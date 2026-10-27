import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Building2, User, Send, Flag } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/**
 * "More" menu for a reel (the three dots): jump to the agency or creator
 * profile, share, or report. Items that don't apply (no agency) are left out.
 */
export default function ReelMoreSheet({
  visible,
  reel,
  onClose,
  onOpenAgency,
  onOpenCreator,
  onShare,
  onReport,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();

  const items = [
    reel.agency?.name && {
      icon: Building2,
      label: `View ${reel.agency.name}`,
      onPress: onOpenAgency,
    },
    {
      icon: User,
      label: `View ${reel.creatorHandle || 'creator'} profile`,
      onPress: onOpenCreator,
    },
    { icon: Send, label: 'Share reel', onPress: onShare },
    { icon: Flag, label: 'Report', onPress: onReport, danger: true },
  ].filter(Boolean);

  // Close first so the follow-up (navigation, share sheet, alert) isn't
  // fighting a dismissing modal.
  const choose = (action) => () => {
    onClose();
    setTimeout(action, 250);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheet, { paddingBottom: insets.bottom + SPACING.md }]}>
              <View style={styles.grabber} />
              {items.map(({ icon: Icon, label, onPress, danger }) => (
                <TouchableOpacity
                  key={label}
                  style={styles.row}
                  onPress={choose(onPress)}
                  activeOpacity={0.7}
                >
                  <Icon size={20} color={danger ? colors.error : colors.ink} />
                  <Text style={[styles.label, danger && { color: colors.error }]} numberOfLines={1}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
    sheet: {
      paddingTop: SPACING.sm,
      paddingHorizontal: SPACING.lg,
      borderTopLeftRadius: RADIUS.lg,
      borderTopRightRadius: RADIUS.lg,
      backgroundColor: colors.background,
    },
    grabber: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.divider,
      marginBottom: SPACING.sm,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: 14 },
    label: { flex: 1, fontFamily: FONTS.semibold, fontSize: 15, color: colors.ink },
  });
}
