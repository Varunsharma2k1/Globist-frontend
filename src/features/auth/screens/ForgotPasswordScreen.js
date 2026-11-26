import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import Header from '../../../components/Header';
import KeyboardAwareScrollView from '../../../components/KeyboardAwareScrollView';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';
import { requestPasswordReset } from '../../../api/auth';
import { SPACING, LAYOUT, FONTS } from '../../../theme';
import FormNotice from '../components/FormNotice';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Forgot password, two steps:
 *   1. email -> server emails a 6-digit code (valid 10 min, 5 tries)
 *   2. code + new password -> every other device is signed out and this one
 *      is signed in; going back lets AuthScreen continue to its redirect.
 */
export default function ForgotPasswordScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const { resetPassword } = useAuth();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState(route?.params?.email || '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const errorText = (err) =>
    err.response?.data?.message ||
    (err.response
      ? 'Something went wrong. Please try again.'
      : 'Could not reach the server. Check your connection.');

  const sendCode = async () => {
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setNotice({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      const { message } = await requestPasswordReset(value);
      setEmail(value);
      setStep('code');
      setNotice({ type: 'info', text: message });
    } catch (err) {
      setNotice({ type: 'error', text: errorText(err) });
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setNotice({ type: 'error', text: 'Enter the 6-digit code from the email' });
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setNotice({
        type: 'error',
        text: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      await resetPassword({ email, code: code.trim(), newPassword: password });
      navigation.goBack(); // AuthScreen sees the session and continues
    } catch (err) {
      setNotice({ type: 'error', text: errorText(err) });
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Reset Password" onBack={() => navigation.goBack()} />
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
      >
        <Text style={typography.h2}>
          {step === 'email' ? 'Forgot your password?' : 'Check your email'}
        </Text>
        <Text style={[typography.body, { marginTop: SPACING.xs, marginBottom: SPACING.lg }]}>
          {step === 'email'
            ? "Enter your account email and we'll send you a 6-digit code."
            : `Enter the code sent to ${email} and choose a new password. You'll be signed out on all other devices.`}
        </Text>

        <FormNotice notice={notice} />

        {step === 'email' ? (
          <>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
            />
            <Button
              title="Send Code"
              onPress={sendCode}
              loading={loading}
              style={{ marginTop: SPACING.md }}
            />
          </>
        ) : (
          <>
            <Input
              label="6-digit code"
              value={code}
              onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
            />
            <Input
              label="New password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              rightIcon={
                showPassword ? (
                  <EyeOff size={18} color={colors.textMuted} />
                ) : (
                  <Eye size={18} color={colors.textMuted} />
                )
              }
              onRightIconPress={() => setShowPassword((v) => !v)}
            />
            <Button
              title="Reset Password"
              onPress={submitReset}
              loading={loading}
              style={{ marginTop: SPACING.md }}
            />
            <TouchableOpacity style={styles.linkWrap} onPress={sendCode} disabled={loading}>
              <Text style={styles.link}>Didn't get it? Send a new code</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1 },
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    linkWrap: { marginTop: SPACING.lg, alignItems: 'center' },
    link: { fontFamily: FONTS.heading, fontSize: 14, color: colors.ink },
  });
}
