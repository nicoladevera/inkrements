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
  // Exercise & Movement (consolidated)
  { name: 'run', label: 'Exercise' },
  { name: 'yoga', label: 'Yoga' },
  { name: 'dumbbell', label: 'Strength' },
  { name: 'bike', label: 'Cycling' },

  // Health & Wellness
  { name: 'water', label: 'Hydration' },
  { name: 'food-apple', label: 'Nutrition' },
  { name: 'sleep', label: 'Sleep' },
  { name: 'meditation', label: 'Meditation' },
  { name: 'pill', label: 'Medication' },

  // Learning & Development
  { name: 'book-open-page-variant', label: 'Reading' },
  { name: 'pencil', label: 'Writing' },
  { name: 'brain', label: 'Study' },
  { name: 'language-python', label: 'Coding' },

  // Productivity & Goals
  { name: 'clipboard-check', label: 'Tasks' },
  { name: 'briefcase', label: 'Work' },
  { name: 'target', label: 'Goals' },

  // Lifestyle & Hobbies
  { name: 'notebook', label: 'Journal' },
  { name: 'palette', label: 'Creative' },
  { name: 'music', label: 'Music' },
  { name: 'camera', label: 'Photography' },
  { name: 'chef-hat', label: 'Cooking' },

  // Social & Mindfulness
  { name: 'account-group', label: 'Social' },
  { name: 'emoticon-happy', label: 'Mood' },
  { name: 'check-circle', label: 'General' },
];

// Default icon when none is selected
export const DEFAULT_ICON: HabitIcon = { name: 'check-circle', label: 'General' };

// Get icon by name
export const getIconByName = (name: string): HabitIcon | undefined => {
  return HABIT_ICONS.find(icon => icon.name === name);
};

