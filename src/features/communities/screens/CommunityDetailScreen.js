import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import PostCard from '../components/PostCard';
import CommunityHeader from '../components/CommunityHeader';
import PostComposerModal from '../components/PostComposerModal';
import { useCommunities, useCommunityData } from '../../../hooks/useCommunities';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { getCommunity } from '../../../data/communities';
import { SPACING, RADIUS, FONTS, LAYOUT } from '../../../theme';

/** A community's page, Reddit-style: banner, join, sort tabs and the post feed. */
export default function CommunityDetailScreen({ navigation, route }) {
  const community = getCommunity(route.params?.communityId);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { toggleJoin, addPost } = useCommunities();
  const { isJoined, memberCount, getPostsFor } = useCommunityData();
  const [sort, setSort] = useState('hot');
  const [composing, setComposing] = useState(false);
  const styles = getStyles(colors);

  if (!community) return <View style={styles.container} />;

  const joined = isJoined(community.id);
  const posts = getPostsFor(community.id, sort);

  const startPost = () => {
    if (joined) return setComposing(true);
    Alert.alert(`Join c/${community.handle}?`, 'Join this community to share your own posts.', [
      { text: 'Not now', style: 'cancel' },
      {
        text: 'Join & post',
        onPress: () => {
          toggleJoin(community.id);
          setComposing(true);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <CommunityHeader
            community={community}
            joined={joined}
            members={memberCount(community)}
            sort={sort}
            onSort={setSort}
            onBack={() => navigation.goBack()}
            onToggleJoin={() => toggleJoin(community.id)}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: SPACING.md + 2 }} />}
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.postWrap}>
            <PostCard
              post={item}
              community={community}
              onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No posts yet. Be the first to share something.</Text>
        }
      />

      <Pressable
        style={[styles.fab, { bottom: SPACING.lg + insets.bottom }]}
        onPress={startPost}
        accessibilityRole="button"
        accessibilityLabel="Create post"
      >
        <Plus size={20} color={colors.inkContrast} strokeWidth={2.6} />
        <Text style={styles.fabText}>New post</Text>
      </Pressable>

      <PostComposerModal
        visible={composing}
        community={community}
        onClose={() => setComposing(false)}
        onSubmit={(draft) => {
          addPost(community.id, draft, user);
          // A brand-new post would sink under the popular ones in Hot; show it first.
          setSort('new');
        }}
      />
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    postWrap: {
      paddingHorizontal: SPACING.md + 4,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    empty: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      padding: SPACING.xl,
    },
    fab: {
      position: 'absolute',
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.ink,
      paddingHorizontal: SPACING.lg,
      paddingVertical: 13,
      borderRadius: RADIUS.pill,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    fabText: { fontFamily: FONTS.heading, fontSize: 15, color: colors.inkContrast },
  });
}
