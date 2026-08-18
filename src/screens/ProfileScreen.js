import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { User, Video, Briefcase, ChevronRight } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Tag from '../components/Tag';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { COLORS, SPACING, TYPOGRAPHY, FONTS, LAYOUT } from '../theme';

/**
 * ProfileScreen Component
 *
 * Account overview screen displaying user stats (Reels posted, trips booked, explorer tier)
 * and providing authentication management (Sign in / Sign out).
 */
export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Profile" />
        <View style={styles.guestContainer}>
          <View style={styles.guestIconTile}>
            <User size={32} color={COLORS.textMuted} strokeWidth={1.5} />
          </View>
          <Text style={TYPOGRAPHY.h3}>Sign in to view Profile</Text>
          <Text style={[TYPOGRAPHY.body, { textAlign: 'center', marginVertical: SPACING.md }]}>
            Access your explorer rewards tier, saved trips, and posted reels.
          </Text>
          <Button
            title="Sign In / Register"
            onPress={() => navigation.navigate('Auth')}
            style={{ width: '100%' }}
          />
        </View>
      </View>
    );
  }

  const initial = (user.name || 'E').charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <Header title="Profile & Explorer Rewards" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <Text style={TYPOGRAPHY.h2}>{user.name || 'Explorer User'}</Text>
          <Text style={styles.phoneText}>{user.phone || '+91 98765 43210'}</Text>
          <View style={{ marginTop: SPACING.xs }}>
            <Tag
              label={`${(user.explorerTier || 'Gold').toUpperCase()} EXPLORER`}
              variant="primary"
            />
          </View>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{user.stats?.reelsPosted || 3}</Text>
              <Text style={styles.statLabel}>Reels Posted</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{user.stats?.tripsBooked || 2}</Text>
              <Text style={styles.statLabel}>Trips Booked</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>₹{(user.stats?.earnings || 1450).toLocaleString()}</Text>
              <Text style={styles.statLabel}>Affiliate Earned</Text>
            </View>
          </View>
        </Card>

        <Text style={TYPOGRAPHY.h3}>Account Actions</Text>
        <Card style={styles.menuRow} onPress={() => navigation.navigate('PostReel')}>
          <View style={styles.menuLeft}>
            <Video size={18} color={COLORS.ink} strokeWidth={1.75} />
            <Text style={styles.actionText}>Post a New Travel Reel</Text>
          </View>
          <ChevronRight size={18} color={COLORS.textMuted} />
        </Card>

        <Card style={styles.menuRow} onPress={() => navigation.navigate('MyTrips')}>
          <View style={styles.menuLeft}>
            <Briefcase size={18} color={COLORS.ink} strokeWidth={1.75} />
            <Text style={styles.actionText}>View Booked Trips & Itineraries</Text>
          </View>
          <ChevronRight size={18} color={COLORS.textMuted} />
        </Card>

        <Button
          title="Sign Out"
          variant="outline"
          onPress={logout}
          style={{ marginTop: SPACING.lg }}
        />
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
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  guestIconTile: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.pastel.peach.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarInitial: {
    fontFamily: FONTS.heading,
    fontSize: 32,
    color: COLORS.pastel.peach.fg,
  },
  phoneText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statsCard: {
    marginBottom: SPACING.lg,
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
    color: COLORS.ink,
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.ink,
  },
});
