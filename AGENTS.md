# AGENTS.md

A comprehensive guide for AI agents and developers working with the Inkrements habit-tracking application.

---

## 1. Tech Stack & Dependencies

### Core Framework
- **React Native**: 0.81.5 (Expo SDK 54)
- **React**: 19.1.0
- **React DOM**: 19.1.0 (for web)
- **TypeScript**: 5.9.2 (strict mode enabled)
- **Expo SDK**: ~54.0.30
- **Node.js**: 18+ required

### Navigation & Routing
- **@react-navigation/native**: ^7.1.26
- **@react-navigation/native-stack**: ^7.9.0
- **react-native-screens**: ~4.16.0
- **react-native-safe-area-context**: ^5.6.2

### Data Persistence
- **Mobile (iOS/Android)**: expo-sqlite ^16.0.10 (SQLite database)
- **Web**: @react-native-async-storage/async-storage 2.2.0

### UI & Styling
- **Icons**: @expo/vector-icons ^15.0.3 (MaterialCommunityIcons)
- **Fonts**: @expo-google-fonts/playfair-display ^0.4.2
- **Gradients**: expo-linear-gradient ~15.0.8
- **Font Loading**: expo-font ~14.0.10

### Utilities
- **Date Handling**: date-fns ^4.1.0
- **Web Support**: react-native-web ^0.21.0

### Build & Deployment
- **EAS CLI**: >= 13.2.0 (global installation required)
- **Build Configuration**: eas.json with development, preview, and production profiles
- **Platform Support**: iOS, Android, Web

### Environment Requirements
- **Node.js**: 18 or higher
- **Xcode**: Required for iOS Simulator (macOS only)
- **Android Studio**: Required for Android Emulator
- **Expo Go App**: For physical device testing
- **Apple Developer Account**: Optional ($99/year for ad-hoc distribution)

---

## 2. Project Structure

### Architecture Pattern
**Layered Architecture** with clear separation of concerns:

```
├── Presentation Layer (screens/ + components/)
├── Business Logic Layer (services/)
├── Data Access Layer (database.ts)
└── Model Layer (models/)
```

### Directory Structure

```
inkrements/
├── index.ts                          # Expo root component registration
├── App.tsx                           # Navigation setup, font loading, DB init
├── app.json                          # Expo configuration (bundle IDs, icons)
├── eas.json                          # EAS Build profiles (dev, preview, prod)
├── package.json                      # Dependencies and npm scripts
├── tsconfig.json                     # TypeScript config (strict mode, path aliases)
│
├── assets/                           # Static files (NOT code)
│   ├── icon.png                      # App icon (1024x1024)
│   ├── adaptive-icon.png             # Android adaptive icon
│   ├── splash-icon.png               # Splash screen
│   ├── favicon.png                   # Web favicon
│   └── app-overview.png              # Marketing screenshot
│
├── docs/                             # Project documentation
│   ├── DEPLOYMENT.md                 # EAS Build guide
│   ├── MOBILE_TESTING.md             # Testing strategies
│   └── REDESIGN_PLAN.md              # Design implementation plan
│
├── src/                              # Application source code (~4,274 lines)
│   ├── components/                   # Reusable presentational components
│   │   ├── DateRangeSelector.tsx     # Dropdown for 4-52 week ranges
│   │   ├── EmptyState.tsx            # New user welcome screen
│   │   ├── HabitCard.tsx             # Habit card for home screen list
│   │   ├── LevelLegend.tsx           # Color legend for level-based habits
│   │   ├── LevelSelectorModal.tsx    # Modal to select progress level
│   │   ├── ProgressGrid.tsx          # 7-column weekly grid visualization
│   │   ├── ProgressStatistics.tsx    # Completion rate display
│   │   └── ProgressTile.tsx          # Individual day tile (single cell)
│   │
│   ├── constants/                    # Design tokens (DO NOT hardcode values)
│   │   ├── colors.ts                 # Warm palette (peach, coral, lavender)
│   │   ├── icons.ts                  # MaterialCommunityIcons mapping
│   │   ├── spacing.ts                # Spacing, shadows, border radius
│   │   └── typography.ts             # Font families and text styles
│   │
│   ├── models/                       # TypeScript interfaces
│   │   ├── Habit.ts                  # Habit data model
│   │   └── Progress.ts               # Progress entry model
│   │
│   ├── screens/                      # Container components (manage state)
│   │   ├── CreateHabitScreen.tsx     # Create/edit habit form (modal)
│   │   ├── HabitDetailScreen.tsx     # Habit detail view with full grid
│   │   └── HomeScreen.tsx            # Main dashboard with habit list
│   │
│   ├── services/                     # Business logic & data access (CRITICAL)
│   │   ├── database.ts               # Platform-agnostic DB initialization
│   │   ├── habitService.ts           # Habit CRUD operations
│   │   └── progressService.ts        # Progress CRUD operations
│   │
│   └── utils/                        # Helper functions
│       ├── colorUtils.ts             # Color manipulation utilities
│       ├── dateUtils.ts              # Date formatting (uses date-fns)
│       ├── greetingUtils.ts          # Time-based greeting logic
│       └── statisticsUtils.ts        # Completion rate calculations
│
├── tasks/                            # Project planning documents
│   ├── prd-inkrements-habit-tracker.md
│   └── tasks-inkrements-habit-tracker.md
│
└── rules/                            # AI prompt templates
```

