import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import KeyboardAwareScrollView from '../../../components/KeyboardAwareScrollView';
import { changePassword } from '../../../api/auth';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import haptics from '../../../utils/haptics';
import { SPACING, LAYOUT, FONTS } from '../../../theme';

const MIN = 8;

/**
 * Change password (POST /auth/password/change). Other devices are signed
 * out; this one stays signed in. Accounts created with Google have no
 * password yet, so they just set one.
 */
export default function ChangePasswordScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { user, updateUser } = useAuth();
  // Google sign-ups have no password until they set one here.
  const googleOnly =
    user?.hasPassword === false || (user?.authProvider === 'google' && !user?.hasPassword);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const problem =
    next.length && next.length < MIN
      ? `At least ${MIN} characters`
      : confirm.length && confirm !== next
        ? 'Passwords don’t match'
        : null;
  const ready = (googleOnly || current) && next.length >= MIN && confirm === next;

  const save = async () => {
    if (!ready) return;
    setSaving(true);
    try {
      const res = await changePassword({
        currentPassword: current || undefined,
        newPassword: next,
      });
      haptics.success();
      await updateUser({ hasPassword: true });
      const others = res?.otherDevicesSignedOut;
      Alert.alert(
        'Password updated',
        others
          ? `Signed out of ${others} other device${others === 1 ? '' : 's'} for your safety.`
          : undefined,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      haptics.error();
      Alert.alert(
        "Couldn't update",
        error.response?.data?.message || 'Check your connection and try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const eye = show ? (
    <EyeOff size={18} color={colors.textMuted} />
  ) : (
    <Eye size={18} color={colors.textMuted} />
  );
  const pw = {
    secureTextEntry: !show,
    autoCapitalize: 'none',
    autoCorrect: false,
    rightIcon: eye,
    onRightIconPress: () => setShow((v) => !v),
  };

  return (
    <View style={styles.container}>
      <Header title="Password & security" onBack={() => navigation.goBack()} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
      >
        <Text style={styles.intro}>
          {googleOnly
            ? 'You sign in with Google. Set a password to also sign in with your email.'
            : 'Choose a strong password you don’t use anywhere else.'}
        </Text>
        {!googleOnly ? (
          <Input
            label="Current password"
            value={current}
            onChangeText={setCurrent}
            autoComplete="current-password"
            textContentType="password"
            {...pw}
          />
        ) : null}
        <Input
          label="New password"
          value={next}
          onChangeText={setNext}
          placeholder={`At least ${MIN} characters`}
          autoComplete="new-password"
          textContentType="newPassword"
          {...pw}
        />
        <Input
          label="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
          autoComplete="new-password"
          textContentType="newPassword"
          {...pw}
        />
        {problem ? <Text style={styles.problem}>{problem}</Text> : null}
        <Text style={styles.note}>
          Other devices will be signed out. This phone stays signed in.
        </Text>
        <Button
          title={googleOnly ? 'Set password' : 'Update password'}
          loading={saving}
          onPress={save}
          style={[{ marginTop: SPACING.md }, !ready && { opacity: 0.4 }]}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    intro: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textMuted,
      marginBottom: SPACING.lg,
    },
    problem: {
      fontFamily: FONTS.heading,
      fontSize: 12,
      color: colors.error,
      marginTop: -SPACING.xs,
    },
    note: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted, marginTop: SPACING.sm },
  });
}
