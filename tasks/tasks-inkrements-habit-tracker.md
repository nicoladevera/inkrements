# Task List: Inkrements Habit Tracker

## Relevant Files

- `App.tsx` or `App.js` - Main application entry point and navigation setup
- `src/screens/HomeScreen.tsx` - Home screen displaying all habits with 4-week grids
- `src/screens/HabitDetailScreen.tsx` - Detail view for individual habit with extended timeframes
- `src/screens/CreateHabitScreen.tsx` - Form for creating/editing habits
- `src/components/HabitCard.tsx` - Compact habit card component for home screen
- `src/components/ProgressGrid.tsx` - Reusable tile-based progress grid component
- `src/components/ProgressTile.tsx` - Individual tile component representing one day
- `src/components/LevelLegend.tsx` - Legend showing level colors and descriptions
- `src/components/DateRangeSelector.tsx` - Date range selector component
- `src/components/ProgressStatistics.tsx` - Statistics display component (e.g., "15/28 days completed")
- `src/components/EmptyState.tsx` - Welcome message and CTA when no habits exist
- `src/components/LevelSelectorModal.tsx` - Modal for selecting progress level when logging
- `src/models/Habit.ts` - Habit data model/interface
- `src/models/Progress.ts` - Progress entry data model/interface
- `src/services/database.ts` - Database initialization and connection
- `src/services/habitService.ts` - CRUD operations for habits
- `src/services/progressService.ts` - CRUD operations for progress entries
- `src/utils/dateUtils.ts` - Date manipulation and formatting utilities
- `src/utils/colorUtils.ts` - Grayscale color scheme utilities
- `src/utils/statisticsUtils.ts` - Progress statistics calculation utilities
- `src/constants/colors.ts` - Grayscale color palette constants
- `src/constants/icons.ts` - Icon set definitions
- `package.json` - Project dependencies and scripts

### Notes

