# Deployment Guide: Installing Inkrements on Your iPhone

This guide covers how to build and install the Inkrements app on your iPhone for personal use, without publishing to the App Store.

---

## Overview

There are two main approaches for installing Inkrements on your iPhone:

1. **Ad-hoc Distribution** (with Apple Developer Account) - Recommended
2. **Internal Distribution** (without Apple Developer Account) - Free alternative

---

## Option 1: Ad-hoc Distribution (Recommended)

### Prerequisites
- **Apple Developer Account** ($99/year)
- **Expo account** (free)
- **Node.js** installed on your computer
- **Xcode** installed (for Mac users)

### Pros
✅ Build is permanent (never expires)
✅ Install on up to 100 devices
✅ Full production features
✅ Works completely offline after installation
✅ Professional distribution method

### Cons
❌ Requires $99/year Apple Developer membership
❌ Manual installation process (not through App Store)
❌ Requires re-registering devices if you get a new iPhone

### Step-by-Step Instructions

#### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Login to Expo
```bash
eas login
```

If you don't have an Expo account, create one at https://expo.dev/signup

#### 3. Link Your Apple Developer Account
```bash
eas build:configure
```

Follow the prompts to:
- Log in to your Apple Developer account
- Grant necessary permissions
- EAS will create an App Store Connect API key

#### 4. Register Your iPhone
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
Simply run `eas device:create` again to register the new device.

#### 5. Build the App
```bash
eas build --platform ios --profile production
```

This process:
- Uploads your code to Expo's build servers
- Compiles a native iOS `.ipa` file
- Takes approximately 10-15 minutes
- Displays build progress in the terminal
- Provides a download link when complete

#### 6. Install on Your iPhone

**Method A: Direct Installation (Easiest)**
1. Open the download link from step 5 on your iPhone (in Safari)
2. Tap "Install"
3. The app will appear on your home screen
4. Trust the developer profile: Settings → General → VPN & Device Management

**Method B: Using Apple Configurator (Alternative)**
1. Download the `.ipa` file to your Mac
2. Install Apple Configurator 2 from the Mac App Store
3. Connect your iPhone via USB
4. Drag the `.ipa` file onto your device in Configurator

#### 7. Launch the App
- Find "Inkrements" on your home screen
- Tap to launch
- You may need to trust the app in Settings if prompted

### Updating the App

When you make changes and want to update:

1. Increment the version in `app.json`:
```json
{
  "expo": {
    "version": "1.0.1"  // Changed from 1.0.0
  }
}
```

2. Rebuild:
```bash
eas build --platform ios --profile production
```

3. Install the new build using the download link
4. The new version will replace the old one

---

## Option 2: Internal Distribution (Free)

### Prerequisites
- **Expo account** (free)
- **Node.js** installed on your computer

### Pros
✅ Completely free
✅ No Apple Developer account needed
✅ Quick setup
✅ Easy installation process
✅ Easy sharing - unlimited people can install from one link
✅ **Your habit data is preserved** when rebuilding

### Cons
❌ Builds expire after 30 days (must rebuild monthly)
❌ Everyone needs to reinstall when build expires
❌ Requires periodic maintenance

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
eas build --platform ios --profile production
```

**Note:** Without an Apple Developer account, EAS will:
- Use Expo's provisioning profile
- Create a build valid for 30 days
- Provide a download link

#### 4. Install on Your iPhone
1. Open the download link on your iPhone (in Safari)
2. Tap "Install"
3. The app will appear on your home screen

#### 5. Sharing with Others (Optional)

You can share the download link with anyone:
1. Copy the download link from the build output
2. Share it via text, email, AirDrop, etc.
3. Recipients open the link on their iPhone (in Safari)
4. They tap "Install"
5. The app installs on their device

**Important:**
- Each person has their **own separate data** (habits don't sync)
- Everyone will need to reinstall when the build expires
- Unlimited people can use the same link

#### 6. Reinstall Every 30 Days

When your build expires (you'll see an error when trying to open the app):

1. Run `eas build --platform ios --profile production` again
2. Install the new build from the link **WITHOUT deleting the old app first**
3. **Your habit data will be preserved!** ✅

**CRITICAL - Data Preservation:**
- ✅ **DO**: Install the new build over the existing app
- ❌ **DON'T**: Delete the app before installing the new build

iOS preserves your app data (SQLite database with all your habits and progress) as long as:
- You don't delete the app first
- The bundle identifier stays the same (it will)

**Setting a Reminder:**
Add a calendar reminder for 25 days after each build to rebuild before expiration.

---

## Comparison Chart

| Feature | Ad-hoc Distribution | Internal Distribution |
|---------|---------------------|----------------------|
| **Cost** | $99/year | Free |
| **Build Lifetime** | Permanent | 30 days |
| **Devices Supported** | Up to 100 | Unlimited |
| **Sharing** | Must register each device | Share one link with anyone |
| **Installation** | Manual | Manual |
| **Data Preservation** | Always preserved | Preserved if not deleted |
| **Maintenance** | One-time | Monthly rebuild |
| **Best For** | Long-term personal use | Sharing with friends/family |

---

## Troubleshooting

### "Unable to Install App"
- **Cause:** Profile not trusted
- **Solution:** Settings → General → VPN & Device Management → Trust the developer

### "App Won't Open"
- **Cause:** Build expired (internal distribution only)
- **Solution:** Rebuild and reinstall

### "Device Not Registered"
- **Cause:** UDID not in provisioning profile
- **Solution:** Run `eas device:create` again

### "Build Failed"
- **Cause:** Various (check EAS logs)
- **Solution:**
  1. Check build logs: `eas build:list`
  2. View specific build: `eas build:view [build-id]`
  3. Common fixes:
     - Ensure `app.json` is valid
     - Check that all dependencies are installed
     - Verify Apple Developer account is active

### "This App Cannot Be Installed Because Its Integrity Could Not Be Verified"
- **Cause:** Certificate mismatch or expired
- **Solution:**
  1. Delete the app from your iPhone
  2. Rebuild: `eas build --platform ios --profile production --clear-cache`
  3. Reinstall from new link

---

## Configuration Files

Your project is already configured with the following files:

### `app.json`
```json
{
  "expo": {
    "name": "Inkrements",
    "slug": "Inkrements",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.nicoladevera.inkrements"
    }
  }
}
```

### `eas.json`
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

- **EAS Build Documentation:** https://docs.expo.dev/build/introduction/
- **Device Registration:** https://docs.expo.dev/build/internal-distribution/
- **Apple Developer Program:** https://developer.apple.com/programs/
- **Expo Account:** https://expo.dev/

---

## Quick Reference Commands

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Register a device
eas device:create

# Build for production
eas build --platform ios --profile production

# View build status
eas build:list

# View build details
eas build:view [build-id]

# Clear cache and rebuild (troubleshooting)
eas build --platform ios --profile production --clear-cache
```

