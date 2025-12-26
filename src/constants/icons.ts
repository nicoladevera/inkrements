/**
 * Icon set definitions for habit icons
 * Using @expo/vector-icons (MaterialCommunityIcons)
 */

export type IconName = typeof HABIT_ICONS[number]['name'];

export interface HabitIcon {
  name: string;
  label: string;
}

// Curated list of most common habit icons
export const HABIT_ICONS: HabitIcon[] = [
  // Exercise & Movement
  { name: 'run', label: 'Exercise' },
  { name: 'walk', label: 'Walking' },
  { name: 'dumbbell', label: 'Strength' },
  { name: 'bike', label: 'Cycling' },

  // Health & Wellness
  { name: 'water-outline', label: 'Hydration' },
  { name: 'food-apple', label: 'Nutrition' },
  { name: 'sleep', label: 'Sleep' },
  { name: 'meditation', label: 'Meditation' },
  { name: 'pill', label: 'Medication' },
  { name: 'broom', label: 'Cleaning' },

  // Learning & Development
  { name: 'book-open-page-variant', label: 'Reading' },
  { name: 'pencil', label: 'Writing' },
  { name: 'laptop', label: 'Coding' },

  // Productivity & Goals
  { name: 'clipboard-check', label: 'Tasks' },
  { name: 'briefcase', label: 'Work' },
  { name: 'cash', label: 'Finance' },

  // Lifestyle & Hobbies
  { name: 'sprout', label: 'Nature' },
  { name: 'palette', label: 'Creative' },
  { name: 'music', label: 'Music' },
  { name: 'camera', label: 'Photography' },
  { name: 'pot-steam', label: 'Cooking' },

  // Social & Mindfulness
  { name: 'heart', label: 'Self-care' },
  { name: 'emoticon-happy', label: 'Mood' },
  { name: 'check-circle', label: 'General' },
];

// Default icon when none is selected
export const DEFAULT_ICON: HabitIcon = { name: 'check-circle', label: 'General' };

// Get icon by name
export const getIconByName = (name: string): HabitIcon | undefined => {
  return HABIT_ICONS.find(icon => icon.name === name);
};

