import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Map, Clapperboard, MessageSquareText } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';
import haptics from '../../../utils/haptics';

export const AGENCY_TABS = [
  { key: 'trips', label: 'Trips', Icon: Map },
  { key: 'tapes', label: 'Tapes', Icon: Clapperboard },
  { key: 'reviews', label: 'Reviews', Icon: MessageSquareText },
];

/** Instagram-style tab bar: icon + label, gold underline on the active tab. Pass `tabs` to reuse it. */
export default function AgencyTabs({ active, onChange, tabs = AGENCY_TABS }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {tabs.map(({ key, label, Icon }) => {
        const selected = key === active;
        const color = selected ? colors.ink : colors.textMuted;
        return (
          <Pressable
            key={key}
            style={styles.tab}
            onPress={() => {
              if (!selected) haptics.select();
              onChange(key);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={label}
          >
            <View style={styles.tabInner}>
              <Icon size={18} color={color} strokeWidth={selected ? 2.4 : 2} />
              <Text style={[styles.label, { color }, selected && styles.labelActive]}>{label}</Text>
            </View>
            <View style={[styles.indicator, selected && { backgroundColor: colors.accent }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
      marginTop: SPACING.sm,
    },
    tab: { flex: 1, alignItems: 'center' },
    tabInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: SPACING.sm + 2,
    },
    label: { fontFamily: FONTS.semibold, fontSize: 14 },
    labelActive: { fontFamily: FONTS.bold },
    indicator: { height: 2, width: '70%', borderRadius: 1, backgroundColor: 'transparent' },
  });
}
