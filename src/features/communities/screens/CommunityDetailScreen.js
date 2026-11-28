import React, { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, Pressable, Alert, LayoutAnimation, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import PostCard from '../components/PostCard';
import CommunityHeader from '../components/CommunityHeader';
import PostComposerModal from '../components/PostComposerModal';
import { useCommunities, useCommunityActions, useCommunityData } from '../../../hooks/useCommunities';
import { useTheme } from '../../../hooks/useTheme';
import { getCommunity } from '../../../data/communities';
import { SPACING, RADIUS, FONTS, LAYOUT } from '../../../theme';

/** A community's page, Reddit-style: banner, join, sort tabs and the post feed. */
export default function CommunityDetailScreen({ navigation, route }) {
  const community = getCommunity(route.params?.communityId);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { toggleJoin, addPost } = useCommunityActions();
  const { isJoined, memberCount, onlineCount, getPostsFor } = useCommunityData();
  const { loadPosts } = useCommunities();
  const communityId = community?.id;
  // Fresh posts from everyone while this page is open (every 15 s).
  useFocusEffect(
    useCallback(() => {
      if (!communityId) return undefined;
      loadPosts(communityId);
      const t = setInterval(() => loadPosts(communityId), 15000);
      return () => clearInterval(t);
    }, [communityId, loadPosts])
  );
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts(communityId);
    setRefreshing(false);
  };
  const [sort, setSortState] = useState('hot');
  const listRef = useRef(null);
  // Animate the reorder so switching Hot / New / Top is visible.
  const setSort = (next) => {
    if (next === sort) return;
    // Same soft reflow as Explore's filters: posts glide, nothing flashes.
    LayoutAnimation.configureNext(LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'));
    setSortState(next);
  };
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
        onPress: async () => {
          await toggleJoin(community.id);
          setComposing(true);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={posts}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <CommunityHeader
            community={community}
            joined={joined}
            members={memberCount(community)}
            online={onlineCount(community)}
            sort={sort}
            onSort={setSort}
            onBack={() => navigation.goBack()}
            onToggleJoin={() => toggleJoin(community.id)}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
        onSubmit={async (draft) => {
          const post = await addPost(community.id, draft);
          // A brand-new post would sink under the popular ones in Hot; show it first.
          if (post) setSort('new');
        }}
      />
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    postWrap: {
      paddingHorizontal: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.divider,
      marginHorizontal: SPACING.lg,
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
      paddingVertical: 14,
      borderRadius: RADIUS.pill,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 4,
    },
    fabText: { fontFamily: FONTS.heading, fontSize: 14, color: colors.inkContrast },
  });
}
