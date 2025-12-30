# Deployment Guide: Installing Inkrements on Your iPhone

This guide covers realistic options for installing the Inkrements app on your iPhone for personal use, without publishing to the App Store.

**Important:** Apple's restrictions make iOS deployment challenging for personal projects. All options have significant trade-offs.

---

## Overview

There are four realistic approaches for installing Inkrements on your iPhone:

1. **TestFlight Distribution** - Easiest installation, $99/year, 90-day builds (Recommended)
2. **Ad-hoc Distribution** - Permanent builds, $99/year, more complex setup
3. **Local Xcode Build with Free Apple ID** - Free but very limited (7-day expiration)
4. **Android Alternative** - Completely free if you have an Android device

---

## Option 1: TestFlight Distribution (Recommended)

TestFlight is Apple's official beta testing platform. It provides the easiest installation experience for you and anyone you want to share with.

### Prerequisites
- **Apple Developer Program membership** ($99/year - required)
- **Expo account** (free)
- **Node.js** installed on your computer

### Pros
✅ **Easiest installation** - users install via TestFlight app from App Store
✅ **Simple sharing** - send a link or email invite, no device registration needed
✅ Up to **10,000 testers**
✅ **Publicly shareable link** option
✅ Automatic update notifications in TestFlight app
✅ Install on any device without pre-registration
✅ Works on iPhone, iPad, Apple Watch, Apple TV

### Cons
❌ Requires $99/year Apple Developer membership
❌ **Builds expire after 90 days** (must rebuild quarterly)
❌ Users must have TestFlight app installed
❌ Requires Apple review if using external testing (usually auto-approved)

### Step-by-Step Instructions

#### 1. Sign Up for Apple Developer Program
1. Go to https://developer.apple.com/programs/
2. Sign in with your Apple ID
3. Enroll in the Apple Developer Program ($99/year)
4. Complete the enrollment process (may take 24-48 hours)

#### 2. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 3. Login to Expo
```bash
eas login
```

If you don't have an Expo account, create one at https://expo.dev/signup

#### 4. Update Build Configuration

Make sure your `eas.json` has this configuration:

```json
{
  "build": {
    "production": {
      "ios": {
        "simulator": false
      }
    }
  }
}
```

#### 5. Build the App
```bash
eas build --platform ios --profile production
```

This process:
- Uploads your code to Expo's build servers
- Compiles a native iOS `.ipa` file
- Takes approximately 10-15 minutes
- Will prompt you to set up Apple credentials if first time
- Provides a build ID when complete

#### 6. Submit to TestFlight
```bash
eas submit --platform ios
```

This will:
- Prompt you to log in to App Store Connect if needed
- Upload the build to App Store Connect
- Takes a few minutes

Alternatively, you can specify which build to submit:
```bash
eas submit --platform ios --latest
```

#### 7. Wait for Apple Processing
1. Go to https://appstoreconnect.apple.com
2. Navigate to "My Apps" → "Inkrements" → "TestFlight"
3. Wait 5-10 minutes for Apple to process the build
4. The build will show "Ready to Submit" status

#### 8. Add Build to Testing

**For Personal Use (Internal Testing):**
1. In TestFlight tab, find your build
2. Under "Internal Testing", click the "+" to create a group or add testers
3. Add your email address
4. Click "Save"

**For Sharing with Others (External Testing):**
1. Click "External Testing" in the left sidebar
2. Create a new group (e.g., "Friends & Family")
3. Add the build to the group
4. Add testers by email OR create a public link
5. Submit for review (usually auto-approved in minutes)

#### 9. Install on Your iPhone

**First Time Setup:**
1. Install "TestFlight" from the App Store on your iPhone
2. Open the email invite OR public link
3. Tap "View in TestFlight"
4. Tap "Install"
5. The app installs like any App Store app

**Future Updates:**
TestFlight will notify you when new builds are available.

### Updating the App

When you make changes:

1. Increment the version in `app.json`:
```json
{
  "expo": {
    "version": "2.1.0"  // Changed from 2.0.0
  }
}
```

2. Build and submit:
```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
```

3. Users will see the update in TestFlight automatically

### Rebuilding Before Expiration

