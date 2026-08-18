import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Database } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { FONTS } from '../../../theme';
import { getSharedRowStyles } from './sharedRowStyles';
import SettingsSectionLabel from './SettingsSectionLabel';

/**
 * "Storage & Cache Usage" row with an inline "Clear Cache" action. Purely a
 * UI stub (no real cache to measure) — mirrors the design handoff's
 * "128 MB used" → "0 MB used — cache cleared" copy swap on tap.
 */
export default function StorageUsageRow() {
  const { colors } = useTheme();
  const rowStyles = getSharedRowStyles(colors);
  const styles = getStyles();
  const [cacheCleared, setCacheCleared] = useState(false);

  return (
    <View>
      <SettingsSectionLabel>Data & Media</SettingsSectionLabel>
      <View style={rowStyles.row}>
        <Database size={19} color={colors.text} strokeWidth={2} />
        <View style={rowStyles.rowText}>
          <Text style={rowStyles.rowLabel}>Storage & Cache Usage</Text>
          <Text style={rowStyles.rowSub}>
            {cacheCleared ? '0 MB used — cache cleared' : '128 MB used'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setCacheCleared(true)}
          disabled={cacheCleared}
          style={{ opacity: cacheCleared ? 0.5 : 1 }}
        >
          <Text style={styles.clearCacheText}>{cacheCleared ? 'Cleared' : 'Clear Cache'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getStyles() {
  return StyleSheet.create({
    clearCacheText: {
      fontFamily: FONTS.bold,
      fontSize: 13,
      color: '#C94A3A',
    },
  });
}
