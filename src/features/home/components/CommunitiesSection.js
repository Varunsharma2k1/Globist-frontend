import React from 'react';
import { Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import SectionHeader from './SectionHeader';
import CommunityMiniCard, { MINI_CARD_WIDTH } from '../../communities/components/CommunityMiniCard';
import { COMMUNITIES } from '../../../data/communities';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

/** "Travel Communities" row on Home: swipe through clubs and join with one tap. */
export default function CommunitiesSection({ navigation }) {
  const { colors } = useTheme();

  return (
    <>
      <SectionHeader title="Travel Communities">
        <TouchableOpacity onPress={() => navigation.navigate('Communities')}>
          <Text style={[styles.seeAll, { color: colors.ink }]}>See All</Text>
        </TouchableOpacity>
      </SectionHeader>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={MINI_CARD_WIDTH + SPACING.md}
        style={styles.row}
        contentContainerStyle={styles.rowContent}
      >
        {COMMUNITIES.map((community) => (
          <CommunityMiniCard
            key={community.id}
            community={community}
            onPress={() => navigation.navigate('CommunityDetail', { communityId: community.id })}
          />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  seeAll: { fontFamily: FONTS.heading, fontSize: 13 },
  // Bleeds to the screen edges while the first card lines up with the section title.
  row: { marginHorizontal: -SPACING.lg },
  rowContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
});
