import Ember from 'ember';

export default Ember.Controller.extend({
  config: {
    options: {
      zoom: 7,
      center: {
        lat: 62.9945,
        lng: -96.329
      }
    },
    mapEvents: [],
    markerEvents: []
  },

  actions: {
    mapReady(map) {
      this.set('map', map);
    }
  }
});
