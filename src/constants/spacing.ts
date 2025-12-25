/**
 * Spacing, border radius, and shadow constants for Inkrements redesign
 */

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
} as const;

export const BorderRadius = {
    tile: 6,        // Progress tiles
    button: 16,     // Buttons and inputs
    card: 20,       // Cards
    modal: 24,      // Modal dialogs
    pill: 999,      // Pill-shaped elements
    icon: 14,       // Icon containers
} as const;

export const Shadows = {
    card: {
        shadowColor: 'rgba(209, 180, 160, 0.15)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 4,
    },
    cardHover: {
        shadowColor: 'rgba(209, 180, 160, 0.2)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 8,
    },
    fab: {
        shadowColor: '#F5A67A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
} as const;
