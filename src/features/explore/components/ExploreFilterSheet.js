import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ExploreChip from './ExploreChip';
import ExploreAgencyFilter from './ExploreAgencyFilter';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS, LAYOUT } from '../../../theme';
import { FILTER_OPTIONS } from '../utils/exploreFilters';

const SECTIONS = {
  sort: 'Sort by',
  when: 'Next departure',
  budget: 'Budget per person',
  duration: 'Trip length',
  difficulty: 'Difficulty',
  agency: 'Travel agency',
};

// Which sections each entry point opens: the When/Budget/Agency quick chips
// show just their own section, the Filters chip shows everything.
const SECTIONS_FOR = {
  when: ['when'],
  budget: ['budget'],
  agency: ['agency'],
  all: ['sort', 'when', 'budget', 'agency', 'duration', 'difficulty'],
};

/**
 * Bottom sheet for refining the trip list. Every tap applies instantly (the
 * list behind updates live); the footer button just closes the sheet.
 */
export default function ExploreFilterSheet({
  section,
  filters,
  sortKey,
  whenOptions,
  agencyOptions,
  onChange,
  onToggleAgency,
  onClear,
  onClose,
  resultCount,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const keys = SECTIONS_FOR[section] || SECTIONS_FOR.all;

  return (
    <Modal visible={Boolean(section)} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close filters" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + SPACING.md }]}>
        <View style={styles.handle} />
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {keys.map((key) => {
            if (key === 'agency') {
              return (
                <View key={key} style={styles.section}>
                  <Text style={styles.sectionLabel}>{SECTIONS.agency}</Text>
                  <ExploreAgencyFilter
                    options={agencyOptions}
                    selected={filters.agencies}
                    verifiedOnly={filters.verifiedOnly}
                    onToggleAgency={onToggleAgency}
                    onToggleVerified={() => onChange('verifiedOnly', !filters.verifiedOnly)}
                  />
                </View>
              );
            }
            const current = key === 'sort' ? sortKey : filters[key];
            const options = key === 'when' ? whenOptions : FILTER_OPTIONS[key];
            return (
              <View key={key} style={styles.section}>
                <Text style={styles.sectionLabel}>{SECTIONS[key]}</Text>
                {key === 'when' && options.length <= 1 ? (
                  <Text style={styles.note}>No upcoming departure dates listed yet.</Text>
                ) : null}
                <View style={styles.options}>
                  {options.map((option) => (
                    <ExploreChip
                      key={option.key}
                      label={option.label}
                      active={current === option.key}
                      onPress={() => onChange(key, option.key)}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onClear} activeOpacity={0.6} style={styles.clear}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={styles.apply}>
            <Text style={styles.applyText}>
              {resultCount ? `Show ${resultCount} trip${resultCount === 1 ? '' : 's'}` : 'No trips'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    sheet: {
      maxHeight: '80%',
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
      backgroundColor: colors.surface,
      borderTopLeftRadius: RADIUS.lg,
      borderTopRightRadius: RADIUS.lg,
      paddingHorizontal: SPACING.lg,
    },
    handle: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: RADIUS.pill,
      backgroundColor: colors.divider,
      marginVertical: SPACING.sm + 2,
    },
    body: {
      flexGrow: 0,
    },
    section: {
      marginTop: SPACING.sm,
      marginBottom: SPACING.md,
    },
    sectionLabel: {
      fontFamily: FONTS.bold,
      fontSize: 15,
      color: colors.ink,
      marginBottom: SPACING.sm + 2,
    },
    note: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: SPACING.sm,
    },
    options: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.xs + 2,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      paddingTop: SPACING.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.divider,
    },
    clear: {
      paddingVertical: SPACING.sm + 4,
      paddingHorizontal: SPACING.xs,
    },
    clearText: {
      fontFamily: FONTS.semibold,
      fontSize: 15,
      color: colors.text,
      textDecorationLine: 'underline',
    },
    apply: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: SPACING.sm + 6,
      borderRadius: RADIUS.pill,
      backgroundColor: colors.ink,
    },
    applyText: {
      fontFamily: FONTS.bold,
      fontSize: 15,
      color: colors.inkContrast,
    },
  });
}
