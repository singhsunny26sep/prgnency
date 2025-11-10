# App Update System - HiranyaGarbh

## Overview
This system implements automatic app update checking and popup notifications when new versions are available on the Play Store.

## Features
- ✅ Automatic update checking on app startup
- ✅ Beautiful popup modal for update notifications
- ✅ Version comparison logic
- ✅ Dismissible updates (users can choose "Later")
- ✅ Mandatory update support
- ✅ Redux state management
- ✅ AsyncStorage persistence for dismissed updates
- ✅ API service for update information

## Components Created

### 1. Version Utilities (`src/Utils/VersionUtils.ts`)
- `getCurrentAppVersion()` - Gets current app version info
- `compareVersions()` - Compares version strings
- `isUpdateAvailable()` - Checks if update is available
- `formatVersionDisplay()` - Formats version for display

### 2. Redux Integration
- **Action Types** (`src/Redux/ActionTypes.ts`) - Added update-related actions
- **Reducer** (`src/Redux/Common.ts`) - Added update state management
- **Actions** (`src/Redux/UpdateActions.ts`) - Thunk actions for update operations

### 3. Update Popup Component (`src/Components/UpdatePopup/UpdatePopup.tsx`)
- Beautiful modal design matching app theme
- "Update Now" and "Later" buttons
- Mandatory update handling
- Direct Play Store linking

### 4. API Integration (`src/API/API.ts`)
- Added `checkAppUpdate` service call

### 5. Backend Service (`src/API/UpdateService.js`)
- Express.js server for handling update checks
- Deployable to Heroku
- Configurable version information

## How It Works

1. **App Startup**: When the app launches, it automatically checks for dismissed updates and then checks for new updates after 3 seconds.

2. **Update Check**: The app calls the update service API with current version info.

3. **Version Comparison**: Server compares versions and returns update information if available.

4. **Popup Display**: If update is available and not dismissed, popup shows with:
   - Update message
   - Version information
   - Update Now / Later buttons

5. **User Actions**:
   - **Update Now**: Opens Play Store
   - **Later**: Dismisses popup and stores dismissal in AsyncStorage

## Setup Instructions

### 1. Deploy Update Service
```bash
cd src/API
npm install
npm start
```

Deploy to Heroku or your preferred hosting service.

### 2. Update API Base URL (if needed)
The service is already configured to use your existing Heroku backend. If you want to use a different URL, update the `checkAppUpdate` call in `src/Redux/UpdateActions.ts`.

### 3. Configure Version Information
Update the following files when releasing new versions:

**Android (`android/app/build.gradle`)**:
```gradle
versionCode 3
versionName "2.1"
```

**Update Service (`src/API/UpdateService.js`)**:
```javascript
const CURRENT_VERSION = '2.1';
const BUILD_NUMBER = 3;
```

## API Endpoints

### Check for Updates
```
POST /api/app/check-update
Content-Type: application/json

{
  "currentVersion": "2.0",
  "buildNumber": "2",
  "platform": "android"
}
```

**Response**:
```json
{
  "version": "2.1",
  "buildNumber": 3,
  "isUpdateAvailable": true,
  "isMandatory": false,
  "updateMessage": "New features available...",
  "downloadUrl": "https://play.google.com/store/apps/details?id=com.hiranyagarbh"
}


## Configuration Options

### Update Service Configuration
Edit `src/API/UpdateService.js`:
```javascript
const CURRENT_VERSION = '2.1';           // App version
const BUILD_NUMBER = 3;                  // Build number
const IS_MANDATORY = false;              // Force update
const UPDATE_MESSAGE = 'Your message';   // Update message in Hindi/English
const DOWNLOAD_URL = 'Play Store URL';   // Direct download link
```

### Popup Customization
Edit `src/Components/UpdatePopup/UpdatePopup.tsx` to customize:
- Colors and styling
- Button text
- Layout and animations

## Usage in Code

### Manual Update Check
```typescript
import { useDispatch } from 'react-redux';
import { checkForUpdates } from './src/Redux/UpdateActions';

const dispatch = useDispatch();
dispatch(checkForUpdates() as any);
```

### Access Update State
```typescript
import { useSelector } from 'react-redux';

const updateInfo = useSelector((state: any) => state.Common.updateInfo);
const isChecking = useSelector((state: any) => state.Common.isCheckingUpdate);
```

## Testing

1. **Test Update Detection**:
   - Update version in `UpdateService.js`
   - Restart app
   - Should show update popup

2. **Test Dismissal**:
   - Click "Later" button
   - Restart app
   - Should not show popup again

3. **Test Mandatory Update**:
   - Set `IS_MANDATORY = true`
   - Only "Update Now" button should appear

## Troubleshooting

### Popup Not Showing
- Check API endpoint is reachable
- Verify version comparison logic
- Check Redux state in debugger

### API Connection Issues
- Verify Heroku service is running
- Check network connectivity
- Review API error logs

### Version Comparison Issues
- Ensure version format is consistent (e.g., "2.1", "2.10")
- Check build numbers are integers

## Deployment Checklist

- [ ] Deploy updated API service to Heroku
- [ ] Update version in `android/app/build.gradle`
- [ ] Update version in `src/API/UpdateService.js`
- [ ] Test update popup functionality
- [ ] Test dismissal and persistence
- [ ] Upload new version to Play Store

## Support

For issues or questions regarding the update system:
1. Check API service logs
2. Verify network connectivity
3. Review Redux state in React Native Debugger
4. Check AsyncStorage for dismissed updates