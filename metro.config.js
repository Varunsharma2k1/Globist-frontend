const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude build artifacts and root node_modules from watcher to prevent EMFILE limit issues
config.resolver.blacklistedRE = /node_modules\/.*\/node_modules/;

module.exports = config;
