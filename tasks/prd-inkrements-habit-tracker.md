# Product Requirements Document: Inkrements Habit Tracker

## Introduction/Overview

**Inkrements** is a personal habit-tracking application inspired by GitHub's tile-based contribution graph. The name is a wordplay combining "increments" (signaling gradual progress) and "ink" (signaling the act of jotting things down). 

This app allows users to create custom habits, track daily progress with varying intensity levels, and visualize their consistency over time through an intuitive grid interface. The primary goal is to provide a simple, focused tool for personal habit tracking with rich historical data visualization spanning days, months, and years.

**Problem Statement:** Many habit trackers are either too complex with excessive features or too simple without meaningful progress visualization. Users need a clean, visual way to track habits with optional granularity (binary vs. level-based) while maintaining a complete historical record.

## Goals

1. Enable users to create and manage multiple custom habits with personalized icons and names
2. Provide an intuitive tile-based daily progress tracker for each habit
3. Support both binary (yes/no) and level-based (varying intensity) progress tracking
4. Allow users to visualize their habit consistency over various timeframes (30 days, 45 days, 6 months, full year)
5. Ensure data persistence across app sessions with local-first storage
6. Create a functional, wireframe-style interface (grayscale) for initial iterations to prioritize functionality over design

## User Stories

**As a user, I want to:**

1. Create a new habit with a custom name, icon, and color scheme so I can personalize my tracking experience
2. Choose whether a habit is binary (done/not done) or level-based (varying intensities) so I can track different types of activities appropriately
3. Define up to 3 custom levels for level-based habits with associated colors/shades so I can track intensity (e.g., 15min, 30min, 60+ min reading)
4. Mark my progress for today or backfill missed entries from any past date so I can maintain accurate tracking even if I forget to log immediately
5. View a tile-based grid showing my progress for a selected timeframe (4/8/12/26/52 weeks) so I can visualize my consistency patterns
6. See all my habits in one scrollable home screen view with their individual progress grids (defaulted to last 4 weeks) so I can get a quick overview of my tracking
7. Click into any habit to view a detailed page with extended timeframe options so I can analyze longer-term patterns
8. Edit or delete any past progress entry so I can correct mistakes or update inaccurate logs
9. Have my progress data automatically saved locally so I never lose my tracking history
10. Optionally enable cloud backup so I can protect my data or sync across multiple devices in the future
11. Use the app without internet connectivity since my data is stored locally on my device

## Functional Requirements

### Habit Management

1. The system must allow users to create a new habit with the following properties:
   - Habit name (text, required)
   - Habit icon (selectable from a predefined icon set)
   - Tracking type: Binary or Level-based (required)
   
2. For level-based habits, the system must allow users to define 2-3 custom levels where each level includes:
   - Level name/description (e.g., "15 minutes", "30 minutes", "60+ minutes")
   - Color/shade value (grayscale for initial version: light gray, medium gray, dark gray)
   
3. For binary habits, the system must use a simple done/not done state with a single "completed" color (medium gray for initial version)

4. The system must display a level legend in the habit detail view that shows:
   - Each level's shade/color
   - The corresponding level name/description
   - For binary habits: "Completed" label with its color
   
5. The system must allow users to edit existing habit properties (name, icon, levels, colors)

6. The system must allow users to delete a habit and all associated progress data (with confirmation prompt)

7. The system must display all created habits in a scrollable list/dashboard view

8. The system must allow unlimited habit creation (no maximum limit)

9. The system must allow users to manually reorder habits on the home screen (drag and drop or similar interaction)

10. The system must persist the user's custom habit order across app sessions

### Progress Tracking

11. The system must automatically detect and display the current date without user input

12. The system must define "today" as the current calendar day from midnight (12:00 AM) to 11:59 PM

13. The system must allow users to mark progress for today's date for any habit

14. The system must allow users to backfill progress for any past date

15. The system must prevent users from marking progress for future dates

16. For level-based habits, the system must display the available levels and allow users to select one when logging progress

17. For binary habits, the system must provide a simple "mark as done" action

18. The system must allow users to edit any previously logged progress entry (change level or mark as incomplete)

19. The system must allow users to delete any previously logged progress entry

20. The system must not require marking "not done" explicitly - unfilled dates remain empty/untracked

### Progress Visualization

21. The system must display a tile-based grid for each habit showing daily progress

22. Each tile in the grid must represent one day

23. The grid must be organized in a weekly format with 7 columns representing days of the week (Sunday through Saturday)

24. The grid must display weeks as rows, with the most recent week at the top

25. Tiles must be colored according to the progress level logged (grayscale shading for initial version)

