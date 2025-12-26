# Inkrements Visual Redesign - Complete Implementation Guide

> **Purpose**: This document contains everything needed for Claude Code to execute the visual redesign in a new session without additional context.

## Project Overview

**App**: Inkrements - A React Native (Expo) habit tracking app
**Current State**: Grayscale wireframe aesthetic (v1)
**Target State**: Modern wellness app aesthetic with warm gradients, soft shadows, and elegant typography

**Tech Stack**:
- React Native with Expo (~54.0)
- TypeScript
- React Navigation (Native Stack)
- expo-sqlite (mobile) / AsyncStorage (web)

---

## Target Design Aesthetic

Based on reference screenshots of modern wellness apps:

### Visual Characteristics
- **Colors**: Soft warm gradients (peach/coral/orange), lavender accents, cream backgrounds
- **Typography**: Elegant serif headlines (Playfair Display), clean sans-serif body
- **Shapes**: Very rounded corners (16-24px border radius), pill-shaped buttons
- **Depth**: Soft shadows instead of borders, subtle glassmorphism
- **Spacing**: Generous whitespace, premium feel

### Design Constraints (User-Specified)
1. **Custom fonts**: Use expo-google-fonts with Playfair Display for serif headlines
2. **Keep current navigation**: Maintain existing 3-screen stack (Home, HabitDetail, CreateHabit)
3. **Minimal animations**: Use only React Native's built-in Animated API (Expo Go compatible)
4. **Accent gradients only**: Apply expo-linear-gradient sparingly to key CTAs/buttons

---

## Implementation Instructions

### Step 1: Install Required Packages

```bash
npx expo install @expo-google-fonts/playfair-display expo-font expo-linear-gradient
```

---

### Step 2: Create New Constants Files

#### File: `src/constants/typography.ts` (CREATE NEW)

```typescript
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
```

#### File: `src/constants/spacing.ts` (CREATE NEW)

```typescript
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
```

---

### Step 3: Replace Color Palette

#### File: `src/constants/colors.ts` (REPLACE ENTIRE FILE)

```typescript
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
```

---

### Step 4: Update Color Utilities

#### File: `src/utils/colorUtils.ts` (UPDATE)

Replace `GRAYSCALE_OPTIONS` with:

```typescript
// Warm color options for level selection (replaces GRAYSCALE_OPTIONS)
export const WARM_COLOR_OPTIONS = [
  { value: '#FFD4B8', label: 'Light Peach' },
  { value: '#FFB88C', label: 'Coral' },
  { value: '#F5A67A', label: 'Warm Peach' },
  { value: '#E8D5F0', label: 'Lavender' },
  { value: '#D4C5E8', label: 'Purple' },
] as const;
```

Update `getDefaultLevelColors` function:

```typescript
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

// Generate warm tone shades
const generateWarmShades = (count: number): string[] => {
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
```

---

### Step 5: Update App.tsx with Font Loading

#### File: `App.tsx` (UPDATE)

Add font loading at the top:

```typescript
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
```

Update the App component:

```typescript
export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load fonts
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_600SemiBold,
  });

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError('Failed to initialize the app. Please restart.');
      }
    };
    init();
  }, []);

  // Wait for both fonts and database
  if (!fontsLoaded || !isInitialized) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // ... rest of the component
}
```

Update navigator screenOptions:

```typescript
screenOptions={{
  headerStyle: {
    backgroundColor: Colors.background,
  },
  headerTintColor: Colors.textPrimary,
  headerTitleStyle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: Colors.background,
  },
}}
```

Update loading screen styles:

```typescript
loadingContainer: {
  flex: 1,
  backgroundColor: Colors.background,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
},
loadingText: {
  fontSize: 16,
  color: Colors.textSecondary,
  fontFamily: 'PlayfairDisplay_600SemiBold',
},
```

---

### Step 6: Update Components

#### File: `src/components/ProgressTile.tsx` (UPDATE STYLES)

Key style changes:
```typescript
tile: {
  borderRadius: 6,  // was 4
  borderWidth: 1,
  borderColor: Colors.border,  // warm border
  margin: 1.5,  // slightly more spacing
},
todayTile: {
  borderColor: Colors.accent,  // lavender border for today
  borderWidth: 2,
},
todayDot: {
  backgroundColor: Colors.accent,  // lavender dot
},
```

#### File: `src/components/HabitCard.tsx` (UPDATE STYLES)

