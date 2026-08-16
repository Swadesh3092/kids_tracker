import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Meal } from '../types';
import { colors, radius, spacing } from '../theme';

interface Props {
  meal: Meal;
  onDelete: (id: number) => void;
}

export function MealRow({ meal, onDelete }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.timeBubble}>
        <Text style={styles.timeText}>{meal.time}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.mlText}>🍼 {meal.ml} ml</Text>
        {meal.note ? <Text style={styles.noteText}>{meal.note}</Text> : null}
      </View>
      <Pressable onPress={() => onDelete(meal.id)} hitSlop={10} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  timeBubble: {
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  info: {
    flex: 1,
  },
  mlText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  noteText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  deleteText: {
    color: colors.danger,
    fontWeight: '700',
  },
});
