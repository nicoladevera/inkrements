# Troubleshooting Guide

## Expo Start Timeout / Simulator URL Opening Fails

### Symptoms

When running `npx expo start --ios`, you may encounter:

```
Error: xcrun simctl openurl <DEVICE_ID> exp://192.168.1.155:8081 exited with non-zero code: 60
An error was encountered processing the command (domain=NSPOSIXErrorDomain, code=60):
Simulator device failed to open exp://192.168.1.155:8081.
Operation timed out
```

The iOS Simulator may show a red error screen with a Babel-related error.

### Root Cause

This timeout error is often a **symptom** rather than the actual problem. The underlying cause is typically a missing Babel plugin required by a transitive dependency.

In this project, `react-native-worklets` (a transitive dependency) requires `@babel/plugin-transform-template-literals`, which may not be installed.

The actual error (visible in the Simulator or Metro logs):

```
[BABEL] /Users/.../index.ts: Cannot find module '@babel/plugin-transform-template-literals'
Require stack:
- .../node_modules/react-native-worklets/plugin/index.js
- .../node_modules/babel-preset-expo/build/index.js
...
```

### Diagnosis Steps

1. **Check if the timeout is simulator-related or app-related:**
   ```bash
   # Boot a simulator
   xcrun simctl boot "iPhone 16 Pro"

   # Test opening a regular URL (should work)
   xcrun simctl openurl booted "https://apple.com"

   # Test opening exp:// URL (will fail if Expo Go/Metro has issues)
   xcrun simctl openurl booted "exp://192.168.1.155:8081"
   ```

   - If `https://apple.com` **fails**: The issue is with the simulator itself
   - If `https://apple.com` **works** but `exp://` **fails**: The issue is with Expo Go or Metro bundler

2. **Check Metro bundler output for the actual error:**
   ```bash
   npx expo start --ios
   ```
   Look for red error text mentioning missing modules or Babel errors.

### Solution

1. **Add the missing Babel plugin to `package.json`:**
   ```json
   {
     "devDependencies": {
       "@babel/plugin-transform-template-literals": "^7.25.0"
     }
   }
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   If npm hangs, try:
   ```bash
   # Clear npm cache
   npm cache clean --force

   # Try with offline preference
   npm install --prefer-offline

   # Or clean reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Clear Expo cache and restart:**
   ```bash
   npx expo start --ios --clear
   ```

### If the Issue is Simulator-Related

If `xcrun simctl openurl` fails even for `https://apple.com`, try these steps in order:

1. **Quit and restart Simulator app** (Cmd+Q, not just closing windows)

2. **Kill CoreSimulatorService:**
   ```bash
   sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService
   ```

3. **Clear simulator caches:**
   ```bash
   rm -rf ~/Library/Developer/CoreSimulator/Caches
   ```

4. **Erase simulator content and settings:**
   ```bash
   xcrun simctl erase <DEVICE_ID>
   ```

5. **Delete and recreate the simulator:**
   ```bash
   xcrun simctl delete <DEVICE_ID>
   xcrun simctl create "iPhone 16 Pro" "iPhone 16 Pro" iOS18.6
   ```

6. **Clear Xcode derived data:**
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```

7. **Restart your Mac**

### Alternative: Use Physical Device

If simulator issues persist, use a physical device with tunnel mode:

```bash
npx expo start --tunnel
```

Then scan the QR code with the Expo Go app on your physical device.

### Related Files

- `package.json` - Ensure Babel plugins are listed in devDependencies
- `babel.config.js` - Babel configuration (if customized)
- `node_modules/react-native-worklets/plugin/index.js` - Source of the plugin requirement

### Environment

This issue was diagnosed on:
- macOS Darwin 24.6.0
- Xcode 26.2
- Expo SDK 54
- React Native 0.81.5
- iOS Simulator 18.6
