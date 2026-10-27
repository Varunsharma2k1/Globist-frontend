import React, { useCallback, useState } from 'react';
import { View, FlatList, ActivityIndicator, PixelRatio, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import ReelItem from '../../../components/ReelItem';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { useReelsFeed } from '../hooks/useReelsFeed';
import { useInfiniteReelPaging } from '../hooks/useInfiniteReelPaging';
import { useReelsTabBarTheme } from '../hooks/useReelsTabBarTheme';
import { useReelBooking } from '../hooks/useReelBooking';
import { ReelEngagementProvider } from '../context/ReelEngagementContext';
import ReelsHeaderOverlay from '../components/ReelsHeaderOverlay';
import ReelsEmptyState from '../components/ReelsEmptyState';

/**
 * ReelsScreen Component
 *
 * Vertical video reel feed displaying creator travel content, looping the
 * fetched reels endlessly in both scroll directions. Data fetching,
 * infinite-paging math, booking, and the dark-tab-bar-while-focused
 * behavior each live in their own hook (see ../hooks) — this file is just
 * the layout.
 *
 * Page sizing: every reel page is exactly the height of the feed's own
 * measured container (via onLayout), rounded to a whole device pixel, and
 * the list snaps on that same interval. Deriving it from the window height
 * minus an assumed tab bar height broke on devices where the window
 * dimensions don't match the space actually given to the screen (Android
 * system bars, edge-to-edge, notches), and fractional page heights drifted
 * further out of alignment the deeper the looped list went.
 */
export default function ReelsScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { user } = useAuth();
  const [muted, setMuted] = useState(false);
  const [reelHeight, setReelHeight] = useState(0);

  // Matches BottomTabNavigator's tab bar so restyling it here never shifts
  // the feed's layout.
  const tabBarHeight = 56 + insets.bottom;
  useReelsTabBarTheme(navigation, { tabBarHeight, insetsBottom: insets.bottom, colors });

  const { reels, loading, error, retry } = useReelsFeed();
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
  const { bookReel, pendingReelId } = useReelBooking(navigation, user?._id);

  const handleFeedLayout = useCallback((e) => {
    const measured = PixelRatio.roundToNearestPixel(e.nativeEvent.layout.height);
    if (measured > 0) {
      setReelHeight((prev) => (Math.abs(prev - measured) < 0.5 ? prev : measured));
    }
  }, []);

  const handleToggleMute = useCallback(() => setMuted((v) => !v), []);

  const handleCreatorPress = useCallback(
    (reel) => {
      navigation.navigate('CreatorProfile', {
        creator: {
          ...reel.user,
          creatorHandle: reel.creatorHandle,
          creatorTier: reel.creatorTier,
        },
      });
    },
    [navigation]
  );

  const handleAgencyPress = useCallback(
    (agency) => agency && navigation.navigate('AgencyProfile', { agency }),
    [navigation]
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <ReelItem
        reel={item}
        height={reelHeight}
        isActive={isFocused && index === activeIndex}
        muted={muted}
        onToggleMute={handleToggleMute}
        onCreatorPress={handleCreatorPress}
        onAgencyPress={handleAgencyPress}
        onBookPress={bookReel}
        bookingPending={pendingReelId != null && pendingReelId === item._id}
      />
    ),
    [
      reelHeight,
      isFocused,
      activeIndex,
      muted,
      handleToggleMute,
      handleCreatorPress,
      handleAgencyPress,
      bookReel,
      pendingReelId,
    ]
  );

  const renderFeed = () => {
    if (loading) return <ActivityIndicator color={colors.white} style={styles.loader} />;
    if (error) return <ReelsEmptyState error onRetry={retry} />;
    if (reels.length === 0) return <ReelsEmptyState />;
    // Wait for the first measurement so items and snap points agree from
    // the very first frame.
    if (!reelHeight) return null;
    return (
      <FlatList
        ref={listRef}
        style={{ height: reelHeight }}
        data={loopedReels}
        keyExtractor={(item, index) => `${item._id || 'reel'}-${index}`}
        renderItem={renderItem}
        snapToInterval={reelHeight}
        snapToAlignment="start"
        disableIntervalMomentum
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        getItemLayout={getItemLayout}
        initialScrollIndex={startIndex}
        initialNumToRender={2}
        onMomentumScrollEnd={handleMomentumEnd}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        windowSize={5}
        maxToRenderPerBatch={3}
      />
    );
  };

  return (
    <ReelEngagementProvider>
      <View style={styles.container} onLayout={handleFeedLayout}>
        {renderFeed()}
        <ReelsHeaderOverlay onPressPost={() => navigation.navigate('PostReel')} />
      </View>
    </ReelEngagementProvider>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.reelTone.default,
      overflow: 'hidden',
    },
    loader: {
      flex: 1,
    },
  });
}
