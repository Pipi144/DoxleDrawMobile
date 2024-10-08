const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts = [
  ...defaultConfig.resolver.sourceExts,
  'cjs',
  'jsx',
  'js',
  'ts',
  'tsx',
];
module.exports = defaultConfig;
