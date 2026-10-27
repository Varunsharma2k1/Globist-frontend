import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import PackageCard from '../components/PackageCard';
import { AGENCY_PACKAGES } from '../../../data/agencyPackages';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';

/**
 * Agency accounts only: the Himalayan trek packages this agency has listed.
 * Data is dummy for now (see src/data/agencyPackages.js).
 */
export default function AgencyPackagesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);

  const live = AGENCY_PACKAGES.filter((p) => p.status === 'live').length;
  const booked = AGENCY_PACKAGES.reduce((sum, p) => sum + (p.totalSlots - p.slotsLeft), 0);

  return (
    <View style={styles.container}>
      <Header title="Himalayan Treks" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
      >
        <Text style={typography.h2}>Himalayan Treks</Text>
        <Text style={[typography.body, { marginTop: SPACING.xs, marginBottom: SPACING.md }]}>
          {AGENCY_PACKAGES.length} packages · {live} live · {booked} travellers booked
        </Text>

        {AGENCY_PACKAGES.map((pkg) => (
          <PackageCard key={pkg._id} pkg={pkg} />
        ))}
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
  });
}