26. Empty/untracked tiles must appear as the background color or a distinct "no data" state

27. **Home Screen View**: The system must display all habits on one scrollable page, each showing:
   - Habit name and icon
   - Progress grid defaulted to the last 4 weeks (4 rows × 7 columns)
   
28. **Home Screen Empty State**: When no habits exist, the system must display:
   - A welcoming, encouraging message
   - A clear call-to-action button to create the first habit
   - Example: "Ready to build better habits? 🌱 Let's start your journey!" with a "Create Your First Habit" button
   
29. **Detail View**: The system must allow users to tap/click any habit to open a detailed view with:
   - Habit name and icon
   - Level legend (for level-based habits) showing what each shade/color represents
   - Progress statistics showing completion rate for the selected timeframe (e.g., "15/28 days completed this month")
   - Larger progress grid defaulted to the last 12 weeks (3 months)
   - Date range selector for extended timeframes
   
30. The detail view must provide a date range selector with the following preset options:
   - Last 4 weeks (1 month)
   - Last 8 weeks (2 months)
   - Last 12 weeks (3 months) [DEFAULT]
   - Last 26 weeks (6 months)
   - Last 52 weeks (1 year)
   
31. The progress statistics must update dynamically based on the selected date range

32. The grid must update dynamically when the date range selection changes

33. The system must display date labels on the grid for orientation:
   - Day of week labels at the column headers (S, M, T, W, T, F, S)
   - Month indicators at the start of each month row
   - Optional week numbers for longer date ranges
   
34. The system must show the currently selected date range (e.g., "Last 12 weeks (3 months)") in the detail view

35. The system must always display the home screen (all habits overview) when the app is opened

### Data Persistence

36. The system must save all habit configurations and progress data locally on the device

37. The system must save the user's custom habit order and persist it across app sessions

38. Data must persist across app launches, closures, and device restarts

39. The system must implement local-first storage (SQLite, AsyncStorage, or similar)

40. The system must provide an option in settings to enable cloud backup (can be implemented in a future phase)

41. When cloud backup is enabled, the system must automatically sync data changes to the cloud

42. The system must function fully offline with local storage

### User Interface (Initial Grayscale Version)

43. The app must use a grayscale color palette (black, white, shades of gray) for all UI elements

44. The system must use varying shades of gray to distinguish between progress levels (e.g., light gray = level 1, medium gray = level 2, dark gray = level 3)

45. The UI must follow a wireframe aesthetic prioritizing clarity and functionality over visual design

46. The system must be responsive and usable on mobile device screen sizes (primary focus)

47. All interactive elements (buttons, tiles, selectors) must have clear tap targets and visual feedback

48. The level legend must clearly show the color/shade for each level alongside its description

49. The system must not include an onboarding tutorial or walkthrough in v1 (users start directly on the home screen)

## Non-Goals (Out of Scope)

1. **Multi-user support** - This is a personal-use app for a single user only
2. **Social features** - No sharing, comparing, or social networking functionality
3. **Notifications/reminders** - No push notifications or reminder system in the initial version
4. **Analytics/insights** - No automated streak counting in v1; basic progress statistics (completion rate) are included in detail view
5. **Gamification** - No badges, achievements, or reward systems
6. **Public app store distribution** - Not intended for iOS App Store or Google Play Store publication
7. **Advanced color customization** - Initial version uses grayscale only; full color customization comes later
8. **Habit templates or presets** - Users create all habits from scratch
9. **Export functionality** - No CSV/PDF/JSON export in v1 or v2
10. **Multiple device real-time sync** - Cloud backup is optional and not required for v1
11. **Habit categories or grouping** - All habits appear in a single flat list
12. **Onboarding/tutorial** - No walkthrough or tutorial screens in v1
13. **Habit archiving** - Not included in v1 (planned for v2)

## Design Considerations

