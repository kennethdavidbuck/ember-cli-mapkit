import Ember from 'ember';

export default Ember.Controller.extend({
  config: {
    zoom: 7,
    lat: 62.9945,
    lng: -96.329,
    mapType: 'satellite',
    mapEvents: [],
    markerEvents: []
  },

  actions: {
    mapReady(map) {
      this.set('map', map);
    }
  }
});
