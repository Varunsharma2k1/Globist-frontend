import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING } from '../../../theme';
import { getSharedModalStyles } from './sharedModalStyles';
import { getFeedOptionStyles } from './FeedPreferencesCard';
import { THEME_MODE_LABEL } from '../data/settingsGroups';

const MODES = ['light', 'dark', 'system'];

/**
 * Light / Dark / System picker, opened from the "Language & App Theme" row.
 */
export default function ThemePickerModal({ visible, onClose }) {
  const { colors, mode, setMode } = useTheme();
  const modalStyles = getSharedModalStyles(colors);
  const optionStyles = getFeedOptionStyles(colors);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={modalStyles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={modalStyles.modalCard}>
          <Text style={modalStyles.modalTitle}>App Theme</Text>
          <Text style={modalStyles.modalBody}>Choose how Triptape looks on this device.</Text>
          <View style={{ gap: SPACING.xs, marginTop: SPACING.sm }}>
            {MODES.map((m) => {
              const active = mode === m;
              return (
                <TouchableOpacity
                  key={m}
                  style={[optionStyles.feedOption, active && optionStyles.feedOptionActive]}
                  onPress={() => {
                    setMode(m);
                    onClose();
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      optionStyles.feedOptionLabel,
                      active && optionStyles.feedOptionLabelActive,
                    ]}
                  >
                    {THEME_MODE_LABEL[m]}
                  </Text>
                  {active && <Check size={18} color={colors.inkContrast} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
