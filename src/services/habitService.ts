/**
 * CRUD operations for habits
 */

import { 
  getDatabase, 
  generateId, 
  getCurrentTimestamp,
  isWebPlatform,
  getWebStorage,
  persistData,
} from './database';
import { 
  Habit, 
  CreateHabitInput, 
  UpdateHabitInput,
  TrackingType,
  HabitLevel,
  BINARY_LEVEL,
} from '../models/Habit';

// Row type from database
interface HabitRow {
  id: string;
  name: string;
  description?: string;
  icon: string;
  tracking_type: string;
  levels: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database row to Habit object
 */
const rowToHabit = (row: HabitRow): Habit => ({
  id: row.id,
  name: row.name,
  description: row.description,
  icon: row.icon,
  trackingType: row.tracking_type as TrackingType,
  levels: JSON.parse(row.levels) as HabitLevel[],
  displayOrder: row.display_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * Create a new habit
 */
export const createHabit = async (input: CreateHabitInput): Promise<Habit> => {
  const id = generateId();
  const now = getCurrentTimestamp();
  
  // Set default levels based on tracking type
  const levels = input.levels || (input.trackingType === 'binary'
    ? [BINARY_LEVEL]
    : []);
  
  if (isWebPlatform()) {
    const storage = getWebStorage();
    
    // Get the next display order
    let maxOrder = -1;
    storage.habits.forEach((habit: any) => {
      if (habit.display_order > maxOrder) {
        maxOrder = habit.display_order;
      }
    });
    const displayOrder = maxOrder + 1;
    
    const habitRow: HabitRow = {
      id,
      name: input.name,
      description: input.description,
      icon: input.icon,
      tracking_type: input.trackingType,
      levels: JSON.stringify(levels),
      display_order: displayOrder,
      created_at: now,
      updated_at: now,
    };

    storage.habits.set(id, habitRow);
    await persistData();

    return {
      id,
      name: input.name,
      description: input.description,
      icon: input.icon,
      trackingType: input.trackingType,
      levels,
      displayOrder,
      createdAt: now,
      updatedAt: now,
    };
  }
  
  // SQLite path
  const db = await getDatabase();
  
  // Get the next display order
  const result = await db.getFirstAsync<{ maxOrder: number | null }>(
    'SELECT MAX(display_order) as maxOrder FROM habits'
  );
  const displayOrder = (result?.maxOrder ?? -1) + 1;
  
  await db.runAsync(
    `INSERT INTO habits (id, name, description, icon, tracking_type, levels, display_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.name,
    input.description || null,
    input.icon,
    input.trackingType,
    JSON.stringify(levels),
    displayOrder,
    now,
    now
  );

  return {
    id,
    name: input.name,
    description: input.description,
    icon: input.icon,
    trackingType: input.trackingType,
    levels,
    displayOrder,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Get all habits ordered by display order
 */
export const getHabits = async (): Promise<Habit[]> => {
  if (isWebPlatform()) {
    const storage = getWebStorage();
    const habits: Habit[] = [];
    
    storage.habits.forEach((row: HabitRow) => {
      habits.push(rowToHabit(row));
    });
    
    return habits.sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  const db = await getDatabase();
  const rows = await db.getAllAsync<HabitRow>(
    'SELECT * FROM habits ORDER BY display_order ASC'
  );
  return rows.map(rowToHabit);
};

/**
 * Get a single habit by ID
 */
export const getHabitById = async (id: string): Promise<Habit | null> => {
  if (isWebPlatform()) {
    const storage = getWebStorage();
    const row = storage.habits.get(id);
    return row ? rowToHabit(row) : null;
  }
  
  const db = await getDatabase();
  const row = await db.getFirstAsync<HabitRow>(
    'SELECT * FROM habits WHERE id = ?',
    id
  );
  return row ? rowToHabit(row) : null;
};

/**
 * Update an existing habit
 */
export const updateHabit = async (
  id: string, 
  input: UpdateHabitInput
): Promise<Habit | null> => {
  const now = getCurrentTimestamp();
  
  // Get current habit
  const current = await getHabitById(id);
  if (!current) {
    return null;
  }
  
  if (isWebPlatform()) {
    const storage = getWebStorage();
    const row = storage.habits.get(id);
    
    if (!row) return null;
    
    const updatedRow: HabitRow = {
      ...row,
      name: input.name ?? row.name,
      description: input.description !== undefined ? input.description : row.description,
      icon: input.icon ?? row.icon,
      tracking_type: input.trackingType ?? row.tracking_type,
      levels: input.levels ? JSON.stringify(input.levels) : row.levels,
      display_order: input.displayOrder ?? row.display_order,
      updated_at: now,
    };
    
    storage.habits.set(id, updatedRow);
    await persistData();
    
    return rowToHabit(updatedRow);
  }
  
  // SQLite path
  const db = await getDatabase();
  
  // Build update fields
  const updates: string[] = ['updated_at = ?'];
  const values: (string | number | null)[] = [now];
  
  if (input.name !== undefined) {
    updates.push('name = ?');
    values.push(input.name);
  }

  if (input.description !== undefined) {
    updates.push('description = ?');
    values.push(input.description || null);
  }

  if (input.icon !== undefined) {
    updates.push('icon = ?');
    values.push(input.icon);
  }
  
  if (input.trackingType !== undefined) {
    updates.push('tracking_type = ?');
    values.push(input.trackingType);
  }
  
  if (input.levels !== undefined) {
    updates.push('levels = ?');
    values.push(JSON.stringify(input.levels));
  }
  
  if (input.displayOrder !== undefined) {
    updates.push('display_order = ?');
    values.push(input.displayOrder);
  }
  
  values.push(id);
  
  await db.runAsync(
    `UPDATE habits SET ${updates.join(', ')} WHERE id = ?`,
    ...values
  );
  
  return getHabitById(id);
};

/**
 * Delete a habit and all associated progress
 */
export const deleteHabit = async (id: string): Promise<boolean> => {
  if (isWebPlatform()) {
    const storage = getWebStorage();
    
    // Delete associated progress
    const progressToDelete: string[] = [];
    storage.progress.forEach((progress: any, key: string) => {
      if (progress.habit_id === id) {
        progressToDelete.push(key);
      }
    });
    progressToDelete.forEach(key => storage.progress.delete(key));
    
    // Delete the habit
    const deleted = storage.habits.delete(id);
    await persistData();
    
    return deleted;
  }
  
  const db = await getDatabase();
  
  // Delete associated progress first
  await db.runAsync('DELETE FROM progress WHERE habit_id = ?', id);
  
  // Delete the habit
  const result = await db.runAsync('DELETE FROM habits WHERE id = ?', id);
  
  return result.changes > 0;
};

/**
 * Reorder habits
 * Takes an array of habit IDs in the new order
 */
export const reorderHabits = async (habitIds: string[]): Promise<void> => {
  const now = getCurrentTimestamp();
  
  if (isWebPlatform()) {
    const storage = getWebStorage();
    
    for (let i = 0; i < habitIds.length; i++) {
      const row = storage.habits.get(habitIds[i]);
      if (row) {
        row.display_order = i;
        row.updated_at = now;
        storage.habits.set(habitIds[i], row);
      }
    }
    
    await persistData();
    return;
  }
  
  const db = await getDatabase();
  
  // Update each habit's display order
  for (let i = 0; i < habitIds.length; i++) {
    await db.runAsync(
      'UPDATE habits SET display_order = ?, updated_at = ? WHERE id = ?',
      i,
      now,
      habitIds[i]
    );
  }
};

/**
 * Get the count of all habits
 */
export const getHabitCount = async (): Promise<number> => {
  if (isWebPlatform()) {
    return getWebStorage().habits.size;
  }
  
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM habits'
  );
  return result?.count ?? 0;
};
