import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { useTheme } from '../../../hooks/useTheme';
import haptics from '../../../utils/haptics';
import { SPACING, LAYOUT, FONTS, RADIUS } from '../../../theme';
import { TERMS, PRIVACY, LEGAL_UPDATED } from '../data/legal';

const TABS = [
  { key: 'terms', label: 'Terms', title: 'Terms of Service', body: TERMS },
  { key: 'privacy', label: 'Privacy', title: 'Privacy Policy', body: PRIVACY },
];

/** Terms of Service and Privacy Policy, switched with a segmented control. */
export default function LegalScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [tab, setTab] = useState(route.params?.tab === 'privacy' ? 'privacy' : 'terms');
  const doc = TABS.find((t) => t.key === tab);

  return (
    <View style={styles.container}>
      <Header title="Terms & Privacy" onBack={() => navigation.goBack()} />
      <View style={styles.segmentWrap}>
        <View style={styles.segment}>
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => {
                if (t.key !== tab) haptics.select();
                setTab(t.key);
              }}
              style={[styles.segItem, tab === t.key && styles.segOn]}
            >
              <Text style={[styles.segText, tab === t.key && { color: colors.ink }]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.xl + insets.bottom }]}
      >
        <Text style={styles.title}>{doc.title}</Text>
        <Text style={styles.updated}>Last updated {LEGAL_UPDATED}</Text>
        {doc.body.map((s, i) => (
          <View key={s.h} style={styles.block}>
            <Text style={styles.h}>
              {i + 1}. {s.h}
            </Text>
            <Text style={styles.p}>{s.p}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  const centred = { width: '100%', maxWidth: LAYOUT.contentMaxWidth, alignSelf: 'center' };
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    segmentWrap: { ...centred, paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
    segment: {
      flexDirection: 'row',
      padding: 4,
      borderRadius: RADIUS.pill,
      backgroundColor: colors.surfaceMuted,
    },
    segItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: SPACING.sm,
      borderRadius: RADIUS.pill,
    },
    segOn: { backgroundColor: colors.mode === 'dark' ? colors.surface : '#FFFFFF' },
    segText: { fontFamily: FONTS.heading, fontSize: 14, color: colors.textMuted },
    content: { ...centred, padding: SPACING.lg },
    title: { fontFamily: FONTS.heading, fontSize: 28, letterSpacing: -0.5, color: colors.ink },
    updated: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: SPACING.xs,
    },
    block: { marginTop: SPACING.lg },
    h: { fontFamily: FONTS.heading, fontSize: 14, color: colors.ink },
    p: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 22,
      color: colors.text,
      marginTop: SPACING.xs,
    },
  });
}
