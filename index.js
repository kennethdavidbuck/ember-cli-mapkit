/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-mapkit',

  contentFor: function (type, config) {
    if (type === 'head') {
      var content = '';

      if(config.APP.MAPKIT.googleMaps.enabled) {
        content += '<script src="' + config.APP.MAPKIT.googleMaps.source + '"></script>';
      }

      if(config.APP.MAPKIT.leafletMaps.enabled) {
        content += '<link rel="stylesheet" href="' + config.APP.MAPKIT.leafletMaps.src + '.css" />';
        content += '<script src="' + config.APP.MAPKIT.leafletMaps.src + '.js"></script>';
      }

      return content;
    }
  },

  config: function (env, baseConfig) {
    var ENV = {
      APP: {
        MAPKIT: {
          googleMaps: {
            enabled: true,
            source: 'http://maps.googleapis.com/maps/api/js?v=3',
            apiKey: null,
            key: null,
            clientId: null,
            libraries: []
          },
          leafletMaps: {
            enabled:true,
            src: 'http://cdn.leafletjs.com/leaflet-0.7.5/leaflet',
            provider: ''
          }
        }
      }
    };

    return ENV;
  }
};
