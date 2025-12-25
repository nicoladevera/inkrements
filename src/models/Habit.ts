/**
 * Habit data model/interface
 */

// Level definition for level-based habits
export interface HabitLevel {
  name: string;        // e.g., "15 minutes", "30 minutes", "60+ minutes"
  colorValue: string;  // Grayscale hex color (e.g., "#CCCCCC")
}

// Tracking type enum
export type TrackingType = 'binary' | 'level-based';

// Main Habit interface
export interface Habit {
  id: string;
  name: string;
  icon: string;                    // Icon name from icon library
  trackingType: TrackingType;
  levels: HabitLevel[];            // Empty array for binary habits, 2-3 items for level-based
  displayOrder: number;            // For custom ordering on home screen
  createdAt: string;               // ISO timestamp
  updatedAt: string;               // ISO timestamp
}

// Habit creation input (without auto-generated fields)
export interface CreateHabitInput {
  name: string;
  icon: string;
  trackingType: TrackingType;
  levels?: HabitLevel[];
}

// Habit update input (partial, without id)
export interface UpdateHabitInput {
  name?: string;
  icon?: string;
  trackingType?: TrackingType;
  levels?: HabitLevel[];
  displayOrder?: number;
}

// Default levels for level-based habits (grayscale)
export const DEFAULT_LEVELS: HabitLevel[] = [
  { name: 'Light', colorValue: '#CCCCCC' },
  { name: 'Medium', colorValue: '#888888' },
  { name: 'Intense', colorValue: '#444444' },
];

// Default level for binary habits
export const BINARY_LEVEL: HabitLevel = {
  name: 'Completed',
  colorValue: '#888888',  // Medium gray for binary completion
};

