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

  teardown: Ember.on('willDestroyElement', function () {
    const markerMap = this.get('markerMap');

    markerMap.forEach((leafletMarker) => {
      leafletMarker.clearAllEventListeners();
    });

    markerMap.clear();
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

    if (marker.draggable) {
      options.draggable = true;
    }

    if (marker.title) {
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
    let data = {
      id: id,
      type: eventName
    };
    const {markerMap} = this.getProperties('markerMap');

    Ember.assert('[MapKit:Leaflet] This marker has no mapping', markerMap.has(id));

    const leafletMarker = markerMap.get(id);

    leafletMarker.on(eventName, () => {
      data.position = this.getMarkerPosition(id);
      data.pixel = this.getMarkerPixel(id);

      this.sendAction(LeafletUtility.marker.eventAction(eventName), this, id, data);
    });
  },

  removeAllMarkerListeners(id) {
    const {markerMap} = this.getProperties('markerMap');

    Ember.assert('[MapKit:Leaflet] This marker has no mapping', markerMap.has(id));

    markerMap.get(id).clearAllEventListeners();
  },

  removeMarkerListener(id, eventName) {
    const {markerMap} = this.getProperties('markerMap');

    Ember.assert('[MapKit:Leaflet] This marker has no mapping', markerMap.has(id));

    markerMap.get(id).off(eventName);
  },

  getMarkerPosition(id) {
    const markerMap = this.get('markerMap');

    Ember.assert('MapKit: This marker has no mapping', markerMap.has(id));

    const position = markerMap.get(id).getLatLng();

    return {
      lat: position.lat,
      lng: position.lng
    };
  },

  _getMarkerPixel(leafletMarker) {
    const markerPixel = this.get('leafletMap').latLngToLayerPoint(leafletMarker.getLatLng());
    const mapPixel = this.getMapPixel();

    return {
      x: parseInt(mapPixel.left + markerPixel.x, 10),
      y: parseInt(mapPixel.top + markerPixel.y, 10)
    };
  },

  setMarkerDraggable(id, draggable) {
    const markerMap = this.get('markerMap');

    Ember.assert('MapKit: This marker has no mapping', markerMap.has(id));

    const leafletMarker = markerMap.get(id);

    if (draggable) {
      leafletMarker.dragging.enable();
    } else {
      leafletMarker.dragging.disable();
    }
  },

  setMarkerTitle(id/*, title*/) {
    const markerMap = this.get('markerMap');

    Ember.assert('MapKit: This marker has no mapping', markerMap.has(id));

    // TODO - Find way to set leaflet marker title
    Ember.Logger.log('TODO: Provide means of setting marker title.');
  }
});
