var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {

  defaults['ember-bootstrap'] = {
    importBootstrapTheme: true
  };

  var app = new EmberAddon(defaults);

  return app.toTree();
};
