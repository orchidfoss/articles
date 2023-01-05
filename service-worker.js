'use strict';

var cacheName = 'orchid-cache-v2';
var cacheAssets = [
  'index.html',
  'manifest.json',
  'lib/gaia-icons/gaia-icons.css',
  'lib/gaia-icons/bidi-helper.css',
  'style/splashscreen.css',
  'style/main.css',
  'style/warning.css',
  'style/slideshow.css',
  'style/filters.css',
  'style/posts.css',
  'style/comments.css',
  'style/header.css',
  'style/layout.css',
  'style/switches.css',
  'style/seekbars.css',
  'style/buttons.css',
  'style/rating_graphs.css',
  'style/input_areas.css',
  'style/submit_tags.css',
  'style/tooltips.css',
  'style/dropdown.css',
  'style/image_viewer.css',
  'style/submit.css',
  'style/post.css',
  'style/featured.css',
  'style/history.css',
  'style/settings.css',
  'http://www.google.com/jsapi?key=AIzaSyA5m1Nc8ws2BbmPRwKu5gFradvD_hgq6G0',
  'services/script.js" type="module',
  'lib/smooth-scrollbar.js',
  'lib/plugins/overscroll.js',
  'js/main.js',
  'js/languages.js',
  'js/dark_mode.js',
  'js/comments.js',
  'js/views.js',
  'js/file_data.js',
  'js/light_or_dark.js',
  'js/color_picker.js',
  'js/search_results.js',
  'js/posts.js',
  'js/submit_tags.js',
  'js/dropdown.js',
  'js/image_viewer.js',
  'js/views/submit.js',
  'js/views/content.js',
  'js/views/post.js',
  'js/views/featured.js',
  'js/views/history.js',
  'js/views/settings.js',
  'js/dropdowns/main.js',
  'js/dropdowns/help.js',
  'js/l10n.js',
  'locales/main.ar.properties',
  'locales/main.en-US.properties',
  'locales/main.fr.properties',
  'locales/main.zh.properties'
];

// Call install Event
self.addEventListener('install', (e) => {
  // Wait until promise is finished
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log(`Service Worker: Caching Files: ${cache}`);
      cache
        .addAll(cacheAssets)
        // When everything is set
        .then(() => self.skipWaiting());
    })
  );
});

// Call Activate Event
self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated');
  // Clean up old caches by looping through all of the
  // caches and deleting any old caches or caches that
  // are not defined in the list
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache == cacheName) {
            return;
          }

          console.log('Service Worker: Clearing Old Cache');
          return caches.delete(cache);
        })
      );
    })
  );
});
