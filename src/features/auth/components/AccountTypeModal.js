import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Compass, Building2, Check } from 'lucide-react-native';
import Button from '../../../components/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

const ACCOUNT_TYPES = [
  {
    key: 'traveler',
    label: 'Traveller',
    description: 'Discover and book authentic trips',
    Icon: Compass,
  },
  {
    key: 'agency',
    label: 'Agency',
    description: 'List and sell your travel packages',
    Icon: Building2,
  },
];

/**
 * One-time prompt shown over the home screen right after a brand-new account
 * signs up (email or Google). It can't be dismissed: the chosen type is saved
 * on the user and shown as the badge on their profile.
 */
export default function AccountTypeModal() {
  const { user, selectAccountType } = useAuth();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await selectAccountType(selected);
    } catch (err) {
      Alert.alert(
        'Something went wrong',
        err.response?.data?.message || 'Could not save your account type'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={Boolean(user?.needsAccountType)}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>
            Welcome to Triptape{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </Text>
          <Text style={styles.subtitle}>
            How will you use Triptape? This sets the badge on your profile.
          </Text>

          {ACCOUNT_TYPES.map(({ key, label, description, Icon }) => {
            const active = selected === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.option, active && styles.optionActive]}
                onPress={() => setSelected(key)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                  <Icon size={20} color={active ? colors.inkContrast : colors.ink} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{label}</Text>
                  <Text style={styles.optionDesc}>{description}</Text>
                </View>
                {active && <Check size={18} color={colors.ink} />}
              </TouchableOpacity>
            );
          })}

          <Button
            title="Continue"
            onPress={handleContinue}
            loading={saving}
            style={[{ marginTop: SPACING.md }, !selected && { opacity: 0.4 }]}
          />
        </View>
      </View>
    </Modal>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'center',
      padding: SPACING.lg,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.lg,
      width: '100%',
      maxWidth: 440,
      alignSelf: 'center',
    },
    title: {
      fontFamily: FONTS.heading,
      fontSize: 22,
      color: colors.text,
    },
    subtitle: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      marginTop: SPACING.xs,
      marginBottom: SPACING.lg,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      padding: SPACING.md,
      borderRadius: RADIUS.md,
      borderWidth: 1.5,
      borderColor: colors.divider,
      marginBottom: SPACING.sm,
    },
    optionActive: {
      borderColor: colors.ink,
      backgroundColor: colors.surfaceMuted,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrapActive: {
      backgroundColor: colors.ink,
    },
    optionText: {
      flex: 1,
    },
    optionLabel: {
      fontFamily: FONTS.heading,
      fontSize: 15,
      color: colors.text,
    },
    optionDesc: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
  });
}
