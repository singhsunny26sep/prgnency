import { Dimensions, Platform } from 'react-native';

export interface AppVersionInfo {
  version: string;
  buildNumber: string;
  platform: string;
}

export interface UpdateInfo {
  version: string;
  buildNumber: number;
  isUpdateAvailable: boolean;
  isMandatory: boolean;
  updateMessage: string;
  downloadUrl: string;
}

// Read version from package.json at runtime
const getVersionFromPackage = (): string => {
  try {
    // In React Native, we need to read the package.json file
    // Since we can't directly import JSON in this context, we'll use a dynamic approach
    const packageJson = require('../../package.json');
    return packageJson.version || '1.0.0';
  } catch (error) {
    console.warn('Could not read version from package.json, using default:', error);
    return '1.0.0';
  }
};

// Calculate version code from version string
const getVersionCodeFromVersion = (version: string): number => {
  const parts = version.split('.').map(Number);
  return parts[0] * 10000 + parts[1] * 100 + (parts[2] || 0);
};

/**
 * Get current app version information from build config
 */
export const getCurrentAppVersion = (): AppVersionInfo => {
  const version = getVersionFromPackage();
  const versionCode = getVersionCodeFromVersion(version);
  const platform = Platform.OS;

  return {
    version,
    buildNumber: versionCode.toString(),
    platform,
  };
};

/**
 * Compare two version strings
 * Returns: -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 */
export const compareVersions = (version1: string, version2: string): number => {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }
  return 0;
};

/**
 * Check if an update is available
 */
export const isUpdateAvailable = (
  currentVersion: string,
  latestVersion: string
): boolean => {
  return compareVersions(currentVersion, latestVersion) < 0;
};

/**
 * Get device dimensions for responsive design
 */
export const getDeviceDimensions = () => {
  return {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };
};

/**
 * Format version for display
 */
export const formatVersionDisplay = (version: string, buildNumber?: string): string => {
  if (buildNumber && buildNumber !== '1') {
    return `v${version} (${buildNumber})`;
  }
  return `v${version}`;
};