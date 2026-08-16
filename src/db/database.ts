import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('babytracker.db');

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS kid (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      birthDate TEXT NOT NULL,
      avatarEmoji TEXT NOT NULL DEFAULT '👶'
    );

    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kidId INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      ml INTEGER NOT NULL,
      note TEXT
    );

    CREATE TABLE IF NOT EXISTS weight_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kidId INTEGER NOT NULL,
      weekStartDate TEXT NOT NULL,
      weightKg REAL NOT NULL,
      note TEXT,
      UNIQUE(kidId, weekStartDate)
    );

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  migrateToPerKidTables();

  db.execSync('CREATE INDEX IF NOT EXISTS idx_meals_kid_date ON meals(kidId, date);');
}

/** Adds kidId to meals/weight_entries for installs created before multi-kid support existed. */
function migrateToPerKidTables() {
  const mealsHasKidId = tableHasColumn('meals', 'kidId');
  const weightHasKidId = tableHasColumn('weight_entries', 'kidId');
  if (mealsHasKidId && weightHasKidId) return;

  const firstKid = db.getFirstSync<{ id: number }>('SELECT id FROM kid ORDER BY id ASC LIMIT 1');
  const fallbackKidId = firstKid?.id ?? null;

  if (!mealsHasKidId) {
    db.execSync(`
      ALTER TABLE meals RENAME TO meals_old;
      CREATE TABLE meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kidId INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        ml INTEGER NOT NULL,
        note TEXT
      );
    `);
    if (fallbackKidId !== null) {
      db.runSync(
        `INSERT INTO meals (id, kidId, date, time, ml, note)
         SELECT id, ?, date, time, ml, note FROM meals_old`,
        fallbackKidId
      );
    }
    db.execSync('DROP TABLE meals_old;');
  }

  if (!weightHasKidId) {
    db.execSync(`
      ALTER TABLE weight_entries RENAME TO weight_entries_old;
      CREATE TABLE weight_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kidId INTEGER NOT NULL,
        weekStartDate TEXT NOT NULL,
        weightKg REAL NOT NULL,
        note TEXT,
        UNIQUE(kidId, weekStartDate)
      );
    `);
    if (fallbackKidId !== null) {
      db.runSync(
        `INSERT INTO weight_entries (id, kidId, weekStartDate, weightKg, note)
         SELECT id, ?, weekStartDate, weightKg, note FROM weight_entries_old`,
        fallbackKidId
      );
    }
    db.execSync('DROP TABLE weight_entries_old;');
  }
}

function tableHasColumn(table: string, column: string): boolean {
  const columns = db.getAllSync<{ name: string }>(`PRAGMA table_info(${table})`);
  return columns.some((c) => c.name === column);
}
