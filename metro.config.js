const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};
const defaultConfig = getDefaultConfig(__dirname);
module.exports = mergeConfig(
  {
    ...defaultConfig,
    resolver: {
      sourceExts: [
        ...defaultConfig.resolver.sourceExts,
        'jsx',
        'js',
        'ts',
        'tsx',
      ],
    },
  },
  config,
);
