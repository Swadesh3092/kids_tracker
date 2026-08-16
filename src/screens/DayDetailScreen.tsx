import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddMealSheet } from '../components/AddMealSheet';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MealRow } from '../components/MealRow';
import { StatPill } from '../components/StatPill';
import { useKids } from '../context/KidContext';
import { addMeal, deleteMeal, getMealsForDate } from '../db/meals';
import { colors, spacing } from '../theme';
import { Meal, RootStackParamList } from '../types';
import { formatDayHeader } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'DayDetail'>;

export function DayDetailScreen({ route }: Props) {
  const { date } = route.params;
  const { activeKid } = useKids();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [sheetVisible, setSheetVisible] = useState(false);

  const refresh = useCallback(() => {
    if (activeKid) setMeals(getMealsForDate(activeKid.id, date));
  }, [activeKid, date]);

  useEffect(refresh, [refresh]);

  function handleAddMeal(time: string, ml: number, note?: string) {
    if (!activeKid) return;
    addMeal(activeKid.id, date, time, ml, note);
    setSheetVisible(false);
    refresh();
  }

  function handleDelete(id: number) {
    deleteMeal(id);
    refresh();
  }

  const totalMl = meals.reduce((sum, m) => sum + m.ml, 0);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📅</Text>
        <Text style={styles.headerTitle}>{formatDayHeader(date)}</Text>
      </View>

      <View style={styles.statsRow}>
        <StatPill emoji="🍼" label="Total milk" value={`${totalMl} ml`} tone="primary" />
        <StatPill emoji="🍽️" label="Feeds" value={`${meals.length}`} tone="secondary" />
      </View>

      <Card style={styles.listCard}>
        {meals.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌙</Text>
            <Text style={styles.emptyText}>No feeds logged yet for this day</Text>
          </View>
        ) : (
          <FlatList
            data={meals}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <MealRow meal={item} onDelete={handleDelete} />}
          />
        )}
      </Card>

      <View style={styles.footer}>
        <Button label="+ Add a feed" onPress={() => setSheetVisible(true)} />
      </View>

      <AddMealSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} onSave={handleAddMeal} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerEmoji: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  listCard: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  footer: {
    padding: spacing.lg,
  },
});
