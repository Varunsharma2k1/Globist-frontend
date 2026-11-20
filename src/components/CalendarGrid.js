import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { FONTS, SPACING } from '../theme';
import { formatLongDate, isSameDay } from '../utils/dates';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** The weekday header and the day cells of a month (see monthGrid in utils/dates). */
export default function CalendarGrid({ weeks, selected, today, markedDate, isDisabled, onSelect }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((d, i) => (
          <Text key={i} style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>

      {weeks.map((week, w) => (
        <View key={w} style={styles.weekRow}>
          {week.map((date, d) => {
            if (!date) return <View key={d} style={styles.cell} />;
            const off = isDisabled(date);
            const isSelected = isSameDay(date, selected);
            const isToday = isSameDay(date, today);
            const isMarked = isSameDay(date, markedDate);
            return (
              <Pressable
                key={d}
                style={styles.cell}
                disabled={off}
                onPress={() => onSelect(date)}
                accessibilityRole="button"
                accessibilityLabel={formatLongDate(date)}
                accessibilityState={{ disabled: off, selected: isSelected }}
              >
                <View
                  style={[
                    styles.day,
                    isToday && !isSelected && { borderWidth: 1.5, borderColor: colors.ink },
                    isSelected && { backgroundColor: colors.ink },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: isSelected ? colors.inkContrast : colors.text },
                      off && styles.dayTextOff,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                  {isMarked && !isSelected && <View style={styles.dot} />}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    weekRow: { flexDirection: 'row' },
    weekday: {
      flex: 1,
      textAlign: 'center',
      fontFamily: FONTS.semibold,
      fontSize: 12,
      color: colors.textMuted,
      paddingVertical: SPACING.sm,
    },
    cell: { flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', padding: 2 },
    day: {
      width: '100%',
      height: '100%',
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayText: { fontFamily: FONTS.semibold, fontSize: 15 },
    dayTextOff: { opacity: 0.28 },
    dot: {
      position: 'absolute',
      bottom: 5,
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.success,
    },
  });
}
