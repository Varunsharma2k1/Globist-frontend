import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const LOOP_REPEATS = 60;

/**
 * Drives the "endless" reel feed illusion: repeats the fetched reels list
 * many times and starts the viewport in the middle repeat, then silently
 * re-centers the scroll position whenever it nears either edge of the
 * repeated list — so paging feels infinite in both directions without
 * actually rendering an unbounded list.
 *
 * @param {Array} reels
 * @param {number} reelHeight
 */
export function useInfiniteReelPaging(reels, reelHeight) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;

  const loopedReels = useMemo(() => {
    if (!reels.length) return [];
    return Array.from({ length: LOOP_REPEATS }, () => reels).flat();
  }, [reels]);

  const startIndex = reels.length ? Math.floor(LOOP_REPEATS / 2) * reels.length : 0;

  useEffect(() => {
    if (reels.length) setActiveIndex(startIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reels.length]);

  // Re-syncing the scroll position on refocus guards against a known RN FlatList
  // quirk where returning from a pushed screen (e.g. CreatorProfile) can leave
  // rendered items visually out of sync with their real offsets, causing overlap.
  useFocusEffect(
    useCallback(() => {
      if (reels.length) {
        listRef.current?.scrollToOffset({
          offset: activeIndex * reelHeight,
          animated: false,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reels.length, reelHeight])
  );

  const getItemLayout = useCallback(
    (_, index) => ({ length: reelHeight, offset: reelHeight * index, index }),
    [reelHeight]
  );

  const handleMomentumEnd = useCallback(
    (e) => {
      if (!reels.length) return;
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / reelHeight);
      const edgeBuffer = reels.length * 3;
      if (index < edgeBuffer || index > loopedReels.length - edgeBuffer) {
        const mod = ((index % reels.length) + reels.length) % reels.length;
        const recenteredIndex = startIndex + mod;
        listRef.current?.scrollToOffset({
          offset: recenteredIndex * reelHeight,
          animated: false,
        });
      }
    },
    [reels.length, loopedReels.length, startIndex, reelHeight]
  );

  return {
    listRef,
    loopedReels,
    startIndex,
    activeIndex,
    onViewableItemsChanged,
    viewabilityConfig,
    getItemLayout,
    handleMomentumEnd,
  };
}

export default useInfiniteReelPaging;
