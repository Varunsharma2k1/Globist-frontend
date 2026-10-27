import React, { useCallback, useState } from 'react';
import { View, FlatList, TouchableOpacity, PixelRatio, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import ReelItem from '../../reels/components/ReelItem';
import { ReelEngagementProvider } from '../../reels/context/ReelEngagementContext';
import { useReelBooking } from '../../reels/hooks/useReelBooking';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';

const VIEWABILITY = { itemVisiblePercentThreshold: 80 };

/**
 * Full-screen player for the reels opened from My Posts. Starts at the tapped
 * reel and swipes vertically through the rest, like the main reels feed.
 */
export default function ReelViewerScreen({ navigation, route }) {
  const { reels = [], startIndex = 0 } = route.params || {};
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [height, setHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [muted, setMuted] = useState(false);
  const { bookReel, pendingReelId } = useReelBooking(navigation, user?._id);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems[0]) setActiveIndex(viewableItems[0].index);
  }, []);

  const onLayout = (e) => {
    const measured = PixelRatio.roundToNearestPixel(e.nativeEvent.layout.height);
    if (measured > 0 && measured !== height) setHeight(measured);
  };

  const renderItem = ({ item, index }) => (
    <ReelItem
      reel={item}
      height={height}
      isActive={isFocused && index === activeIndex}
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
    <ReelEngagementProvider>
      <View
        style={[styles.container, { backgroundColor: colors.reelTone.default }]}
        onLayout={onLayout}
      >
        {height > 0 && (
          <FlatList
            data={reels}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            style={{ height }}
            pagingEnabled
            snapToInterval={height}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            bounces={false}
            initialScrollIndex={startIndex}
            getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={VIEWABILITY}
          />
        )}
        <TouchableOpacity
          style={[styles.back, { top: insets.top + 8 }]}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ReelEngagementProvider>
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
