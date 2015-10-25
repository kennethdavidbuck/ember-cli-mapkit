/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'dummy',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {

    },
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src':  "'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com maps.gstatic.com gist.github.com cdn.leafletjs.com",
      'font-src':    "'self' fonts.gstatic.com",
      'connect-src': "'self'",
      'img-src':     "'self' *.gstatic.com *.googleapis.com *.tile.openstreetmap.org cdn.leafletjs.com",
      'style-src':   "'self' 'unsafe-inline' gist-assets.github.com fonts.googleapis.com cdn.leafletjs.com",
      'frame-src':   "ghbtns.com platform.twitter.com cdn.leafletjs.com"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.baseURL = '/ember-cli-mapkit';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.baseURL = '/';
  }

  return ENV;
};
