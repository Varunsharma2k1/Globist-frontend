import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import Header from '../../../components/Header';
import CommunityCard from '../components/CommunityCard';
import { useCommunityData } from '../../../hooks/useCommunities';
import { useTheme } from '../../../hooks/useTheme';
import { COMMUNITIES, COMMUNITY_CATEGORIES } from '../../../data/communities';
import { SPACING, RADIUS, FONTS, LAYOUT } from '../../../theme';

/** Discover travel communities: search, category chips, the ones you've joined, and the rest. */
export default function CommunitiesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const { joinedCommunities } = useCommunityData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMMUNITIES.filter(
      (c) =>
        (category === 'All' || c.category === category) &&
        (!q || `${c.name} ${c.tagline} ${c.category}`.toLowerCase().includes(q))
    );
  }, [query, category]);

  const open = (c) => navigation.navigate('CommunityDetail', { communityId: c.id });

  return (
    <View style={styles.container}>
      <Header title="Communities" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.xl + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={typography.h2}>Find your people</Text>
        <Text style={[typography.body, { marginTop: SPACING.xs, marginBottom: SPACING.md }]}>
          Join travel clubs, swap stories and plan trips together.
        </Text>

        <View style={styles.search}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search communities"
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {COMMUNITY_CATEGORIES.map((cat) => {
            const active = cat === category;
            return (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.chip,
                  { backgroundColor: active ? colors.ink : colors.surfaceMuted },
                ]}
              >
                <Text
                  style={[styles.chipText, { color: active ? colors.inkContrast : colors.text }]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {joinedCommunities.length > 0 && (
          <>
            <Text style={styles.section}>Your communities</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.joinedRow}>
              {joinedCommunities.map((c) => (
                <Pressable key={c.id} style={styles.joined} onPress={() => open(c)}>
                  <Image source={c.cover} style={styles.joinedImage} />
                  <Text style={styles.joinedName} numberOfLines={2}>
                    {c.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        <Text style={styles.section}>{category === 'All' ? 'Discover' : category}</Text>
        <View style={{ gap: SPACING.sm + 2 }}>
          {results.map((c) => (
            <CommunityCard key={c.id} community={c} onPress={() => open(c)} />
          ))}
          {results.length === 0 && (
            <Text style={styles.empty}>No communities match that. Try another word.</Text>
          )}
        </View>
      </ScrollView>
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
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      backgroundColor: colors.surfaceMuted,
      borderRadius: RADIUS.pill,
      paddingHorizontal: SPACING.md,
    },
    searchInput: {
      flex: 1,
      fontFamily: FONTS.body,
      fontSize: 15,
      color: colors.text,
      paddingVertical: 12,
    },
    chips: {
      marginTop: SPACING.md,
      marginHorizontal: -SPACING.lg,
      paddingHorizontal: SPACING.lg,
      flexGrow: 0,
    },
    chip: {
      paddingHorizontal: SPACING.md,
      paddingVertical: 8,
      borderRadius: RADIUS.pill,
      marginRight: SPACING.sm,
    },
    chipText: { fontFamily: FONTS.semibold, fontSize: 13 },
    section: {
      fontFamily: FONTS.heading,
      fontSize: 18,
      color: colors.ink,
      marginTop: SPACING.lg,
      marginBottom: SPACING.sm + 2,
    },
    joinedRow: { marginHorizontal: -SPACING.lg, paddingHorizontal: SPACING.lg, flexGrow: 0 },
    joined: { width: 84, marginRight: SPACING.md, alignItems: 'center' },
    joinedImage: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surfaceMuted },
    joinedName: {
      fontFamily: FONTS.semibold,
      fontSize: 11,
      lineHeight: 14,
      color: colors.text,
      textAlign: 'center',
      marginTop: 6,
    },
    empty: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      paddingVertical: SPACING.xl,
    },
  });
}
