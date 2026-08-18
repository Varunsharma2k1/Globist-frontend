import { useEffect, useRef, useState } from 'react';
import { useVideoPlayer } from 'expo-video';

const CONTROLS_AUTO_HIDE_MS = 1800;

/**
 * Owns a single reel's video player instance plus the play/pause and
 * mute-controls-visibility state that goes with it. Colocated here (rather
 * than inline in ReelItem) so the player lifecycle — creation, play/pause
 * effects tied to `isActive`, mute sync, and the auto-hiding controls timer —
 * can be reasoned about and tested independently of the rendering.
 *
 * @param {Object} params
 * @param {string} [params.mediaUrl]
 * @param {boolean} params.isActive - whether this reel is the one currently on screen
 * @param {boolean} params.muted
 * @param {() => void} [params.onToggleMute] - parent-owned mute toggle (mute is shared across the feed)
 */
export function useReelPlayback({ mediaUrl, isActive, muted, onToggleMute }) {
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

  // Reveal the play/pause + mute controls, auto-hiding them shortly after —
  // unless the video is paused, in which case they stay up so there's always
  // a visible way to resume.
  const revealControls = (stillPaused) => {
    setControlsVisible(true);
    clearHideTimer();
    if (!stillPaused) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), CONTROLS_AUTO_HIDE_MS);
    }
  };

  useEffect(() => clearHideTimer, []);

  const player = useVideoPlayer(hasVideo ? mediaUrl : null, (p) => {
    p.loop = true;
    p.muted = muted;
  });

  useEffect(() => {
    if (!hasVideo || !player) return;
    if (isActive && !paused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, paused, hasVideo, player]);

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
      revealControls(next);
      return next;
    });
  };

  const handleToggleMute = () => {
    onToggleMute?.();
    revealControls(paused);
  };

  return { hasVideo, player, paused, controlsVisible, handleTogglePlay, handleToggleMute };
}

export default useReelPlayback;
