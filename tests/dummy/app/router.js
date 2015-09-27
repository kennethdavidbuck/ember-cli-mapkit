import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('maps', function () {
    this.route('ui-google-map');
    this.route('ui-leaflet-map');
  });
});

export default Router;
