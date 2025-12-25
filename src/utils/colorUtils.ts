/**
 * Grayscale color scheme utilities
 */

import { Colors, getProgressColor } from '../constants/colors';
import { HabitLevel } from '../models/Habit';

/**
 * Get the color for a progress level
 * Uses the habit's custom level colors if defined, otherwise falls back to defaults
 */
export const getColorForLevel = (
  level: number,
  habitLevels?: HabitLevel[]
): string => {
  if (level <= 0) {
    return Colors.notTracked;
  }

  // If habit has custom levels defined, use those
  if (habitLevels && habitLevels.length > 0) {
    const levelIndex = level - 1; // Convert 1-based to 0-based index
    if (levelIndex >= 0 && levelIndex < habitLevels.length) {
      return habitLevels[levelIndex].colorValue;
    }
  }

  // Fall back to default progress colors
  return getProgressColor(level);
};

/**
 * Get grayscale value from hex color (0-255)
 */
export const getGrayscaleValue = (hexColor: string): number => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Simple average for grayscale
  return Math.round((r + g + b) / 3);
};

/**
 * Determine if text should be light or dark based on background color
 */
export const getContrastTextColor = (backgroundColor: string): string => {
  const grayscale = getGrayscaleValue(backgroundColor);
  return grayscale > 128 ? Colors.textPrimary : Colors.white;
};

/**
 * Generate grayscale shades for level-based habits
 * Returns an array of hex colors from light to dark
 */
export const generateGrayscaleShades = (count: number): string[] => {
  const shades: string[] = [];
  
  // Range from light (#CCCCCC) to dark (#444444)
  const lightValue = 204; // 0xCC
  const darkValue = 68;   // 0x44
  const step = (lightValue - darkValue) / (count - 1);
  
  for (let i = 0; i < count; i++) {
    const value = Math.round(lightValue - (step * i));
    const hex = value.toString(16).padStart(2, '0');
    shades.push(`#${hex}${hex}${hex}`);
  }
  
  return shades;
};

/**
 * Predefined grayscale options for level selection
 */
export const GRAYSCALE_OPTIONS = [
  { value: '#CCCCCC', label: 'Light' },
  { value: '#AAAAAA', label: 'Light-Medium' },
  { value: '#888888', label: 'Medium' },
  { value: '#666666', label: 'Medium-Dark' },
  { value: '#444444', label: 'Dark' },
] as const;

/**
 * Get default colors for a given number of levels
 */
export const getDefaultLevelColors = (levelCount: number): string[] => {
  switch (levelCount) {
    case 2:
      return ['#CCCCCC', '#444444'];
    case 3:
      return ['#CCCCCC', '#888888', '#444444'];
    default:
      return generateGrayscaleShades(levelCount);
  }
};

