/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-mapkit',

  contentFor: function(type, config) {
    if (type === 'head') {
      return '<script src="http://maps.googleapis.com/maps/api/js?v=3"></script>';
    }
  }
};
