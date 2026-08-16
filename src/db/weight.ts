import { db } from './database';
import { WeightEntry } from '../types';

export function getAllWeightEntries(kidId: number): WeightEntry[] {
  return db.getAllSync<WeightEntry>(
    'SELECT * FROM weight_entries WHERE kidId = ? ORDER BY weekStartDate ASC',
    kidId
  );
}

export function getWeightEntryForWeek(kidId: number, weekStartDate: string): WeightEntry | null {
  return (
    db.getFirstSync<WeightEntry>(
      'SELECT * FROM weight_entries WHERE kidId = ? AND weekStartDate = ?',
      kidId,
      weekStartDate
    ) ?? null
  );
}

export function upsertWeightEntry(kidId: number, weekStartDate: string, weightKg: number, note?: string) {
  db.runSync(
    `INSERT INTO weight_entries (kidId, weekStartDate, weightKg, note) VALUES (?, ?, ?, ?)
     ON CONFLICT(kidId, weekStartDate) DO UPDATE SET weightKg = excluded.weightKg, note = excluded.note`,
    kidId,
    weekStartDate,
    weightKg,
    note ?? null
  );
}

export function deleteWeightEntry(id: number) {
  db.runSync('DELETE FROM weight_entries WHERE id = ?', id);
}
