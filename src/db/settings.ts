import { db } from './database';

export function getActiveKidId(): number | null {
  const row = db.getFirstSync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', 'activeKidId');
  return row ? Number(row.value) : null;
}

export function setActiveKidId(id: number): void {
  db.runSync(
    `INSERT INTO app_meta (key, value) VALUES ('activeKidId', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    String(id)
  );
}
