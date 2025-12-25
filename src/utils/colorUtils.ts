/**
 * Warm color scheme utilities for Inkrements redesign
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
 * Generate warm tone shades for level-based habits
 * Returns an array of hex colors from light to deep peach
 */
export const generateWarmShades = (count: number): string[] => {
  const shades: string[] = [];
  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    // Interpolate from light peach to deep peach
    const r = Math.round(255 - ratio * 10);
    const g = Math.round(212 - ratio * 46);
    const b = Math.round(184 - ratio * 62);
    shades.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
  }
  return shades;
};

/**
 * Warm color options for level selection (replaces GRAYSCALE_OPTIONS)
 */
export const WARM_COLOR_OPTIONS = [
  { value: '#FFD4B8', label: 'Light Peach' },
  { value: '#FFB88C', label: 'Coral' },
  { value: '#F5A67A', label: 'Warm Peach' },
  { value: '#E8D5F0', label: 'Lavender' },
  { value: '#D4C5E8', label: 'Purple' },
  { value: '#B8A5D8', label: 'Deep Purple' },
  { value: '#C5E0F5', label: 'Soft Blue' },
  { value: '#9BC6E8', label: 'Sky Blue' },
  { value: '#74ADD6', label: 'Steel Blue' },
] as const;

// Keep old name for backwards compatibility during transition
export const GRAYSCALE_OPTIONS = WARM_COLOR_OPTIONS;

/**
 * Get default colors for a given number of levels
 */
export const getDefaultLevelColors = (levelCount: number): string[] => {
  switch (levelCount) {
    case 2:
      return ['#FFD4B8', '#F5A67A'];
    case 3:
      return ['#FFD4B8', '#FFB88C', '#F5A67A'];
    default:
      return generateWarmShades(levelCount);
  }
};
