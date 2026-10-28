import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import SectionHeader from './SectionHeader';
import PackageCarouselCard from './PackageCarouselCard';
import { SPACING } from '../../../theme';

const MAX_PACKAGES = 6;
const AUTO_ADVANCE_MS = 4000;
const CARD_WIDTH_RATIO = 0.82; // of the screen width
const CARD_MAX_WIDTH = 340;

/**
 * Trending packages, one centred card at a time, rotating on its own. Loops
 * endlessly (three copies, silently re-centred), pauses while dragging or when
 * Home isn't focused. The full lists live under each region above.
 */
export default function TrendingPackagesSection({ trips, navigation }) {
  const items = useMemo(() => trips.slice(0, MAX_PACKAGES), [trips]);
  const count = items.length;
  const looped = useMemo(
    () => (count > 1 ? [...items, ...items, ...items] : items),
    [items, count]
  );

  const isFocused = useIsFocused();
  const listRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const offsetRef = useRef(0);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const cardWidth = Math.min(Math.round(width * CARD_WIDTH_RATIO), CARD_MAX_WIDTH);
  const loops = count > 1;

  // Jump back into the middle copy once the user has scrolled into an outer one.
  const recenter = useCallback(() => {
    if (!width || !loops) return 0;
    let index = Math.round(offsetRef.current / width);
    if (index < count || index >= count * 2) {
      index = count + (((index % count) + count) % count);
      listRef.current?.scrollToOffset({ offset: index * width, animated: false });
      offsetRef.current = index * width;
    }
    return index;
  }, [width, loops, count]);

  useEffect(() => {
    if (!width || !loops || dragging || !isFocused) return undefined;
    const timer = setTimeout(() => {
      const index = recenter();
      listRef.current?.scrollToOffset({ offset: (index + 1) * width, animated: true });
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
    // `active` changes after every card, which re-arms the timer.
  }, [width, loops, dragging, isFocused, active, recenter]);

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
        listener: (e) => {
          offsetRef.current = e.nativeEvent.contentOffset.x;
          if (!width || !count) return;
          const logical = ((Math.round(offsetRef.current / width) % count) + count) % count;
          setActive((prev) => (prev === logical ? prev : logical));
        },
      }),
    [scrollX, width, count]
  );

  if (!count) return null;

  const renderItem = ({ item, index }) => {
    const range = [(index - 1) * width, index * width, (index + 1) * width];
    const scale = scrollX.interpolate({
      inputRange: range,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
      inputRange: range,
      outputRange: [0.35, 1, 0.35],
      extrapolate: 'clamp',
    });
    return (
      <View style={{ width, alignItems: 'center' }}>
        <Animated.View style={{ opacity, transform: [{ scale }] }}>
          <PackageCarouselCard
            trip={item}
            width={cardWidth}
            onPress={() =>
              navigation.navigate('TripDetail', { tripId: item._id, title: item.title })
            }
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <>
      <SectionHeader title="Trending Travel Packages" />
      <View style={styles.bleed} onLayout={(e) => setWidth(Math.round(e.nativeEvent.layout.width))}>
        {width > 0 && (
          <Animated.FlatList
            ref={listRef}
            data={looped}
            keyExtractor={(_, index) => String(index)}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={loops}
            initialScrollIndex={loops ? count : 0}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onScrollBeginDrag={() => setDragging(true)}
            onMomentumScrollEnd={() => {
              recenter();
              setDragging(false);
            }}
          />
        )}
        {loops && (
          <View style={styles.dots} pointerEvents="none">
            {items.map((trip, i) => (
              <View
                key={trip._id || trip.title}
                style={[styles.dot, i === active && styles.dotActive]}
              />
            ))}
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // Spans the full screen width (the Home content is padded) so each page is a full screen.
  bleed: { marginHorizontal: -SPACING.lg, paddingBottom: SPACING.md },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: SPACING.md },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(128,128,128,0.45)' },
  dotActive: { width: 18, backgroundColor: '#8A8A8A' },
});