Key style changes:
```typescript
import { Shadows, BorderRadius, Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';

// In styles:
container: {
  backgroundColor: Colors.cardBackground,
  borderRadius: BorderRadius.card,  // 20
  padding: Spacing.xl,  // 20
  marginBottom: Spacing.md,
  ...Shadows.card,
  // REMOVE: borderWidth, borderColor
},
iconContainer: {
  width: 44,
  height: 44,
  borderRadius: BorderRadius.icon,
  backgroundColor: Colors.accentLight,  // lavender background
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: Spacing.md,
},
habitName: {
  fontFamily: Typography.fontFamily.serifMedium,
  fontSize: Typography.fontSize.title,
  color: Colors.textPrimary,
},
```

#### File: `src/components/EmptyState.tsx` (UPDATE with gradient button)

Add import:
```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '../constants/typography';
import { BorderRadius } from '../constants/spacing';
```

Update button JSX:
```typescript
<TouchableOpacity
  style={styles.button}
  onPress={onCreateHabit}
  activeOpacity={0.8}
>
  <LinearGradient
    colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  />
  <MaterialCommunityIcons name="plus" size={20} color={Colors.textOnGradient} />
  <Text style={styles.buttonText}>Create Your First Habit</Text>
</TouchableOpacity>
```

Update styles:
```typescript
title: {
  fontFamily: Typography.fontFamily.serif,
  fontSize: Typography.fontSize.headline,
  color: Colors.textPrimary,
  textAlign: 'center',
},
button: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 14,
  borderRadius: BorderRadius.pill,
  overflow: 'hidden',  // for gradient
  gap: 8,
},
buttonText: {
  color: Colors.textOnGradient,
  fontSize: 16,
  fontWeight: '600',
},
```

#### File: `src/components/LevelSelectorModal.tsx` (UPDATE STYLES)

Key style changes:
```typescript
import { Typography } from '../constants/typography';
import { BorderRadius, Shadows } from '../constants/spacing';

overlay: {
  backgroundColor: Colors.overlay,
},
content: {
  backgroundColor: Colors.cardBackground,
  borderRadius: BorderRadius.modal,  // 24
  padding: 24,
  ...Shadows.cardHover,
},
title: {
  fontFamily: Typography.fontFamily.serif,
  fontSize: Typography.fontSize.title,
  color: Colors.textPrimary,
},
levelButton: {
  borderRadius: BorderRadius.button,  // 16
  backgroundColor: Colors.cardBackgroundAlt,
  borderColor: Colors.border,
},
levelButtonSelected: {
  borderColor: Colors.accent,
  backgroundColor: Colors.accentLight,
},
```

---

### Step 7: Update Screens

#### File: `src/screens/HomeScreen.tsx` (UPDATE with gradient FAB)

Add import:
```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { Shadows, BorderRadius } from '../constants/spacing';
```

Update FAB JSX:
```typescript
<TouchableOpacity
  style={styles.fab}
  onPress={() => navigation.navigate('CreateHabit')}
  activeOpacity={0.8}
>
  <LinearGradient
    colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  />
  <MaterialCommunityIcons name="plus" size={28} color={Colors.textOnGradient} />
</TouchableOpacity>
```

Update styles:
```typescript
container: {
  flex: 1,
  backgroundColor: Colors.background,
},
fab: {
  position: 'absolute',
  right: 20,
  bottom: 24,
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  ...Shadows.fab,
},
```

#### File: `src/screens/HabitDetailScreen.tsx` (UPDATE STYLES)

Add imports:
```typescript
import { Typography } from '../constants/typography';
import { BorderRadius, Shadows, Spacing } from '../constants/spacing';
```

Key style changes:
```typescript
habitName: {
  fontFamily: Typography.fontFamily.serif,
  fontSize: Typography.fontSize.headline,
  color: Colors.textPrimary,
},
iconContainer: {
  width: 56,
  height: 56,
  borderRadius: BorderRadius.icon,
  backgroundColor: Colors.accentLight,
  justifyContent: 'center',
  alignItems: 'center',
},
// Add card-style wrapper for stats and legend sections
sectionCard: {
  backgroundColor: Colors.cardBackground,
  borderRadius: BorderRadius.card,
  padding: Spacing.lg,
  marginBottom: Spacing.md,
  ...Shadows.card,
},
```

#### File: `src/screens/CreateHabitScreen.tsx` (UPDATE with gradient save button)

Add imports:
```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '../constants/typography';
import { BorderRadius, Spacing } from '../constants/spacing';
```

Replace grayscale color options with warm colors (in the level configuration section):
```typescript
// Use WARM_COLOR_OPTIONS instead of GRAYSCALE_OPTIONS
import { WARM_COLOR_OPTIONS } from '../utils/colorUtils';
```

