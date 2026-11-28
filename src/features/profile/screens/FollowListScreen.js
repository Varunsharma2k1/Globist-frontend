import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Header from '../../../components/Header';
import { getFollowList } from '../../../api/follows';
import { useTheme } from '../../../hooks/useTheme';
import { absoluteMediaUrl } from '../../../utils/mediaUrl';
import { SPACING, FONTS, LAYOUT } from '../../../theme';

/** Followers or Following of a user. Route params: { userId, kind }. */
export default function FollowListScreen({ navigation, route }) {
  const { userId, kind } = route.params;
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [people, setPeople] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    getFollowList(userId, kind)
      .then((list) => alive && setPeople(list))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [userId, kind]);

  const empty = kind === 'followers' ? 'No followers yet.' : 'Not following anyone yet.';

  return (
    <View style={styles.container}>
      <Header
        title={kind === 'followers' ? 'Followers' : 'Following'}
        onBack={() => navigation.goBack()}
      />
      {!people && !failed ? (
        <ActivityIndicator color={colors.ink} style={{ marginTop: SPACING.xl }} />
      ) : (
        <FlatList
          data={people || []}
          keyExtractor={(p) => p._id}
          contentContainerStyle={styles.content}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {failed ? 'Could not load. Check your connection.' : empty}
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => navigation.push('CreatorProfile', { creator: item })}
              accessibilityRole="button"
            >
              <View style={styles.avatar}>
                {item.avatar ? (
                  <Image
                    source={{ uri: absoluteMediaUrl(item.avatar) }}
                    style={StyleSheet.absoluteFill}
                  />
                ) : (
                  <Text style={styles.initial}>{(item.name || '?').charAt(0).toUpperCase()}</Text>
                )}
              </View>
              <Text style={styles.name}>{item.name}</Text>
            </Pressable>
          )}
        />
      )}
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
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      paddingVertical: SPACING.sm,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    initial: { fontFamily: FONTS.heading, fontSize: 18, color: colors.ink },
    name: { fontFamily: FONTS.heading, fontSize: 14, color: colors.ink },
    empty: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: SPACING.xl,
    },
  });
}