### Key Architectural Patterns

1. **Repository/Service Pattern**
   - All database operations go through `habitService.ts` and `progressService.ts`
   - Never access database.ts directly from screens/components
   - Services return Promises for async operations

2. **Platform-Agnostic Data Layer**
   - `database.ts` detects platform (`Platform.OS`)
   - Mobile: Uses SQLite (expo-sqlite)
   - Web: Uses AsyncStorage + in-memory Map
   - Same API across all platforms

3. **Container/Presentational Components**
   - **Screens**: Manage state, handle navigation, call services
   - **Components**: Receive props, render UI, emit callbacks
   - Heavy use of `React.memo()` for performance

4. **Design Token System**
   - All colors, spacing, typography defined in `src/constants/`
   - Never hardcode `#fff` or `16` values in components
   - Import from constants for consistency

5. **Navigation Structure**
   - Native Stack Navigator (no animations library)
   - Routes: `Home`, `HabitDetail`, `CreateHabit` (modal)
   - Type-safe routing with `RootStackParamList`

---

## 3. Development Commands

### Package Manager
This project uses **npm** (not yarn or pnpm).

### Setup & Installation

```bash
# Clone the repository
git clone https://github.com/your-username/inkrements.git
cd inkrements

# Install dependencies
npm install

# IMPORTANT: For Expo packages, ALWAYS use:
npx expo install <package-name>
# This ensures SDK-compatible versions
```

### Development Server

```bash
# Start Metro bundler (development server)
npm start
# Then press 'i' for iOS, 'a' for Android, 'w' for Web

# Platform-specific shortcuts
npm run ios        # Start iOS Simulator directly
npm run android    # Start Android Emulator directly
npm run web        # Start web browser directly

# Clear cache (fixes many errors)
npx expo start --clear

# Tunnel mode (for network issues)
npx expo start --tunnel

# LAN mode (explicit local network)
npx expo start --lan
```

### Building & Deployment

```bash
# Install EAS CLI globally (one-time setup)
npm install -g eas-cli

# Login to Expo account
eas login

# Register device for ad-hoc distribution
eas device:create

# Build for iOS
eas build --platform ios --profile production
eas build --platform ios --profile preview
eas build --platform ios --profile development

# Build for Android
eas build --platform android --profile production

# View build history
eas build:list

# View specific build details
eas build:view [build-id]

# Clear cache and rebuild (troubleshooting)
eas build --platform ios --profile production --clear-cache
```

### TypeScript

```bash
# Type check (no emit)
npx tsc --noEmit

# Watch mode for type checking
npx tsc --noEmit --watch
```

### Testing

**Note**: This project currently has **no automated testing framework** configured. Testing is manual.

```bash
# Manual testing via Expo Go (physical device)
npm start → scan QR code

# iOS Simulator testing (macOS only)
npm run ios
# or: npm start → press 'i'

# Android Emulator testing
npm run android
# or: npm start → press 'a'

# Web browser testing
npm run web
# or: npm start → press 'w'
```

**To add testing** (not currently configured):
```bash
# If you want to add Jest
npx expo install jest-expo jest
npm install --save-dev @testing-library/react-native
```

### Debugging

```bash
# Reload app
# - Physical device: Shake device
# - iOS Simulator: Cmd + R
# - Android: R (press twice)

# Open developer menu
# - Physical device: Shake device
# - iOS Simulator: Cmd + D
# - Android: Cmd/Ctrl + M

# Check for TypeScript errors
npx tsc --noEmit
```

---

## 4. Testing Strategy

