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
      // Here you can pass flags/options to your application instance
      // when it is created
      // Here you can pass flags/options to your application instance
      // when it is created,
      MAPKIT: {
        MAP_EVENTS: [
          'bounds_changed',
          'center_changed',
          'click',
          'dblclick',
          'rightclick',
          'tilesloaded',
          'tiles_changed',
          'zoom_changed',
          'drag',
          'dragend',
          'dragstart',
          'heading_changed',
          'idle',
          'maptypeid_changed',
          'projection_changed',
          'mousemove',
          'mouseup',
          'mousedown',
          'mouseover',
          'mouseout'
        ],

        MARKER_EVENTS: [
          'animation_changed',
          'click',
          'clickable_changed',
          'cursor_changed',
          'dblclick',
          'drag',
          'dragend',
          'draggable_changed',
          'dragstart',
          'flat_changed',
          'icon_changed',
          'mousedown',
          'mouseout',
          'mouseover',
          'mouseup',
          'position_changed',
          'rightclick',
          'shape_changed',
          'title_changed',
          'visible_changed',
          'zindex_changed'
        ]
      }
    },
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src':  "'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com maps.gstatic.com gist.github.com",
      'font-src':    "'self' fonts.gstatic.com",
      'connect-src': "'self'",
      'img-src':     "'self' *.gstatic.com *.googleapis.com",
      'style-src':   "'self' 'unsafe-inline' gist-assets.github.com fonts.googleapis.com",
      'frame-src':   "ghbtns.com platform.twitter.com"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
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

  }

  return ENV;
};
