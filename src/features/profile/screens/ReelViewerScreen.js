import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, PixelRatio, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import ReelItem from '../../reels/components/ReelItem';
import { useReelBooking } from '../../reels/hooks/useReelBooking';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { useTopInset } from '../../../hooks/useTopInset';
import { useInfiniteReelPaging } from '../../reels/hooks/useInfiniteReelPaging';

/**
 * Full-screen player for the reels opened from My Posts. Starts at the tapped
 * reel and swipes vertically in an endless loop, like the main reels feed.
 */
export default function ReelViewerScreen({ navigation, route }) {
  const { reels = [], startIndex = 0 } = route.params || {};
  const topInset = useTopInset();
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [height, setHeight] = useState(0);
  const [muted, setMuted] = useState(false);
  const { bookReel, pendingReelId } = useReelBooking(navigation, user?._id);

  const paging = useInfiniteReelPaging(reels, height, startIndex);
  const { activeIndex } = paging;
  const loops = reels.length > 1; // a single tape just loops its own video

  const onLayout = (e) => {
    const measured = PixelRatio.roundToNearestPixel(e.nativeEvent.layout.height);
    if (measured > 0 && measured !== height) setHeight(measured);
  };

  const renderItem = ({ item, index }) => (
    <ReelItem
      reel={item}
      height={height}
      isActive={isFocused && (!loops || index === activeIndex)}
      shouldLoad={isFocused && (!loops || Math.abs(index - activeIndex) <= 1)}
      muted={muted}
      onToggleMute={() => setMuted((v) => !v)}
      onCreatorPress={(reel) =>
        navigation.navigate('CreatorProfile', {
          creator: {
            ...reel.user,
            creatorHandle: reel.creatorHandle,
            creatorTier: reel.creatorTier,
          },
        })
      }
      onAgencyPress={(agency) => agency && navigation.navigate('AgencyProfile', { agency })}
      onBookPress={bookReel}
      bookingPending={pendingReelId != null && pendingReelId === item._id}
    />
  );

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: colors.reelTone.default }]}
        onLayout={onLayout}
      >
        {height > 0 && (
          <FlatList
            ref={paging.listRef}
            data={loops ? paging.loopedReels : reels}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            renderItem={renderItem}
            style={{ height }}
            pagingEnabled
            snapToInterval={height}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            bounces={false}
            initialScrollIndex={loops ? paging.startIndex : 0}
            getItemLayout={paging.getItemLayout}
            onViewableItemsChanged={paging.onViewableItemsChanged}
            viewabilityConfig={paging.viewabilityConfig}
            onMomentumScrollEnd={loops ? paging.handleMomentumEnd : undefined}
            initialNumToRender={2}
            windowSize={3}
            maxToRenderPerBatch={2}
          />
        )}
        <TouchableOpacity
          style={[styles.back, { top: topInset + 8 }]}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  back: {
    position: 'absolute',
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
