import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Film } from 'lucide-react-native';
import Header from '../../../components/Header';
import ReelGridTile from '../components/ReelGridTile';
import { useMyReels } from '../hooks/useMyReels';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS, LAYOUT } from '../../../theme';

const COLUMNS = 3;
const GAP = 2;

/** Instagram-style 3-column grid of reels (own posts, or reels tagging the agency); tapping one plays it. */
export default function MyReelsScreen({ navigation, route }) {
  // 'tagged' = reels that tag this agency; otherwise the user's own posts.
  const tagged = route.params?.kind === 'tagged';
  const noun = tagged ? 'reel' : 'post';
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const { reels, loading, error } = useMyReels();

  const gridWidth = Math.min(windowWidth, LAYOUT.contentMaxWidth);
  const tileWidth = (gridWidth - GAP * (COLUMNS - 1)) / COLUMNS;

  return (
    <View style={styles.container}>
      <Header title={tagged ? 'Tagged Reels' : 'My Posts'} onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator color={colors.ink} style={{ flex: 1 }} />
      ) : reels.length === 0 ? (
        <View style={styles.empty}>
          <Film size={36} color={colors.textMuted} strokeWidth={1.5} />
          <Text style={[typography.h3, { marginTop: SPACING.md }]}>
            {error ? `Could not load ${noun}s` : `No ${noun}s yet`}
          </Text>
          <Text style={[typography.body, styles.emptyBody]}>
            {error
              ? 'Check your connection and try again.'
              : tagged
                ? 'Reels that tag your agency will show up here.'
                : 'Posts you share will show up here.'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.lg + insets.bottom }}>
          <Text style={styles.count}>
            {reels.length} {reels.length === 1 ? noun : `${noun}s`}
          </Text>
          <View style={[styles.grid, { width: gridWidth }]}>
            {reels.map((reel, index) => (
              <ReelGridTile
                key={reel._id}
                reel={reel}
                width={tileWidth}
                onPress={() => navigation.navigate('ReelViewer', { reels, startIndex: index })}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    count: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.textMuted,
      padding: SPACING.md,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, alignSelf: 'center' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
    emptyBody: { textAlign: 'center', marginTop: SPACING.xs },
  });
}
