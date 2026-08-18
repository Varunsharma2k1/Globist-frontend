import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Database, Check } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useSettings } from '../../../hooks/useSettings';
import { FEED_PREF_OPTIONS } from '../../../context/SettingsContext';
import { SPACING, FONTS, RADIUS } from '../../../theme';
import { getSharedRowStyles } from './sharedRowStyles';
import SettingsSectionLabel from './SettingsSectionLabel';

/**
 * The "Feed Preferences" segmented card — For You / Chronological, selected
 * option filled solid ink with a checkmark.
 */
export default function FeedPreferencesCard() {
  const { colors } = useTheme();
  const rowStyles = getSharedRowStyles(colors);
  const styles = getStyles(colors);
  const { settings, setFeedPref } = useSettings();

  return (
    <View>
      <SettingsSectionLabel>Content & Experience</SettingsSectionLabel>
      <View style={styles.feedCard}>
        <View style={styles.feedCardHeader}>
          <Database size={19} color={colors.text} strokeWidth={2} />
          <Text style={rowStyles.rowLabel}>Feed Preferences</Text>
        </View>
        <Text style={rowStyles.rowSub}>Choose how your home feed is ordered.</Text>
        <View style={{ gap: SPACING.xs, marginTop: SPACING.sm }}>
          {FEED_PREF_OPTIONS.map((opt) => {
            const active = settings.feedPref === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.feedOption, active && styles.feedOptionActive]}
                onPress={() => setFeedPref(opt.key)}
                activeOpacity={0.75}
              >
                <View>
                  <Text style={[styles.feedOptionLabel, active && styles.feedOptionLabelActive]}>
                    {opt.label}
                  </Text>
                  <Text style={[styles.feedOptionSub, active && styles.feedOptionSubActive]}>
                    {opt.sub}
                  </Text>
                </View>
                {active && <Check size={18} color={colors.inkContrast} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    feedCard: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      shadowColor: colors.ink,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    feedCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginBottom: 4,
    },
    feedOption: {
      borderRadius: RADIUS.sm,
      paddingHorizontal: SPACING.md - 2,
      paddingVertical: SPACING.sm + 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surfaceMuted,
    },
    feedOptionActive: {
      backgroundColor: colors.ink,
    },
    feedOptionLabel: {
      fontFamily: FONTS.bold,
      fontSize: 14.5,
      color: colors.text,
    },
    feedOptionLabelActive: {
      color: colors.inkContrast,
    },
    feedOptionSub: {
      fontFamily: FONTS.body,
      fontSize: 11.5,
      color: colors.textMuted,
      marginTop: 2,
    },
    feedOptionSubActive: {
      color: colors.mode === 'dark' ? 'rgba(22,19,17,0.7)' : 'rgba(255,255,255,0.75)',
    },
  });
}

export { getStyles as getFeedOptionStyles };
