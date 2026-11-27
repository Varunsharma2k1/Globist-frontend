import { CONFIG } from '../config';

/** Makes server-relative media paths ("/uploads/…", dev without R2) absolute. */
export function absoluteMediaUrl(url) {
  if (!url || !url.startsWith('/')) return url || null;
  const origin = CONFIG.API_BASE_URL.replace(/\/api\/?$/, '');
  return `${origin}${url}`;
}

export default absoluteMediaUrl;
