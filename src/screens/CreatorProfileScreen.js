import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BadgeCheck } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Tag from '../components/Tag';
import Button from '../components/Button';
import { SPACING, FONTS, LAYOUT } from '../theme';
import { useTheme } from '../hooks/useTheme';

/**
 * CreatorProfileScreen Component
 *
 * Read-only view of a reel creator's public profile. Populated entirely from
 * the reel's embedded `user` data (no dedicated "get creator by id" backend
 * endpoint exists yet) — passed in via route params from ReelItem.
 */
export default function CreatorProfileScreen({ route, navigation }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const { creator } = route.params || {};
  const [following, setFollowing] = useState(false);

  const initial = (creator?.name || creator?.creatorHandle || 'E').replace('@', '').charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <Header title={creator?.creatorHandle || 'Creator'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <View style={styles.nameRow}>
            <Text style={typography.h2}>{creator?.name || creator?.creatorHandle || 'Explorer'}</Text>
            <BadgeCheck size={18} color={colors.success} />
          </View>
          <Text style={styles.handleText}>{creator?.creatorHandle || '@explorer'}</Text>
          <View style={{ marginTop: SPACING.xs }}>
            <Tag
              label={`${(creator?.creatorTier || creator?.explorerTier || 'Gold').toUpperCase()} CREATOR`}
              variant="primary"
            />
          </View>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{creator?.stats?.trips ?? 12}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{creator?.stats?.followers ?? 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{creator?.stats?.reviews ?? 0}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </Card>

        <Button
          title={following ? 'Following' : 'Follow'}
          variant={following ? 'outline' : 'primary'}
          onPress={() => setFollowing((v) => !v)}
        />
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: SPACING.lg,
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.pastel.peach.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarInitial: {
    fontFamily: FONTS.heading,
    fontSize: 34,
    color: colors.pastel.peach.fg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  handleText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  statsCard: {
    marginVertical: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  });
}
