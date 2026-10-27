import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, BedDouble, Utensils, Bus } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/**
 * Day-wise itinerary as an accordion: "Day 1 · Title" rows that expand to
 * the day's description, activities, stay, meals and transfer. Day 1 starts
 * open; "Expand all" opens every day at once.
 */
export default function TripItinerary({ itinerary }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const [open, setOpen] = useState(() => new Set([itinerary?.[0]?.day]));
  if (!itinerary?.length) return null;

  const allOpen = itinerary.every((d) => open.has(d.day));
  const toggle = (day) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={typography.h3}>Itinerary</Text>
        <TouchableOpacity
          onPress={() => setOpen(allOpen ? new Set() : new Set(itinerary.map((d) => d.day)))}
          activeOpacity={0.6}
        >
          <Text style={styles.expandAll}>{allOpen ? 'Collapse all' : 'Expand all'}</Text>
        </TouchableOpacity>
      </View>

      {itinerary.map((item, i) => {
        const isOpen = open.has(item.day);
        const details = [
          { icon: BedDouble, label: 'Stay', value: item.stay },
          { icon: Utensils, label: 'Meals', value: item.meals?.join(' · ') },
          { icon: Bus, label: 'Transfer', value: item.transfer },
        ].filter((d) => d.value);
        const isLast = i === itinerary.length - 1;

        return (
          <View key={item.day} style={styles.day}>
            <View style={styles.rail}>
              <View style={[styles.dot, isOpen && styles.dotOpen]} />
              {isLast ? null : <View style={styles.line} />}
            </View>
            <View style={styles.dayBody}>
              <TouchableOpacity
                style={styles.dayHeader}
                onPress={() => toggle(item.day)}
                activeOpacity={0.6}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
              >
                <View style={styles.dayTitleWrap}>
                  <Text style={styles.dayLabel}>DAY {item.day}</Text>
                  <Text style={styles.dayTitle}>{item.title}</Text>
                </View>
                <ChevronDown
                  size={18}
                  color={colors.textMuted}
                  style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                />
              </TouchableOpacity>

              {isOpen ? (
                <View style={styles.dayContent}>
                  {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
                  {item.activities?.length ? (
                    <View style={styles.activities}>
                      {item.activities.map((a) => (
                        <Text key={a} style={styles.activity}>
                          {a}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                  {details.map(({ icon: Icon, label, value }) => (
                    <View key={label} style={styles.detailRow}>
                      <Icon size={14} strokeWidth={1.75} color={colors.textMuted} />
                      <Text style={styles.detailLabel}>{label}</Text>
                      <Text style={styles.detailValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    section: { marginBottom: SPACING.lg },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    expandAll: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.ink,
      textDecorationLine: 'underline',
    },
    day: { flexDirection: 'row' },
    rail: { width: 20, alignItems: 'center' },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      borderWidth: 1.5,
      borderColor: colors.textMuted,
      backgroundColor: colors.background,
      marginTop: 5,
    },
    dotOpen: { backgroundColor: colors.ink, borderColor: colors.ink },
    line: { flex: 1, width: 1.5, backgroundColor: colors.divider, marginVertical: 2 },
    dayBody: { flex: 1, paddingLeft: SPACING.sm, paddingBottom: SPACING.md },
    dayHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
    dayTitleWrap: { flex: 1 },
    dayLabel: {
      fontFamily: FONTS.semibold,
      fontSize: 11,
      letterSpacing: 1.2,
      color: colors.textMuted,
    },
    dayTitle: { fontFamily: FONTS.bold, fontSize: 15, color: colors.ink, marginTop: 2 },
    dayContent: { marginTop: SPACING.sm, gap: SPACING.sm },
    desc: { fontFamily: FONTS.body, fontSize: 14, lineHeight: 21, color: colors.text },
    activities: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    activity: {
      fontFamily: FONTS.semibold,
      fontSize: 12,
      color: colors.text,
      paddingHorizontal: SPACING.sm + 2,
      paddingVertical: 4,
      borderRadius: RADIUS.pill,
      backgroundColor: colors.surfaceMuted,
      overflow: 'hidden',
    },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailLabel: { fontFamily: FONTS.body, fontSize: 13, color: colors.textMuted, width: 62 },
    detailValue: { flex: 1, fontFamily: FONTS.semibold, fontSize: 13, color: colors.ink },
  });
}
