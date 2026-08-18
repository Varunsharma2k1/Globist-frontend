import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import ReelItem from '../../../components/ReelItem';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING } from '../../../theme';

/**
 * Full-screen Instagram-style preview of the reel being composed, reusing
 * the real ReelItem component so it renders exactly like a published reel
 * (video, caption, creator info, like/comment/share rail) at zero values.
 */
export default function ReelPreviewModal({ visible, onClose, reel }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [muted, setMuted] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: colors.reelTone.default }}>
        {reel && (
          <ReelItem
            reel={reel}
            height={windowHeight}
            isActive={visible}
            muted={muted}
            onToggleMute={() => setMuted((v) => !v)}
            onAgencyPress={() => {}}
            onCreatorPress={() => {}}
          />
        )}
        <TouchableOpacity
          style={[styles.closeBtn, { top: insets.top + SPACING.sm }]}
          onPress={onClose}
        >
          <X size={20} color="#FFFFFF" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    position: 'absolute',
    left: SPACING.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
