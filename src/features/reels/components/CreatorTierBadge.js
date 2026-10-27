import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Award } from 'lucide-react-native';

// Medal colours per creator tier (backend sends 'gold' / 'silver' / 'bronze',
// sometimes as "Gold Creator").
const TIER_COLORS = {
  gold: { fill: '#F5B700', ring: '#FFE08A' },
  silver: { fill: '#AEB7C2', ring: '#E3E8EE' },
  bronze: { fill: '#C27A3A', ring: '#E8B98C' },
};

export const tierKey = (tier) => {
  const match = /gold|silver|bronze/i.exec(tier || '');
  return match ? match[0].toLowerCase() : null;
};

/**
 * Small medal badge next to a creator's name in place of a "Gold Creator"
 * text tag. Renders nothing for an unknown tier.
 */
export default function CreatorTierBadge({ tier, size = 20 }) {
  const key = tierKey(tier);
  if (!key) return null;
  const { fill, ring } = TIER_COLORS[key];
  const label = `${key.charAt(0).toUpperCase()}${key.slice(1)} creator`;

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: fill,
          borderColor: ring,
        },
      ]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
    >
      <Award size={size * 0.62} color="#FFFFFF" strokeWidth={2.5} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
});