### Current Testing Approach
**Manual Testing Only** - No automated test suite configured.

### Testing Environments

#### 1. Expo Go (Primary - Recommended)
**Best for**: Daily development, rapid iteration

```bash
# Start dev server
npm start

# iOS: Open Camera → Scan QR → Tap notification
# Android: Open Expo Go → Scan QR
```

**Pros**:
- Instant hot reload
- Real device performance
- No build time

**Cons**:
- Limited to Expo Go's native module versions
- Cannot use packages requiring custom native code

**Compatibility Note**: This project is **100% Expo Go compatible** by design. It intentionally avoids animation libraries (react-native-reanimated, react-native-gesture-handler) to maintain Expo Go compatibility.

#### 2. iOS Simulator (Quick Iteration)
**Best for**: UI adjustments, screen size testing (macOS only)

```bash
npm run ios
# or: npm start → press 'i'
```

**Shortcuts**:
- `Cmd + R`: Reload
- `Cmd + D`: Dev menu
- `Cmd + K`: Toggle keyboard

#### 3. Android Emulator
**Best for**: Android-specific testing

```bash
npm run android
# or: npm start → press 'a'
```

**Setup**: Requires Android Studio with emulator configured.

#### 4. Custom Development Client (Advanced)
**When to use**:
- Testing packages incompatible with Expo Go
- Worklets version mismatch errors
- Native module conflicts

```bash
# Install expo-dev-client
npx expo install expo-dev-client

# Build custom client (5-10 min first time)
npx expo run:ios      # iOS
npx expo run:android  # Android
```

**Trade-offs**:
- Initial build time
- Must rebuild when native dependencies change
- Requires Xcode/Android Studio

### What to Test

**Critical User Flows**:
1. Create a new habit (binary and level-based)
2. Log progress for today
3. Edit/delete existing progress (long-press)
4. View different date ranges (4-52 weeks)
5. Edit and delete habits
6. Empty state for new users

**Platform-Specific Checks**:
- Touch target sizes (44x44 minimum on iOS)
- Gesture behaviors (swipe, long-press)
- Font rendering differences
- Safe area handling (notches, home indicators)
- Scroll momentum and physics

**Data Persistence**:
- Verify SQLite database on mobile
- Verify AsyncStorage on web
- Test app restart (data should persist)
- Test device restart

### Testing Checklist

```
□ Touch targets are large enough (44x44 minimum)
□ Gestures feel natural (swipe, long-press)
□ Scrolling is smooth with proper momentum
□ Content has breathing room on small screens
□ Font sizes are readable
□ Content avoids notches and safe areas
□ App is responsive to interactions
□ Data persists across app restarts
□ Empty states display correctly for new users
```

### Known Testing Limitations

**Packages Known to Break Expo Go**:
- `react-native-draggable-flatlist` v4.x (requires Worklets 0.7.x, Expo Go has 0.5.x)

**Solution**: Use custom dev client or avoid these packages.

### Debugging Common Issues

See `docs/MOBILE_TESTING.md` for comprehensive troubleshooting, including:
- Worklets version mismatch errors
- Connection issues (Expo Go)
- Simulator won't open
- App crashes on launch
- Hot reload not working
- Package compatibility errors

---

## 5. Code Style & Standards

### TypeScript Configuration

**Strict Mode Enabled** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**Path Aliases**:
```typescript
// Use: import { colors } from '@/constants/colors'
// NOT: import { colors } from '../../../constants/colors'

// Configured in tsconfig.json:
// "@/*": ["src/*"]
```

### Naming Conventions

**Files**:
- Components/Screens: `PascalCase.tsx` (e.g., `HabitCard.tsx`)
- Services/Utils: `camelCase.ts` (e.g., `habitService.ts`)
- Constants: `camelCase.ts` (e.g., `colors.ts`)
- Models: `PascalCase.ts` (e.g., `Habit.ts`)

**Variables & Functions**:
- Variables: `camelCase` (e.g., `habitId`, `completionRate`)
- Functions: `camelCase` (e.g., `getHabits`, `logProgress`)
- Components: `PascalCase` (e.g., `HabitCard`, `ProgressGrid`)
- Constants: `SCREAMING_SNAKE_CASE` for true constants (e.g., `MAX_WEEKS`)
- Interfaces: `PascalCase` (e.g., `Habit`, `Progress`)

**React Patterns**:
- Use functional components (no class components)
- Prefer `React.memo()` for presentational components
- Use hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)
- Extract custom hooks for reusable logic

### Linting & Formatting

