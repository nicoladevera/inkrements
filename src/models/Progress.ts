/**
 * Progress entry data model/interface
 */

// Main Progress interface
export interface Progress {
  id: string;
  habitId: string;         // Foreign key to Habit
  date: string;            // YYYY-MM-DD format
  level: number;           // 0 = not done, 1-3 for levels (1 for binary completed)
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

// Progress creation input
export interface CreateProgressInput {
  habitId: string;
  date: string;            // YYYY-MM-DD format
  level: number;           // 1-3 for level-based, 1 for binary
}

// Progress update input
export interface UpdateProgressInput {
  level: number;
}

// Progress with additional computed properties
export interface ProgressWithDetails extends Progress {
  dayOfWeek: number;       // 0-6 (Sunday-Saturday)
  weekNumber: number;      // Week number within the date range
}

