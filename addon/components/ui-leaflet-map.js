import Ember from 'ember';
import layout from '../templates/components/ui-leaflet-map';

/*global L, JSON*/

export default Ember.Component.extend({
  layout: layout,
  tagName: 'ui-leaflet-map',
  classNames: ['ui-map', 'ui-leaflet-map'],

  readyAction: 'mapReady',

  isLoaded: false,

  markers: [],

  markerClusterer: null,

  markerMap: null,

  preSetup: Ember.on('init', function () {
    this.setProperties({
      markerMap: Ember.Map.create()
    });
  }),

  setup: Ember.on('didInsertElement', function () {
    Ember.run.next(() => {
      const {markers, config} = this.getProperties('markers', 'config');
      const $map = L.map(this.$()[0]).setView([config.lat, config.lng], config.zoom);

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo($map);

      this.set('leafletMap', $map);

      this.addMarkers(markers);

      this.sendAction('readyAction', this);
    });
  }),

  addMarkers(markers) {
    markers.forEach((marker) => {
      this.addMarker(marker);
    });
  },

  addMarker(marker) {
    // force POJO for standardized processing, and because passing an Ember Object as params to a new google marker does not work.
    marker = JSON.parse(JSON.stringify(marker));

    const {markerMap, leafletMap} = this.getProperties('markerMap', 'leafletMap');

    const options = {};

    if(marker.draggable) {
      options.draggable = true;
    }

    if(marker.title) {
      options.title = marker.title;
    }

    const leafletMarker = L.marker([marker.position.lat, marker.position.lng], options);

    leafletMarker.addTo(leafletMap);

    markerMap.set(marker.id, leafletMarker);
  }
});