**Current State**: No ESLint or Prettier configured.

**If you want to add linting** (recommended):
```bash
# Install ESLint + Prettier
npm install --save-dev eslint prettier eslint-config-prettier
npx expo install eslint-config-expo

# Create .eslintrc.js
{
  "extends": "expo",
  "rules": {
    // Add custom rules
  }
}

# Create .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Import Organization

**Recommended Order** (not enforced):
1. React/React Native imports
2. Third-party libraries
3. Navigation imports
4. Local components
5. Services
6. Utils/Constants
7. Models/Types

**Example**:
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HabitCard from '@/components/HabitCard';
import { getHabits } from '@/services/habitService';
import { formatDate } from '@/utils/dateUtils';
import { colors } from '@/constants/colors';
import { Habit } from '@/models/Habit';
```

### Component Structure

**Preferred Pattern**:
```typescript
// 1. Imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Type definitions
interface Props {
  title: string;
  onPress: () => void;
}

// 3. Component (with React.memo if presentational)
const MyComponent = React.memo<Props>(({ title, onPress }) => {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Event handlers
  const handlePress = () => {
    onPress();
  };

  // 6. Render
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
});

// 7. Styles (using StyleSheet.create)
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

// 8. Export
export default MyComponent;
```

### Design Token Usage

**ALWAYS use constants** from `src/constants/`:

```typescript
// ✅ CORRECT
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
  },
  title: {
    ...typography.heading1,
    color: colors.text.primary,
  },
});

// ❌ WRONG - Never hardcode values
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF5F0',  // NO!
    padding: 16,                 // NO!
    borderRadius: 12,            // NO!
  },
});
```

### Database Access Pattern

**ALWAYS use service layer**:

```typescript
// ✅ CORRECT - Use service methods
import { getHabits, createHabit } from '@/services/habitService';

const habits = await getHabits();
await createHabit(habitData);

// ❌ WRONG - Never access database.ts directly from screens
import { db } from '@/services/database';
const result = await db.runAsync('SELECT * FROM habits');
```

### Async/Await Pattern

**Preferred**: Use `async/await` over `.then()` chains

```typescript
// ✅ CORRECT
const loadHabits = async () => {
  try {
    const habits = await getHabits();
    setHabits(habits);
  } catch (error) {
    console.error('Failed to load habits:', error);
  }
};

// ❌ WRONG
getHabits()
  .then((habits) => setHabits(habits))
  .catch((error) => console.error(error));
```

---

## 6. Boundaries & Constraints

### NEVER Modify or Commit

#### Secrets & Credentials
**CRITICAL - These files contain sensitive information:**
```
❌ .env*.local          # Local environment variables
❌ *.key                # Private keys
❌ *.p8                 # Apple AuthKey files
❌ *.p12                # Certificates
❌ *.mobileprovision    # iOS provisioning profiles
❌ *.keystore           # Android keystores
❌ *.jks                # Android signing keys
❌ *.pem                # SSL certificates
```

**If accidentally committed**: Immediately revoke credentials and rotate keys.

#### Generated/Build Artifacts
```
❌ node_modules/        # Dependencies (use package.json)
❌ .expo/               # Expo cache
❌ .expo-shared/        # Expo shared data
❌ dist/                # Build output
❌ web-build/           # Web build output
❌ .metro-health-check* # Metro bundler cache
❌ *.tsbuildinfo        # TypeScript incremental build info
❌ coverage/            # Test coverage reports
```

#### IDE & System Files
```
❌ .DS_Store            # macOS finder metadata
❌ .vscode/             # VS Code settings (personal preference)
❌ .idea/               # JetBrains IDE settings
❌ *.sublime-*          # Sublime Text settings
❌ *.swp, *.swo, *~     # Vim swap files
```

#### Logs & Debug Files
```
❌ logs/
❌ *.log
❌ npm-debug.*
❌ yarn-debug.*
❌ yarn-error.*
```

### Protected Files - Modify with Caution

**app.json** - Changes affect all platforms:
```json
{
  "expo": {
    "name": "Inkrements",           // App name
    "slug": "Inkrements",            // Expo URL slug
    "version": "1.0.0",              // Increment on updates
    "ios": {
      "bundleIdentifier": "com.nicoladevera.inkrements"  // MUST be unique
    },
    "android": {
      // Bundle ID must be unique
    }
  }
}
```

**CRITICAL**: If forking this project, change `bundleIdentifier` to avoid conflicts.