### Visual Design (Initial Version)
- **Grayscale/Wireframe Style**: Use only black, white, and shades of gray
- **Progress Levels**: Distinguish levels through gray value intensity:
  - Not tracked: White or very light gray
  - Binary completion / Level 1: Light gray (#CCCCCC)
  - Level 2: Medium gray (#888888)
  - Level 3: Dark gray (#444444)
- **Typography**: Use clear, readable system fonts (SF Pro for iOS, Roboto for Android)
- **Layout**: Clean, spacious layouts with clear visual hierarchy

### UI Components
- **Habit Card (Home Screen)**: Compact card displaying habit icon, name, and 4-week progress grid
- **Habit Detail View**: Full-screen view with:
  - Habit name and icon at the top
  - Progress statistics (e.g., "15/28 days completed") below the habit name
  - Level legend (for level-based habits) showing color swatches with descriptions
  - Larger progress grid (default 12 weeks)
  - Date range selector controls
- **Progress Grid**: Tile-based calendar view organized by weeks (7 columns for days, multiple rows for weeks)
  - Column headers: S, M, T, W, T, F, S
  - Most recent week at the top
  - Flows chronologically from top (most recent) to bottom (oldest)
- **Level Legend**: Visual guide showing:
  - Color/shade swatch for each level
  - Level description/name next to each swatch
  - Displayed below habit name in detail view
- **Date Range Selector**: Dropdown or segmented control for timeframe selection (4/8/12/26/52 weeks)
- **Level Selector Modal**: When logging progress for level-based habits, show a modal with level options
- **Habit Creation Form**: Simple form with fields for name, icon selection, type toggle, and level configuration

### Interaction Patterns
- **Tap to log**: Tap a tile to log progress for that date (if within allowed range)
- **Long-press for edit**: Long-press a tile to edit or delete existing progress
- **Tap habit card to expand**: Tap any habit card on the home screen to open the detailed view
- **Drag to reorder**: Long-press and drag habit cards on the home screen to reorder them
- **Vertical scroll**: Scroll through all habits on home screen; scroll through extended grid in detail view
- **Pull to refresh**: Standard mobile pattern for data refresh

## Technical Considerations

### Technology Stack
- **Platform**: Cross-platform mobile app (React Native or Flutter recommended)
- **Local Storage**: SQLite or AsyncStorage/SecureStore for React Native; Hive or SQLite for Flutter
- **State Management**: Context API/Redux (React Native) or Provider/Riverpod (Flutter)
- **Cloud Backup (Future)**: Firebase, Supabase, or AWS Amplify for optional cloud sync

### Data Model (Suggested)

**Habits Table:**
- `id` (primary key)
- `name` (string)
- `icon` (string/enum)
- `tracking_type` (enum: binary, level-based)
- `levels` (JSON array for level-based habits)
- `display_order` (integer for custom ordering)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Progress Table:**
- `id` (primary key)
- `habit_id` (foreign key)
- `date` (date, indexed)
- `level` (integer: 0 for not done, 1-3 for levels)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Performance Considerations
- Efficiently render progress grids using weekly layout (7 columns, variable rows based on timeframe)
- Optimize home screen rendering by limiting default view to 4 weeks (4 rows × 7 columns = 28 tiles per habit)
- Cache rendered grids for previously viewed date ranges in detail view
- Index database queries by date and habit_id for fast lookups

### Dependencies
- Icon library: Use an attractive, fun icon set (e.g., FontAwesome, Material Icons, Feather Icons)
- Date handling library (e.g., date-fns, dayjs)
- Local database library (e.g., react-native-sqlite-storage, WatermelonDB)

## Success Metrics

Since this is a personal-use app, traditional metrics like user acquisition don't apply. Success will be measured by:

1. **Functional Completeness**: All core features (create habits, log progress, view history, reorder habits, view statistics) work reliably without bugs
2. **Data Reliability**: Zero data loss across app sessions - 100% persistence rate
3. **Usability**: User (you) can complete core workflows (create habit, log progress, view history) intuitively without friction
4. **Performance**: Progress grids render smoothly (60fps) even with 365+ days of data
5. **Personal Satisfaction**: The app motivates consistent habit tracking and provides valuable historical insights
6. **Foundation Quality**: Grayscale version provides a solid functional foundation for future design enhancements

## Open Questions

1. **Week Start Day in Future Iterations**: While the initial version uses Sunday-Saturday format, would you want the option to customize this in a future version (e.g., Monday start for international users)?

2. **Haptic Feedback**: Should there be haptic feedback (vibration) when tapping tiles to log progress on mobile devices?

---

**Resolved for v1:**
- Icon Set: Use an attractive, fun icon library (e.g., FontAwesome, Material Icons)
- Grid Layout: Sunday-Saturday format
- Habit Limit: Unlimited
- Habit Reordering: Yes, drag-and-drop on home screen
- Progress Statistics: Yes, completion rate shown in detail view (e.g., "15/28 days completed this month")
- Empty State: Welcoming message with call-to-action button
- Data Export: Out of scope for v1 and v2
- Onboarding: None for v1
- Default View: Always show home screen on app open
- Day Definition: Midnight (12:00 AM) to 11:59 PM
- Habit Archiving: Planned for v2

---

**Document Version**: 1.0  
**Last Updated**: December 25, 2025  
**Status**: Ready for Development

