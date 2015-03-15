import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    mapReady: function () {
      Ember.Logger.log('Map ready');
      this.get('map').addMarker(
        Ember.Object.create({ id: 1, title: 'Example', lat: 0, lng: 0})
      );
    },

    mapEvent: function (name, data) {
      Ember.Logger.log(name, data);
    },

    markerEvent: function (name, data) {
      Ember.Logger.log(name, data);
    }
  }
});
