import { db } from './database';
import { Kid } from '../types';

export const MAX_KIDS = 4;

export function getAllKids(): Kid[] {
  return db.getAllSync<Kid>('SELECT * FROM kid ORDER BY id ASC');
}

export function getKidById(id: number): Kid | null {
  return db.getFirstSync<Kid>('SELECT * FROM kid WHERE id = ?', id) ?? null;
}

export function addKid(name: string, birthDate: string, avatarEmoji: string): Kid {
  const count = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM kid');
  if ((count?.count ?? 0) >= MAX_KIDS) {
    throw new Error(`You can only add up to ${MAX_KIDS} kids.`);
  }
  const result = db.runSync(
    'INSERT INTO kid (name, birthDate, avatarEmoji) VALUES (?, ?, ?)',
    name,
    birthDate,
    avatarEmoji
  );
  return { id: result.lastInsertRowId, name, birthDate, avatarEmoji };
}

export function updateKid(id: number, name: string, birthDate: string, avatarEmoji: string): Kid {
  db.runSync('UPDATE kid SET name = ?, birthDate = ?, avatarEmoji = ? WHERE id = ?', name, birthDate, avatarEmoji, id);
  return { id, name, birthDate, avatarEmoji };
}