**eas.json** - Build configuration:
```json
{
  "build": {
    "production": {
      "distribution": "internal",  // "internal" or "store"
      // Changing this affects how builds are signed
    }
  }
}
```

**package.json** - Dependency management:
- Use `npx expo install` for Expo packages (ensures SDK compatibility)
- Never manually edit `version` fields in dependencies
- Check Expo SDK compatibility before adding packages

### Database Schema - Handle with Care

**SQLite tables** (defined in `src/services/database.ts`):

```sql
-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  trackingType TEXT,  -- 'binary' or 'level'
  levels TEXT,        -- JSON array
  createdAt TEXT
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  habitId TEXT NOT NULL,
  date TEXT NOT NULL,
  level INTEGER,
  FOREIGN KEY (habitId) REFERENCES habits(id)
);
```

**Migration Strategy**:
- Currently no migration system
- Changing schema requires manual database reset (data loss)
- Consider adding migrations before making schema changes

### Platform-Specific Constraints

#### Expo Go Limitations
**Cannot use packages with custom native code:**
- ❌ react-native-draggable-flatlist v4.x (Worklets version conflict)
- ❌ react-native-reanimated (version mismatch with Expo SDK 54)
- ❌ Any package requiring Xcode/Android Studio modifications

**If you need these**: Switch to custom dev client (`expo-dev-client`)

#### iOS Specific
- App icons must be 1024x1024 (no alpha channel)
- Bundle identifier must be unique (format: `com.yourname.appname`)
- Safe area insets required for notched devices

#### Android Specific
- Adaptive icon required (foreground + background)
- Package name must be unique (format: `com.yourname.appname`)
- Edge-to-edge mode enabled in app.json

### Performance Constraints

**React Native Limitations**:
- Avoid large lists without virtualization (use `FlatList`, not `ScrollView`)
- Heavy computations should use `useMemo()`
- Memoize components with `React.memo()`
- Debounce rapid state updates

**Database Performance**:
- SQLite queries are synchronous on main thread (use `runAsync`)
- Avoid N+1 queries (fetch all habits, then all progress in one query)
- Index frequently queried columns if dataset grows

### Design System Constraints

**Color Palette** (defined in `src/constants/colors.ts`):
- Warm color scheme (peach, coral, lavender, blue)
- 9 predefined level colors for habits
- DO NOT add random colors - extend the palette in constants

**Typography** (defined in `src/constants/typography.ts`):
- Playfair Display for headings (serif)
- System fonts for body text
- Predefined sizes: xl, lg, md, sm, xs

**Spacing** (defined in `src/constants/spacing.ts`):
- xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48
- Border radius: sm: 8, md: 12, lg: 16

### Deprecated Patterns - DO NOT USE

**Class Components**:
```typescript
// ❌ WRONG - No class components
class MyComponent extends React.Component {
  render() {
    return <View />;
  }
}

// ✅ CORRECT - Use functional components
const MyComponent = () => {
  return <View />;
};
```

**Inline Styles**:
```typescript
// ❌ WRONG - Avoid inline styles
<View style={{ padding: 16, backgroundColor: '#FFF5F0' }} />

// ✅ CORRECT - Use StyleSheet.create
const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background.primary,
  },
});
<View style={styles.container} />
```

**Direct Database Access**:
```typescript
// ❌ WRONG
import { db } from '@/services/database';
const habits = await db.getAllAsync('SELECT * FROM habits');

// ✅ CORRECT
import { getHabits } from '@/services/habitService';
const habits = await getHabits();
```

---

## 7. Git Workflow

### Branching Strategy

**Primary Branch**: `main`
- All production-ready code lives here
- Direct commits allowed for this personal project
- Feature branches recommended for large changes

**Feature Branches** (recommended for significant work):
```bash
# Create feature branch
git checkout -b feature/add-dark-mode

# Work on feature...

# Merge back to main
git checkout main
git merge feature/add-dark-mode
```

### Commit Message Conventions

**Format**: `<type>: <description>`

**Types**:
- `feat:` - New feature (e.g., "feat: add dark mode toggle")
- `fix:` - Bug fix (e.g., "fix: resolve SQLite crash on iOS")
- `docs:` - Documentation only (e.g., "docs: update README with setup instructions")
- `chore:` - Maintenance tasks (e.g., "chore: update dependencies")
- `refactor:` - Code refactoring (no behavior change)
- `style:` - Code style/formatting (no logic change)
- `test:` - Adding or updating tests
- `perf:` - Performance improvements

