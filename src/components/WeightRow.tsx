import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { WeightEntry } from '../types';
import { colors, radius, spacing } from '../theme';
import { formatWeekRange } from '../utils/date';

interface Props {
  entry: WeightEntry;
  previousWeightKg?: number;
  onPress: (entry: WeightEntry) => void;
}

export function WeightRow({ entry, previousWeightKg, onPress }: Props) {
  const delta = previousWeightKg !== undefined ? entry.weightKg - previousWeightKg : undefined;

  return (
    <Pressable style={styles.row} onPress={() => onPress(entry)}>
      <View>
        <Text style={styles.week}>Week of {formatWeekRange(entry.weekStartDate)}</Text>
        {entry.note ? <Text style={styles.note}>{entry.note}</Text> : null}
      </View>
      <View style={styles.right}>
        <Text style={styles.weight}>{entry.weightKg} kg</Text>
        {delta !== undefined && (
          <Text style={[styles.delta, delta >= 0 ? styles.deltaUp : styles.deltaDown]}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(2)} kg
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  week: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  note: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  weight: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  delta: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    borderRadius: radius.pill,
  },
  deltaUp: {
    color: colors.success,
  },
  deltaDown: {
    color: colors.danger,
  },
});
