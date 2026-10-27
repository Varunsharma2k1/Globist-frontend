import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Clock, Mountain, Calendar, Users } from 'lucide-react-native';
import Card from '../../../components/Card';
import Tag from '../../../components/Tag';
import { getCoverImage } from '../../../data/coverImages';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

const DIFFICULTY_LABEL = { easy: 'Easy', moderate: 'Moderate', hard: 'Challenging' };

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/** One of an agency's listed trek packages. */
export default function PackageCard({ pkg }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const isLive = pkg.status === 'live';
  const booked = pkg.totalSlots - pkg.slotsLeft;

  return (
    <Card style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: getCoverImage(pkg) }} style={styles.image} />
        <View style={styles.statusWrap}>
          <Tag label={isLive ? 'LIVE' : 'DRAFT'} variant={isLive ? 'success' : 'default'} />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.region}>{pkg.region.toUpperCase()}</Text>
        <Text style={styles.name}>{pkg.name}</Text>

        <View style={styles.metaRow}>
          <Meta icon={Clock} text={`${pkg.duration} days`} colors={colors} />
          <Meta
            icon={Mountain}
            text={`${DIFFICULTY_LABEL[pkg.difficulty]} · ${pkg.altitudeFt.toLocaleString('en-IN')} ft`}
            colors={colors}
          />
        </View>
        <View style={styles.metaRow}>
          <Meta icon={Calendar} text={`Next batch ${formatDate(pkg.nextBatch)}`} colors={colors} />
          <Meta icon={Users} text={`${booked}/${pkg.totalSlots} booked`} colors={colors} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.season}>{pkg.season}</Text>
          <Text style={styles.price}>
            ₹{pkg.pricePerPerson.toLocaleString('en-IN')}
            <Text style={styles.priceUnit}> /person</Text>
          </Text>
        </View>
      </View>
    </Card>
  );
}

function Meta({ icon: Icon, text, colors }) {
  return (
    <View style={metaStyles.item}>
      <Icon size={13} color={colors.textMuted} />
      <Text style={[metaStyles.text, { color: colors.textMuted }]}>{text}</Text>
    </View>
  );
}

const metaStyles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: SPACING.md },
  text: { fontFamily: FONTS.body, fontSize: 12 },
});

function getStyles(colors) {
  return StyleSheet.create({
    card: { padding: 0, overflow: 'hidden' },
    imageWrap: { height: 150, backgroundColor: colors.surfaceMuted },
    image: { width: '100%', height: '100%' },
    statusWrap: { position: 'absolute', top: SPACING.sm + 2, left: SPACING.sm + 2 },
    body: { padding: SPACING.md },
    region: {
      fontFamily: FONTS.bold,
      fontSize: 11,
      letterSpacing: 0.8,
      color: colors.textMuted,
    },
    name: {
      fontFamily: FONTS.heading,
      fontSize: 17,
      color: colors.ink,
      marginTop: 2,
      marginBottom: SPACING.sm,
    },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SPACING.sm + 2,
      paddingTop: SPACING.sm + 2,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    season: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
    price: { fontFamily: FONTS.heading, fontSize: 17, color: colors.ink },
    priceUnit: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
  });
}
