var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults);

  app.import('bower_components/gmaps-markerclusterer-plus/dist/markerclusterer.min.js',{});

  return app.toTree();
};
