# Troubleshooting Guide

## Metro Running But Simulator Can't Connect

### Symptoms

The app loads in the simulator but shows a red error screen:

```
Could not connect to development server.

Ensure the following:
- Node server is running and available on the same network - run 'npm start' from react-native root
- Node server URL is correctly set in AppDelegate
- WiFi is enabled and connected to the same network as the Node Server

URL: http://192.168.1.155:8081/index.ts.bundle?platform=ios...
```

Metro bundler is running (confirmed with `lsof -i :8081`), but the simulator can't establish a connection.

### Root Cause

This is typically caused by:
- **Stale Metro bundler cache** - Old cached state preventing proper bundle serving
- **Simulator network stack issues** - Simulator's network layer needs reset
- **Stale app bundle in simulator** - Old app instance with wrong Metro URL

### Diagnosis Steps

1. **Verify Metro is actually running:**
   ```bash
   lsof -i :8081
   # Should show: node <PID> ... *:sunproxyadmin (LISTEN)
   ```

2. **Test Metro accessibility:**
   ```bash
   curl http://192.168.1.155:8081/status
   # Should return: packager-status:running
   ```

   - If Metro is **not running**: See "Expo Start Timeout" section below
   - If Metro **is running and accessible**: Continue with solution below

### Solution

1. **Kill existing Metro process and clear caches:**
   ```bash
   # Find and kill Metro/Expo processes
   ps aux | grep -E "node.*expo" | grep -v grep
   kill <PID>

   # Clear Metro caches
   rm -rf node_modules/.cache
   rm -rf /tmp/metro-* /tmp/react-* /tmp/haste-* 2>/dev/null || true

   # Restart with clean slate
   npx expo start --clear --ios
   ```

2. **If still failing, reset the simulator:**
   ```bash
   # Completely quit Simulator app (not just close window)
   osascript -e 'quit app "Simulator"'

   # Wait 2-3 seconds, then restart
   npx expo start --clear --ios
   ```

3. **If still failing, erase simulator:**
   ```bash
   # List devices to get ID
   xcrun simctl list devices | grep "iPhone"

   # Erase the simulator (replace with your device ID)
   xcrun simctl erase <DEVICE_ID>

   # Restart
   npx expo start --clear --ios
   ```

4. **Last resort - use tunnel mode:**
   ```bash
   npx expo start --tunnel
   ```
   This bypasses local network issues by routing through Expo's servers.

### Prevention

- Always use `--clear` flag when you haven't run the app in a while: `npx expo start --clear`
- If you switch WiFi networks, restart Metro bundler
- Periodically clear Metro caches: `rm -rf node_modules/.cache`

---

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
