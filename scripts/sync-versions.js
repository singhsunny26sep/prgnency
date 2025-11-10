#!/usr/bin/env node

/**
 * Version Sync Script
 *
 * This script automatically synchronizes the app version from package.json
 * to Android (build.gradle) and iOS (project.pbxproj) configuration files.
 *
 * Usage:
 *   node scripts/sync-versions.js
 *   npm run sync-versions
 */

const fs = require('fs');
const path = require('path');

// Read package.json to get the version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`📦 Source version from package.json: ${version}`);

// Parse version into components
const versionParts = version.split('.');
const major = parseInt(versionParts[0]) || 0;
const minor = parseInt(versionParts[1]) || 0;
const patch = parseInt(versionParts[2]) || 0;

// Calculate version code (Android) - simple incrementing number
// You can customize this logic based on your versioning strategy
const versionCode = major * 10000 + minor * 100 + patch;

console.log(`🔢 Calculated version code: ${versionCode}`);
console.log(`📱 Version name: ${version}`);

// Update Android build.gradle
function updateAndroidVersion() {
  const buildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');

  if (!fs.existsSync(buildGradlePath)) {
    console.error('❌ Android build.gradle not found');
    return false;
  }

  let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');

  // Update versionCode
  const versionCodeRegex = /versionCode\s+\d+/;
  if (versionCodeRegex.test(buildGradleContent)) {
    buildGradleContent = buildGradleContent.replace(
      versionCodeRegex,
      `versionCode ${versionCode}`
    );
    console.log(`✅ Updated Android versionCode to: ${versionCode}`);
  } else {
    console.warn('⚠️  Could not find versionCode in build.gradle');
  }

  // Update versionName
  const versionNameRegex = /versionName\s+"[^"]*"/;
  if (versionNameRegex.test(buildGradleContent)) {
    buildGradleContent = buildGradleContent.replace(
      versionNameRegex,
      `versionName "${version}"`
    );
    console.log(`✅ Updated Android versionName to: "${version}"`);
  } else {
    console.warn('⚠️  Could not find versionName in build.gradle');
  }

  fs.writeFileSync(buildGradlePath, buildGradleContent);
  return true;
}

// Update iOS project.pbxproj
function updateIOSVersion() {
  const projectPath = path.join(__dirname, '..', 'ios', 'DreamChild.xcodeproj', 'project.pbxproj');

  if (!fs.existsSync(projectPath)) {
    console.error('❌ iOS project.pbxproj not found');
    return false;
  }

  let projectContent = fs.readFileSync(projectPath, 'utf8');

  // Update MARKETING_VERSION (user-facing version)
  const marketingVersionRegex = /MARKETING_VERSION\s*=\s*[^;]+;/g;
  const newMarketingVersion = `MARKETING_VERSION = ${version};`;

  if (marketingVersionRegex.test(projectContent)) {
    projectContent = projectContent.replace(
      marketingVersionRegex,
      newMarketingVersion
    );
    console.log(`✅ Updated iOS MARKETING_VERSION to: ${version}`);
  } else {
    console.warn('⚠️  Could not find MARKETING_VERSION in project.pbxproj');
  }

  // Update CURRENT_PROJECT_VERSION (build number)
  const currentProjectVersionRegex = /CURRENT_PROJECT_VERSION\s*=\s*[^;]+;/g;
  const newCurrentProjectVersion = `CURRENT_PROJECT_VERSION = ${versionCode};`;

  if (currentProjectVersionRegex.test(projectContent)) {
    projectContent = projectContent.replace(
      currentProjectVersionRegex,
      newCurrentProjectVersion
    );
    console.log(`✅ Updated iOS CURRENT_PROJECT_VERSION to: ${versionCode}`);
  } else {
    console.warn('⚠️  Could not find CURRENT_PROJECT_VERSION in project.pbxproj');
  }

  fs.writeFileSync(projectPath, projectContent);
  return true;
}

// Main execution
function main() {
  console.log('🚀 Starting version synchronization...\n');

  let androidSuccess = true;
  let iosSuccess = true;

  try {
    androidSuccess = updateAndroidVersion();
  } catch (error) {
    console.error('❌ Error updating Android version:', error.message);
    androidSuccess = false;
  }

  console.log('');

  try {
    iosSuccess = updateIOSVersion();
  } catch (error) {
    console.error('❌ Error updating iOS version:', error.message);
    iosSuccess = false;
  }

  console.log('');
  console.log('📊 Synchronization Summary:');
  console.log(`   Android: ${androidSuccess ? '✅ Success' : '❌ Failed'}`);
  console.log(`   iOS:     ${iosSuccess ? '✅ Success' : '❌ Failed'}`);

  if (androidSuccess && iosSuccess) {
    console.log('\n🎉 All versions synchronized successfully!');
    console.log(`📱 App version: ${version} (${versionCode})`);
  } else {
    console.log('\n⚠️  Some versions failed to synchronize. Please check the errors above.');
    process.exit(1);
  }
}

// Run the script
main();