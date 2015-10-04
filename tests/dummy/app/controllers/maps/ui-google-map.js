import Ember from 'ember';

export default Ember.Controller.extend({
  config: {
    mapType: 'satellite',
    options: {
      zoom: 7,
      center: {
        lat: 62.9945,
        lng: -96.329
      }
    },
    mapEvents: ['click', 'doubleClick'],
    markerEvents: ['click', 'dragEnd']
  },

  actions: {
    mapReady(map) {
      this.set('map', map);
    }
  }
});
