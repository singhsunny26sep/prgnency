# Automated Version Management System

This project now includes an automated version management system that eliminates the need to manually update version numbers across multiple files.

## 🎯 Problem Solved

Previously, version numbers had to be manually updated in multiple places:
- `package.json` - Main version source
- `android/app/build.gradle` - Android versionCode and versionName
- `ios/DreamChild.xcodeproj/project.pbxproj` - iOS MARKETING_VERSION and CURRENT_PROJECT_VERSION
- `src/Utils/VersionUtils.ts` - Hardcoded version values

## ✅ Solution Implemented

The system now automatically synchronizes versions from a **single source of truth** (`package.json`) to all platform-specific files.

## 🚀 How to Use

### 1. Update Version (Single Place)

Simply update the version in `package.json`:

```json
{
  "name": "HiranyaGarbh",
  "version": "1.1.0",  // ← Update only this line
  "private": true,
  ...
}
```

### 2. Sync Versions to All Platforms

Run the automated sync script:

```bash
# Using npm (recommended)
npm run sync-versions

# Or using node directly
node scripts/sync-versions.js
```

### 3. What Happens Automatically

The script will:
- ✅ Read version from `package.json` (e.g., "1.1.0")
- ✅ Calculate version code (e.g., 10100 for "1.1.0")
- ✅ Update `android/app/build.gradle`:
  - `versionCode 10100`
  - `versionName "1.1.0"`
- ✅ Update `ios/DreamChild.xcodeproj/project.pbxproj`:
  - `MARKETING_VERSION = 1.1.0`
  - `CURRENT_PROJECT_VERSION = 10100`
- ✅ Keep `src/Utils/VersionUtils.ts` synchronized dynamically

## 📁 Files Modified

### Core Script
- `scripts/sync-versions.js` - Main synchronization script

### Configuration Files Updated
- `package.json` - Added `sync-versions` script
- `android/app/build.gradle` - Version fields updated
- `ios/DreamChild.xcodeproj/project.pbxproj` - Version fields updated
- `src/Utils/VersionUtils.ts` - Now reads version dynamically

## 🔧 Version Code Calculation

The system calculates version codes automatically:
- Version "1.0.0" → versionCode `10000`
- Version "1.1.0" → versionCode `10100`
- Version "1.1.1" → versionCode `10101`
- Version "2.0.0" → versionCode `20000`

Formula: `major * 10000 + minor * 100 + patch`

## 🧪 Testing

Run the test script to verify everything is working:

```bash
node scripts/test-version-utils.js
```

## 📋 Workflow for Version Updates

1. **Update** `package.json` version field
2. **Run** `npm run sync-versions`
3. **Commit** all changed files
4. **Build/Test** your app

## 🎉 Benefits

- ✅ **Single source of truth** - Update version in one place only
- ✅ **No manual errors** - Eliminates version mismatches
- ✅ **Automatic calculation** - Version codes computed automatically
- ✅ **Cross-platform sync** - Works for both Android and iOS
- ✅ **Dynamic runtime access** - App code reads version at runtime
- ✅ **Easy to use** - Simple npm script command

## 🔍 Verification

After running the sync script, you can verify the changes:

```bash
# Check Android version
grep -n "versionCode\|versionName" android/app/build.gradle

# Check iOS version
grep -n "MARKETING_VERSION\|CURRENT_PROJECT_VERSION" ios/DreamChild.xcodeproj/project.pbxproj

# Check package.json version
grep "version" package.json
```

## 🛠️ Customization

You can customize the version code calculation in `scripts/sync-versions.js`:

```javascript
// Current calculation (simple and works well)
const versionCode = major * 10000 + minor * 100 + patch;

// Alternative: semantic versioning with build numbers
// const versionCode = major * 1000000 + minor * 10000 + patch * 100 + buildNumber;
```

## 🚨 Important Notes

- Always run `npm run sync-versions` after updating the version in `package.json`
- The script will update existing files, so make sure to commit changes
- iOS and Android may require cleaning build folders after version changes:
  ```bash
  # For React Native
  npx react-native run-android --no-packager
  npx react-native run-ios --no-packager
  ```

---

**🎯 Result**: Your app version is now automatically managed across all platforms with a single command!