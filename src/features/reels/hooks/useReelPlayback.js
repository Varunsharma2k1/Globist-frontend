import { useEffect, useRef, useState } from 'react';
import { useVideoPlayer } from 'expo-video';

// Controls flash on tap and fade out quickly, paused or not (tap the reel to resume).
const CONTROLS_AUTO_HIDE_MS = 800;

// Keep each player's memory small. Defaults buffer ~50 s of video per player,
// which on 128 MB-heap phones (e.g. Redmi A-series) crashed the app with
// OutOfMemoryError after a couple of minutes of looping reels.
const BUFFER_OPTIONS = {
  preferredForwardBufferDuration: 10, // seconds ahead
  minBufferForPlayback: 1, // start as soon as 1 s is ready
  maxBufferBytes: 8 * 1024 * 1024, // Android hard cap per player
  prioritizeTimeOverSizeThreshold: false,
};

/**
 * Owns a single reel's video player instance plus the play/pause and
 * mute-controls-visibility state that goes with it. Colocated here (rather
 * than inline in ReelItem) so the player lifecycle — creation, play/pause
 * effects tied to `isActive`, mute sync, and the auto-hiding controls timer —
 * can be reasoned about and tested independently of the rendering.
 *
 * @param {Object} params
 * @param {string} [params.mediaUrl]
 * @param {boolean} [params.shouldLoad=true] - false = no media loaded (reels far from
 *   the visible one), so only ~3 players hold video memory at any time
 * @param {boolean} params.isActive - whether this reel is the one currently on screen
 * @param {boolean} params.muted
 * @param {() => void} [params.onToggleMute] - parent-owned mute toggle (mute is shared across the feed)
 */
export function useReelPlayback({ mediaUrl, shouldLoad = true, isActive, muted, onToggleMute }) {
  const hasVideo = Boolean(mediaUrl);
  const [paused, setPaused] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const hideTimerRef = useRef(null);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  // Reveal the play/pause + mute controls, then hide them shortly after.
  const revealControls = () => {
    setControlsVisible(true);
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), CONTROLS_AUTO_HIDE_MS);
  };

  useEffect(() => clearHideTimer, []);

  // R2/CDN reels are HLS (.m3u8, adaptive 240–720p); older ones are MP4.
  const source = !hasVideo || !shouldLoad
    ? null
    : /\.m3u8(\?|$)/.test(mediaUrl)
      ? { uri: mediaUrl, contentType: 'hls' }
      : mediaUrl;
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = muted;
    p.bufferOptions = BUFFER_OPTIONS;
  });

  useEffect(() => {
    if (!hasVideo || !player || !source) return;
    if (isActive && !paused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, paused, hasVideo, player, source]);

  // Always resume playing (not paused) when a reel becomes active again.
  useEffect(() => {
    if (!isActive) setPaused(false);
  }, [isActive]);

  useEffect(() => {
    if (player) player.muted = muted;
  }, [muted, player]);

  const handleTogglePlay = () => {
    setPaused((prev) => {
      const next = !prev;
      revealControls();
      return next;
    });
  };

  const handleToggleMute = () => {
    onToggleMute?.();
    revealControls();
  };

  return { hasVideo, isLoaded: Boolean(source), player, paused, controlsVisible, handleTogglePlay, handleToggleMute };
}

export default useReelPlayback;
