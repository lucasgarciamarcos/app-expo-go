// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Adicionar suporte para arquivos .cjs (CommonJS)
defaultConfig.resolver.sourceExts.push('cjs');

// Desabilitar o recurso de exportações de pacotes
// Isso pode resolver problemas com o Firebase e outros pacotes
defaultConfig.resolver.unstable_enablePackageExports = false;

// Resolver problemas com o Firebase e pacotes relacionados
defaultConfig.resolver.extraNodeModules = {
  ...defaultConfig.resolver.extraNodeModules,
  '@firebase/auth': require.resolve('@firebase/auth'),
  '@firebase/app': require.resolve('@firebase/app'),
  '@firebase/util': require.resolve('@firebase/util'),
  '@firebase/component': require.resolve('@firebase/component'),
};

module.exports = defaultConfig;