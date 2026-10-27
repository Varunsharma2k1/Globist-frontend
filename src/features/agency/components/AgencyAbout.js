import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Phone, Globe } from 'lucide-react-native';
import RatingSummary from '../../../components/RatingSummary';
import VerifiedBadge from '../../../components/VerifiedBadge';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/** Short note, verified status, rating + total reviews and contact lines. */
export default function AgencyAbout({ agency }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const note =
    agency.about ||
    (agency.isVerified
      ? 'Verified by Globist. This agency has been checked and approved to run trips on the app.'
      : 'This agency hasn’t added a description yet.');

  return (
    <View style={styles.section}>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <RatingSummary rating={agency.rating} reviewCount={agency.reviewCount} />
          <Text style={styles.statLabel}>{`${agency.reviewCount || 0} total reviews`}</Text>
        </View>
        {agency.isVerified ? (
          <View style={styles.stat}>
            <VerifiedBadge size={18} label />
            <Text style={styles.statLabel}>Checked by Globist</Text>
          </View>
        ) : null}
      </View>

      <Text style={typography.h3}>About</Text>
      <Text style={styles.note}>{note}</Text>

      {agency.phone ? (
        <View style={styles.contactRow}>
          <Phone size={14} color={colors.textMuted} />
          <Text style={styles.contact}>{agency.phone}</Text>
        </View>
      ) : null}
      {agency.website ? (
        <View style={styles.contactRow}>
          <Globe size={14} color={colors.textMuted} />
          <Text style={styles.contact}>{agency.website}</Text>
        </View>
      ) : null}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    section: { marginBottom: SPACING.lg },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: SPACING.md,
      marginBottom: SPACING.lg,
      borderRadius: RADIUS.md,
      backgroundColor: colors.surfaceMuted,
    },
    stat: { alignItems: 'center', gap: 4 },
    statLabel: { fontFamily: FONTS.body, fontSize: 11, color: colors.textMuted },
    note: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 22,
      color: colors.text,
      marginTop: SPACING.xs,
    },
    contactRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.sm },
    contact: { fontFamily: FONTS.body, fontSize: 14, color: colors.text },
  });
}
