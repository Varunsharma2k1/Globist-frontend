import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MapPin, Building2, Backpack, History, TrendingUp } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS, LAYOUT } from '../../../theme';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

const destinationSubtitle = (d) =>
  [d.parentName, d.count ? plural(d.count, 'trip') : 'No trips yet'].filter(Boolean).join(' · ');

/**
 * Shown in place of the trip list while the search field is focused.
 * Empty query → Recent + Popular destinations (zero typing).
 * Typed query → grouped Destinations / Agencies / Packages.
 */
export default function ExploreSuggestions({
  query,
  suggestions,
  recentDestinations,
  popularDestinations,
  onSelectDestination,
  onSelectAgency,
  onSelectTrip,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const Row = ({ icon: Icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.6}>
      <View style={styles.rowIcon}>
        <Icon size={16} strokeWidth={1.75} color={colors.textMuted} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const Group = ({ label, children }) => (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      {children}
    </View>
  );

  const destinationRows = (list, icon) =>
    list.map((d) => (
      <Row
        key={d.key}
        icon={icon}
        title={d.name}
        subtitle={destinationSubtitle(d)}
        onPress={() => onSelectDestination(d)}
      />
    ));

  let content;
  if (!suggestions) {
    content = (
      <>
        {recentDestinations.length ? (
          <Group label="RECENT">{destinationRows(recentDestinations, History)}</Group>
        ) : null}
        <Group label="POPULAR DESTINATIONS">
          {destinationRows(popularDestinations, TrendingUp)}
        </Group>
      </>
    );
  } else {
    const { destinations, agencies, packages } = suggestions;
    const empty = !destinations.length && !agencies.length && !packages.length;
    content = empty ? (
      <Text style={styles.empty}>
        No places or agencies match “{query}”. Press search to look through every trip.
      </Text>
    ) : (
      <>
        {destinations.length ? (
          <Group label="DESTINATIONS">{destinationRows(destinations, MapPin)}</Group>
        ) : null}
        {agencies.length ? (
          <Group label="AGENCIES">
            {agencies.map(({ agency, count }) => (
              <Row
                key={agency._id || agency.name}
                icon={Building2}
                title={agency.name}
                subtitle={[agency.location, plural(count, 'trip')].filter(Boolean).join(' · ')}
                onPress={() => onSelectAgency(agency)}
              />
            ))}
          </Group>
        ) : null}
        {packages.length ? (
          <Group label="PACKAGES">
            {packages.map((trip) => (
              <Row
                key={trip._id || trip.title}
                icon={Backpack}
                title={trip.title}
                subtitle={[
                  trip.duration,
                  Number.isFinite(trip.price) ? `₹${trip.price.toLocaleString()}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
                onPress={() => onSelectTrip(trip)}
              />
            ))}
          </Group>
        ) : null}
      </>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {content}
    </ScrollView>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.xl,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    group: {
      marginBottom: SPACING.lg,
    },
    groupLabel: {
      fontFamily: FONTS.semibold,
      fontSize: 11,
      letterSpacing: 1.4,
      color: colors.textMuted,
      marginBottom: SPACING.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm + 4,
      paddingVertical: SPACING.sm + 2,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: RADIUS.sm,
      backgroundColor: colors.surfaceMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowText: {
      flex: 1,
    },
    rowTitle: {
      fontFamily: FONTS.semibold,
      fontSize: 15,
      color: colors.ink,
    },
    rowSubtitle: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    empty: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textMuted,
      paddingVertical: SPACING.lg,
    },
  });
}
