/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-mapkit',

  contentFor: function (type, config) {
    // this code has been directly lifted from: https://github.com/huafu/ember-google-map/blob/master/index.js
    var src, content = '', google = config.googleMap || {}, params = [], apiKey;
    if (type === 'head') {
      src = "//maps.googleapis.com/maps/api/js";
      // shouldn't need encoding, but who knows what version format it can handle
      params.push('v=' + encodeURIComponent(google.version || '3'));
      // grab either API key or client ID
      apiKey = google.key || google.apiKey;
      if (apiKey) {
        if (google.key) {
          console.warn('[google-map][DEPRECATED] Prefer using `apiKey` instead of `key` for the Google Map API key.');
        }
        if (google.clientId) {
          console.warn('[google-map] You set the API key and a client ID, only the API key will be used, if you set client ID you then not need any API key.');
        }
        params.push('key=' + encodeURIComponent(apiKey));
      }
      else if (google.clientId) {
        // add the client ID
        params.push('client=' + encodeURIComponent(google.clientId));
      }
      // add libraries if specified
      if (google.libraries && google.libraries.length) {
        params.push('libraries=' + encodeURIComponent(google.libraries.join(',')));
      }
      // build our URL
      src += '?' + params.join('&');
      if (google.lazyLoad) {
        content = '<meta name="ember-google-map-sdk-url" content="' + src + '">';
      }
      else {
        content = '<script type="text/javascript" src="' + src + '"></script>';
      }
    }

    return content;
  },

  config: function (env, baseConfig) {
    var ENV = {
      APP: {
        MAPKIT: {
          SOURCE: 'http://maps.googleapis.com/maps/api/js?v=3"',

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
