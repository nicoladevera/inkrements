/**
 * Typography system for Inkrements redesign
 * Uses Playfair Display for headlines, system font for body
 */

export const Typography = {
  // Font families
  fontFamily: {
    serif: 'PlayfairDisplay_700Bold',
    serifMedium: 'PlayfairDisplay_600SemiBold',
    sansSerif: 'System',
  },

  // Font sizes
  fontSize: {
    // Headlines (serif)
    displayLarge: 32,
    displayMedium: 28,
    headline: 24,
    title: 20,

    // Body text (sans-serif)
    bodyLarge: 16,
    body: 15,
    bodySmall: 14,

    // Supporting text
    caption: 12,
    label: 11,
    micro: 10,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Font weights (for system font)
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;
