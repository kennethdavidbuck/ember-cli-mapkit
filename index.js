/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-mapkit',

  contentFor: function (type, config) {
    if (type === 'head') {
      return '<script src="' + config.APP.MAPKIT.SOURCE + '"></script>';
    }
  },

  config: function (env, baseConfig) {
    var ENV = {
      APP: {
        contentSecurityPolicy: {
          'default-src': "'none'",
          'script-src':  "'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com maps.gstatic.com gist.github.com",
          'font-src':    "'self' fonts.gstatic.com",
          'connect-src': "'self'",
          'img-src':     "'self' *.gstatic.com *.googleapis.com",
          'style-src':   "'self' 'unsafe-inline' gist-assets.github.com fonts.googleapis.com",
          'frame-src':   "ghbtns.com platform.twitter.com"
        },

        MAPKIT: {
          KEY: null,

          API_KEY: null,

          CLIENT_ID: null,

          LIBRARIES: [],

          SOURCE: 'http://maps.googleapis.com/maps/api/js?v=3',

          MAP_TYPE: 'satellite',

          MAP_DEFAULT_ZOOM: 7,

          MAP_DEFAULT_LAT: 62.9945,

          MAP_DEFAULT_LNG: -96.329,

          MAP_EVENTS: [
            //'bounds_changed',
            //'center_changed',
            //'click',
            //'dblclick',
            //'rightclick',
            //'tilesloaded',
            //'tiles_changed',
            //'zoom_changed',
            //'drag',
            //'dragend',
            //'dragstart',
            //'heading_changed',
            //'idle',
            //'maptypeid_changed',
            //'projection_changed',
            //'mousemove',
            //'mouseup',
            //'mousedown',
            //'mouseover',
            //'mouseout'
          ],

          MARKER_EVENTS: [
            //'animation_changed',
            //'click',
            //'clickable_changed',
            //'cursor_changed',
            //'dblclick',
            //'drag',
            //'dragend',
            //'draggable_changed',
            //'dragstart',
            //'flat_changed',
            //'icon_changed',
            //'mousedown',
            //'mouseout',
            //'mouseover',
            //'mouseup',
            //'position_changed',
            //'rightclick',
            //'shape_changed',
            //'title_changed',
            //'visible_changed',
            //'zindex_changed'
          ],

          MARKER_CLUSTERER: {

            /**
             *
             */
            gridSize: 60,

            /**
             *
             */
            hideLabel: false,

            /**
             *
             */
            maxZoom: 6,

            /**
             *
             */
            styles: [],

            /**
             * Whether or not to zoom map all the way
             * in on click
             */
            zoomOnClick: false,

            /**
             *
             */
            averageCenter: false,

            /**
             *
             */
            ignoreHidden: false,

            /**
             *
             */
            enableRetinaIcons: false,

            /**
             *
             */
            imagePath: false
          }
        }
      }
    };

    return ENV;
  }
};
