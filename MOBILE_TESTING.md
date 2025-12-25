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

## Testing Options

### 1. Expo Go on Physical Device (Recommended)

The fastest and most accurate way to test. Gives you the real mobile experience with instant hot reload.

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

### 4. Development Build (Advanced)

For testing closer to production, you can create a development build.

#### When to Use
- Testing native modules not supported in Expo Go
- Performance testing closer to production
- Testing app icons, splash screens, etc.

#### Setup

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

This creates a native build on your simulator/emulator or connected device.

---

## Troubleshooting

### Worklets Version Mismatch Error

If you see:
```
WorkletsError: Mismatch between JavaScript part and native part of Worklets
```

**Fix:**
```bash
# Clear all caches
watchman watch-del-all
rm -rf node_modules .expo

# Reinstall dependencies
npm install

# Start with cleared cache
npx expo start --clear
```

Then reload the app on your device/simulator.

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

2. **Check for TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

3. **Reset Expo Go app cache:**
   - iOS: Shake device → "Reload"
   - Android: Device menu → "Reload"

4. **Check logs:**
   - Terminal shows bundler logs
   - Expo Go app may show red error screen with details

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

2. **Quick iterations**: Use iOS Simulator
   - Faster to launch and test
   - Good for UI adjustments
   - Multiple screen sizes

3. **Cross-platform checks**: Test on both iOS and Android
   - Gesture behaviors differ
   - Font rendering varies
   - Safe area handling differs

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

| Method | Command | Best For |
|--------|---------|----------|
| Expo Go (iOS) | `npm start` → scan QR | Real device testing |
| Expo Go (Android) | `npm start` → scan QR | Real device testing |
| iOS Simulator | `npm start` → press `i` | Quick iterations (macOS) |
| Android Emulator | `npm start` → press `a` | Android testing |
| Clear cache | `npx expo start --clear` | Fixing cache issues |
| Reload app | Shake device or `Cmd+R` | Applying changes |

---

**Remember**: The browser is convenient but not representative. Always test on actual devices or simulators for accurate mobile UX feedback.
