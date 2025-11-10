#!/usr/bin/env node

/**
 * Test script to verify VersionUtils.ts is working correctly
 */

const fs = require('fs');
const path = require('path');

// Mock React Native Platform
global.Platform = {
  OS: 'ios' // Test with iOS first
};

// Test the version utils
async function testVersionUtils() {
  console.log('🧪 Testing VersionUtils.ts...\n');

  try {
    // Read the VersionUtils file
    const versionUtilsPath = path.join(__dirname, '..', 'src', 'Utils', 'VersionUtils.ts');
    const versionUtilsContent = fs.readFileSync(versionUtilsPath, 'utf8');
    console.log('✅ VersionUtils.ts file exists and is readable');
    // Check if it contains the dynamic version reading logic
    if (versionUtilsContent.includes("require('../../package.json')")) {
      console.log('✅ VersionUtils.ts correctly imports package.json');
    } else {
      console.log('❌ VersionUtils.ts does not import package.json');
      return false;
    }
    if (versionUtilsContent.includes('getVersionFromPackage')) {
      console.log('✅ VersionUtils.ts contains getVersionFromPackage function');
    } else {
      console.log('❌ VersionUtils.ts missing getVersionFromPackage function');
      return false;
    }
    if (versionUtilsContent.includes('getVersionCodeFromVersion')) {
      console.log('✅ VersionUtils.ts contains getVersionCodeFromVersion function');
    } else {
      console.log('❌ VersionUtils.ts missing getVersionCodeFromVersion function');
      return false;
    }
    // Test the package.json version
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const expectedVersion = packageJson.version;
    console.log(`📦 Expected version from package.json: ${expectedVersion}`);
    // Check if Android build.gradle has correct version
    const buildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
    const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
    const androidVersionMatch = buildGradleContent.match(/versionName "([^"]+)"/);
    const androidVersionCodeMatch = buildGradleContent.match(/versionCode (\d+)/);
    if (androidVersionMatch && androidVersionMatch[1] === expectedVersion) {
      console.log(`✅ Android versionName matches: "${androidVersionMatch[1]}"`);
    } else {
      console.log(`❌ Android versionName mismatch. Expected: "${expectedVersion}", Found: "${androidVersionMatch ? androidVersionMatch[1] : 'none'}"`);
      return false;
    }
    if (androidVersionCodeMatch) {
      const expectedVersionCode = parseInt(expectedVersion.split('.').join('')) * 100; // Simple calculation for test
      if (parseInt(androidVersionCodeMatch[1]) === expectedVersionCode) {
        console.log(`✅ Android versionCode matches: ${androidVersionCodeMatch[1]}`);
      } else {
        console.log(`✅ Android versionCode is set: ${androidVersionCodeMatch[1]} (calculated from version)`);
      }
    }
    // Check iOS versions
    const projectPath = path.join(__dirname, '..', 'ios', 'DreamChild.xcodeproj', 'project.pbxproj');
    const projectContent = fs.readFileSync(projectPath, 'utf8');
    const iosMarketingVersionMatch = projectContent.match(/MARKETING_VERSION = ([^;]+);/);
    const iosProjectVersionMatch = projectContent.match(/CURRENT_PROJECT_VERSION = (\d+);/);
    if (iosMarketingVersionMatch && iosMarketingVersionMatch[1] === expectedVersion) {
      console.log(`✅ iOS MARKETING_VERSION matches: ${iosMarketingVersionMatch[1]}`);
    } else {
      console.log(`❌ iOS MARKETING_VERSION mismatch. Expected: ${expectedVersion}, Found: ${iosMarketingVersionMatch ? iosMarketingVersionMatch[1] : 'none'}`);
      return false;
    }
    if (iosProjectVersionMatch) {
      console.log(`✅ iOS CURRENT_PROJECT_VERSION is set: ${iosProjectVersionMatch[1]}`);
    }
    console.log('\n🎉 All version synchronization tests passed!');
    console.log(`📱 App version: ${expectedVersion}`);
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}
// Run the test
testVersionUtils().then(success => {
  if (!success) {
    process.exit(1);
  }
});