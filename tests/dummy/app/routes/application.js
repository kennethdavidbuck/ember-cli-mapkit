import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    mapReady: function () {
      Ember.Logger.log('Map ready');
    },

    mapEvent: function (name, data) {
      Ember.Logger.log(name, data);
    },

    markerEvent: function (name, data) {
      Ember.Logger.log(name, data);
    }
  }
});
