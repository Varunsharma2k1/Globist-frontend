import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { FONTS } from '../../../theme';
import { formatDay } from '../utils/departures';

/**
 * One day in DepartureCalendar. Departure dates are outlined and tappable;
 * within the picked trip (`offset` = days since departure, null outside
 * it) the departure day is filled in ink, the return day in the accent
 * colour, and a band joins them.
 */
export default function CalendarDayCell({
  day,
  iso,
  isAvailable,
  offset,
  tripDays,
  onPress,
  style,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const inTrip = offset != null;
  const isStart = offset === 0;
  const isEnd = inTrip && tripDays > 1 && offset === tripDays - 1;

  return (
    <View style={style}>
      {inTrip && tripDays > 1 ? (
        <View style={[styles.band, isStart && { left: '50%' }, isEnd && { right: '50%' }]} />
      ) : null}
      <TouchableOpacity
        disabled={!isAvailable}
        onPress={onPress}
        style={[
          styles.day,
          isAvailable && styles.dayAvailable,
          isEnd && styles.dayReturn,
          isStart && styles.dayStart,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: !isAvailable, selected: isStart }}
        accessibilityLabel={`${formatDay(iso)}${isAvailable ? ', departure available' : ''}${
          isEnd ? ', return day' : ''
        }`}
      >
        <Text
          style={[
            styles.text,
            inTrip && styles.textInTrip,
            isAvailable && styles.textAvailable,
            isEnd && styles.textReturn,
            isStart && styles.textStart,
          ]}
        >
          {day.getDate()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    band: {
      position: 'absolute',
      top: 3,
      bottom: 3,
      left: 0,
      right: 0,
      backgroundColor: colors.pastel.peach.bg,
    },
    day: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayAvailable: { borderWidth: 1.5, borderColor: colors.ink },
    dayStart: { backgroundColor: colors.ink, borderColor: colors.ink },
    dayReturn: {
      backgroundColor: colors.pastel.peach.fg,
      borderWidth: 1.5,
      borderColor: colors.pastel.peach.fg,
    },
    text: { fontFamily: FONTS.body, fontSize: 13, color: colors.textMuted, opacity: 0.6 },
    textInTrip: { color: colors.pastel.peach.fg, opacity: 1 },
    textAvailable: { fontFamily: FONTS.bold, color: colors.ink, opacity: 1 },
    textStart: { fontFamily: FONTS.bold, color: colors.inkContrast },
    textReturn: { fontFamily: FONTS.bold, color: colors.white },
  });
}
