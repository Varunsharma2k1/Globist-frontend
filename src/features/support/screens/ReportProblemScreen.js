import React, { useState } from 'react';
import { View, Text, Pressable, Alert, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import KeyboardAwareScrollView from '../../../components/KeyboardAwareScrollView';
import { client } from '../../../api';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import haptics from '../../../utils/haptics';
import { APP_VERSION } from '../../settings/data/settingsGroups';
import { SPACING, LAYOUT, FONTS, RADIUS } from '../../../theme';

const CATEGORIES = [
  { key: 'bug', label: 'Something’s broken' },
  { key: 'booking', label: 'Booking' },
  { key: 'payment', label: 'Payment' },
  { key: 'account', label: 'Account' },
  { key: 'content', label: 'A tape or user' },
  { key: 'other', label: 'Other' },
];
const MAX = 2000;

/** Sends a problem report to the team (POST /support/reports). */
export default function ReportProblemScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { user } = useAuth();
  const guest = !user || user.isGuest;
  const [category, setCategory] = useState(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const ready = category && message.trim().length >= 10 && (!guest || /\S+@\S+\.\S+/.test(email));

  const send = async () => {
    if (!ready) return;
    setSending(true);
    try {
      const { data } = await client.post('/support/reports', {
        category,
        message: message.trim(),
        email: guest ? email.trim() : undefined,
        platform: Platform.OS,
        appVersion: APP_VERSION,
      });
      haptics.success();
      Alert.alert('Report sent', data.message, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      haptics.error();
      Alert.alert(
        "Couldn't send",
        error.response?.data?.message || 'Check your connection and try again.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Report a problem" onBack={() => navigation.goBack()} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
      >
        <Text style={styles.label}>What’s it about?</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((c) => {
            const active = category === c.key;
            return (
              <Pressable
                key={c.key}
                onPress={() => {
                  haptics.select();
                  setCategory(c.key);
                }}
                style={[styles.chip, active && styles.chipOn]}
              >
                <Text style={[styles.chipText, active && { color: colors.inkContrast }]}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Input
          label="What happened?"
          value={message}
          onChangeText={(t) => setMessage(t.slice(0, MAX))}
          placeholder="Tell us what you were doing and what went wrong"
          multiline
        />
        <Text style={styles.counter}>
          {message.length}/{MAX}
        </Text>

        {guest ? (
          <Input
            label="Your email"
            value={email}
            onChangeText={setEmail}
            placeholder="So we can reply"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : null}

        <Text style={styles.note}>
          We include your phone type and app version ({Platform.OS}, v{APP_VERSION}) to help us fix
          it.
        </Text>
        <Button
          title="Send report"
          loading={sending}
          onPress={send}
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
    label: { fontFamily: FONTS.heading, fontSize: 14, color: colors.ink, marginBottom: SPACING.sm },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
    chip: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: RADIUS.pill,
      backgroundColor: colors.surfaceMuted,
    },
    chipOn: { backgroundColor: colors.ink },
    chipText: { fontFamily: FONTS.heading, fontSize: 12, color: colors.ink },
    counter: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      textAlign: 'right',
      marginTop: -SPACING.sm,
      marginBottom: SPACING.sm,
    },
    note: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
  });
}