Update save button JSX:
```typescript
<TouchableOpacity
  style={styles.saveButton}
  onPress={handleSave}
  activeOpacity={0.8}
>
  <LinearGradient
    colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  />
  <Text style={styles.saveButtonText}>
    {route.params?.habitId ? 'Update Habit' : 'Create Habit'}
  </Text>
</TouchableOpacity>
```

Key style changes:
```typescript
sectionTitle: {
  fontSize: Typography.fontSize.caption,
  fontWeight: Typography.fontWeight.semibold,
  color: Colors.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: Typography.letterSpacing.wide,
},
textInput: {
  backgroundColor: Colors.cardBackgroundAlt,
  borderColor: Colors.border,
  borderRadius: BorderRadius.button,
  fontSize: Typography.fontSize.bodyLarge,
  padding: 14,
},
iconButton: {
  width: 48,
  height: 48,
  borderRadius: BorderRadius.icon,
  backgroundColor: Colors.cardBackgroundAlt,
  borderWidth: 2,
  borderColor: 'transparent',
},
iconButtonSelected: {
  backgroundColor: Colors.accentLight,
  borderColor: Colors.accent,
},
saveButton: {
  borderRadius: BorderRadius.pill,
  paddingVertical: 16,
  alignItems: 'center',
  overflow: 'hidden',
},
saveButtonText: {
  color: Colors.textOnGradient,
  fontSize: Typography.fontSize.bodyLarge,
  fontWeight: Typography.fontWeight.semibold,
},
```

---

## Files Summary

### New Files to Create (2)
| File | Description |
|------|-------------|
| `src/constants/typography.ts` | Typography system with font families and sizes |
| `src/constants/spacing.ts` | Spacing, border radius, and shadow constants |

### Files to Modify (14)
| File | Key Changes |
|------|-------------|
| `package.json` | (via npx expo install) Add 3 packages |
| `App.tsx` | Font loading, navigator theme, loading screen |
| `src/constants/colors.ts` | Replace entire palette with warm colors |
| `src/utils/colorUtils.ts` | Replace grayscale options with warm colors |
| `src/components/ProgressTile.tsx` | Border radius 6px, warm colors, lavender today |
| `src/components/ProgressGrid.tsx` | Update label colors |
| `src/components/ProgressStatistics.tsx` | Update text colors |
| `src/components/LevelLegend.tsx` | Card shadow, warm colors, larger radius |
| `src/components/DateRangeSelector.tsx` | Warm colors, larger radius |
| `src/components/LevelSelectorModal.tsx` | Border radius 24px, serif title, warm overlay |
| `src/components/HabitCard.tsx` | Shadow (no border), serif name, lavender icon bg |
| `src/components/EmptyState.tsx` | Serif title, gradient CTA button |
| `src/screens/HomeScreen.tsx` | Cream background, gradient FAB |
| `src/screens/HabitDetailScreen.tsx` | Serif name, lavender icon, card sections |
| `src/screens/CreateHabitScreen.tsx` | Warm color picker, gradient save button |

---

## Visual Changes At-a-Glance

| Element | Before | After |
|---------|--------|-------|
| App background | White (#FFFFFF) | Cream (#FFF9F5) |
| Card style | 1px gray border | Soft shadow, no border |
| Border radius | 8-12px | 16-24px (more rounded) |
| Headlines | System font | Playfair Display serif |
| Progress tiles | Grayscale | Warm peach/coral tones |
| Accent color | None | Lavender (#D4C5E8) |
| FAB | Solid black | Peach gradient |
| Save/CTA buttons | Solid black | Peach gradient |
| Today indicator | Black border | Lavender border |
| Icon containers | Light gray | Light lavender |

---

## Testing Checklist

After implementation, verify:

- [ ] App loads without errors (fonts load successfully)
- [ ] All text is readable with good contrast
- [ ] Progress tiles show warm peach/coral colors correctly
- [ ] Gradients render on FAB, save button, and empty state CTA
- [ ] Today's date tile has lavender border
- [ ] Cards have soft shadows (no visible borders)
- [ ] Modals have warm dark overlay
- [ ] Works on iOS, Android, and Web
- [ ] Navigation header uses serif font
- [ ] Level selector modal shows warm color options

---

## Prompt for Future Claude Code Session

```
Please implement the visual redesign for Inkrements as documented in DESIGN_REDESIGN_PLAN.md.

Follow the implementation steps in order:
1. Install packages
2. Create new constants files (typography.ts, spacing.ts)
3. Update colors.ts and colorUtils.ts
4. Update App.tsx with font loading
5. Update all components
6. Update all screens

The document contains complete code snippets for each change.
```
