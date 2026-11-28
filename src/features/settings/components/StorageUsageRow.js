import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { HardDrive } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { FONTS } from '../../../theme';
import haptics from '../../../utils/haptics';
import { getSharedRowStyles } from './sharedRowStyles';

/** Total size of every file under a folder (bytes). */
async function folderSize(uri) {
  let total = 0;
  let names = [];
  try {
    names = await FileSystem.readDirectoryAsync(uri);
  } catch {
    return 0;
  }
  for (const name of names) {
    const child = `${uri}${name}`;
    try {
      const info = await FileSystem.getInfoAsync(child, { size: true });
      if (!info.exists) continue;
      total += info.isDirectory ? await folderSize(`${child}/`) : info.size || 0;
    } catch {
      // unreadable entry: skip
    }
  }
  return total;
}

const pretty = (bytes) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/**
 * Real cache usage: video thumbnails, picked/resized photos and other temp
 * files the app keeps in its cache folder. Clearing frees that space; the
 * app re-creates what it needs. Your account, tapes and settings are untouched.
 */
export default function StorageUsageRow() {
  const { colors } = useTheme();
  const rowStyles = getSharedRowStyles(colors);
  const styles = getStyles(colors);
  const [bytes, setBytes] = useState(null);
  const [clearing, setClearing] = useState(false);
  const root = FileSystem.cacheDirectory;

  const measure = useCallback(async () => {
    setBytes(root ? await folderSize(root) : 0);
  }, [root]);

  useEffect(() => {
    measure();
  }, [measure]);

  const clear = async () => {
    setClearing(true);
    try {
      const names = await FileSystem.readDirectoryAsync(root);
      await Promise.all(
        names.map((n) =>
          FileSystem.deleteAsync(`${root}${n}`, { idempotent: true }).catch(() => {})
        )
      );
      haptics.success();
    } catch {
      Alert.alert('Could not clear the cache', 'Try again.');
    } finally {
      await measure();
      setClearing(false);
    }
  };

  return (
    <View style={rowStyles.row}>
      <HardDrive size={19} color={colors.text} strokeWidth={2} />
      <View style={rowStyles.rowText}>
        <Text style={rowStyles.rowLabel}>Cache</Text>
        <Text style={rowStyles.rowSub}>
          {bytes == null ? 'Measuring…' : `${pretty(bytes)} of thumbnails & temporary files`}
        </Text>
      </View>
      {clearing ? (
        <ActivityIndicator color={colors.ink} />
      ) : (
        <TouchableOpacity onPress={clear} disabled={!bytes} style={{ opacity: bytes ? 1 : 0.4 }}>
          <Text style={styles.clear}>Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    clear: { fontFamily: FONTS.heading, fontSize: 14, color: colors.error },
  });
}
