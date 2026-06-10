// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// react-native-fast-tflite requires `.tflite` files to be bundled as assets, so
// that `require('../../assets/models/fast_brain.tflite')` resolves at build time.
config.resolver.assetExts.push('tflite');

module.exports = config;