- This is a cross-platform mobile app (React Native recommended based on PRD)
- Initial implementation uses grayscale color scheme only
- Local-first storage using SQLite
- No authentication required for v1
- Testing can be added in future iterations

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/inkrements-habit-tracker`)

- [x] 1.0 Project setup and initialization
  - [x] 1.1 Initialize React Native project using `npx react-native init Inkrements --template react-native-template-typescript`
  - [x] 1.2 Install required dependencies (react-navigation, react-native-sqlite-storage, date-fns, react-native-vector-icons, react-native-gesture-handler, react-native-reanimated)
  - [x] 1.3 Set up project directory structure (src/screens, src/components, src/services, src/models, src/utils, src/constants)
  - [x] 1.4 Configure TypeScript paths and compile options in tsconfig.json
  - [x] 1.5 Set up React Navigation with Stack Navigator for screen navigation
  - [x] 1.6 Create grayscale color palette constants in `src/constants/colors.ts` (#FFFFFF, #CCCCCC, #888888, #444444, #000000)
  - [x] 1.7 Set up icon library (FontAwesome or Material Icons) and create icon constants in `src/constants/icons.ts`

- [x] 2.0 Database schema and storage layer
  - [x] 2.1 Install and link react-native-sqlite-storage
  - [x] 2.2 Create database initialization file `src/services/database.ts` with connection logic
  - [x] 2.3 Define Habits table schema (id, name, icon, tracking_type, levels, display_order, created_at, updated_at)
  - [x] 2.4 Define Progress table schema (id, habit_id, date, level, created_at, updated_at)
  - [x] 2.5 Write database migration/setup function to create tables on first launch
  - [x] 2.6 Add indexes on Progress table (date, habit_id) for query optimization
  - [x] 2.7 Test database connection and table creation

- [x] 3.0 Core data models and services
  - [x] 3.1 Create Habit interface/type in `src/models/Habit.ts` (id, name, icon, trackingType, levels, displayOrder, timestamps)
  - [x] 3.2 Create Progress interface/type in `src/models/Progress.ts` (id, habitId, date, level, timestamps)
  - [x] 3.3 Create Level interface/type for level-based habits (name, colorValue)
  - [x] 3.4 Implement habitService.ts with CRUD operations: createHabit, getHabits, getHabitById, updateHabit, deleteHabit, reorderHabits
  - [x] 3.5 Implement progressService.ts with operations: logProgress, getProgressForHabit, getProgressForDateRange, updateProgress, deleteProgress
  - [x] 3.6 Add query functions for statistics: getCompletionRate, getProgressCountForRange
  - [x] 3.7 Test service functions with mock data

- [x] 4.0 UI components - Progress grid system
  - [x] 4.1 Create ProgressTile component (`src/components/ProgressTile.tsx`) - single tile representing one day with grayscale coloring based on level
  - [x] 4.2 Add tap handler to ProgressTile for logging progress
  - [x] 4.3 Add long-press handler to ProgressTile for editing/deleting progress
  - [x] 4.4 Create ProgressGrid component (`src/components/ProgressGrid.tsx`) - renders 7-column weekly grid layout
  - [x] 4.5 Implement grid logic to organize dates into weeks (Sunday-Saturday format, most recent week at top)
  - [x] 4.6 Add column headers (S, M, T, W, T, F, S) to ProgressGrid
  - [x] 4.7 Add month indicators at the start of each month row in ProgressGrid
  - [x] 4.8 Make ProgressGrid configurable for different date ranges (4, 8, 12, 26, 52 weeks)
  - [x] 4.9 Optimize grid rendering for performance (memoization, efficient re-renders)

- [x] 5.0 UI components - Habit cards and lists
  - [x] 5.1 Create HabitCard component (`src/components/HabitCard.tsx`) - displays habit icon, name, and compact 4-week grid
  - [x] 5.2 Add tap handler to HabitCard to navigate to detail screen
  - [x] 5.3 Style HabitCard with grayscale wireframe aesthetic (borders, spacing, clear typography)
  - [x] 5.4 Create EmptyState component (`src/components/EmptyState.tsx`) with welcoming message and "Create Your First Habit" button
  - [x] 5.5 Create LevelLegend component (`src/components/LevelLegend.tsx`) - shows color swatches with level descriptions
  - [x] 5.6 Create DateRangeSelector component (`src/components/DateRangeSelector.tsx`) - dropdown/segmented control for timeframe selection
  - [x] 5.7 Create ProgressStatistics component (`src/components/ProgressStatistics.tsx`) - displays "X/Y days completed" text
  - [x] 5.8 Create LevelSelectorModal component (`src/components/LevelSelectorModal.tsx`) - modal for selecting progress level when logging

- [x] 6.0 Home screen implementation
  - [x] 6.1 Create HomeScreen component (`src/screens/HomeScreen.tsx`) with basic structure
  - [x] 6.2 Fetch all habits from database using habitService on screen mount
  - [x] 6.3 Display EmptyState component when no habits exist
  - [x] 6.4 Render scrollable list of HabitCard components when habits exist
  - [x] 6.5 Fetch 4-week progress data for each habit to display in cards
  - [x] 6.6 Add floating action button (FAB) or header button to navigate to CreateHabitScreen
  - [x] 6.7 Implement pull-to-refresh functionality to reload habits and progress
  - [x] 6.8 Add navigation handler to open HabitDetailScreen when card is tapped
  - [x] 6.9 Ensure HomeScreen is set as initial route in navigation stack

- [x] 7.0 Habit detail screen implementation
  - [x] 7.1 Create HabitDetailScreen component (`src/screens/HabitDetailScreen.tsx`) receiving habitId as route param
  - [x] 7.2 Fetch habit details and progress data for default 12-week range on mount
  - [x] 7.3 Display habit name and icon at the top of the screen
  - [x] 7.4 Render ProgressStatistics component showing completion rate
  - [x] 7.5 Render LevelLegend component for level-based habits
  - [x] 7.6 Render large ProgressGrid component with 12-week default view
  - [x] 7.7 Render DateRangeSelector with options (4, 8, 12, 26, 52 weeks) and default to 12 weeks
  - [x] 7.8 Implement date range change handler to refetch progress and update grid dynamically
  - [x] 7.9 Update statistics when date range changes
  - [x] 7.10 Add header button to navigate to edit habit screen
  - [x] 7.11 Add delete habit option with confirmation dialog

- [x] 8.0 Create/Edit habit screen implementation
  - [x] 8.1 Create CreateHabitScreen component (`src/screens/CreateHabitScreen.tsx`) supporting both create and edit modes
  - [x] 8.2 Add text input field for habit name with validation (required)
  - [x] 8.3 Create icon picker UI displaying available icons from icon library in a grid
  - [x] 8.4 Add tracking type toggle/selector (Binary vs Level-based)
  - [x] 8.5 Conditionally show level configuration section for level-based habits
  - [x] 8.6 Add UI to define 2-3 levels with name and grayscale color selection for level-based habits
  - [x] 8.7 For binary habits, set default "completed" color to medium gray (#888888)
  - [x] 8.8 Implement form validation (habit name required, levels configured for level-based)
  - [x] 8.9 Add save button that creates/updates habit via habitService
  - [x] 8.10 Navigate back to HomeScreen (or HabitDetailScreen if editing) after successful save
  - [x] 8.11 Handle error states and display appropriate error messages

- [x] 9.0 Progress logging functionality
  - [x] 9.1 Implement date validation utility to check if date is today or any past date (allow logging), and prevent future dates
  - [x] 9.2 Handle ProgressTile tap event to open LevelSelectorModal (for level-based) or directly log (for binary)
  - [x] 9.3 In LevelSelectorModal, display available levels for the habit with color swatches and descriptions
  - [x] 9.4 Save progress entry via progressService when level is selected or binary habit is tapped
  - [x] 9.5 Update ProgressGrid UI immediately after logging to reflect new progress
  - [x] 9.6 Implement long-press handler on ProgressTile to show edit/delete options
  - [x] 9.7 Create edit dialog/modal to change progress level for existing entries
  - [x] 9.8 Implement delete functionality with confirmation for existing progress entries
  - [x] 9.9 Handle edge cases (logging on already-logged dates, validation errors)
  - [x] 9.10 Ensure progress timestamps use correct date (midnight to 11:59 PM definition)

- [x] 10.0 Habit reordering functionality
  - [x] 10.1 Integrate react-native-gesture-handler and react-native-reanimated for drag-and-drop
  - [x] 10.2 Wrap habit list in HomeScreen with draggable list component (e.g., react-native-draggable-flatlist)
  - [x] 10.3 Enable long-press and drag interaction on HabitCard components
  - [x] 10.4 Add visual feedback during drag (elevation, opacity change)
  - [x] 10.5 Update display_order field in database when reordering is complete
  - [x] 10.6 Persist new order via habitService.reorderHabits
  - [x] 10.7 Ensure habit order persists across app restarts
  - [x] 10.8 Test reordering with multiple habits (edge cases: first, last, middle positions)

- [x] 11.0 Polish and final integration
  - [x] 11.1 Implement dateUtils.ts functions (getCurrentDate, isToday, getWeeksAgo, formatDate, getDayOfWeek, getWeekDates)
  - [x] 11.2 Implement statisticsUtils.ts for calculating completion rates based on progress data
  - [x] 11.3 Add consistent grayscale styling across all screens (background colors, text colors, borders)
  - [x] 11.4 Ensure all tap targets meet minimum size requirements (44x44 points) for usability
  - [x] 11.5 Add visual feedback for all interactive elements (buttons, tiles, cards) - opacity/scale on press
  - [x] 11.6 Test app flow from start to finish: create habit → log progress → view detail → reorder → edit habit → delete progress
  - [x] 11.7 Handle app state management (loading states, empty states, error states)
  - [x] 11.8 Test data persistence by closing and reopening app multiple times
  - [x] 11.9 Optimize performance: check for unnecessary re-renders, optimize large grid rendering
  - [x] 11.10 Test with multiple habits (5-10) and various date ranges to ensure smooth scrolling
  - [x] 11.11 Add proper TypeScript types throughout the codebase, fix any type errors
  - [x] 11.12 Review PRD requirements (all 49 functional requirements) and verify each is implemented

