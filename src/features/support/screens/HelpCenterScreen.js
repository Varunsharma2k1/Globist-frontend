import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Linking,
  Alert,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ChevronDown, Mail, Flag } from 'lucide-react-native';
import Header from '../../../components/Header';
import KeyboardAwareScrollView from '../../../components/KeyboardAwareScrollView';
import { useTheme } from '../../../hooks/useTheme';
import haptics from '../../../utils/haptics';
import { SPACING, LAYOUT, FONTS, RADIUS } from '../../../theme';
import { FAQ_SECTIONS, SUPPORT_EMAIL } from '../data/faqs';

/** Searchable FAQs (tap to expand) and ways to reach us. */
export default function HelpCenterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_SECTIONS;
    return FAQ_SECTIONS.map((s) => ({
      ...s,
      items: s.items.filter((i) => `${i.q} ${i.a}`.toLowerCase().includes(q)),
    })).filter((s) => s.items.length);
  }, [query]);

  const toggle = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    haptics.select();
    setOpen((cur) => (cur === key ? null : key));
  };

  const email = () =>
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=TripTape%20help`).catch(() =>
      Alert.alert('Email us', SUPPORT_EMAIL)
    );

  return (
    <View style={styles.container}>
      <Header title="Help Center" onBack={() => navigation.goBack()} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.xl + insets.bottom }]}
      >
        <Text style={styles.title}>How can we help?</Text>
        <View style={styles.search}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search bookings, refunds, tapes…"
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
          />
        </View>

        {sections.map((section) => (
          <View key={section.title}>
            <Text style={styles.section}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, i) => {
                const key = `${section.title}-${i}`;
                const expanded = open === key || Boolean(query.trim());
                return (
                  <Pressable
                    key={key}
                    onPress={() => toggle(key)}
                    style={[styles.item, i > 0 && styles.divider]}
                  >
                    <View style={styles.qRow}>
                      <Text style={styles.q}>{item.q}</Text>
                      <ChevronDown
                        size={18}
                        color={colors.textMuted}
                        style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
                      />
                    </View>
                    {expanded ? <Text style={styles.a}>{item.a}</Text> : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
        {!sections.length ? (
          <Text style={styles.none}>No answers match “{query}”. Contact us below.</Text>
        ) : null}

        <Text style={styles.section}>Still need help?</Text>
        <View style={styles.card}>
          <Pressable style={styles.contact} onPress={email}>
            <Mail size={20} color={colors.ink} />
            <View style={{ flex: 1 }}>
              <Text style={styles.q}>Email support</Text>
              <Text style={styles.sub}>{SUPPORT_EMAIL} · replies within 24 hours</Text>
            </View>
          </Pressable>
          <Pressable
            style={[styles.contact, styles.divider]}
            onPress={() => navigation.navigate('ReportProblem')}
          >
            <Flag size={20} color={colors.ink} />
            <View style={{ flex: 1 }}>
              <Text style={styles.q}>Report a problem</Text>
              <Text style={styles.sub}>Something not working? Tell us what happened</Text>
            </View>
          </Pressable>
        </View>
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
    title: { fontFamily: FONTS.heading, fontSize: 28, letterSpacing: -0.5, color: colors.ink },
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginTop: SPACING.md,
      paddingHorizontal: SPACING.md,
      minHeight: 44,
      borderRadius: RADIUS.pill,
      backgroundColor: colors.surfaceMuted,
    },
    searchInput: {
      flex: 1,
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.text,
      paddingVertical: SPACING.sm,
    },
    section: {
      fontFamily: FONTS.heading,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.textMuted,
      marginTop: SPACING.lg,
      marginBottom: SPACING.sm,
    },
    card: {
      borderRadius: RADIUS.lg,
      backgroundColor: colors.mode === 'dark' ? colors.surface : colors.surfaceMuted,
      paddingHorizontal: SPACING.md,
    },
    item: { paddingVertical: SPACING.md },
    divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
    qRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    q: { flex: 1, fontFamily: FONTS.heading, fontSize: 14, color: colors.ink },
    a: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textMuted,
      marginTop: SPACING.sm,
    },
    sub: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted, marginTop: 2 },
    contact: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      paddingVertical: SPACING.md,
    },
    none: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      marginTop: SPACING.lg,
      textAlign: 'center',
    },
  });
}
