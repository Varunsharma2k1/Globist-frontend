import React, { useRef, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Pencil, MapPin } from 'lucide-react-native';
import VerifiedBadge from '../../../components/VerifiedBadge';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { getCoverImage } from '../../../data/coverImages';

const HERO_HEIGHT = 260;

/**
 * Full-bleed background photo with the agency's name, verified tick and
 * location laid over a dark scrim. The Edit button only shows for agencies.
 */
export default function AgencyHero({ agency, imageType, onBack, onEdit }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [failed, setFailed] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const uri =
    agency.coverUrl ||
    getCoverImage({ imageUrl: agency.imageUrl, _id: agency._id || agency.name, imageType });

  return (
    <View
      style={[
        styles.hero,
        { height: HERO_HEIGHT + insets.top, backgroundColor: colors.pastel.mountain.bg },
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

      <View style={[styles.topRow, { top: insets.top + SPACING.sm }]}>
        <RoundButton icon={ArrowLeft} label="Go back" onPress={onBack} />
        {onEdit ? <RoundButton icon={Pencil} label="Edit profile" onPress={onEdit} /> : null}
      </View>

      <View style={styles.titleWrap}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={2}>
            {agency.name}
          </Text>
          {agency.isVerified ? <VerifiedBadge size={20} /> : null}
        </View>
        {agency.location ? (
          <View style={styles.locationRow}>
            <MapPin size={13} color="rgba(255,255,255,0.85)" />
            <Text style={styles.location}>{agency.location}</Text>
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
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
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
    padding: SPACING.lg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    flexShrink: 1,
    fontFamily: FONTS.heading,
    fontSize: 26,
    letterSpacing: -0.4,
    color: '#FFFFFF',
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
    color: 'rgba(255,255,255,0.88)',
  },
});
