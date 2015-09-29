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
      const $map = L.map(this.getMapElement()).setView([config.lat, config.lng], config.zoom);

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo($map);

      this.set('map', $map);

      this.addMarkers(markers);
    });
  }),

  teardown: Ember.on('willDestroyElement', function () {
    const markerMap = this.get('markerMap');

    markerMap.forEach((mapMarker) => {
      mapMarker.clearAllEventListeners();
    });

    markerMap.clear();
  }),

  addMarker(marker) {
    marker = JSON.parse(JSON.stringify(marker));

    const {config, markerMap, map} = this.getProperties('config', 'markerMap', 'map');

    const options = {};

    if (marker.draggable) {
      options.draggable = true;
    }

    if (marker.title) {
      options.title = marker.title;
    }

    const mapMarker = L.marker([marker.position.lat, marker.position.lng], options);

    mapMarker.addTo(map);

    markerMap.set(marker.id, mapMarker);

    // apply default marker events
    const self = this;
    config.markerEvents.forEach(function (eventName) {
      self.addMarkerListener(marker.id, eventName);
    }, mapMarker);
  },

  addMarkerListener(id, eventName) {
    let data = {
      id: id,
      type: eventName
    };

    this.getMarker(id).on(eventName, () => {
      data.position = this.getMarkerPosition(id);
      data.pixel = this.getMarkerPixel(id);

      this.sendAction(LeafletUtility.marker.eventAction(eventName), this, id, data);
    });
  },

  removeAllMarkerListeners(id) {
    this.getMarker(id).clearAllEventListeners();
  },

  removeMarkerListener(id, eventName) {
    this.getMarker(id).off(eventName);
  },

  getMarkerPosition(id) {
    const position = this.getMarker(id).getLatLng();

    return {
      lat: position.lat,
      lng: position.lng
    };
  },

  _getMarkerPixel(mapMarker) {
    const markerPixel = this.get('map').latLngToLayerPoint(mapMarker.getLatLng());
    const mapPixel = this.getMapPixel();

    return {
      x: parseInt(mapPixel.left + markerPixel.x, 10),
      y: parseInt(mapPixel.top + markerPixel.y, 10)
    };
  },

  setMarkerDraggable(id, draggable) {
    if (draggable) {
      this.getMarker(id).dragging.enable();
    } else {
      this.getMarker(id).dragging.disable();
    }
  },

  setMarkerTitle(/*id, title*/) {
    // TODO - Find way to set leaflet marker title
  }
});
