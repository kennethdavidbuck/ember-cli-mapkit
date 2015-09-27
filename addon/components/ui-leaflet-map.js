import Ember from 'ember';
import LeafletUtility from '../utilities/leaflet';
import UIAbstractMap from './ui-abstract-map';

import layout from '../templates/components/ui-leaflet-map';

/*global L, JSON*/

export default UIAbstractMap.extend({

  layout: layout,
  tagName: 'ui-leaflet-map',
  classNames: ['ui-leaflet-map'],

  setup: Ember.on('didInsertElement', function () {
    Ember.run.next(() => {
      const {markers, config} = this.getProperties('markers', 'config');
      const $map = L.map(this.$()[0]).setView([config.lat, config.lng], config.zoom);

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo($map);

      this.set('leafletMap', $map);

      this.addMarkers(markers);
    });
  }),

  addMarkers(markers) {
    markers.forEach((marker) => {
      this.addMarker(marker);
    });
  },

  addMarker(marker) {
    marker = JSON.parse(JSON.stringify(marker));

    const {config, markerMap, leafletMap} = this.getProperties('config', 'markerMap', 'leafletMap');

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

    // apply default marker events
    const self = this;
    config.markerEvents.forEach(function (eventName) {
      self.addMarkerListener(marker.id, eventName);
    }, leafletMarker);
  },

  addMarkerListener(id, eventName) {
    let data = {};
    const {markerMap} = this.getProperties('markerMap');

    Ember.assert('MapKit: This marker has no mapping', markerMap.has(id));

    const leafletMarker = markerMap.get(id);

    leafletMarker.on(eventName, () => {
      data = {
        id: id
      };

      this.sendAction(LeafletUtility.marker.eventAction(eventName), this, id, data);
    });
  },
});
