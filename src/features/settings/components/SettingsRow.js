import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import SettingsToggle from '../../../components/SettingsToggle';
import { getSharedRowStyles } from './sharedRowStyles';

/**
 * A single Settings list row — icon, label + optional sub-label, and either
 * a toggle switch (row.type === 'toggle') or a chevron (nav row). A nav row
 * is only pressable if an explicit `onPress` is supplied.
 */
export default function SettingsRow({ row, on, onToggle, onPress }) {
  const { colors } = useTheme();
  const styles = getSharedRowStyles(colors);
  const Icon = row.icon;
  const handlePress = onPress || (row.type === 'toggle' ? onToggle : undefined);

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={row.type === 'toggle' ? 1 : 0.7}
      onPress={handlePress}
      disabled={!handlePress}
    >
      <Icon size={19} color={colors.text} strokeWidth={2} />
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{row.label}</Text>
        {!!row.sub && <Text style={styles.rowSub}>{row.sub}</Text>}
      </View>
      {row.type === 'toggle' ? (
        <SettingsToggle value={on} onValueChange={onToggle} />
      ) : (
        <ChevronRight size={16} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}
