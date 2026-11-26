import { uploadAsync, FileSystemUploadType } from 'expo-file-system/legacy';
import client from './client';

/**
 * Reel upload pipeline (server: /api/media, see server/docs/ARCHITECTURE.md):
 *
 *   1. ask the API for a presigned upload URL
 *   2. stream the file from disk straight to Cloudflare R2 (never via our API)
 *   3. register the reel -> it starts as 'processing'
 *   4. poll until the transcode worker marks it 'ready' (HLS on the CDN)
 */

const POLL_MS = 2000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;
const SUPPORTED = ['video/mp4', 'video/quicktime'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** iOS picks .mov, Android usually .mp4; anything else is sent as mp4. */
export const reelContentType = (mimeType) => (SUPPORTED.includes(mimeType) ? mimeType : 'video/mp4');

async function getUploadUrl(contentType) {
  const { data } = await client.post('/media/upload-url', { contentType });
  return data; // { uploadUrl, method, headers, key }
}

async function putFile(fileUri, { uploadUrl, headers }, onProgress) {
  const res = await uploadAsync(uploadUrl, fileUri, {
    httpMethod: 'PUT',
    uploadType: FileSystemUploadType.BINARY_CONTENT,
    headers,
    sessionType: 1, // background session on iOS; ignored on Android
  });
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Upload failed (${res.status})`);
  }
  onProgress?.(1);
}

async function registerReel(key, details) {
  const { data } = await client.post('/media/reels', { key, ...details });
  return data; // reel with status 'processing'
}

async function waitUntilReady(reelId, onStatus) {
  const started = Date.now();
  while (Date.now() - started < POLL_TIMEOUT_MS) {
    const { data } = await client.get(`/media/reels/${reelId}/status`);
    onStatus?.(data.status);
    if (data.status === 'ready') return data;
    if (data.status === 'failed') throw new Error('We could not process this video. Try another one.');
    await sleep(POLL_MS);
  }
  // Still processing: the reel appears in the feed by itself once it's done.
  return { status: 'processing' };
}

/**
 * Full flow. Returns the ready reel ({ _id, status, mediaUrl, hlsUrl, thumbnailUrl }).
 * @param {{ uri: string, mimeType?: string }} file
 * @param {Object} details caption, location, imageType, agencyId, bookingId, isAffiliate, tags
 * @param {(stage: 'uploading'|'processing'|'ready') => void} [onStage]
 */
export async function publishReel(file, details, onStage) {
  const contentType = reelContentType(file.mimeType);
  onStage?.('uploading');
  const target = await getUploadUrl(contentType);
  await putFile(file.uri, target);
  const reel = await registerReel(target.key, details);
  onStage?.('processing');
  const status = await waitUntilReady(reel._id);
  if (status.status === 'ready') onStage?.('ready');
  return { ...reel, ...status };
}
