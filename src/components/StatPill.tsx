import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

interface Props {
  emoji: string;
  label: string;
  value: string;
  tone?: 'primary' | 'secondary' | 'accent';
}

export function StatPill({ emoji, label, value, tone = 'primary' }: Props) {
  const bg =
    tone === 'primary' ? colors.primarySoft : tone === 'secondary' ? colors.secondarySoft : colors.accentSoft;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    flex: 1,
  },
  emoji: {
    fontSize: 22,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
