/**
 * Warm color palette for Inkrements redesign
 * Replaces the original grayscale wireframe palette
 */

export const Colors = {
  // Background colors
  background: '#FFF9F5',           // Soft cream/off-white
  cardBackground: '#FFFFFF',        // Pure white for cards
  cardBackgroundAlt: '#FEF7F2',    // Slightly warm card variant

  // Primary gradient colors (peach/coral/orange)
  gradientStart: '#F5A67A',        // Warm peach
  gradientMid: '#FFB88C',          // Coral
  gradientEnd: '#FFD4B8',          // Light peach

  // Accent colors (lavender/purple)
  accent: '#D4C5E8',               // Soft lavender
  accentLight: '#E8D5F0',          // Lighter lavender
  accentDark: '#B8A5D8',           // Darker lavender

  // Progress level colors (warm tones replacing grayscale)
  notTracked: '#F5EDE8',           // Very light warm gray (untracked tiles)
  level1: '#FFD4B8',               // Light peach - Level 1
  level2: '#FFB88C',               // Medium coral - Level 2
  level3: '#F5A67A',               // Deep peach - Level 3

  // Text colors
  textPrimary: '#2D2A32',          // Near-black with warm undertone
  textSecondary: '#6B6670',        // Warm medium gray
  textTertiary: '#9B969F',         // Light warm gray
  textOnGradient: '#FFFFFF',       // White text on gradient backgrounds

  // Interactive states
  pressed: '#FEF0E8',              // Warm pressed state
  disabled: '#E8E4E0',             // Warm disabled gray

  // Borders and dividers
  border: '#F0E8E2',               // Soft warm border
  borderDark: '#E0D6D0',           // Darker warm border

  // Semantic colors
  error: '#E07070',                // Soft red
  errorLight: '#FDE8E8',           // Light red background
  success: '#70B070',              // Soft green
  successLight: '#E8F5E8',         // Light green background

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(45, 42, 50, 0.5)', // Warm dark overlay for modals
} as const;

// Progress level color mapping
export const ProgressLevelColors = {
  0: Colors.notTracked,
  1: Colors.level1,
  2: Colors.level2,
  3: Colors.level3,
} as const;

// Get color for a specific progress level
export const getProgressColor = (level: number): string => {
  if (level <= 0) return Colors.notTracked;
  if (level >= 3) return Colors.level3;
  return ProgressLevelColors[level as keyof typeof ProgressLevelColors] || Colors.notTracked;
};
