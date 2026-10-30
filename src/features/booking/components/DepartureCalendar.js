import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react-native';
import Card from '../../../components/Card';
import CalendarDayCell from './CalendarDayCell';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';
import { isoDay, toLocalDay, formatDay } from '../utils/departures';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const monthStart = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const monthKey = (date) => date.getFullYear() * 12 + date.getMonth();

/**
 * Month calendar of a trip's fixed departures. Only the agency's start
 * dates (`dates`, 'YYYY-MM-DD') can be picked; every other day is greyed
 * out. The picked trip shows as a range: the departure day filled in ink,
 * the return day filled in the accent colour, and the days between shaded.
 */
export default function DepartureCalendar({ dates, value, onChange, tripDays, intervalDays }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const available = useMemo(() => new Set(dates), [dates]);

  const first = toLocalDay(dates[0]);
  const last = toLocalDay(dates[dates.length - 1]);
  const [month, setMonth] = useState(() => monthStart(toLocalDay(value) || first || new Date()));

  const canPrev = first && monthKey(month) > monthKey(first);
  const canNext = last && monthKey(month) < monthKey(last);
  const shiftMonth = (delta) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

  // Where a day sits in the selected trip: 0 = departure, tripDays - 1 =
  // return, null = outside it.
  const selectedStart = toLocalDay(value);
  const tripOffset = (day) => {
    if (!selectedStart) return null;
    const diff = Math.round((day - selectedStart) / 86400000);
    return diff >= 0 && diff < tripDays ? diff : null;
  };

  const cells = useMemo(() => {
    const lead = month.getDay();
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const list = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= count; d++) list.push(new Date(month.getFullYear(), month.getMonth(), d));
    while (list.length % 7) list.push(null);
    return list;
  }, [month]);

  if (!dates.length) {
    return (
      <Card style={styles.card}>
        <Text style={styles.empty}>No upcoming departures are scheduled for this trip yet.</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => shiftMonth(-1)}
          disabled={!canPrev}
          style={styles.navBtn}
          accessibilityLabel="Previous month"
        >
          <ChevronLeft size={18} color={canPrev ? colors.ink : colors.divider} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity
          onPress={() => shiftMonth(1)}
          disabled={!canNext}
          style={styles.navBtn}
          accessibilityLabel="Next month"
        >
          <ChevronRight size={18} color={canNext ? colors.ink : colors.divider} />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {WEEKDAYS.map((d, i) => (
          <Text key={`w${i}`} style={[styles.cell, styles.weekday]}>
            {d}
          </Text>
        ))}
        {cells.map((day, i) => {
          if (!day) return <View key={`e${i}`} style={styles.cell} />;
          const iso = isoDay(day);
          return (
            <CalendarDayCell
              key={iso}
              day={day}
              iso={iso}
              isAvailable={available.has(iso)}
              offset={tripOffset(day)}
              tripDays={tripDays}
              onPress={() => onChange(iso)}
              style={styles.cell}
            />
          );
        })}
      </View>

      {value ? (
        <View style={styles.legend}>
          <View style={[styles.legendDot, { backgroundColor: colors.ink }]} />
          <Text style={styles.legendText}>Departs</Text>
          <View style={[styles.legendDot, { backgroundColor: colors.pastel.peach.fg }]} />
          <Text style={styles.legendText}>Returns</Text>
          <View style={[styles.legendDot, { backgroundColor: colors.pastel.peach.bg }]} />
          <Text style={styles.legendText}>On trip</Text>
        </View>
      ) : null}

      <View style={styles.footer}>
        <CalendarDays size={14} color={colors.textMuted} />
        <Text style={styles.footerText}>
          Fixed departures every {intervalDays} days · next on{' '}
          {formatDay(dates[0], { year: false })}
        </Text>
      </View>
    </Card>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: { marginBottom: SPACING.md },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.sm,
    },
    navBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
    },
    monthLabel: { fontFamily: FONTS.heading, fontSize: 15, color: colors.ink },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cell: {
      width: `${100 / 7}%`,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    weekday: {
      height: 28,
      fontFamily: FONTS.semibold,
      fontSize: 11,
      color: colors.textMuted,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    legend: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: SPACING.sm,
    },
    legendDot: { width: 10, height: 10, borderRadius: 5, marginLeft: SPACING.xs },
    legendText: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: SPACING.sm,
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    footerText: { flex: 1, fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
    empty: { fontFamily: FONTS.body, fontSize: 14, color: colors.textMuted },
  });
}
