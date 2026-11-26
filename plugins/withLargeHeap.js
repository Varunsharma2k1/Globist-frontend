/**
 * Lets Android give the app a larger memory budget (android:largeHeap).
 * Budget phones cap normal apps at ~128 MB; video apps need headroom.
 * The real fix is keeping few players alive (see useReelPlayback); this is
 * a safety margin on top.
 */
const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withLargeHeap(config) {
  return withAndroidManifest(config, (cfg) => {
    const app = cfg.modResults.manifest.application?.[0];
    if (app) app.$['android:largeHeap'] = 'true';
    return cfg;
  });
};