**Examples** (from recent commits):
```
docs: update app overview screenshot
docs: add app overview screenshot to README
chore: update version to 2.0
feat: Add habit descriptions, custom binary colors, and UI improvements (#5)
```

**Guidelines**:
- Use lowercase after colon
- Keep under 72 characters
- Use imperative mood ("add" not "added")
- Reference PR numbers with `(#123)` if applicable

### Pull Request Workflow

**Creating PRs**:
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature

# Create PR on GitHub
```

**PR Naming**: Same convention as commits
```
feat: Add drag-and-drop habit reordering
fix: Resolve SQLite crash on Android
docs: Update MOBILE_TESTING.md with new troubleshooting steps
```

**Recent PR Examples**:
- `#7` - Enhance welcome screen with decorative tile grid and updated branding
- `#6` - chore: add app icon, EAS build config, and organize documentation
- `#5` - feat: Add habit descriptions, custom binary colors, and UI improvements

### Pre-commit Hooks

**Current State**: No active pre-commit hooks (only sample hooks in `.git/hooks/`)

**Recommended Hooks** (if you want to add them):
```bash
# Install husky for git hooks
npm install --save-dev husky
npx husky install

# Add pre-commit hook for type checking
npx husky add .git/hooks/pre-commit "npx tsc --noEmit"

# Add pre-commit hook for linting (if ESLint configured)
npx husky add .git/hooks/pre-commit "npx eslint src/"
```

### Automated Checks

**None currently configured.**

**Recommended CI/CD** (future enhancement):
- GitHub Actions for TypeScript type checking
- Automated builds on PR creation
- Test suite (when tests are added)

### Version Management

**Version Locations**:
1. `package.json` → `"version": "2.0.0"`
2. `app.json` → `"expo.version": "1.0.0"`

**When to Increment**:
- **Major** (1.0.0 → 2.0.0): Breaking changes, complete redesigns
- **Minor** (1.0.0 → 1.1.0): New features, backward-compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes, minor tweaks

**Before Building for Production**:
```bash
# Update versions
# 1. Edit package.json: "version": "2.0.1"
# 2. Edit app.json: "expo.version": "2.0.1"

# Commit version bump
git add package.json app.json
git commit -m "chore: bump version to 2.0.1"

# Tag release
git tag v2.0.1
git push origin main --tags

# Build
eas build --platform ios --profile production
```

### .gitignore Coverage

**Already Ignored** (see `.gitignore`):
- ✅ node_modules/
- ✅ .expo/, .expo-shared/
- ✅ dist/, web-build/
- ✅ *.key, *.p8, *.keystore (credentials)
- ✅ .env*.local
- ✅ .DS_Store, .vscode/, .idea/
- ✅ *.log

**Not Ignored** (intentionally tracked):
- ✅ package-lock.json (ensures reproducible builds)
- ✅ app.json (required for Expo)
- ✅ eas.json (required for builds)
- ✅ tsconfig.json (TypeScript configuration)
- ✅ assets/ (app icons, splash screens)

### Collaboration Guidelines

**For Personal Use**:
- Direct commits to `main` are acceptable
- Tag releases with version numbers

**For Team Collaboration**:
- Use feature branches for all work
- Require PR reviews before merging
- Run type checks before pushing (`npx tsc --noEmit`)
- Test on both iOS and Android before merging

---

## Summary for AI Agents

**This is a cross-platform habit-tracking mobile app** built with React Native + Expo.

**Critical Constraints**:
1. 100% Expo Go compatible (avoid custom native modules)
2. Use service layer for all database access
3. Use design tokens from constants (never hardcode)
4. TypeScript strict mode (handle all type errors)
5. Never commit secrets/credentials

**Before Making Changes**:
1. Read relevant files (screens, components, services)
2. Check TypeScript types in `src/models/`
3. Follow existing patterns (service layer, React hooks)
4. Test on iOS Simulator + Android Emulator
5. Run `npx tsc --noEmit` to verify types

**Common Tasks**:
- Add feature → Create service method → Update screen → Add types
- Change UI → Import from constants → Update StyleSheet
- Fix bug → Check service layer → Add error handling
- Update dependency → Use `npx expo install <package>` → Test compatibility

**Documentation**:
- Mobile testing: `docs/MOBILE_TESTING.md`
- Deployment: `docs/DEPLOYMENT.md`
- Design plan: `docs/REDESIGN_PLAN.md`

---

**Version**: 2.0.0 (Modern Wellness Design)
**Last Updated**: 2025-12-28
