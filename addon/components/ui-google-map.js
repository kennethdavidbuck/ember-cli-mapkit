import Ember from 'ember';
import GoogleUtiltity from '../utilities/google';
import UIAbstractMap from './ui-abstract-map';

import layout from '../templates/components/ui-google-map';

/*global JSON*/

export default UIAbstractMap.extend({

  layout: layout,
  tagName: 'ui-google-map',
  classNames: ['ui-google-map'],

  markerClusterer: Ember.computed({
    get() {
      const MarkerClusterer = this.get('MarkerClusterer');
      return new MarkerClusterer(null, [], this.get('config.markerClusterer'));
    }
  }),

  mapTypeId: Ember.computed('map', {
    get() {
      return this.get('map').getMapTypeId();
    },
    set(key, value) {
      let type = GoogleUtiltity.map.type(value);

      const map = this.get('map');

      map.setMapTypeId(type);

      return map.getMapTypeId();
    }
  })['volatile'](),

  setup: Ember.on('didInsertElement', function () {
    Ember.run.next(() => {
      const {config, mapApi, markerClusterer} = this.getProperties('config', 'mapApi', 'markerClusterer');

      let options = {
        zoom: config.zoom,
        center: {
          lat: config.lat,
          lng: config.lng
        }
      };

      let $map = new mapApi.maps.Map(this.getMapElement(), options);

      this.setProperties({
        map: $map,
        mapTypeId: config.mapType
      });

      this.addListeners(this.get('config.mapEvents'));

      //fixes bug where fromLatLnToContainerPixel returns undefined.
      const overlay = new mapApi.maps.OverlayView();
      overlay.draw = function () {
      };
      overlay.setMap($map);

      markerClusterer.setMap($map);

      this.addMarkers(this.get('markers'));

      this.sendAction('readyAction', this.get('mapFacade'));
    });
  }),

  teardown: Ember.on('willDestroyElement', function () {
    const {mapApi, map, markerMap, markerClusterer} = this.getProperties('mapApi', 'map', 'markerMap', 'markerClusterer');

    // clean up all listeners
    markerMap.forEach((mapMarker) => {
      mapApi.maps.event.clearInstanceListeners(mapMarker);
    });

    mapApi.maps.event.clearInstanceListeners(map);

    markerClusterer.clearMarkers();
    markerMap.clear();
  }),

  center: Ember.computed('map', {
    get() {
      const center = this.get('map').getCenter();
      return {
        lat: center.lat(),
        lng: center.lng()
      };
    },
    set(key, position) {
      this.get('map').setCenter(position);

      return position;
    }
  })['volatile'](),

  panTo(position) {
    this.get('map').panTo(position);
  },

  zoom: Ember.computed('map', {
    get() {
      return this.get('map').getZoom();
    },
    set(key, zoom) {
      this.get('map').setZoom(zoom);

      return zoom;
    }
  })['volatile'](),

  tilt: Ember.computed('map', {
    get() {
      return this.get('map').getTilt();
    }
  })['volatile'](),

  bounds: Ember.computed('map', {
    get() {
      const bounds = this.get('map').getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      return {
        sw: {
          lat: sw.lat(),
          lng: sw.lng()
        },
        ne: {
          lat: ne.lat(),
          lng: ne.lng()
        }
      };
    }
  })['volatile'](),

  options: Ember.computed('map', {
    set(key, value) {
      this.get('map').setOptions(value);

      return value;
    }
  }),

  fitToMarkers() {
    this.get('markerClusterer').fitMapToMarkers();
  },

  addListeners(eventNames) {
    eventNames.forEach((eventName) => {
      this.addListener(eventName);
    });
  },

  addListener(eventName) {
    const {mapApi, map} = this.getProperties('mapApi', 'map');

    mapApi.maps.event.addListener(map, eventName, (event) => {
      const data = {type: 'map'};

      if (event) {
        const position = this.getMapPixel();

        data.pixel = {
          x: position.left + event.pixel.x,
          y: position.top + event.pixel.y
        };

        data.position = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
      }

      this.sendAction(GoogleUtiltity.map.eventAction(eventName), this.get('mapFacade'), data);
    });
  },

  removeListener(eventName) {
    const {mapApi, map} = this.getProperties('mapApi', 'map');

    mapApi.maps.event.clearInstanceListeners(map, eventName);
  },

  addMarker(marker) {
    marker = JSON.parse(JSON.stringify(marker));

    const {config, mapApi, markerMap, markerClusterer} = this.getProperties('config', 'mapApi', 'markerMap', 'markerClusterer');
    const mapMarker = new mapApi.maps.Marker(marker);

    markerMap.set(marker.id, mapMarker);

    markerClusterer.addMarker(mapMarker);

    // apply default marker events
    const self = this;
    config.markerEvents.forEach(function (eventName) {
      self.addMarkerListener(marker.id, eventName);
    }, mapMarker);
  },

  addMarkerListener(id, eventName) {
    const data = {id: id, type: 'marker'};
    const {mapApi} = this.getProperties('mapApi');

    const mapMarker = this.getMarker(id);

    mapApi.maps.event.addListener(mapMarker, eventName, () => {
      data.position = {
        lat: mapMarker.getPosition().lat(),
        lng: mapMarker.getPosition().lng()
      };

      data.pixel = this._getMarkerPixel(mapMarker);

      this.sendAction(GoogleUtiltity.marker.eventAction(eventName), this.get('markerFacade'), id, data);
    });
  },

  removeMarkerListener(id, eventName) {
    this.get('mapApi').maps.event.clearInstanceListeners(this.getMarker(id), eventName);
  },

  removeMarker(id) {
    const {mapApi, markerMap, markerClusterer} =  this.getProperties('mapApi', 'markerMap', 'markerClusterer');

    const mapMarker = this.getMarker(id);

    mapApi.maps.event.clearInstanceListeners(mapMarker);

    markerClusterer.removeMarker(mapMarker);

    markerMap.delete(id);
  },

  setMarkerIcon(id, icon) {
    this.getMarker(id).setIcon(icon);
  },

  setMarkerPosition(id, position) {
    this.getMarker(id).setPosition(position);
  },

  getMarkerPosition(id) {
    const position = this.getMarker(id).getPosition();

    return {
      lat: position.lat(),
      lng: position.lng()
    };
  },

  _getMarkerPixel(mapMarker) {
    const {mapApi, map} = this.getProperties('mapApi', 'map');

    // Calculate the position of the marker click-style event
    const overlay = new mapApi.maps.OverlayView();
    overlay.draw = function () {
    };
    overlay.setMap(map);

    const proj = overlay.getProjection();
    const pos = mapMarker.getPosition();
    const markerPixel = proj.fromLatLngToContainerPixel(pos);

    const mapPixel = this.getMapPixel();

    return {
      x: parseInt(mapPixel.left + markerPixel.x, 10),
      y: parseInt(mapPixel.top + markerPixel.y, 10)
    };
  },

  setMarkerDraggable(id, draggable) {
    this.getMarker(id).setDraggable(draggable);
  },

  setMarkerVisible(id, visible) {
    this.getMarker(id).setVisible(visible);
  },

  setMarkerTitle(id, title) {
    this.getMarker(id).setTitle(title);
  }
});

