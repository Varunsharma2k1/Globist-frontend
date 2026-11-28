import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, Clapperboard, MessageCircle, User } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import haptics from '../utils/haptics';
import { useInboxBadge } from '../hooks/useInboxBadge';

const ICONS = {
  HomeTab: Home,
  ExploreTab: Compass,
  ReelsTab: Clapperboard,
  InboxTab: MessageCircle,
  ProfileTab: User,
};

const PILL_HEIGHT = 60;
const HALO = 46; // selected circle
const SIDE = 16;
const TOP = 6;
const PAD = 6; // pill inner horizontal padding

/** Total height the bar takes at the bottom (screens that size to it use this). */
export const tabBarHeightFor = (insets) => PILL_HEIGHT + TOP + Math.max(insets.bottom, 12);

/**
 * Minimal floating "glass" tab bar (Apple-style): a frosted capsule with
 * icons only; the selected tab sits in a soft circle that springs in.
 * Over Reels it turns to dark glass so it reads on video.
 */
export default function GlassTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, resolvedScheme } = useTheme();
  const inboxUnread = useInboxBadge();
  const [pillWidth, setPillWidth] = useState(0);
  const count = state.routes.length;
  const itemW = pillWidth ? (pillWidth - PAD * 2) / count : 0;
  const pos = useRef(new Animated.Value(state.index)).current;
  const stretch = useRef(new Animated.Value(1)).current;
  const lastIndex = useRef(state.index);

  // One shared circle glides to the new tab (spring), stretching a touch
  // sideways mid-flight and settling back round — the iOS "liquid" feel.
  useEffect(() => {
    if (lastIndex.current === state.index) return;
    const jump = Math.abs(state.index - lastIndex.current);
    lastIndex.current = state.index;
    Animated.parallel([
      Animated.spring(pos, {
        toValue: state.index,
        useNativeDriver: true,
        stiffness: 260,
        damping: 24,
        mass: 0.9,
      }),
      Animated.sequence([
        Animated.timing(stretch, {
          toValue: 1 + Math.min(jump, 3) * 0.12,
          duration: 110,
          useNativeDriver: true,
        }),
        Animated.spring(stretch, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 10 }),
      ]),
    ]).start();
  }, [state.index, pos, stretch]);
  const onVideo = state.routes[state.index]?.name === 'ReelsTab';
  const dark = onVideo || resolvedScheme === 'dark';

  const palette = dark
    ? {
        page: onVideo ? '#000000' : colors.background,
        tint: 'rgba(20, 24, 22, 0.62)',
        border: 'rgba(255, 255, 255, 0.10)',
        icon: 'rgba(255, 255, 255, 0.55)',
        iconActive: '#FFFFFF',
        halo: 'rgba(255, 255, 255, 0.14)',
        haloRing: 'rgba(255, 255, 255, 0.18)',
      }
    : {
        page: colors.background,
        tint: 'rgba(255, 255, 255, 0.72)',
        border: 'rgba(0, 0, 0, 0.08)',
        icon: colors.textMuted,
        iconActive: colors.ink,
        halo: 'rgba(0, 0, 0, 0.07)',
        haloRing: 'rgba(0, 0, 0, 0.10)',
      };

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: palette.page, paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      <View style={[styles.shadow, !dark && styles.shadowLight]}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 60 : 40}
          tint={dark ? 'dark' : 'light'}
          blurMethod="dimezisBlurViewSdk31Plus"
          style={[styles.pill, { borderColor: palette.border }]}
          onLayout={(e) => setPillWidth(e.nativeEvent.layout.width)}
        >
          <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.tint }]} />
          {itemW ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.halo,
                {
                  left: PAD + (itemW - HALO) / 2,
                  backgroundColor: palette.halo,
                  borderColor: palette.haloRing,
                  transform: [
                    {
                      translateX: pos.interpolate({
                        inputRange: [0, Math.max(count - 1, 1)],
                        outputRange: [0, itemW * Math.max(count - 1, 1)],
                      }),
                    },
                    { scaleX: stretch },
                    {
                      scaleY: stretch.interpolate({
                        inputRange: [1, 1.5],
                        outputRange: [1, 0.88],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}
            />
          ) : null}
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel ?? options.title ?? route.name;
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                haptics.select();
                navigation.navigate(route.name, route.params);
              }
            };
            const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });
            return (
              <TabButton
                key={route.key}
                Icon={ICONS[route.name] || Home}
                label={label}
                focused={focused}
                badge={route.name === 'InboxTab' ? inboxUnread : 0}
                palette={palette}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
        </BlurView>
      </View>
    </View>
  );
}

function TabButton({ Icon, label, focused, badge, palette, onPress, onLongPress }) {
  const pop = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  // Small bounce of the icon when its tab becomes active.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!focused) return;
    pop.setValue(0.82);
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 14 }).start();
  }, [focused, pop]);

  const pressIn = () =>
    Animated.spring(pop, { toValue: 0.88, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  const pressOut = () =>
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={styles.item}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={badge > 0 ? `${label}, ${badge} unread` : label}
      hitSlop={4}
    >
      <Animated.View style={{ transform: [{ scale: pop }] }}>
        <Icon
          size={22}
          color={focused ? palette.iconActive : palette.icon}
          strokeWidth={focused ? 2.2 : 1.8}
        />
      </Animated.View>
      {badge > 0 ? (
        <View style={styles.badge} pointerEvents="none">
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: SIDE, paddingTop: TOP },
  shadow: { borderRadius: PILL_HEIGHT / 2 },
  // Soft, float (light mode only; dark glass needs none).
  shadowLight: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    backgroundColor: 'transparent',
  },
  pill: {
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PAD,
  },
  item: { flex: 1, height: PILL_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  // iOS-style red badge on the icon's top-right corner.
  badge: {
    position: 'absolute',
    top: 11,
    left: '50%',
    marginLeft: 4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 11, lineHeight: 14, fontWeight: '700' },
  halo: {
    position: 'absolute',
    top: (PILL_HEIGHT - HALO) / 2 - StyleSheet.hairlineWidth,
    width: HALO,
    height: HALO,
    borderRadius: HALO / 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
