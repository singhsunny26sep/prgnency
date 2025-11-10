import AsyncStorage from '@react-native-async-storage/async-storage';
import { actionTypes } from './ActionTypes';
import { Services } from '../API/API';
import { getCurrentAppVersion, isUpdateAvailable, UpdateInfo } from '../Utils/VersionUtils';

/**
 * Action to start update check
 */
export const checkUpdateStart = () => ({
  type: actionTypes.CHECK_UPDATE_START,
});

/**
 * Action to handle successful update check
 */
export const checkUpdateSuccess = (updateInfo: UpdateInfo) => ({
  type: actionTypes.CHECK_UPDATE_SUCCESS,
  payload: updateInfo,
});

/**
 * Action to handle update check error
 */
export const checkUpdateError = (error: string) => ({
  type: actionTypes.CHECK_UPDATE_ERROR,
  payload: error,
});

/**
 * Action to set update info
 */
export const setUpdateInfo = (updateInfo: UpdateInfo | null) => ({
  type: actionTypes.SET_UPDATE_INFO,
  payload: updateInfo,
});

/**
 * Action to set update dismissed status
 */
export const setUpdateDismissed = (dismissed: boolean) => ({
  type: actionTypes.SET_UPDATE_DISMISSED,
  payload: dismissed,
});

/**
 * Thunk action to check for app updates
 */
export const checkForUpdates = () => {
  return async (dispatch: any) => {
    try {
      dispatch(checkUpdateStart());

      // Get current app version
      const currentVersionInfo = getCurrentAppVersion();

      // Call API to check for updates
      const response = await Services.checkAppUpdate({
        currentVersion: currentVersionInfo.version,
        buildNumber: currentVersionInfo.buildNumber,
        platform: currentVersionInfo.platform,
      });

      if (response && response.data) {
        const updateData = response.data;

        // Check if update is available
        const isAvailable = isUpdateAvailable(currentVersionInfo.version, updateData.version);

        const updateInfo: UpdateInfo = {
          version: updateData.version,
          buildNumber: updateData.buildNumber || 0,
          isUpdateAvailable: isAvailable,
          isMandatory: updateData.isMandatory || false,
          updateMessage: updateData.updateMessage || 'A new version is available',
          downloadUrl: updateData.downloadUrl || '',
        };

        dispatch(checkUpdateSuccess(updateInfo));
        return updateInfo;
      } else {
        dispatch(checkUpdateError('Invalid response from server'));
        return null;
      }
    } catch (error: any) {
      console.error('Update check error:', error);
      dispatch(checkUpdateError(error.message || 'Failed to check for updates'));
      return null;
    }
  };
};

/**
 * Thunk action to dismiss update popup
 */
export const dismissUpdate = (version?: string) => {
  return async (dispatch: any) => {
    try {
      // Store dismissed version in AsyncStorage
      if (version) {
        await AsyncStorage.setItem('dismissedUpdateVersion', version);
      }

      dispatch(setUpdateDismissed(true));
    } catch (error) {
      console.error('Error dismissing update:', error);
    }
  };
};

/**
 * Check if update was previously dismissed
 */
export const checkDismissedUpdate = () => {
  return async (dispatch: any) => {
    try {
      const dismissedVersion = await AsyncStorage.getItem('dismissedUpdateVersion');
      if (dismissedVersion) {
        dispatch(setUpdateDismissed(true));
      }
    } catch (error) {
      console.error('Error checking dismissed update:', error);
    }
  };
};