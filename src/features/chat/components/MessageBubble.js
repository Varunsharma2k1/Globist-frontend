import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { clockTime, dayLabel } from '../utils/format';

/** A message bubble plus its day divider and status line ("Sending…", "Seen"). */
export default function MessageBubble({ message, older, mine, seen, onRetry, styles }) {
  const showDay = !older || dayLabel(older.createdAt) !== dayLabel(message.createdAt);
  const failed = message.status === 'failed';
  let meta = `${clockTime(message.createdAt)}${seen ? ' · Seen' : ''}`;
  if (message.status === 'sending') meta = 'Sending…';
  if (failed) meta = 'Not sent · tap to retry';

  return (
    <View>
      {showDay && <Text style={styles.day}>{dayLabel(message.createdAt)}</Text>}
      <View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs]}>
        <TouchableOpacity
          activeOpacity={failed ? 0.6 : 1}
          disabled={!failed}
          onPress={() => onRetry(message)}
          style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}
        >
          <Text style={[styles.msgText, mine && styles.msgTextMine]}>{message.text}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.meta, mine ? styles.metaMine : null]}>{meta}</Text>
    </View>
  );
}
