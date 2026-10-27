import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { useAuthForm } from '../hooks/useAuthForm';
import AuthModeSwitch from '../components/AuthModeSwitch';
import FormNotice from '../components/FormNotice';

/**
 * AuthScreen Component
 *
 * User authentication screen supporting both Sign In and Sign Up modes.
 * Form state/submission lives in useAuthForm; each visual section is its
 * own component (see ../components) — this file is just the layout.
 */
export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const styles = getStyles();
  const form = useAuthForm();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={form.isLogin ? 'Sign In' : 'Create Account'} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
      >
        <Text style={typography.h2}>{form.isLogin ? 'Welcome Back' : 'Create Your Account'}</Text>
        <Text style={[typography.body, { marginTop: SPACING.xs, marginBottom: SPACING.lg }]}>
          {form.isLogin
            ? 'Sign in with your email to access your trips & reels'
            : 'Sign up with your email to book trips & post reels'}
        </Text>

        <FormNotice notice={form.notice} />

        {!form.isLogin && (
          <Input
            label="Full Name"
            value={form.name}
            onChangeText={form.setName}
            placeholder="e.g. Alex Rivera"
          />
        )}

        <Input
          label="Email"
          value={form.email}
          onChangeText={form.setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
        />

        <Input
          label="Password"
          value={form.password}
          onChangeText={form.setPassword}
          placeholder="••••••••"
          secureTextEntry={!form.showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={form.isLogin ? 'current-password' : 'new-password'}
          textContentType={form.isLogin ? 'password' : 'newPassword'}
          rightIcon={
            form.showPassword ? (
              <EyeOff size={18} color={colors.textMuted} />
            ) : (
              <Eye size={18} color={colors.textMuted} />
            )
          }
          onRightIconPress={() => form.setShowPassword((v) => !v)}
        />

        <Button
          title={form.isLogin ? 'Sign In' : 'Create Account'}
          onPress={form.handleSubmit}
          loading={form.loading}
          style={{ marginTop: SPACING.md }}
        />

        <AuthModeSwitch isLogin={form.isLogin} onToggle={form.toggleMode} />
      </ScrollView>
    </View>
  );
}

function getStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
  });
}