Set a reminder for **80 days** after each build to rebuild before the 90-day expiration:

```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
```

Users will be notified of the new build in TestFlight and can update with one tap.

### Sharing with Others

**Option 1: Public Link (Easiest)**
1. In App Store Connect → TestFlight → External Testing
2. Select your testing group
3. Enable "Public Link"
4. Copy and share the link via text, email, social media, etc.
5. Anyone with the link can install (up to 10,000 people)

**Option 2: Email Invites**
1. In your testing group, click "Testers" → "Add Testers"
2. Enter email addresses
3. They'll receive an invite email with installation instructions

**Note:** Each person has their own separate data (habits don't sync between devices)

---

## Option 2: Ad-hoc Distribution

Ad-hoc distribution provides permanent builds but requires more complex device registration.

### Prerequisites
- **Apple Developer Program membership** ($99/year - required)
- **Expo account** (free)
- **Node.js** installed on your computer

### Pros
✅ Build is **permanent** (never expires)
✅ Install on up to 100 devices
✅ Install via download link (no Mac/cable needed after initial build)
✅ Works completely offline after installation
✅ No TestFlight app required

### Cons
❌ Requires $99/year Apple Developer membership
❌ Must register each device's UDID before building
❌ More complex installation (trust profile manually)
❌ Must rebuild when adding new devices
❌ If you get a new iPhone, must re-register and rebuild

### When to Use This
Choose ad-hoc over TestFlight if:
- You want permanent builds that never expire
- You don't want to rebuild every 90 days
- You're okay with more complex setup

### Step-by-Step Instructions

#### 1. Sign Up for Apple Developer Program
1. Go to https://developer.apple.com/programs/
2. Sign in with your Apple ID
3. Enroll in the Apple Developer Program ($99/year)
4. Complete the enrollment process (may take 24-48 hours)

#### 2. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 3. Login to Expo
```bash
eas login
```

#### 4. Configure EAS Build
```bash
eas build:configure
```

Follow the prompts to:
- Log in to your Apple Developer account
- Grant necessary permissions
- EAS will create an App Store Connect API key

#### 5. Update Build Configuration

Make sure your `eas.json` has:

```json
{
  "build": {
    "production": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    }
  }
}
```

#### 6. Register Your iPhone
```bash
eas device:create
```

This command will:
- Generate a registration URL
- Display it in your terminal
- Open the URL on your iPhone in Safari
- Follow the prompts to install the registration profile
- Your device UDID will be automatically registered

**If you get a new iPhone later:**
Simply run `eas device:create` again and rebuild.

#### 7. Build the App
```bash
eas build --platform ios --profile production
```

This process:
- Uploads your code to Expo's build servers
- Compiles a native iOS `.ipa` file
- Takes approximately 10-15 minutes
- Displays build progress in the terminal
- Provides a download link when complete

#### 8. Install on Your iPhone

**Direct Installation:**
1. Open the download link from step 7 on your iPhone (in Safari)
2. Tap "Install"
3. The app will appear on your home screen
4. Trust the developer profile: Settings → General → VPN & Device Management → Trust

#### 9. Launch the App
- Find "Inkrements" on your home screen
- Tap to launch

### Updating the App

When you make changes:

1. Increment the version in `app.json`:
```json
{
  "expo": {
    "version": "2.1.0"  // Changed from 2.0.0
  }
}
```

2. Rebuild:
```bash
eas build --platform ios --profile production
```

3. Install the new build using the download link
4. The new version will replace the old one

### Sharing with Others

You can share the app with up to 100 people:

1. Have them run the device registration:
   ```bash
   eas device:create
   ```
   - Send them this command to run on their computer
   - They open the generated URL on their iPhone
   - Their device gets registered

2. After their device is registered, rebuild the app:
   ```bash
   eas build --platform ios --profile production
   ```

3. Share the new download link with them
4. They install from the link

**Note:** You must rebuild every time you add a new device.

---

## Option 3: Local Xcode Build with Free Apple ID

### Prerequisites
- **Mac with Xcode installed** (required - no workaround)
- **Free Apple ID** (no paid membership needed)
- **iPhone with USB cable** (required for installation)

### Pros
✅ Completely free
✅ No Apple Developer Program membership needed

### Cons
❌ Apps **expire after 7 days** (must reinstall weekly)
❌ Limited to **3 apps** total on your device
❌ Must connect iPhone to Mac via USB cable each time
❌ Must rebuild via Xcode every 7 days (no simple link)
❌ Cannot share with others
❌ Requires keeping your Mac available for weekly reinstalls
❌ More complex setup process

### When to Use This
Choose this option only if:
- You cannot afford $99/year
- You're okay with weekly reinstalls
- You have a Mac and USB cable available

### Step-by-Step Instructions

#### 1. Install Xcode
1. Open Mac App Store
2. Search for "Xcode"
3. Install (it's large, ~10-15 GB)
4. Open Xcode and agree to license terms

#### 2. Add Your Apple ID to Xcode
1. Open Xcode
2. Go to Xcode → Settings → Accounts
3. Click the "+" button
4. Sign in with your Apple ID
5. You'll see a "Personal Team" - this is your free provisioning

#### 3. Generate Native iOS Project
From your project directory:
```bash
npx expo prebuild --platform ios
```

This creates an `ios/` folder with the Xcode project.

#### 4. Open Project in Xcode
```bash
open ios/Inkrements.xcworkspace
```

**Important:** Open the `.xcworkspace` file, NOT the `.xcodeproj` file.

#### 5. Configure Signing
1. In Xcode's left sidebar, click on "Inkrements" (the blue project icon at the top)
2. Under "Targets", select "Inkrements"
3. Go to the "Signing & Capabilities" tab
4. Check "Automatically manage signing"
5. For "Team", select your Personal Team (your Apple ID name)
6. The Bundle Identifier should be `com.nicoladevera.inkrements`

If you see signing errors, you may need to change the bundle identifier to something unique (e.g., add your initials).

#### 6. Connect Your iPhone
1. Connect your iPhone to your Mac via USB cable
2. Unlock your iPhone
3. If prompted, tap "Trust This Computer" on your iPhone

#### 7. Select Your Device
In Xcode's top toolbar, click the device selector (next to the Play/Stop buttons) and choose your iPhone.

#### 8. Build and Run
1. Click the Play button (▶️) in Xcode's top-left corner
2. Xcode will build and install the app
3. Wait for the build to complete (first build takes a few minutes)

#### 9. Trust the Developer on iPhone
1. On your iPhone, go to Settings → General → VPN & Device Management
2. Under "Developer App", tap your Apple ID
3. Tap "Trust [Your Apple ID]"
4. Confirm

#### 10. Launch the App
Find "Inkrements" on your home screen and tap to launch.

### Reinstalling After 7 Days

When the app expires (after 7 days):

1. Connect your iPhone to your Mac via USB
2. Open the project in Xcode: `open ios/Inkrements.xcworkspace`
3. Select your iPhone as the target device
4. Click the Play button to rebuild and reinstall

**Your data is preserved** as long as you don't delete the app between reinstalls.

**Setting a Reminder:**
Set a weekly calendar reminder to rebuild the app before it expires.

### Making Code Changes

When you update your React Native code:

1. Make your changes in the `app/` or `src/` directories
2. Rebuild the native app if needed: `npx expo prebuild --platform ios`
3. Open in Xcode and run again

---

## Option 4: Android Alternative (If You Have Android)

If you have an Android phone, you can build and install completely free without any developer account.

### Prerequisites
- **Android phone**
- **Expo account** (free)
- **Node.js** installed

### Pros
✅ Completely free forever
✅ No developer account needed
✅ No expiration (build lasts indefinitely)
✅ Easy installation via download link
✅ Can share with unlimited people
✅ No cable/computer needed after initial build

### Cons
❌ Requires an Android device (not iPhone)

### Step-by-Step Instructions

#### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Login to Expo
```bash
eas login
```

#### 3. Build the App
```bash
eas build --platform android --profile production
```

This will:
- Upload your code to Expo's build servers
- Compile a native Android `.apk` or `.aab` file
- Takes approximately 10-15 minutes
- Provides a download link when complete

#### 4. Install on Your Android Phone
1. Open the download link on your Android phone
2. Tap "Download"
3. If prompted, allow installation from unknown sources
4. Tap "Install"
5. The app will appear in your app drawer

#### 5. Sharing with Others
Simply share the download link via text, email, etc. Anyone can install from the link.

### Updating the App
1. Increment the version in `app.json`
2. Run `eas build --platform android --profile production`
3. Install the new build from the new link

---

## Comparison Chart

| Feature | TestFlight | Ad-hoc | Xcode (Free) | Android |
|---------|------------|--------|--------------|---------|
| **Cost** | $99/year | $99/year | Free | Free |
| **Build Lifetime** | 90 days | Permanent | 7 days | Permanent |
| **Installation Method** | TestFlight app | Download link | USB + Xcode | Download link |
| **Requires Mac** | No | No | Yes | No |
| **Requires Cable** | No | No | Yes | No |
| **Max Testers** | 10,000 | 100 devices | 3 devices | Unlimited |
| **Device Registration** | Not required | Required | Required | Not required |
| **Sharing Ease** | ⭐⭐⭐⭐⭐ Very easy | ⭐⭐⭐ Moderate | ⭐ Cannot share | ⭐⭐⭐⭐⭐ Very easy |
| **Maintenance** | Rebuild every 90 days | Rebuild when updating | Rebuild weekly | Rebuild when updating |
| **Best For** | Personal use + sharing | Permanent builds | Testing only | Android users |

---

## Troubleshooting

### TestFlight Issues

#### "Build is Processing"
- **Cause:** Apple is processing your build
- **Solution:** Wait 5-15 minutes, refresh App Store Connect

#### "Missing Compliance"
- **Cause:** Export compliance not set
- **Solution:** In App Store Connect, answer "No" to encryption questions (unless you added encryption)

#### "TestFlight Invite Expired"
- **Cause:** Invite links expire after 30 days
- **Solution:** Create a new public link or resend invite

#### "App Not Available"
- **Cause:** Build expired (90 days)
- **Solution:** Rebuild and resubmit, users will see the update in TestFlight

### EAS Build Issues

#### "Unable to Install App"
- **Cause:** Profile not trusted
- **Solution:** Settings → General → VPN & Device Management → Trust the developer

#### "Device Not Registered" (Ad-hoc only)
- **Cause:** UDID not in provisioning profile
- **Solution:** Run `eas device:create` and rebuild

#### "Build Failed"
- **Cause:** Various (check EAS logs)
- **Solution:**
  1. Check build logs: `eas build:list`
  2. View specific build: `eas build:view [build-id]`
  3. Try clearing cache: `eas build --platform ios --profile production --clear-cache`

### Xcode Build Issues

#### "Signing for 'Inkrements' requires a development team"
- **Cause:** No team selected
- **Solution:** Select your Personal Team in Signing & Capabilities

#### "Failed to create provisioning profile"
- **Cause:** Bundle identifier conflict
- **Solution:** Change bundle identifier in Xcode to something unique (e.g., `com.yourname.inkrements`)

#### "Unable to install [app name]"
- **Cause:** Conflicting version already installed
- **Solution:** Delete the app from iPhone and try again

#### "The application expired"
- **Cause:** 7 days have passed
- **Solution:** Rebuild and reinstall via Xcode

#### "Could not launch [app name]"
- **Cause:** Developer not trusted
- **Solution:** Settings → General → VPN & Device Management → Trust your Apple ID

---

## Frequently Asked Questions

### Will my habit data be erased when I rebuild the app?

**No! Your data is preserved.** ✅

When you rebuild/reinstall the app, your habit data remains intact on your iPhone in a local SQLite database. This works for all options as long as:
- You don't delete the app before reinstalling
- The bundle identifier stays the same

### Which option should I choose?

**If you have an iPhone and want the best experience:**
→ Use **TestFlight (Option 1)** - easiest installation and sharing, rebuild every 90 days

**If you want permanent builds and don't mind complexity:**
→ Use **Ad-hoc Distribution (Option 2)** - never expires, but device registration required

**If you can't afford $99/year:**
→ Use **Xcode (Option 3)** - free but requires weekly rebuilds

**If you have an Android phone:**
→ Use **Android (Option 4)** - completely free with no limitations

### Can I share this app with friends and family?

**Option 1 (TestFlight):** ⭐ **Best for sharing!** Send a public link, up to 10,000 people, no device registration needed.

**Option 2 (Ad-hoc):** Yes, up to 100 devices. Each person must register their device UDID first, then you rebuild.

**Option 3 (Xcode Free):** No, you can only install on your own devices (up to 3).

**Option 4 (Android):** Yes, unlimited. Just share the download link.

### Do habits sync between devices?

**No.** This is a local-first app without cloud sync.
- Each device has its own separate SQLite database
- Data stays private and works offline

### How do I back up my data?

Your data is automatically backed up through:
1. **iCloud Backup** (if enabled on your iPhone)
2. **iTunes/Finder Backup** (when you back up to your computer)

iOS includes app data in device backups.

### What if I start with one option and want to switch?

You can switch between options anytime. Your data will transfer as long as the bundle identifier stays the same (`com.nicoladevera.inkrements`).

For example:
- Start with Xcode (free) → Switch to TestFlight when you get a paid account
- Start with Ad-hoc → Switch to TestFlight for easier sharing

### Why is iOS deployment so difficult?

Apple requires code signing for all iOS apps to ensure security. Unlike Android, there's no simple "sideloading" option. Apple only provides:
- 7-day free provisioning for personal testing
- Paid developer accounts for serious distribution

This is an Apple restriction, not an Expo or React Native limitation.

### How does TestFlight compare to the App Store?

TestFlight is for **beta testing**, not public distribution:
- No App Review (mostly) - faster approval
- Limited to 10,000 testers
- Builds expire after 90 days
- Perfect for personal apps you don't want to publish publicly
- Users need TestFlight app installed

To publish to the actual App Store, you'd need to submit for full App Review, which is a more complex process.

---

## Recommended Approach

**For most people on iPhone:**
Use **Option 1 (TestFlight)**. The $99/year investment gives you:
- Super easy installation (via TestFlight app)
- Easy sharing with unlimited people
- 90-day builds (quarterly rebuilds are manageable)
- Best user experience

**If you want permanent builds:**
Use **Option 2 (Ad-hoc Distribution)** instead. Same cost, but never expires.

**If you can't afford $99/year:**
Use **Option 3 (Xcode)** but understand you'll need to reinstall weekly.

**If you have an Android device:**
Use **Option 4 (Android)**. It's the best free experience.

---

## Configuration Files

Your project is already configured with the following files:

### `app.json`
```json
{
  "expo": {
    "name": "Inkrements",
    "slug": "Inkrements",
    "version": "2.0.0",
    "ios": {
      "bundleIdentifier": "com.nicoladevera.inkrements"
    }
  }
}
```

### `eas.json`

For TestFlight:
```json
{
  "build": {
    "production": {
      "ios": {
        "simulator": false
      }
    }
  }
}
```

For Ad-hoc Distribution:
```json
{
  "build": {
    "production": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    }
  }
}
```

---

## Additional Resources

- **TestFlight Documentation:** https://developer.apple.com/testflight/
- **EAS Submit Documentation:** https://docs.expo.dev/submit/introduction/
- **EAS Build Documentation:** https://docs.expo.dev/build/introduction/
- **Apple Developer Program:** https://developer.apple.com/programs/
- **Expo Account:** https://expo.dev/
- **Xcode:** https://developer.apple.com/xcode/

---

## Quick Reference Commands

### TestFlight (Option 1)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios --latest

# View build status
eas build:list

# View submission status
eas submit:list
```

### Ad-hoc Distribution (Option 2)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Register device
eas device:create

# Build for iOS
eas build --platform ios --profile production

# View build status
eas build:list
```

### Xcode Build (Option 3)
```bash
# Generate iOS project
npx expo prebuild --platform ios

# Open in Xcode
open ios/Inkrements.xcworkspace

# Rebuild after code changes
npx expo prebuild --platform ios --clean
```

### Android (Option 4)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android --profile production
```

---

Last updated: December 30, 2025
