import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Calendar, ChevronDown } from 'lucide-react-native';
import CalendarModal from './CalendarModal';
import { useTheme } from '../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../theme';
import { formatLongDate } from '../utils/dates';

/**
 * A form field that looks like the other inputs but opens a calendar instead
 * of a keyboard. `value` is a Date (or null); `onChange` gets the picked Date.
 * Extra props (minDate, maxDate, markedDate, markedLabel) go to the calendar.
 */
export default function DateField({
  label,
  value,
  onChange,
  placeholder = 'Select a date',
  ...calendarProps
}) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        style={({ pressed }) => [styles.field, pressed && { opacity: 0.85 }]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={
          label ? `${label}: ${value ? formatLongDate(value) : 'not selected'}` : 'Select date'
        }
      >
        <Calendar size={16} color={colors.textMuted} />
        <Text style={[styles.value, !value && { color: colors.textMuted }]}>
          {value ? formatLongDate(value) : placeholder}
        </Text>
        <ChevronDown size={18} color={colors.textMuted} />
      </Pressable>

      <CalendarModal
        visible={open}
        title={label || 'Select a date'}
        value={value}
        onClose={() => setOpen(false)}
        onConfirm={(date) => {
          onChange(date);
          setOpen(false);
        }}
        {...calendarProps}
      />
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { marginBottom: SPACING.md },
    label: {
      fontFamily: FONTS.semibold,
      fontSize: 14,
      marginBottom: SPACING.xs,
      color: colors.text,
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm + 2,
      backgroundColor: colors.surfaceMuted,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
    },
    value: { flex: 1, fontFamily: FONTS.body, fontSize: 14, color: colors.text },
  });
}
