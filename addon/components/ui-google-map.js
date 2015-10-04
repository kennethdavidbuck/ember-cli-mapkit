import GoogleUtiltity from '../utilities/google';
import UIAbstractMap from './ui-abstract-map';

import layout from '../templates/components/ui-google-map';

/*global JSON*/

export default UIAbstractMap.extend({

  layout: layout,
  tagName: 'ui-google-map',
  classNames: ['ui-google-map'],

  setup() {
    const {config, mapApi} = this.getProperties('config', 'mapApi');
    const $map = new mapApi.maps.Map(this.getMapElement(), config.options);

    this.set('map', $map);

    this.setMapType(config.mapType);
    this.addListeners(config.mapEvents);

    //fixes bug where fromLatLnToContainerPixel returns undefined.
    const overlay = new mapApi.maps.OverlayView();
    overlay.draw = function () {
    };
    overlay.setMap($map);
  },

  teardown(markers) {
    const {mapApi, map} = this.getProperties('mapApi', 'map');

    // clean up all listeners
    markers.forEach((mapMarker) => {
      mapApi.maps.event.clearInstanceListeners(mapMarker);
    });

    mapApi.maps.event.clearInstanceListeners(map);
  },

  getMapType() {
    return GoogleUtiltity.encodeMapType(this.get('map').getMapTypeId());
  },

  setMapType(value) {
    let type = GoogleUtiltity.map.decodeMapType(value);

    const map = this.get('map');

    map.setMapTypeId(type);

    return map.getMapTypeId();
  },

  getCenter() {
    const center = this.get('map').getCenter();
    return {
      lat: center.lat(),
      lng: center.lng()
    };
  },

  setCenter(position) {
    this.get('map').setCenter(position);
  },

  getTilt() {
    return this.get('map').getTilt();
  },

  panTo(position) {
    this.get('map').panTo(position);
  },

  getZoom() {
    return this.get('map').getZoom();
  },

  setZoom(zoom) {
    this.get('map').setZoom(zoom);
  },

  getBounds() {
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
  },

  setOptions(options) {
    this.get('map').setOptions(options);
  },

  addListener(eventName) {
    const decodedEventName = GoogleUtiltity.map.decodeEventName(eventName);
    const encodedEventAction = GoogleUtiltity.map.encodeEventAction(decodedEventName);

    const {mapApi, map} = this.getProperties('mapApi', 'map');

    mapApi.maps.event.addListener(map, decodedEventName, (event) => {
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
      } else {
        data.position = this.getCenter();
        data.pixel = {};
      }

      this.sendAction(encodedEventAction, this.get('mapFacade'), data);
    });
  },

  removeListener(eventName) {
    const {mapApi, map} = this.getProperties('mapApi', 'map');

    mapApi.maps.event.clearInstanceListeners(map, eventName);
  },

  addMarker(marker) {
    marker = JSON.parse(JSON.stringify(marker));

    const {config, mapApi, markerMap, map} = this.getProperties('config', 'mapApi', 'markerMap', 'map');

    marker.map = map;

    const mapMarker = new mapApi.maps.Marker(marker);

    markerMap.set(marker.id, mapMarker);

    // apply default marker events
    const self = this;
    config.markerEvents.forEach(function (eventName) {
      self.addMarkerListener(marker.id, eventName);
    }, mapMarker);
  },

  addMarkerListener(id, eventName) {
    const decodedEventName = GoogleUtiltity.marker.decodeEventName(eventName);
    const encodedEventAction = GoogleUtiltity.marker.encodeEventAction(decodedEventName);

    const data = {id: id, type: 'marker'};
    const mapApi = this.get('mapApi');
    const mapMarker = this.getMarker(id);

    mapApi.maps.event.addListener(mapMarker, decodedEventName, () => {
      data.position = {
        lat: mapMarker.getPosition().lat(),
        lng: mapMarker.getPosition().lng()
      };

      data.pixel = this._getMarkerPixel(mapMarker);

      this.sendAction(encodedEventAction, this.get('markerFacade'), id, data);
    });
  },

  removeMarkerListener(id, eventName) {
    this.get('mapApi').maps.event.clearInstanceListeners(this.getMarker(id), eventName);
  },

  clearMarkerListeners(id) {
    this.get('mapApi').maps.event.clearInstanceListeners(this.getMarker(id));
  },

  removeMarker(id) {
    const markerMap = this.get('markeMap');
    const mapMarker = this.getMarker(id);

    mapMarker.setMap(null);

    this.clearMarkerListeners(id);

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
  },

  fitToMarkers() {
    const {mapApi, map} = this.getProperties('mapApi', 'map');
    const bounds = new mapApi.maps.LatLngBounds();

    this.getMarkers().forEach((marker) => {
      bounds.extend(marker.getPosition());
    });

    map.fitBounds(bounds);
  }
});

