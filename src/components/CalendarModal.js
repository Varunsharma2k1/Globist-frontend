import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Button from './Button';
import CalendarGrid from './CalendarGrid';
import { useTheme } from '../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../theme';
import {
  addMonths,
  formatLongDate,
  formatMonthYear,
  monthGrid,
  startOfToday,
} from '../utils/dates';

/**
 * Month-grid date picker in a bottom sheet. Days before `minDate` or after
 * `maxDate` are greyed out and can't be picked; `markedDate` (e.g. a trip's
 * next departure) gets a dot. The choice only applies on Confirm.
 */
export default function CalendarModal({
  visible,
  title = 'Select a date',
  value,
  minDate,
  maxDate,
  markedDate,
  markedLabel,
  onConfirm,
  onClose,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const today = useMemo(startOfToday, []);
  const [selected, setSelected] = useState(value);
  const [month, setMonth] = useState(addMonths(value || minDate || today, 0));

  // Start from the current value every time the sheet opens.
  useEffect(() => {
    if (visible) {
      setSelected(value);
      setMonth(addMonths(value || minDate || today, 0));
    }
  }, [visible, value, minDate, today]);

  const weeks = useMemo(() => monthGrid(month), [month]);
  const canGoBack = !minDate || addMonths(month, 0) > addMonths(minDate, 0);
  const canGoForward = !maxDate || addMonths(month, 1) <= maxDate;
  const disabled = (date) => (minDate && date < minDate) || (maxDate && date > maxDate);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close calendar" />
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.monthRow}>
            <Pressable
              onPress={() => setMonth(addMonths(month, -1))}
              disabled={!canGoBack}
              hitSlop={10}
              style={[styles.arrow, !canGoBack && styles.arrowOff]}
              accessibilityLabel="Previous month"
            >
              <ChevronLeft size={20} color={colors.ink} />
            </Pressable>
            <Text style={styles.monthText}>{formatMonthYear(month)}</Text>
            <Pressable
              onPress={() => setMonth(addMonths(month, 1))}
              disabled={!canGoForward}
              hitSlop={10}
              style={[styles.arrow, !canGoForward && styles.arrowOff]}
              accessibilityLabel="Next month"
            >
              <ChevronRight size={20} color={colors.ink} />
            </Pressable>
          </View>

          <CalendarGrid
            weeks={weeks}
            selected={selected}
            today={today}
            markedDate={markedDate}
            isDisabled={disabled}
            onSelect={setSelected}
          />

          {markedDate ? (
            <View style={styles.legend}>
              <View style={styles.dot2} />
              <Text style={styles.legendText}>{markedLabel || 'Marked date'}</Text>
            </View>
          ) : null}

          <View style={styles.footer}>
            <Text style={styles.picked}>
              {selected ? formatLongDate(selected) : 'No date selected'}
            </Text>
          </View>
          <View style={styles.actions}>
            <Button title="Cancel" variant="outline" onPress={onClose} style={{ flex: 1 }} />
            <Button
              title="Confirm"
              onPress={() => selected && onConfirm(selected)}
              style={[{ flex: 1 }, !selected && { opacity: 0.4 }]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    root: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: RADIUS.lg,
      borderTopRightRadius: RADIUS.lg,
      padding: SPACING.lg,
      paddingBottom: SPACING.xl,
      width: '100%',
      maxWidth: 520,
      alignSelf: 'center',
    },
    title: { fontFamily: FONTS.heading, fontSize: 20, color: colors.ink, marginBottom: SPACING.md },
    monthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.sm,
    },
    monthText: { fontFamily: FONTS.bold, fontSize: 16, color: colors.ink },
    arrow: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    arrowOff: { opacity: 0.3 },
    legend: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.sm },
    dot2: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
    legendText: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
    footer: {
      marginTop: SPACING.md,
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    picked: { fontFamily: FONTS.bold, fontSize: 15, color: colors.ink, textAlign: 'center' },
    actions: { flexDirection: 'row', gap: SPACING.sm + 2, marginTop: SPACING.md },
  });
}
