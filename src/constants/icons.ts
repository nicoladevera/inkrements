/**
 * Icon set definitions for habit icons
 * Using @expo/vector-icons (MaterialCommunityIcons)
 */

export type IconName = typeof HABIT_ICONS[number]['name'];

export interface HabitIcon {
  name: string;
  label: string;
}

// Curated list of icons suitable for habit tracking
export const HABIT_ICONS: HabitIcon[] = [
  // Health & Fitness
  { name: 'run', label: 'Running' },
  { name: 'walk', label: 'Walking' },
  { name: 'bike', label: 'Cycling' },
  { name: 'swim', label: 'Swimming' },
  { name: 'yoga', label: 'Yoga' },
  { name: 'dumbbell', label: 'Exercise' },
  { name: 'heart-pulse', label: 'Health' },
  { name: 'meditation', label: 'Meditation' },
  
  // Learning & Creativity
  { name: 'book-open-page-variant', label: 'Reading' },
  { name: 'pencil', label: 'Writing' },
  { name: 'palette', label: 'Art' },
  { name: 'music', label: 'Music' },
  { name: 'language-python', label: 'Coding' },
  { name: 'school', label: 'Learning' },
  { name: 'brain', label: 'Study' },
  
  // Productivity & Work
  { name: 'briefcase', label: 'Work' },
  { name: 'clipboard-check', label: 'Tasks' },
  { name: 'calendar-check', label: 'Planning' },
  { name: 'target', label: 'Goals' },
  { name: 'clock-outline', label: 'Time' },
  
  // Lifestyle
  { name: 'water', label: 'Hydration' },
  { name: 'food-apple', label: 'Nutrition' },
  { name: 'sleep', label: 'Sleep' },
  { name: 'pill', label: 'Medication' },
  { name: 'shower', label: 'Self-care' },
  { name: 'tooth', label: 'Dental' },
  { name: 'coffee', label: 'Coffee' },
  { name: 'tea', label: 'Tea' },
  
  // Social & Communication
  { name: 'phone', label: 'Calls' },
  { name: 'message', label: 'Messages' },
  { name: 'account-group', label: 'Social' },
  { name: 'home-heart', label: 'Family' },
  
  // Hobbies
  { name: 'gamepad-variant', label: 'Gaming' },
  { name: 'movie', label: 'Movies' },
  { name: 'camera', label: 'Photography' },
  { name: 'flower', label: 'Gardening' },
  { name: 'chef-hat', label: 'Cooking' },
  
  // Finance & Organization
  { name: 'piggy-bank', label: 'Savings' },
  { name: 'cash', label: 'Budget' },
  { name: 'broom', label: 'Cleaning' },
  { name: 'recycle', label: 'Eco' },
  
  // Mindfulness
  { name: 'emoticon-happy', label: 'Mood' },
  { name: 'notebook', label: 'Journal' },
  { name: 'weather-sunny', label: 'Outdoors' },
  { name: 'star', label: 'Gratitude' },
  { name: 'check-circle', label: 'General' },
];

// Default icon when none is selected
export const DEFAULT_ICON: HabitIcon = { name: 'check-circle', label: 'General' };

// Get icon by name
export const getIconByName = (name: string): HabitIcon | undefined => {
  return HABIT_ICONS.find(icon => icon.name === name);
};

