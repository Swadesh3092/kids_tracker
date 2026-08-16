import { db } from './database';
import { DayTotal, Meal } from '../types';

export function getMealsForDate(kidId: number, date: string): Meal[] {
  return db.getAllSync<Meal>('SELECT * FROM meals WHERE kidId = ? AND date = ? ORDER BY time ASC', kidId, date);
}

export function addMeal(kidId: number, date: string, time: string, ml: number, note?: string): Meal {
  const result = db.runSync(
    'INSERT INTO meals (kidId, date, time, ml, note) VALUES (?, ?, ?, ?, ?)',
    kidId,
    date,
    time,
    ml,
    note ?? null
  );
  return { id: result.lastInsertRowId, kidId, date, time, ml, note: note ?? null };
}

export function deleteMeal(id: number) {
  db.runSync('DELETE FROM meals WHERE id = ?', id);
}

/** Maps yyyy-MM-dd -> totals, for every day in the given yyyy-MM month that has meals, for one kid. */
export function getDailyTotalsForMonth(kidId: number, yearMonth: string): Record<string, DayTotal> {
  const rows = db.getAllSync<{ date: string; totalMl: number; count: number }>(
    'SELECT date, SUM(ml) as totalMl, COUNT(*) as count FROM meals WHERE kidId = ? AND date LIKE ? GROUP BY date',
    kidId,
    `${yearMonth}%`
  );
  const map: Record<string, DayTotal> = {};
  for (const row of rows) {
    map[row.date] = { totalMl: row.totalMl, count: row.count };
  }
  return map;
}
