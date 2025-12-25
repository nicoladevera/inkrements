/**
 * Grayscale color palette for Inkrements v1
 * Following wireframe aesthetic with varying shades of gray
 */

export const Colors = {
  // Base colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Progress level colors (grayscale)
  notTracked: '#F5F5F5',      // Very light gray - empty/untracked tiles
  level1: '#CCCCCC',          // Light gray - Binary completion / Level 1
  level2: '#888888',          // Medium gray - Level 2
  level3: '#444444',          // Dark gray - Level 3
  
  // UI element colors
  background: '#FFFFFF',       // App background
  cardBackground: '#FAFAFA',   // Card/tile background
  border: '#E0E0E0',          // Borders and dividers
  borderDark: '#CCCCCC',      // Darker borders for emphasis
  
  // Text colors
  textPrimary: '#000000',     // Primary text
  textSecondary: '#666666',   // Secondary/muted text
  textTertiary: '#999999',    // Tertiary/placeholder text
  
  // Interactive states
  pressed: '#E8E8E8',         // Pressed state background
  disabled: '#CCCCCC',        // Disabled state
  
  // Semantic colors (still grayscale for v1)
  error: '#666666',           // Error state (dark gray)
  success: '#444444',         // Success state (darker gray)
} as const;

// Progress level color mapping
export const ProgressLevelColors = {
  0: Colors.notTracked,  // Not tracked
  1: Colors.level1,      // Level 1 / Binary completed
  2: Colors.level2,      // Level 2
  3: Colors.level3,      // Level 3
} as const;

// Get color for a specific progress level
export const getProgressColor = (level: number): string => {
  if (level <= 0) return Colors.notTracked;
  if (level >= 3) return Colors.level3;
  return ProgressLevelColors[level as keyof typeof ProgressLevelColors] || Colors.notTracked;
};

