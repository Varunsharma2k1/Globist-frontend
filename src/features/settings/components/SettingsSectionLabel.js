import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { getSharedRowStyles } from './sharedRowStyles';

export default function SettingsSectionLabel({ children }) {
  const { colors } = useTheme();
  const styles = getSharedRowStyles(colors);
  return <Text style={styles.sectionTitle}>{children}</Text>;
}
