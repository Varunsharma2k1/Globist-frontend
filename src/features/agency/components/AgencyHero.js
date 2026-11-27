import React, { useRef, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { ArrowLeft, Pencil, MapPin } from 'lucide-react-native';
import VerifiedBadge from '../../../components/VerifiedBadge';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { getCoverImage } from '../../../data/coverImages';
import { useTopInset } from '../../../hooks/useTopInset';

const HERO_HEIGHT = 220;

/**
 * Full-bleed cover photo, with the agency's name, verified tick and location
 * in their own block BELOW it (not over the photo), so they're always
 * readable whatever the image. The Edit button only shows for agencies.
 */
export default function AgencyHero({ agency, imageType, onBack, onEdit }) {
  const { colors } = useTheme();
  const topInset = useTopInset();
  const [failed, setFailed] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const uri =
    agency.coverUrl ||
    getCoverImage({ imageUrl: agency.imageUrl, _id: agency._id || agency.name, imageType });

  return (
    <View>
      <View
        style={[
          styles.hero,
          { height: HERO_HEIGHT + topInset, backgroundColor: colors.pastel.mountain.bg },
        ]}
      >
        {uri && !failed ? (
          <Animated.Image
            source={{ uri }}
            style={[StyleSheet.absoluteFill, { opacity: fade }]}
            resizeMode="cover"
            onLoad={() =>
              Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start()
            }
            onError={() => setFailed(true)}
          />
        ) : null}
        <View style={styles.scrim} />

        <View style={[styles.topRow, { top: topInset + SPACING.sm }]}>
          <RoundButton icon={ArrowLeft} label="Go back" onPress={onBack} />
          {onEdit ? <RoundButton icon={Pencil} label="Edit profile" onPress={onEdit} /> : null}
        </View>
      </View>

      <View style={styles.titleWrap}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.ink }]} numberOfLines={2}>
            {agency.name}
          </Text>
          {agency.isVerified ? <VerifiedBadge size={20} /> : null}
        </View>
        {agency.location ? (
          <View style={styles.locationRow}>
            <MapPin size={13} color={colors.textMuted} />
            <Text style={[styles.location, { color: colors.textMuted }]}>{agency.location}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function RoundButton({ icon: Icon, label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <BlurView intensity={40} tint="dark" style={styles.round}>
        <Icon size={20} color="#FFFFFF" />
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  // Light scrim only so the back / edit buttons stay visible on bright photos.
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  topRow: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  round: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrap: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    flexShrink: 1,
    fontFamily: FONTS.heading,
    fontSize: 28,
    letterSpacing: -0.4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
  },
  location: {
    fontFamily: FONTS.body,
    fontSize: 14,
  },
});
