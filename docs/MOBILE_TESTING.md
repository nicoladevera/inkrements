# Mobile Testing Guide

This guide covers how to test the Inkrements app on mobile devices and simulators for a more accurate representation of the user experience.

## Why Mobile Testing Matters

Browser responsive mode doesn't accurately represent the mobile experience because it misses:
- Real touch gestures (swipes, long-presses)
- Native scroll physics and momentum
- Actual native component rendering (SQLite, gesture handlers, reanimated)
- Device-specific screen dimensions and safe areas (notches, home indicators)
- Real performance characteristics
- Mobile-specific font rendering

> **Note:** This guide covers testing during development. When you're ready to deploy a standalone app for daily use (without running `npx expo start`), see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Testing Options

### 1. Expo Go on Physical Device (Recommended)

The fastest and most accurate way to test during development. Gives you the real mobile experience with instant hot reload.

> **Important:** Expo Go is a development tool, not a standalone app. Your computer must be running `npx expo start` for the app to work. For installing a permanent standalone app, see [DEPLOYMENT.md](./DEPLOYMENT.md).

#### Setup

1. **Install Expo Go**
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

3. **Connect your device**
   - **iOS**: Open Camera app → Scan QR code in terminal → Tap notification
   - **Android**: Open Expo Go app → Scan QR code with built-in scanner

#### Benefits
- Real device performance and touch interactions
- Hot reload - changes appear instantly
- Test actual scrolling physics and gestures
- See real font rendering and spacing
- Test on your actual screen size

#### Tips
- Make sure your phone and computer are on the same Wi-Fi network
- Shake the device to open the developer menu
- Pull down to refresh/reload the app

#### Sharing with Remote Testers (Tunnel Mode)

Want to share your development build with testers who aren't on your Wi-Fi network? Use tunnel mode.

**Start with tunnel:**
```bash
npx expo start --tunnel
```

**How it works:**
- Creates a public URL through Expo's tunneling service
- Anyone with the QR code can connect from anywhere (different Wi-Fi, city, country)
- Their Expo Go app loads your code through the internet tunnel

**Connection Modes Comparison:**

| Mode | Command | Access | Speed | Use Case |
|------|---------|--------|-------|----------|
| LAN (default) | `npx expo start` | Same Wi-Fi only | Fast | Solo development |
| Tunnel | `npx expo start --tunnel` | Anywhere (internet) | Slower | Remote testers |
| Localhost | `npx expo start --localhost` | Your computer only | Fastest | Simulators only |

**Important:** Tunnel mode is still development mode - your computer must be running the dev server. For standalone apps that work without your computer, see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Tips for remote testing sessions:**
- Share the QR code screenshot via messaging apps
- Warn testers about potential latency (internet vs local network)
- Keep terminal open - closing it disconnects all testers

---

### 2. iOS Simulator (macOS Only)

Built-in iOS device simulator. Good for quick iteration without a physical device.

#### Setup

1. **Install Xcode** (if not already installed)
   ```bash
   xcode-select --install
   ```

2. **Start Expo and launch simulator**
   ```bash
   npm start
   # Then press 'i' in the terminal
   ```

   Or start directly:
   ```bash
   npm run ios
   ```

#### Switching Device Types

While simulator is running, go to:
- Xcode → Open Developer Tool → Simulator
- File → Open Simulator → iOS [version] → [Device]

Available devices:
- iPhone SE (small screen)
- iPhone 15 (standard size)
- iPhone 15 Pro Max (large screen)
- iPad models

#### Simulator Shortcuts
- `Cmd + R` - Reload app
- `Cmd + D` - Open developer menu
- `Cmd + K` - Toggle keyboard
- `Cmd + Shift + H` - Go to home screen

#### Benefits
- Fast iteration without physical device
- Test multiple device sizes quickly
- Built into macOS development environment

#### Limitations
- Not identical to real hardware performance
- Touch gestures simulated with mouse/trackpad
- Some native features may behave differently

---

### 3. Android Emulator

Android device emulator for testing on Android devices.

#### Setup

