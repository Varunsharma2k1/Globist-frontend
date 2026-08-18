import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SettingsToggle from '../../../components/SettingsToggle';
import Input from '../../../components/Input';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

export default function AffiliateToggleRow({ isAffiliate, onToggle, agencyId, onChangeAgencyId }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <>
      <View style={styles.affiliateRow}>
        <Text style={styles.sectionLabel}>Affiliate Reel</Text>
        <SettingsToggle value={isAffiliate} onValueChange={onToggle} />
      </View>
      {isAffiliate && (
        <Input
          label="Agency ID"
          value={agencyId}
          onChangeText={onChangeAgencyId}
          placeholder="Paste the agency's ID"
        />
      )}
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    sectionLabel: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    affiliateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
    },
  });
}