---

## Frequently Asked Questions

### Will my habit data be erased when I rebuild the app?

**No! Your data is preserved.** ✅

When you "rebuild" the app, you're just creating a new installation file (.ipa). Your habit data lives on your iPhone in a local SQLite database, completely separate from the app file.

**How it works:**
1. Your habits and progress are stored in `/var/mobile/Containers/Data/Application/[app-id]/`
2. iOS preserves this data directory as long as the app's bundle identifier stays the same
3. When you install a new build over the old one, iOS keeps your data intact

**Important:** Only delete the app if you want to start fresh. Otherwise, always install new builds directly over the existing app.

### Can I share this app with friends and family?

**Yes! Very easily with the free option.**

**Internal Distribution (Free):**
- After building, you get a shareable download link
- Send the link to anyone via text, email, etc.
- They open it on their iPhone and tap "Install"
- Unlimited people can use the same link
- Each person gets their own separate data (no syncing)
- Everyone needs to reinstall when the build expires (30 days)

**Ad-hoc Distribution ($99/year):**
- Must register each person's device UDID first using `eas device:create`
- They open the registration link on their iPhone
- Then they can install the app
- Limited to 100 devices
- Build never expires

**For sharing with multiple people, the free option is actually easier!**

### What happens if I forget to rebuild and the app expires?

If your build expires (after 30 days with internal distribution):
1. The app will show an error when you try to open it
2. **Your data is still safe on your device** ✅
3. Simply rebuild and reinstall
4. Your habits and progress will reappear

The app won't open, but iOS doesn't delete your data. It's waiting for you to install a fresh build.

### Do habits sync between devices?

**No.** This is a local-first app without cloud sync.

- Each device has its own separate SQLite database
- If you install on your iPhone and iPad, they won't share data
- If you share with a friend, they'll have their own habits
- This ensures privacy and offline functionality

### How do I back up my data?

Currently, your data is backed up through:
1. **iCloud Backup** (automatic if enabled on your iPhone)
2. **iTunes/Finder Backup** (when you back up to your computer)

iOS includes app data in device backups, so if you restore from a backup, your habits will return.

### Can I use both options at the same time?

No need to! Choose one:
- **Free option** for sharing with friends/family easily
- **Paid option** for permanent builds if it's just for you

If you start with the free option and later get an Apple Developer account, you can switch. Your data will transfer since the bundle identifier stays the same.

---

## Recommended Approach

**For long-term personal use only:** Use **Option 1 (Ad-hoc Distribution)** with an Apple Developer account. The $99/year investment is worth it for permanent builds and no monthly maintenance.

**For sharing with friends/family:** Use **Option 2 (Internal Distribution)**. It's free, easier to share (just send the link), and unlimited users. Just set a monthly reminder to rebuild.

**If cost is a concern:** Use **Option 2 (Internal Distribution)**. The 30-day rebuild is a small inconvenience, but your data is always preserved.

---

## Notes

- Your app data (habits, progress) is stored locally on your iPhone using SQLite
- **Data is ALWAYS preserved** when reinstalling/updating (as long as you don't delete the app first)
- The app works completely offline once installed
- You can share with unlimited people using internal distribution
- Each device maintains its own separate data (no syncing between devices)
- Data is included in iCloud/iTunes backups automatically

---

Last updated: December 26, 2025
