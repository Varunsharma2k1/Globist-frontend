import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS } from '../../../theme';

const blank = (agency) => ({
  about: agency.about || '',
  location: agency.location || '',
  phone: agency.phone || '',
  website: agency.website || '',
  coverUrl: agency.coverUrl || '',
});

/** Bottom sheet where an agency edits the details shown on its profile. */
export default function AgencyEditModal({ visible, agency, onSave, onClose }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState(blank(agency));

  useEffect(() => {
    if (visible) setForm(blank(agency));
  }, [visible, agency]);

  const set = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom + SPACING.md }]}>
          <View style={styles.titleRow}>
            <Text style={typography.h2}>Edit agency profile</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
              <X size={22} color={colors.ink} />
            </TouchableOpacity>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Input
              label="About (short note)"
              value={form.about}
              onChangeText={set('about')}
              placeholder="Tell travellers what makes your trips special"
              multiline
            />
            <Input label="Base location" value={form.location} onChangeText={set('location')} />
            <Input
              label="Phone"
              value={form.phone}
              onChangeText={set('phone')}
              keyboardType="phone-pad"
            />
            <Input label="Website" value={form.website} onChangeText={set('website')} />
            <Input
              label="Background photo (image link)"
              value={form.coverUrl}
              onChangeText={set('coverUrl')}
              placeholder="https://…"
            />
            <Button
              title="Save changes"
              onPress={() => {
                onSave(form);
                onClose();
              }}
              style={styles.save}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
    sheet: {
      maxHeight: '88%',
      padding: SPACING.lg,
      borderTopLeftRadius: RADIUS.lg,
      borderTopRightRadius: RADIUS.lg,
      backgroundColor: colors.background,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    save: { marginTop: SPACING.sm },
  });
}
