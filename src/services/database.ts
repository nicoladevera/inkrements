/**
 * Database initialization and connection
 * Using expo-sqlite for local-first storage (mobile)
 * Falls back to AsyncStorage for web
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATABASE_NAME = 'inkrements.db';
const STORAGE_KEY_HABITS = '@inkrements_habits';
const STORAGE_KEY_PROGRESS = '@inkrements_progress';

// Type for our simple storage interface
interface StorageInterface {
  habits: Map<string, any>;
  progress: Map<string, any>;
}

// SQLite Database interface for type safety
interface SQLiteDatabase {
  execAsync: (sql: string) => Promise<void>;
  runAsync: (sql: string, ...params: any[]) => Promise<{ changes: number }>;
  getFirstAsync: <T>(sql: string, ...params: any[]) => Promise<T | null>;
  getAllAsync: <T>(sql: string, ...params: any[]) => Promise<T[]>;
  closeAsync: () => Promise<void>;
}

// In-memory cache for web
let memoryStorage: StorageInterface = {
  habits: new Map(),
  progress: new Map(),
};

let isInitialized = false;

// For mobile, we'll use SQLite
let sqliteDb: SQLiteDatabase | null = null;

/**
 * Check if we're on web
 */
const isWeb = Platform.OS === 'web';

/**
 * Initialize database/storage
 */
export const initializeDatabase = async (): Promise<void> => {
  if (isInitialized) return;

  if (isWeb) {
    // Load from AsyncStorage for web
    try {
      const habitsData = await AsyncStorage.getItem(STORAGE_KEY_HABITS);
      const progressData = await AsyncStorage.getItem(STORAGE_KEY_PROGRESS);
      
      if (habitsData) {
        const habits = JSON.parse(habitsData);
        memoryStorage.habits = new Map(Object.entries(habits));
      }
      
      if (progressData) {
        const progress = JSON.parse(progressData);
        memoryStorage.progress = new Map(Object.entries(progress));
      }
      
      console.log('Web storage initialized successfully');
    } catch (error) {
      console.error('Error loading from AsyncStorage:', error);
    }
  } else {
    // Use SQLite for mobile
    try {
      const SQLite = await import('expo-sqlite');
      sqliteDb = await SQLite.openDatabaseAsync(DATABASE_NAME) as unknown as SQLiteDatabase;
      
      // Create Habits table
      await sqliteDb.execAsync(`
        CREATE TABLE IF NOT EXISTS habits (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          icon TEXT NOT NULL,
          tracking_type TEXT NOT NULL CHECK(tracking_type IN ('binary', 'level-based')),
          levels TEXT NOT NULL DEFAULT '[]',
          display_order INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);

      // Migration: Add description column if it doesn't exist (for existing databases)
      try {
        await sqliteDb.execAsync(`
          ALTER TABLE habits ADD COLUMN description TEXT;
        `);
      } catch (error) {
        // Column already exists, ignore error
      }
      
      // Create Progress table
      await sqliteDb.execAsync(`
        CREATE TABLE IF NOT EXISTS progress (
          id TEXT PRIMARY KEY NOT NULL,
          habit_id TEXT NOT NULL,
          date TEXT NOT NULL,
          level INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
          UNIQUE(habit_id, date)
        );
      `);
      
      // Create indexes
      await sqliteDb.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_progress_habit_id ON progress(habit_id);
      `);
      await sqliteDb.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_progress_date ON progress(date);
      `);
      await sqliteDb.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_progress_habit_date ON progress(habit_id, date);
      `);
      await sqliteDb.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_habits_display_order ON habits(display_order);
      `);
      
      console.log('SQLite database initialized successfully');
    } catch (error) {
      console.error('Error initializing SQLite:', error);
      throw error;
    }
  }
  
  isInitialized = true;
};

/**
 * Save web storage to AsyncStorage
 */
const persistWebStorage = async (): Promise<void> => {
  if (!isWeb) return;
  
  try {
    const habitsObj = Object.fromEntries(memoryStorage.habits);
    const progressObj = Object.fromEntries(memoryStorage.progress);
    
    await AsyncStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habitsObj));
    await AsyncStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progressObj));
  } catch (error) {
    console.error('Error persisting to AsyncStorage:', error);
  }
};

/**
 * Get database connection (for SQLite on mobile)
 */
export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (isWeb) {
    throw new Error('SQLite not available on web, use getWebStorage instead');
  }
  
  if (!sqliteDb) {
    await initializeDatabase();
  }
  
  return sqliteDb!;
};

/**
 * Get storage interface for web
 */
export const getWebStorage = (): StorageInterface => {
  return memoryStorage;
};

/**
 * Check if running on web
 */
export const isWebPlatform = (): boolean => {
  return isWeb;
};

/**
 * Trigger persist for web storage
 */
export const persistData = async (): Promise<void> => {
  await persistWebStorage();
};

/**
 * Close database connection
 */
export const closeDatabase = async (): Promise<void> => {
  if (!isWeb && sqliteDb) {
    await sqliteDb.closeAsync();
    sqliteDb = null;
  }
  isInitialized = false;
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get current ISO timestamp
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
