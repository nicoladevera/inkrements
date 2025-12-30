/**
 * CRUD operations for progress entries
 */

import { 
  getDatabase, 
  generateId, 
  getCurrentTimestamp,
  isWebPlatform,
  getWebStorage,
  persistData,
} from './database';
import { Progress, CreateProgressInput, UpdateProgressInput } from '../models/Progress';
import { formatDate, getDateRangeBounds } from '../utils/dateUtils';

// Row type from database
interface ProgressRow {
  id: string;
  habit_id: string;
  date: string;
  level: number;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database row to Progress object
 */
const rowToProgress = (row: ProgressRow): Progress => ({
  id: row.id,
  habitId: row.habit_id,
  date: row.date,
  level: row.level,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * Generate a composite key for web storage
 */
const getProgressKey = (habitId: string, date: string): string => {
  return `${habitId}_${date}`;
};

/**
 * Log progress for a habit on a specific date
 * If progress already exists for that date, it will be updated
 */
export const logProgress = async (input: CreateProgressInput): Promise<Progress> => {
  const now = getCurrentTimestamp();
  
  if (isWebPlatform()) {
    const storage = getWebStorage();
    const key = getProgressKey(input.habitId, input.date);
    
    // Check if progress already exists
    let existingRow: ProgressRow | undefined;
    storage.progress.forEach((row: ProgressRow, k: string) => {
      if (row.habit_id === input.habitId && row.date === input.date) {
        existingRow = row;
      }
    });
    
    if (existingRow) {
      // Update existing progress
      existingRow.level = input.level;
      existingRow.updated_at = now;
      storage.progress.set(existingRow.id, existingRow);
      await persistData();
      
      return rowToProgress(existingRow);
    }
    
    // Create new progress entry
    const id = generateId();
    const newRow: ProgressRow = {
      id,
      habit_id: input.habitId,
      date: input.date,
      level: input.level,
      created_at: now,
      updated_at: now,
    };
    
    storage.progress.set(id, newRow);
    await persistData();
    
    return rowToProgress(newRow);
  }
  
  // SQLite path
  const db = await getDatabase();
  
  // Check if progress already exists for this habit and date
  const existing = await db.getFirstAsync<ProgressRow>(
    'SELECT * FROM progress WHERE habit_id = ? AND date = ?',
    input.habitId,
    input.date
  );
  
  if (existing) {
    // Update existing progress
    await db.runAsync(
      'UPDATE progress SET level = ?, updated_at = ? WHERE id = ?',
      input.level,
      now,
      existing.id
    );
    
    return {
      id: existing.id,
      habitId: input.habitId,
      date: input.date,
      level: input.level,
      createdAt: existing.created_at,
      updatedAt: now,
    };
  }
  
  // Create new progress entry
  const id = generateId();
  
  await db.runAsync(
    `INSERT INTO progress (id, habit_id, date, level, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    id,
    input.habitId,
    input.date,
    input.level,
    now,
    now
  );
  
  return {
    id,
    habitId: input.habitId,
    date: input.date,
    level: input.level,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Get all progress entries for a habit
 */
export const getProgressForHabit = async (habitId: string): Promise<Progress[]> => {
  if (isWebPlatform()) {
    const storage = getWebStorage();
    const results: Progress[] = [];
    
    storage.progress.forEach((row: ProgressRow) => {
      if (row.habit_id === habitId) {
        results.push(rowToProgress(row));
      }
    });
    
    return results.sort((a, b) => b.date.localeCompare(a.date));
  }
  
  const db = await getDatabase();
  const rows = await db.getAllAsync<ProgressRow>(
    'SELECT * FROM progress WHERE habit_id = ? ORDER BY date DESC',
    habitId
  );
  return rows.map(rowToProgress);
};

/**
 * Get progress for a habit within a date range (specified by number of weeks)
 */
export const getProgressForDateRange = async (
  habitId: string,
  weeks: number
): Promise<Progress[]> => {
  const { start, end } = getDateRangeBounds(weeks);
  const startDate = formatDate(start);
  const endDate = formatDate(end);
  
  if (isWebPlatform()) {
    const storage = getWebStorage();
    const results: Progress[] = [];
    
    storage.progress.forEach((row: ProgressRow) => {
      if (row.habit_id === habitId && row.date >= startDate && row.date <= endDate) {
        results.push(rowToProgress(row));
      }
    });
    
    return results.sort((a, b) => b.date.localeCompare(a.date));
  }
  
  const db = await getDatabase();
  const rows = await db.getAllAsync<ProgressRow>(
    `SELECT * FROM progress 
     WHERE habit_id = ? AND date >= ? AND date <= ?
     ORDER BY date DESC`,
    habitId,
    startDate,
    endDate
  );
  
  return rows.map(rowToProgress);
};

/**
 * Get progress for a specific date
 */
export const getProgressForDate = async (
  habitId: string,
  date: string
): Promise<Progress | null> => {
  if (isWebPlatform()) {
    const storage = getWebStorage();
    
    let found: ProgressRow | undefined;
    storage.progress.forEach((row: ProgressRow) => {
      if (row.habit_id === habitId && row.date === date) {
        found = row;
      }
    });
    
    return found ? rowToProgress(found) : null;
  }
  
  const db = await getDatabase();
  const row = await db.getFirstAsync<ProgressRow>(
    'SELECT * FROM progress WHERE habit_id = ? AND date = ?',
    habitId,
    date
  );
  return row ? rowToProgress(row) : null;
};

/**
 * Update an existing progress entry
 */
export const updateProgress = async (
  id: string,
  input: UpdateProgressInput
): Promise<Progress | null> => {
  const now = getCurrentTimestamp();
  
  if (isWebPlatform()) {
    const storage = getWebStorage();
    const row = storage.progress.get(id);
    
    if (!row) return null;
    
    row.level = input.level;
    row.updated_at = now;
    storage.progress.set(id, row);
    await persistData();
    
    return rowToProgress(row);
  }
  
  const db = await getDatabase();
  
  const existing = await db.getFirstAsync<ProgressRow>(
    'SELECT * FROM progress WHERE id = ?',
    id
  );
  
  if (!existing) {
    return null;
  }
  
  await db.runAsync(
    'UPDATE progress SET level = ?, updated_at = ? WHERE id = ?',
    input.level,
    now,
    id
  );
  
  return {
    ...rowToProgress(existing),
    level: input.level,
    updatedAt: now,
  };
};

/**
 * Delete a progress entry
 */
export const deleteProgress = async (id: string): Promise<boolean> => {
  if (isWebPlatform()) {
    const storage = getWebStorage();
    const deleted = storage.progress.delete(id);
    await persistData();
    return deleted;
  }
  
  const db = await getDatabase();
  const result = await db.runAsync('DELETE FROM progress WHERE id = ?', id);
  return result.changes > 0;
};

/**
 * Delete progress for a specific habit and date
 */
export const deleteProgressForDate = async (
  habitId: string,
  date: string
): Promise<boolean> => {
  if (isWebPlatform()) {
    const storage = getWebStorage();
    
    let idToDelete: string | undefined;
    storage.progress.forEach((row: ProgressRow, id: string) => {
      if (row.habit_id === habitId && row.date === date) {
        idToDelete = id;
      }
    });
    
    if (idToDelete) {
      storage.progress.delete(idToDelete);
      await persistData();
      return true;
    }
    
    return false;
  }
  
  const db = await getDatabase();
  const result = await db.runAsync(
    'DELETE FROM progress WHERE habit_id = ? AND date = ?',
    habitId,
    date
  );
  return result.changes > 0;
};

/**
 * Get count of completed days for a habit within a date range
 */
export const getCompletionCount = async (
  habitId: string,
  weeks: number
): Promise<number> => {
  const { start, end } = getDateRangeBounds(weeks);
  const startDate = formatDate(start);
  const endDate = formatDate(end);
  
  if (isWebPlatform()) {
    const storage = getWebStorage();
    let count = 0;
    
    storage.progress.forEach((row: ProgressRow) => {
      if (row.habit_id === habitId && 
          row.date >= startDate && 
          row.date <= endDate && 
          row.level > 0) {
        count++;
      }
    });
    
    return count;
  }
  
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM progress 
     WHERE habit_id = ? AND date >= ? AND date <= ? AND level > 0`,
    habitId,
    startDate,
    endDate
  );
  
  return result?.count ?? 0;
};

/**
 * Get progress for multiple habits at once (for home screen optimization)
 */
export const getProgressForHabits = async (
  habitIds: string[],
  weeks: number
): Promise<Map<string, Progress[]>> => {
  const { start, end } = getDateRangeBounds(weeks);
  const startDate = formatDate(start);
  const endDate = formatDate(end);
  
  // Initialize result map
  const progressMap = new Map<string, Progress[]>();
  for (const habitId of habitIds) {
    progressMap.set(habitId, []);
  }
  
  if (isWebPlatform()) {
    const storage = getWebStorage();
    const habitIdSet = new Set(habitIds);
    
    storage.progress.forEach((row: ProgressRow) => {
      if (habitIdSet.has(row.habit_id) && 
          row.date >= startDate && 
          row.date <= endDate) {
        const progress = rowToProgress(row);
        progressMap.get(row.habit_id)?.push(progress);
      }
    });
    
    return progressMap;
  }
  
  const db = await getDatabase();
  const placeholders = habitIds.map(() => '?').join(',');
  
  const rows = await db.getAllAsync<ProgressRow>(
    `SELECT * FROM progress 
     WHERE habit_id IN (${placeholders}) AND date >= ? AND date <= ?
     ORDER BY date DESC`,
    ...habitIds,
    startDate,
    endDate
  );
  
  for (const row of rows) {
    const progress = rowToProgress(row);
    progressMap.get(progress.habitId)?.push(progress);
  }
  
  
  return progressMap;
};

/**
 * Get ALL progress entries (for export/backup)
 */
export const getAllProgress = async (): Promise<Progress[]> => {
  if (isWebPlatform()) {
    const storage = getWebStorage();
    const results: Progress[] = [];
    
    storage.progress.forEach((row: ProgressRow) => {
      results.push(rowToProgress(row));
    });
    
    return results.sort((a, b) => b.date.localeCompare(a.date));
  }
  
  const db = await getDatabase();
  const rows = await db.getAllAsync<ProgressRow>(
    'SELECT * FROM progress ORDER BY date DESC'
  );
  return rows.map(rowToProgress);
};
