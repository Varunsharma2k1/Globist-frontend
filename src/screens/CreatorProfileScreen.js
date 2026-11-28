import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, MessageCircle, Clapperboard } from 'lucide-react-native';
import Header from '../components/Header';
import ProfileHero from '../features/profile/components/ProfileHero';
import { SectionTitle } from '../features/profile/components/ProfileSections';
import ReelGridTile from '../features/profile/components/ReelGridTile';
import { getPublicProfile } from '../api/follows';
import { getUserReels } from '../api/reels';
import { useFollow, isServerUserId } from '../context/FollowContext';
import { SPACING, FONTS, LAYOUT, RADIUS } from '../theme';
import { useTheme } from '../hooks/useTheme';
import { useRequireAuth } from '../hooks/useRequireAuth';

const GAP = 4; // tight gap suits the sharp tiles

/** "Manali, Himachal Pradesh" -> "Manali" (the tag on each tape card). */
const placeOf = (reel) =>
  String(reel.location || '')
    .split(',')[0]
    .trim();

/**
 * Someone else's profile, in the same style as your own Profile page:
 * the grey greeting card (avatar, name, bio, Tapes / Followers / Following),
 * Follow + Message as cards, then their tapes in a two-column grid.
 * Route params: { creator }.
 */
export default function CreatorProfileScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const dark = colors.mode === 'dark';
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { creator } = route.params || {};
  const creatorId = creator?._id;
  const real = isServerUserId(creatorId);
  const [profile, setProfile] = useState(null);
  const [reels, setReels] = useState(null);
  const { meId, isFollowing, toggle } = useFollow();
  const { requireAuth } = useRequireAuth(navigation);
  const isMe = real && String(creatorId) === meId;

  useFocusEffect(
    useCallback(() => {
      if (!real) {
        setReels([]);
        return undefined;
      }
      let alive = true;
      getPublicProfile(creatorId)
        .then((data) => alive && setProfile(data))
        .catch(() => {});
      getUserReels(creatorId)
        .then((list) => alive && setReels(list))
        .catch(() => alive && setReels((prev) => prev || []));
      return () => {
        alive = false;
      };
    }, [creatorId, real])
  );

  const person = profile?.user || creator || {};
  const name = person.name || creator?.creatorHandle || 'Traveller';
  const first = name.replace('@', '').split(/[\s_]/)[0];
  const following = real && isFollowing(creatorId);

  const onFollow = async () => {
    if (!requireAuth({ name: 'CreatorProfile', params: route.params })) return;
    const result = await toggle(creatorId);
    if (result) setProfile((p) => (p ? { ...p, followers: result.followers } : p));
  };

  const openChat = () => {
    const params = { userId: creatorId, title: name };
    if (requireAuth({ name: 'ChatThread', params })) navigation.navigate('ChatThread', params);
  };

  const openList = (kind) => {
    if (requireAuth({ name: 'CreatorProfile', params: route.params })) {
      navigation.push('FollowList', { userId: creatorId, kind });
    }
  };

  const tagline = [person.bio, person.location ? `📍 ${person.location}` : null]
    .filter(Boolean)
    .join('\n');

  const gridWidth = Math.min(width, LAYOUT.contentMaxWidth) - SPACING.lg * 2;
  const tileWidth = Math.floor((gridWidth - GAP) / 2);

  return (
    <View style={styles.container}>
      <Header title={creator?.creatorHandle || name} onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.xxl + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHero
          user={person}
          title={name}
          tagline={tagline || 'Exploring India, one tape at a time.'}
          items={
            real
              ? [
                  { label: 'Tapes', value: profile?.tapes },
                  {
                    label: 'Followers',
                    value: profile?.followers,
                    onPress: () => openList('followers'),
                  },
                  {
                    label: 'Following',
                    value: profile?.following,
                    onPress: () => openList('following'),
                  },
                ]
              : []
          }
        />

        {real && !isMe ? (
          <View style={styles.actions}>
            <Pressable
              onPress={onFollow}
              style={[styles.card, styles.action, !following && styles.followOn]}
              accessibilityRole="button"
            >
              <Text
                style={[styles.actionText, !following && { color: dark ? '#9FC0DE' : '#3F5F7E' }]}
              >
                {following ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
            <Pressable
              onPress={openChat}
              style={[styles.card, styles.action]}
              accessibilityRole="button"
              accessibilityLabel={`Message ${first}`}
            >
              <MessageCircle size={18} color={colors.ink} />
              <Text style={styles.actionText}>Message</Text>
            </Pressable>
          </View>
        ) : null}

        <SectionTitle>Tapes</SectionTitle>

        {reels === null ? (
          <ActivityIndicator color={colors.ink} style={{ marginTop: SPACING.lg }} />
        ) : !reels.length ? (
          <View style={[styles.card, styles.empty]}>
            <Clapperboard size={24} color={colors.textMuted} strokeWidth={1.5} />
            <Text style={styles.emptyText}>When {first} posts a tape, it shows up here.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {reels.map((reel, index) => (
              <View key={reel._id} style={styles.tile}>
                <ReelGridTile
                  reel={reel}
                  width={tileWidth}
                  aspect={4 / 3}
                  onPress={() => navigation.push('ReelViewer', { reels, startIndex: index })}
                >
                  {placeOf(reel) ? (
                    <View style={styles.placeTag} pointerEvents="none">
                      <MapPin size={11} color="#FFFFFF" />
                      <Text style={styles.placeTagText} numberOfLines={1}>
                        {placeOf(reel)}
                      </Text>
                    </View>
                  ) : null}
                </ReelGridTile>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  const dark = colors.mode === 'dark';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.md,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    // Same card as your own profile's sections.
    card: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: dark ? 0 : 0.05,
      shadowRadius: 16,
      elevation: dark ? 0 : 1,
    },
    actions: { flexDirection: 'row', gap: SPACING.sm + 4, marginTop: SPACING.md },
    action: {
      flex: 1,
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.sm,
    },
    // iOS "tinted" button: a soft wash of colour with coloured text. Quiet in
    // light and dark mode, instead of a solid block.
    followOn: {
      backgroundColor: dark ? 'rgba(143, 176, 207, 0.16)' : 'rgba(74, 107, 138, 0.10)',
      borderColor: dark ? 'rgba(143, 176, 207, 0.28)' : 'rgba(74, 107, 138, 0.18)',
      shadowOpacity: 0,
      elevation: 0,
    },
    actionText: { fontFamily: FONTS.heading, fontSize: 14, color: colors.ink },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
    tile: { overflow: 'hidden' }, // sharp rectangles, no rounded corners
    placeTag: {
      position: 'absolute',
      left: SPACING.sm,
      top: SPACING.sm,
      maxWidth: '75%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
      borderRadius: RADIUS.pill,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    placeTagText: { flexShrink: 1, fontFamily: FONTS.heading, fontSize: 12, color: '#FFFFFF' },
    empty: { alignItems: 'center', gap: SPACING.sm, padding: SPACING.lg },
    emptyText: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
}
