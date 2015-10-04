import Ember from 'ember';

export default Ember.Controller.extend({
  config: {
    zoom: 7,
    lat: 62.9945,
    lng: -96.329,
    mapType: 'satellite',
    mapEvents: [],
    markerEvents: [],
    markerClusterer: {
      gridSize: 60,
      hideLabel: false,
      maxZoom: 6,
      styles: [],
      zoomOnClick: false,
      averageCenter: false,
      ignoreHidden: false,
      enableRetinaIcons: false,
      imagePath: false
    }
  },

  actions: {
    mapReady(map) {
      this.set('map', map);
    }
  }
});
