import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
import ReelItem from '../components/ReelItem';
import { getReels } from '../api';
import { COLORS, SPACING, FONTS } from '../theme';

const LOOP_REPEATS = 60;

/**
 * ReelsScreen Component
 *
 * Vertical video reel feed displaying creator travel content.
 * Uses modular `getReels` API service. Each reel is sized to fit above the tab
 * bar and loops the fetched reels endlessly in both scroll directions.
 */
export default function ReelsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const listRef = useRef(null);

  // Each reel fills the screen down to (but not under) the tab bar, so the tab
  // bar sits fitted below the reel container instead of floating over the video.
  const tabBarHeight = 56 + insets.bottom;
  const reelHeight = windowHeight - tabBarHeight;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;

  useEffect(() => {
    fetchReelsData();
  }, []);

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

  const fetchReelsData = async () => {
    try {
      const data = await getReels();
      setReels(data || []);
    } catch (error) {
      console.warn('[ReelsScreen] Error fetching reels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgencyPress = (agency) => {
    if (agency?._id) {
      navigation.navigate('Explore');
    }
  };

  const handleCreatorPress = (reel) => {
    navigation.navigate('CreatorProfile', {
      creator: {
        ...reel.user,
        creatorHandle: reel.creatorHandle,
        creatorTier: reel.creatorTier,
      },
    });
  };

  // Repeat the reel list many times so paging feels endless in both directions,
  // starting the viewport in the middle repeat.
  const loopedReels = useMemo(() => {
    if (!reels.length) return [];
    return Array.from({ length: LOOP_REPEATS }, () => reels).flat();
  }, [reels]);

  const startIndex = reels.length ? Math.floor(LOOP_REPEATS / 2) * reels.length : 0;

  useEffect(() => {
    if (reels.length) setActiveIndex(startIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reels.length]);

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

  return (
    <View style={styles.container}>
      <View style={[styles.headerOverlay, { paddingTop: insets.top + SPACING.sm }]}>
        <Text style={styles.headerTitle}>Travel Reels</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('PostReel')}>
          <Plus size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.white} style={{ flex: 1 }} />
      ) : reels.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No reels yet. Be the first to post one!</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={loopedReels}
          keyExtractor={(item, index) => `${item._id || 'reel'}-${index}`}
          renderItem={({ item, index }) => (
            <ReelItem
              reel={item}
              height={reelHeight}
              isActive={index === activeIndex}
              muted={muted}
              onToggleMute={() => setMuted((v) => !v)}
              onAgencyPress={handleAgencyPress}
              onCreatorPress={handleCreatorPress}
            />
          )}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          getItemLayout={getItemLayout}
          initialScrollIndex={startIndex}
          onMomentumScrollEnd={handleMomentumEnd}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          windowSize={5}
          maxToRenderPerBatch={3}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.reelTone.default,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  headerTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.white,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});
