import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, FONTS, LAYOUT } from '../theme';

/**
 * AuthScreen Component
 *
 * User authentication screen supporting both Sign In and Sign Up modes.
 * Uses `useAuth` custom hook for clean, stateful auth dispatching.
 */
export default function AuthScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('traveler');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async () => {
    if (!phone || !password) {
      Alert.alert('Required Fields', 'Please enter phone number and password');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(phone, password);
      } else {
        if (!name) {
          Alert.alert('Required Field', 'Please enter your name');
          setLoading(false);
          return;
        }
        await signup({ name, phone, password, role });
      }
      navigation.navigate('MainTabs');
    } catch (err) {
      Alert.alert('Authentication Error', err.response?.data?.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={isLogin ? 'Sign In' : 'Create Account'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}>
        <Text style={TYPOGRAPHY.h2}>{isLogin ? 'Welcome Back' : 'Create Your Account'}</Text>
        <Text style={[TYPOGRAPHY.body, { marginTop: SPACING.xs, marginBottom: SPACING.lg }]}>
          {isLogin
            ? 'Sign in to access your booked trips & reels'
            : 'Book authentic travel packages & post reels'}
        </Text>

        {!isLogin && (
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Alex Rivera"
          />
        )}

        <Input
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 98765 43210"
          keyboardType="phone-pad"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          rightIcon={
            showPassword ? (
              <EyeOff size={18} color={COLORS.textMuted} />
            ) : (
              <Eye size={18} color={COLORS.textMuted} />
            )
          }
          onRightIconPress={() => setShowPassword((v) => !v)}
        />

        {!isLogin && (
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Account Type</Text>
            <View style={styles.roleRow}>
              {['traveler', 'creator', 'agency'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleChip, role === r && styles.roleChipActive]}
                  onPress={() => setRole(r)}
                >
                  <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                    {r.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <Button
          title={isLogin ? 'Sign In' : 'Register Account'}
          onPress={handleSubmit}
          loading={loading}
          style={{ marginTop: SPACING.md }}
        />

        <TouchableOpacity style={styles.switchContainer} onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? " : 'Already registered? '}
            <Text style={styles.switchHighlight}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  roleContainer: {
    marginBottom: SPACING.md,
  },
  roleLabel: {
    fontFamily: FONTS.body,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  roleRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  roleChip: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
  },
  roleChipActive: {
    backgroundColor: COLORS.ink,
  },
  roleText: {
    fontFamily: FONTS.heading,
    fontSize: 11,
    color: COLORS.text,
  },
  roleTextActive: {
    color: COLORS.white,
  },
  switchContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  switchText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  switchHighlight: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.ink,
  },
});
