import Ember from 'ember';

const {merge} = 'ember';

export default Ember.Controller.extend({
  config: {
    zoom: 7,
    lat: 62.9945,
    lng: -96.329,
    mapType: 'satellite',
    mapEvents: ['click', 'dblclick'],
    markerEvents: ['click', 'dragend'],
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
    },

    mapDoubleClick(map, data) {
      const marker = Ember.Object.create(merge({
        id: 1234,
        draggable: true
      }, data));

      this.get('model').pushObject(marker);

      map.addMarker(marker);

      return true;
    }
  }
});
