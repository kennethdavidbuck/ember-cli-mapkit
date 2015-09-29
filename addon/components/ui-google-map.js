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

  mapTypeId: Ember.computed('googleMap', {
    get() {
      return this.get('googleMap').getMapTypeId();
    },
    set(key, value) {
      let type = GoogleUtiltity.map.type(value);

      const googleMap = this.get('googleMap');

      googleMap.setMapTypeId(type);

      return googleMap.getMapTypeId();
    }
  })['volatile'](),

  setup: Ember.on('didInsertElement', function () {
    Ember.run.next(() => {
      const {config, googleApi, markerClusterer} = this.getProperties('config', 'googleApi', 'markerClusterer');

      let options = {
        zoom: config.zoom,
        center: {
          lat: config.lat,
          lng: config.lng
        }
      };

      let googleMap = new googleApi.maps.Map(this.$()[0], options);

      this.setProperties({
        googleMap: googleMap,
        mapTypeId: config.mapType
      });

      this.addListeners(this.get('config.mapEvents'));

      //fixes bug where fromLatLnToContainerPixel returns undefined.
      const overlay = new googleApi.maps.OverlayView();
      overlay.draw = function () {
      };
      overlay.setMap(googleMap);

      markerClusterer.setMap(googleMap);

      this.addMarkers(this.get('markers'));

      this.sendAction('readyAction', this);
    });
  }),

  teardown: Ember.on('willDestroyElement', function () {
    const {googleApi, googleMap, markerMap, markerClusterer} = this.getProperties('googleApi', 'googleMap', 'markerMap', 'markerClusterer');

    // clean up all listeners
    markerMap.forEach((googleMarker) => {
      googleApi.maps.event.clearInstanceListeners(googleMarker);
    });

    googleApi.maps.event.clearInstanceListeners(googleMap);

    markerClusterer.clearMarkers();
    markerMap.clear();
  }),

  center: Ember.computed('googleMap', {
    get() {
      const center = this.get('googleMap').getCenter();
      return {
        lat: center.lat(),
        lng: center.lng()
      };
    },
    set(key, position) {
      this.get('googleMap').setCenter(position);

      return position;
    }
  })['volatile'](),

  panTo(position) {
    this.get('googleMap').panTo(position);
  },

  zoom: Ember.computed('googleMap', {
    get() {
      return this.get('googleMap').getZoom();
    },
    set(key, zoom) {
      this.get('googleMap').setZoom(zoom);

      return zoom;
    }
  })['volatile'](),

  tilt: Ember.computed('googleMap', {
    get() {
      return this.get('googleMap').getTilt();
    }
  })['volatile'](),

  bounds: Ember.computed('googleMap', {
    get() {
      const bounds = this.get('googleMap').getBounds();
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

  options: Ember.computed('googleMap', {
    set(key, value) {
      this.get('googleMap').setOptions(value);

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
    const {googleApi, googleMap} = this.getProperties('googleApi', 'googleMap');

    googleApi.maps.event.addListener(googleMap, eventName, (event) => {
      let position;
      let data = {};
      if (event) {
        position = this.getMapPixel(),
        data = {
          pixel: {
            x: position.left + event.pixel.x,
            y: position.top + event.pixel.y
          },
          position: {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          }
        };
      }

      this.sendAction(GoogleUtiltity.map.eventAction(eventName), this, data);
    });
  },

  removeListener(eventName) {
    const {googleApi, googleMap} = this.getProperties('googleApi', 'googleMap');

    googleApi.maps.event.clearInstanceListeners(googleMap, eventName);
  },

  addMarker(marker) {
    marker = JSON.parse(JSON.stringify(marker));

    const {config, googleApi, markerMap, markerClusterer} = this.getProperties('config', 'googleApi', 'markerMap', 'markerClusterer');
    const googleMarker = new googleApi.maps.Marker(marker);

    markerMap.set(marker.id, googleMarker);

    markerClusterer.addMarker(googleMarker);

    // apply default marker events
    const self = this;
    config.markerEvents.forEach(function (eventName) {
      self.addMarkerListener(marker.id, eventName);
    }, googleMarker);
  },

  addMarkerListener(id, eventName) {
    let data = {id: id, type: eventName};
    const {googleApi} = this.getProperties('googleApi');

    const googleMarker = this.getMarker(id);

    googleApi.maps.event.addListener(googleMarker, eventName, () => {
      data.position = {
        lat: googleMarker.getPosition().lat(),
        lng: googleMarker.getPosition().lng()
      };

      data.pixel = this._getMarkerPixel(googleMarker);

      this.sendAction(GoogleUtiltity.marker.eventAction(eventName), this, id, data);
    });
  },

  removeMarkerListener(id, eventName) {
    this.get('googleApi').maps.event.clearInstanceListeners(this.getMarker(id), eventName);
  },

  removeMarker(id) {
    const {googleApi, markerMap, markerClusterer} =  this.getProperties('googleApi', 'markerMap', 'markerClusterer');

    const googleMarker = this.getMarker(id);

    googleApi.maps.event.clearInstanceListeners(googleMarker);

    markerClusterer.removeMarker(googleMarker);

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

  _getMarkerPixel(googleMarker) {
    const {googleApi, googleMap} = this.getProperties('googleApi', 'googleMap');

    // Calculate the position of the marker click-style event
    const overlay = new googleApi.maps.OverlayView();
    overlay.draw = function () {
    };
    overlay.setMap(googleMap);

    const proj = overlay.getProjection();
    const pos = googleMarker.getPosition();
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

