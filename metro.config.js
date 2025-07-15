const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = {};

// First merge the default config with our custom config
const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

// Then wrap with Reanimated config
module.exports = wrapWithReanimatedMetroConfig(mergedConfig);
