import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FONTS } from '../../../theme';

const VISIBLE_CHARS = 6;
const FADE_ALPHAS = [0.55, 0.28];

/**
 * Creator handle that shows only its first few characters, fading out like
 * Instagram, so a long name can't push the Follow button off the row. Tap
 * opens the creator's profile; long-press reveals (or collapses) the full name.
 */
export default function ReelFadingName({ name, onPress }) {
  const [expanded, setExpanded] = useState(false);
  const needsFade = name.length > VISIBLE_CHARS + FADE_ALPHAS.length;

  let content = name;
  if (needsFade && !expanded) {
    const solid = name.slice(0, VISIBLE_CHARS);
    const fading = name.slice(VISIBLE_CHARS, VISIBLE_CHARS + FADE_ALPHAS.length);
    content = (
      <>
        {solid}
        {[...fading].map((ch, i) => (
          <Text key={i} style={{ color: `rgba(255,255,255,${FADE_ALPHAS[i]})` }}>
            {ch}
          </Text>
        ))}
      </>
    );
  }

  return (
    <TouchableOpacity
      style={styles.tap}
      onPress={onPress}
      onLongPress={() => needsFade && setExpanded((v) => !v)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Open ${name}'s profile`}
    >
      <Text style={styles.name} numberOfLines={1}>
        {content}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tap: {
    flexShrink: 1,
  },
  name: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
