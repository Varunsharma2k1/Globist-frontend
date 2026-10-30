import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import CarouselCard from './CarouselCard';
import { CAROUSEL_SLIDES } from '../data/carouselSlides';
import { SPACING } from '../../../theme';

const AUTO_ADVANCE_MS = 4000;
const CARD_WIDTH_RATIO = 0.62; // of the screen width
const CARD_ASPECT = 1.25; // height / width
const GAP = 14;

const COUNT = CAROUSEL_SLIDES.length;
// Three copies back to back: the user starts in the middle one and is silently
// moved back to it whenever they drift into an outer copy, so it never ends.
const LOOPED = [...CAROUSEL_SLIDES, ...CAROUSEL_SLIDES, ...CAROUSEL_SLIDES];

/**
 * Endless, centre-focused carousel at the top of Home: tall framed cards, the
 * middle one large and lifted with its neighbours peeking in smaller on each
 * side. Auto-advances every few seconds, pauses while dragging or when Home
 * isn't focused. Tapping a card calls `onSlidePress(slide)`.
 */
export default function HomeCarousel({ onSlidePress }) {
  const isFocused = useIsFocused();
  const listRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const offsetRef = useRef(0);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const cardWidth = Math.round(width * CARD_WIDTH_RATIO);
  const cardHeight = Math.round(cardWidth * CARD_ASPECT);
  const itemWidth = cardWidth + GAP;
  const sidePad = (width - cardWidth) / 2;

  // Jump back into the middle copy once the user has scrolled into an outer one.
  const recenter = useCallback(
    (animated = false) => {
      if (!itemWidth) return 0;
      let index = Math.round(offsetRef.current / itemWidth);
      if (index < COUNT || index >= COUNT * 2) {
        index = COUNT + (((index % COUNT) + COUNT) % COUNT);
        listRef.current?.scrollToOffset({ offset: index * itemWidth, animated });
        offsetRef.current = index * itemWidth;
      }
      return index;
    },
    [itemWidth]
  );

  useEffect(() => {
    if (!itemWidth || dragging || !isFocused) return undefined;
    const timer = setTimeout(() => {
      const index = recenter();
      listRef.current?.scrollToOffset({ offset: (index + 1) * itemWidth, animated: true });
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
    // `active` changes after every slide, which re-arms the timer.
  }, [itemWidth, dragging, isFocused, active, recenter]);

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
        listener: (e) => {
          offsetRef.current = e.nativeEvent.contentOffset.x;
          if (!itemWidth) return;
          const logical = ((Math.round(offsetRef.current / itemWidth) % COUNT) + COUNT) % COUNT;
          setActive((prev) => (prev === logical ? prev : logical));
        },
      }),
    [scrollX, itemWidth]
  );

  const renderItem = ({ item, index }) => (
    <CarouselCard
      item={item}
      index={index}
      scrollX={scrollX}
      cardWidth={cardWidth}
      cardHeight={cardHeight}
      itemWidth={itemWidth}
      gap={GAP}
      isActive={index % COUNT === active}
      onPress={() => onSlidePress(item)}
    />
  );

  return (
    <View
      style={styles.container}
      onLayout={(e) => setWidth(Math.round(e.nativeEvent.layout.width))}
    >
      {width > 0 && (
        <Animated.FlatList
          ref={listRef}
          data={LOOPED}
          keyExtractor={(_, index) => String(index)}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={itemWidth}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          contentContainerStyle={{ paddingHorizontal: sidePad, paddingVertical: SPACING.sm }}
          style={{ height: cardHeight + SPACING.sm * 2 + 18 }}
          initialScrollIndex={COUNT}
          getItemLayout={(_, index) => ({ length: itemWidth, offset: itemWidth * index, index })}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={() => setDragging(true)}
          onMomentumScrollEnd={() => {
            recenter();
            setDragging(false);
          }}
        />
      )}

      <View style={styles.dots} pointerEvents="none">
        {CAROUSEL_SLIDES.map((slide, i) => (
          <View key={slide.id} style={[styles.dot, i === active && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(128,128,128,0.45)' },
  dotActive: { width: 18, backgroundColor: '#8A8A8A' },
});
