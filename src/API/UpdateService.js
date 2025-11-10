// Update Service API endpoint for Heroku deployment
// This file can be deployed as a separate service to handle update checks

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Current app version info - Update this when releasing new versions
const CURRENT_VERSION = '2.1';
const BUILD_NUMBER = 3;
const IS_MANDATORY = false;
const UPDATE_MESSAGE = 'नई सुविधाओं और बग फिक्स के साथ अपडेट उपलब्ध है। कृपया ऐप को अपडेट करें।';
const DOWNLOAD_URL = 'https://play.google.com/store/apps/details?id=com.hiranyagarbh';

// API endpoint to check for updates
app.post('/api/app/check-update', (req, res) => {
  try {
    const { currentVersion, buildNumber, platform } = req.body;

    console.log('Update check request:', {
      currentVersion,
      buildNumber,
      platform,
      serverVersion: CURRENT_VERSION,
      serverBuild: BUILD_NUMBER
    });

    // Compare versions - simple string comparison for now
    // You can implement more sophisticated version comparison if needed
    const isUpdateAvailable = currentVersion !== CURRENT_VERSION;

    const updateInfo = {
      version: CURRENT_VERSION,
      buildNumber: BUILD_NUMBER,
      isUpdateAvailable,
      isMandatory: IS_MANDATORY,
      updateMessage: UPDATE_MESSAGE,
      downloadUrl: DOWNLOAD_URL,
      platform: platform
    };

    res.json(updateInfo);
  } catch (error) {
    console.error('Update check error:', error);
    res.status(500).json({
      error: 'Failed to check for updates',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    version: CURRENT_VERSION,
    buildNumber: BUILD_NUMBER,
    timestamp: new Date().toISOString()
  });
});

// Get current version info
app.get('/api/app/version', (req, res) => {
  res.json({
    version: CURRENT_VERSION,
    buildNumber: BUILD_NUMBER,
    isMandatory: IS_MANDATORY,
    updateMessage: UPDATE_MESSAGE,
    downloadUrl: DOWNLOAD_URL
  });
});

app.listen(PORT, () => {
  console.log(`Update Service running on port ${PORT}`);
  console.log(`Current version: ${CURRENT_VERSION} (Build: ${BUILD_NUMBER})`);
});

module.exports = app;