1. **Install Android Studio** (if not already installed)
   - Download from [developer.android.com](https://developer.android.com/studio)

2. **Create an emulator** (one-time setup)
   - Open Android Studio
   - Tools → Device Manager
   - Create Device → Select hardware → Download system image
   - Finish and start emulator

3. **Launch app in emulator**
   ```bash
   npm start
   # Then press 'a' in the terminal
   ```

   Or start directly:
   ```bash
   npm run android
   ```

#### Benefits
- Test on Android without physical device
- Multiple device configurations available
- Built-in developer tools

---

### 4. Custom Development Client (Advanced)

For testing with packages incompatible with Expo Go or closer to production builds.

#### When to Use
- **Native module conflicts** (e.g., worklets version mismatches)
- Testing native modules not supported in Expo Go
- Using packages like `react-native-draggable-flatlist` that require specific native versions
- Performance testing closer to production
- Testing app icons, splash screens, custom fonts, etc.

#### Key Differences from Expo Go

| Feature | Expo Go | Custom Dev Client |
|---------|---------|-------------------|
| Setup time | Instant | Requires build (~5-10 min first time) |
| Native modules | Fixed versions | Full control |
| Package compatibility | Limited to Expo Go versions | Any package |
| Rebuild required | Never | When native deps change |
| File size | Provided by Expo | Custom per project |

#### Setup

1. **Install expo-dev-client:**
   ```bash
   npx expo install expo-dev-client
   ```

2. **Build and run:**
   ```bash
   # iOS (requires macOS with Xcode)
   npx expo run:ios
   
   # Android (requires Android Studio)
   npx expo run:android
   ```

3. **Development workflow:**
   - First build takes 5-10 minutes
   - Subsequent JavaScript changes hot-reload instantly (like Expo Go)
   - Only rebuild when you add/update native dependencies

#### Benefits
- Resolve worklets and other native module version conflicts
- Use any React Native package
- Closer to production environment
- Full control over native code

#### Trade-offs
- Initial setup time
- Need native development tools (Xcode/Android Studio)
- Larger app file size
- Must rebuild after native dependency changes

**Tip:** Start with Expo Go for rapid prototyping. Switch to custom dev client only when you hit compatibility issues or need specific native features.

---

## Managing Test Data & Versions

When testing new features (like empty states) without losing your existing test data (habits, logs), use one of these strategies to keep environments separate.

### 1. The Quick Fix: Use a Different Simulator
The easiest way to get a "fresh" device without wiping your data is to use a different simulator device. Each simulator maintains its own isolated storage.

**How to do it:**
1. Open Simulator app
2. **File > Open Simulator** > Choose a different device (e.g., if using iPhone 15, open iPhone SE)
3. In your terminal, press `shift + i` to select the specific simulator to run on

**Best for:**
- Quick checks of empty states
- One-off testing
- Validating layout on different screen sizes

### 2. The Robust Solution: App Variants (Recommended)
For a long-term professional workflow, configure "App Variants" (Development, Preview, Production). This allows you to have **Inkrements** (Production/Test) and **Inkrements Dev** (Development) installed on the *same* device side-by-side.

**How it works:**
- Uses a dynamic `app.config.ts` instead of static `app.json`
- Changes the `bundleIdentifier` based on an environment variable (e.g., `APP_VARIANT=development`)
- Each variant has its own isolated sandbox and storage

**Setup Overview:**
1. Convert `app.json` to `app.config.ts`
2. Add logic to switch bundle ID (e.g., suffix with `.dev`)
3. Update `package.json` scripts to include the variant flag:
   ```bash
   "start:dev": "APP_VARIANT=development npx expo start"
   ```

**Best for:**
- Long-term development
- Keeping "real" usage data separate from "testing" data on your physical phone
- Testing migration paths

---

## Troubleshooting

### Worklets Version Mismatch Error

If you see:
```
WorkletsError: Mismatch between JavaScript part and native part of Worklets (0.7.1 vs 0.5.1)
```

**Root Cause:**
This error occurs when packages in your project require a newer version of `react-native-worklets-core` than what's baked into Expo Go's native modules. This is a **fundamental Expo Go limitation** - you cannot update native modules in Expo Go.

**Common Culprits:**
- `react-native-draggable-flatlist` (requires Reanimated 4.x with Worklets 0.7.x)
- Newer versions of `react-native-reanimated` that don't match your Expo SDK
- Any package that uses advanced gesture/animation features

**Solution 1: Use Expo SDK Compatible Versions (Recommended for Expo Go)**

First, check what versions your Expo SDK expects:
```bash
npx expo start
# Look for warnings like: "react-native-reanimated@X.X.X - expected version: ~Y.Y.Y"
```

Then align your packages:
```bash
# Clear everything
rm -rf node_modules package-lock.json
npm cache clean --force

# Update package.json to use the expected versions (e.g., for SDK 54):
# "react-native-reanimated": "~4.1.1"
# "react-native-gesture-handler": "~2.28.0"
# "react-native-screens": "~4.16.0"

# Reinstall
npm install

# Start with cleared cache
npx expo start --clear
```

**Solution 2: Remove Incompatible Packages**

If a package (like `react-native-draggable-flatlist`) causes the error, you have two options:

A. Replace it with Expo Go compatible alternatives:
```bash
# Remove the problematic package
npm uninstall react-native-draggable-flatlist

# Use standard React Native components instead (e.g., FlatList)
```

B. Switch to a custom development client (see section below)

**Solution 3: Build a Custom Development Client**

For full control over native dependencies:
```bash
# Install expo-dev-client
npx expo install expo-dev-client

# Build for iOS
npx expo run:ios

# Build for Android
npx expo run:android
```

This gives you a custom native build with your exact package versions, but requires:
- More setup time
- Xcode (iOS) or Android Studio (Android)
- Rebuilding after native dependency changes

**When to Use Each Solution:**
- **Solution 1**: Best for quick development with Expo Go
- **Solution 2**: When you don't need the specific feature (e.g., drag-to-reorder)
- **Solution 3**: When you need packages incompatible with Expo Go

**Prevention Tips:**
1. Always check Expo SDK compatibility before adding packages
2. Use `npx expo install <package>` instead of `npm install` when possible (auto-installs correct versions)
3. Review package warnings when starting the dev server
4. Test in Expo Go early when adding new animation/gesture packages

---

### Connection Issues (Expo Go)

**Phone can't connect to dev server:**

1. Ensure both devices are on the same Wi-Fi network
2. Try connecting via tunnel mode:
   ```bash
   npx expo start --tunnel
   ```
3. Disable firewall temporarily to test
4. Try connecting via LAN mode explicitly:
   ```bash
   npx expo start --lan
   ```

---

### Simulator Won't Open

**iOS Simulator:**
```bash
# Check if Xcode command line tools are installed
xcode-select -p

# Install if needed
xcode-select --install

# Open simulator manually
open -a Simulator
```

**Android Emulator:**
- Check Android Studio → Device Manager shows devices
- Try starting emulator from Android Studio first
- Verify ANDROID_HOME environment variable is set

---

### App Crashes on Launch

1. **Clear Metro bundler cache:**
   ```bash
   npx expo start --clear
   ```

2. **Check for version compatibility issues:**
   ```bash
   npx expo start
   # Look for package version warnings in the terminal output
   ```
   If you see warnings like "expected version: ~X.X.X", align your packages:
   ```bash
   # Use expo install to get compatible versions
   npx expo install <package-name>
   ```

3. **Check for TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

4. **Reset Expo Go app cache:**
   - iOS: Shake device → "Reload"
   - Android: Device menu → "Reload"

5. **Check logs:**
   - Terminal shows bundler logs
   - Expo Go app may show red error screen with details
   - Look for errors mentioning "HostFunction", "Worklets", or native modules

6. **If native module errors persist:**
   - Check if packages are compatible with Expo Go
   - Consider switching to custom development client (see Development Build section)

---

### Hot Reload Not Working

1. **Manual reload:**
   - Shake device (physical)
   - `Cmd + R` (iOS Simulator)
   - `R` twice (Android)

2. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npx expo start --clear
   ```

---

## Best Practices

### Testing Workflow

1. **Primary development**: Use Expo Go on your physical device
   - Most accurate touch interactions
   - Real performance feedback
   - Easy to carry around and test throughout the day
   - **Limitation**: Can only use packages compatible with Expo Go's native modules

2. **Quick iterations**: Use iOS Simulator
   - Faster to launch and test
   - Good for UI adjustments
   - Multiple screen sizes

3. **Cross-platform checks**: Test on both iOS and Android
   - Gesture behaviors differ
   - Font rendering varies
   - Safe area handling differs

4. **When adding new packages**: Check compatibility first
   - Review package documentation for Expo Go compatibility
   - Use `npx expo install <package>` to auto-install correct versions
   - Test in Expo Go immediately after adding animation/gesture packages
   - If worklets errors appear, decide: remove package, use alternative, or switch to dev client

### Package Management Best Practices

1. **Use `npx expo install` for Expo packages:**
   ```bash
   # Good - automatically installs SDK-compatible version
   npx expo install react-native-reanimated
   
   # Risky - may install incompatible version
   npm install react-native-reanimated
   ```

2. **Monitor version warnings:**
   - When starting dev server, check for "expected version" warnings
   - Address these early to prevent runtime errors

3. **Before adding gesture/animation packages:**
   - Check if they require specific native module versions
   - Verify compatibility with your Expo SDK version
   - Have a backup plan (alternative package or custom dev client)

4. **Document native dependencies:**
   - Keep track of packages that require specific native versions
   - Note which features require custom dev client vs work in Expo Go

### What to Test on Mobile

- **Touch targets**: Are buttons/tiles large enough to tap comfortably?
- **Gestures**: Do swipes, long-presses, and drags feel natural?
- **Scrolling**: Does momentum scrolling feel smooth?
- **Spacing**: Does content have proper breathing room on small screens?
- **Text readability**: Is font size comfortable to read?
- **Safe areas**: Does content avoid notches and home indicators?
- **Performance**: Is the app responsive to interactions?

---

## Quick Reference

### Common Commands

| Method | Command | Best For |
|--------|---------|----------|
| Expo Go (iOS) | `npm start` → scan QR | Real device testing |
| Expo Go (Android) | `npm start` → scan QR | Real device testing |
| iOS Simulator | `npm start` → press `i` | Quick iterations (macOS) |
| Android Emulator | `npm start` → press `a` | Android testing |
| Clear cache | `npx expo start --clear` | Fixing cache issues |
| Reload app | Shake device or `Cmd+R` | Applying changes |
| Install Expo package | `npx expo install <package>` | Get SDK-compatible version |
| Check compatibility | `npx expo start` (watch for warnings) | Verify package versions |
| Custom dev client | `npx expo run:ios` or `run:android` | Native module conflicts |

### Troubleshooting Checklist

**When you encounter errors in Expo Go:**

1. ✅ Check terminal for package version warnings
2. ✅ Clear cache: `npx expo start --clear`
3. ✅ Reinstall with correct versions: `rm -rf node_modules && npm install`
4. ✅ Verify packages are Expo Go compatible
5. ✅ If worklets/native errors persist: Consider custom dev client

**Package Compatibility Red Flags:**
- ⚠️ Errors mentioning "Worklets", "HostFunction", or version mismatches
- ⚠️ Warnings about "expected version" on dev server start
- ⚠️ Packages requiring specific native module versions
- ⚠️ Animation/gesture libraries with recent major updates

---

## Project-Specific Notes

**Inkrements App Configuration:**
- **Expo SDK**: 54
- **React Native**: 0.81.5
- **Navigation**: @react-navigation/native-stack (no animations dependencies needed)
- **Screens**: ~4.16.0

**Design Decision:**
The app intentionally avoids animation libraries (react-native-reanimated, react-native-gesture-handler) to maintain 100% Expo Go compatibility and simplicity. Navigation uses the native stack navigator which doesn't require these dependencies.

**Known Incompatibilities with Expo Go:**
- ❌ `react-native-draggable-flatlist` v4.x (requires Worklets 0.7.x, Expo Go has 0.5.x)
  - **Alternative**: Use standard `FlatList` or build custom dev client

**Working Features in Expo Go:**
- ✅ SQLite database (expo-sqlite)
- ✅ Navigation (React Navigation Native Stack)
- ✅ All standard React Native components
- ✅ Touch interactions via standard TouchableOpacity/Pressable

---

**Remember**: The browser is convenient but not representative. Always test on actual devices or simulators for accurate mobile UX feedback. When adding packages with native dependencies, test in Expo Go immediately to catch compatibility issues early.
