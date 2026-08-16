import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddWeightSheet } from '../components/AddWeightSheet';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { WeightRow } from '../components/WeightRow';
import { useKids } from '../context/KidContext';
import { getAllWeightEntries, getWeightEntryForWeek, upsertWeightEntry } from '../db/weight';
import { colors, spacing } from '../theme';
import { WeightEntry } from '../types';
import { todayISO, weekStartISO } from '../utils/date';

export function WeightScreen() {
  const { activeKid } = useKids();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const currentWeekStart = weekStartISO(todayISO());

  const load = useCallback(() => {
    if (activeKid) setEntries(getAllWeightEntries(activeKid.id).reverse());
  }, [activeKid]);

  useFocusEffect(load);

  const currentWeekEntry = activeKid ? getWeightEntryForWeek(activeKid.id, currentWeekStart) : null;

  function handleSave(weightKg: number, note?: string) {
    if (!activeKid) return;
    upsertWeightEntry(activeKid.id, currentWeekStart, weightKg, note);
    setSheetVisible(false);
    load();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>⚖️</Text>
        <Text style={styles.headerTitle}>Weekly weight</Text>
      </View>

      <Card style={styles.listCard}>
        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyText}>No weight entries yet</Text>
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item, index }) => (
              <WeightRow
                entry={item}
                previousWeightKg={entries[index + 1]?.weightKg}
                onPress={() => setSheetVisible(true)}
              />
            )}
          />
        )}
      </Card>

      <View style={styles.footer}>
        <Button
          label={currentWeekEntry ? 'Update this week’s weight' : "+ Log this week's weight"}
          onPress={() => setSheetVisible(true)}
          variant="primary"
        />
      </View>

      <AddWeightSheet
        visible={sheetVisible}
        weekStartDate={currentWeekStart}
        initialWeightKg={currentWeekEntry?.weightKg}
        onClose={() => setSheetVisible(false)}
        onSave={handleSave}
      />
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
  listCard: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
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
