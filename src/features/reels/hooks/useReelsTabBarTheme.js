import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Swaps the shared (opaque-light) tab bar for a soft black one while Reels
 * is focused, since the app's normal tab bar style reads jarringly against
 * reel video. Restored to the default on blur so other tabs keep their
 * normal tab bar.
 */
export function useReelsTabBarTheme(navigation, { tabBarHeight, insetsBottom, colors }) {
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: 'rgba(22,19,17,0.96)',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: 'rgba(255,255,255,0.12)',
          height: tabBarHeight,
          paddingBottom: insetsBottom + 6,
          paddingTop: 6,
        },
        tabBarBackground: undefined,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
      });
      return () => {
        navigation.setOptions({
          tabBarStyle: undefined,
          tabBarBackground: undefined,
          tabBarActiveTintColor: undefined,
          tabBarInactiveTintColor: undefined,
        });
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, tabBarHeight, insetsBottom])
  );
}

export default useReelsTabBarTheme;
