import React, { useEffect, useRef } from 'react';
import { View, Pressable, Animated, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, Clapperboard, MessageCircle, User } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import haptics from '../utils/haptics';

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
        border: 'rgba(23, 39, 30, 0.08)',
        icon: colors.textMuted,
        iconActive: colors.ink,
        halo: 'rgba(23, 39, 30, 0.07)',
        haloRing: 'rgba(23, 39, 30, 0.10)',
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
        >
          <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.tint }]} />
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

function TabButton({ Icon, label, focused, palette, onPress, onLongPress }) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      speed: 22,
      bounciness: 6,
    }).start();
  }, [focused, scale]);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.item}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      hitSlop={4}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.halo,
          {
            backgroundColor: palette.halo,
            borderColor: palette.haloRing,
            opacity: scale,
            transform: [
              { scale: scale.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
            ],
          },
        ]}
      />
      <Icon
        size={22}
        color={focused ? palette.iconActive : palette.icon}
        strokeWidth={focused ? 2.2 : 1.8}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: SIDE, paddingTop: TOP },
  shadow: { borderRadius: PILL_HEIGHT / 2 },
  // Soft, green-tinted float (light mode only; dark glass needs none).
  shadowLight: {
    shadowColor: '#17271E',
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
    paddingHorizontal: 6,
  },
  item: { flex: 1, height: PILL_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute',
    width: HALO,
    height: HALO,
    borderRadius: HALO / 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
