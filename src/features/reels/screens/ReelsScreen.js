import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import ReelItem from '../../../components/ReelItem';
import { useTheme } from '../../../hooks/useTheme';
import { useReelsFeed } from '../hooks/useReelsFeed';
import { useInfiniteReelPaging } from '../hooks/useInfiniteReelPaging';
import { useReelsTabBarTheme } from '../hooks/useReelsTabBarTheme';
import ReelsHeaderOverlay from '../components/ReelsHeaderOverlay';
import ReelsEmptyState from '../components/ReelsEmptyState';

/**
 * ReelsScreen Component
 *
 * Vertical video reel feed displaying creator travel content. Each reel is
 * sized to fit above the tab bar and loops the fetched reels endlessly in
 * both scroll directions. Data fetching, infinite-paging math, and the
 * dark-tab-bar-while-focused behavior each live in their own hook (see
 * ../hooks) — this file is just the layout.
 */
export default function ReelsScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { height: windowHeight } = useWindowDimensions();
  const [muted, setMuted] = useState(false);

  // Each reel fills the screen down to (but not under) the tab bar, so the tab
  // bar sits fitted below the reel container instead of floating over the video.
  const tabBarHeight = 56 + insets.bottom;
  const reelHeight = windowHeight - tabBarHeight;

  useReelsTabBarTheme(navigation, { tabBarHeight, insetsBottom: insets.bottom, colors });

  const { reels, loading } = useReelsFeed();
  const {
    listRef,
    loopedReels,
    startIndex,
    activeIndex,
    onViewableItemsChanged,
    viewabilityConfig,
    getItemLayout,
    handleMomentumEnd,
  } = useInfiniteReelPaging(reels, reelHeight);

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

  return (
    <View style={styles.container}>
      <ReelsHeaderOverlay onPressPost={() => navigation.navigate('PostReel')} />

      {loading ? (
        <ActivityIndicator color={colors.white} style={{ flex: 1 }} />
      ) : reels.length === 0 ? (
        <ReelsEmptyState />
      ) : (
        <FlatList
          ref={listRef}
          data={loopedReels}
          keyExtractor={(item, index) => `${item._id || 'reel'}-${index}`}
          renderItem={({ item, index }) => (
            <ReelItem
              reel={item}
              height={reelHeight}
              isActive={isFocused && index === activeIndex}
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

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.reelTone.default,
    },
  });
}
