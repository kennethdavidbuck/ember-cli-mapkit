import UIAbstractMap from './ui-abstract-map';
import Ember from 'ember';
import layout from '../templates/components/ui-google-map';

const {assert} = Ember;

/*global JSON*/

export default UIAbstractMap.extend({

  layout: layout,
  tagName: 'ui-google-map',
  classNames: ['ui-google-map'],

  overlay: null,

  setup() {
    const {config, mapApi} = this.getProperties('config', 'mapApi');
    const $map = new mapApi.maps.Map(this.getElement(), config.options);

    this.set('map', $map);

    this.setMapType(config.mapType);
    this.addListeners(config.mapEvents);

    return new Ember.RSVP.Promise((resolve) => {
      //fixes bug where fromLatLnToContainerPixel returns undefined.
      const overlay = new mapApi.maps.OverlayView();
      overlay.draw = function () {
      };
      overlay.setMap($map);

      this.set('overlay', overlay);

      mapApi.maps.event.addListenerOnce($map, 'idle', () => {
        resolve();
      });
    });
  },

  teardown(markers) {
    const {mapApi, map} = this.getProperties('mapApi', 'map');

    // clean up all listeners
    markers.forEach((mapMarker) => {
      mapApi.maps.event.clearInstanceListeners(mapMarker);
    });

    mapApi.maps.event.clearInstanceListeners(map);

    return new Ember.RSVP.Promise((resolve) => {
      resolve();
    });
  },

  getMapType() {
    return this.encodeMapType(this.get('map').getMapTypeId());
  },

  setMapType(value) {
    const map = this.get('map');

    map.setMapTypeId(this.decodeMapType(value));

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
    const decodedEventName = this.decodeEventName(eventName);
    const encodedEventAction = this.encodeMapEventAction(decodedEventName);

    const {mapApi, map} = this.getProperties('mapApi', 'map');

    mapApi.maps.event.addListener(map, decodedEventName, (event) => {
      const data = {type: 'map', eventName: eventName};

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

    mapApi.maps.event.clearInstanceListeners(map, this.decodeEventName(eventName));
  },

  triggerMapEvent(eventName, position) {
    const {lat, lng} = position;
    const latLng = new this.get('mapApi').maps.LatLng(lat, lng);

    this.triggerEvent(this.get('map'), eventName, {
      stop: null,
      latLng: latLng,
      pixel: this.positionToPixel(latLng)
    });
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
    const decodedEventName = this.decodeEventName(eventName);
    const encodedEventAction = this.encodeMarkerEventAction(decodedEventName);

    const data = {id: id, type: 'marker', event: eventName};
    const mapApi = this.get('mapApi');
    const mapMarker = this.getMarker(id);

    mapApi.maps.event.addListener(mapMarker, decodedEventName, () => {
      data.position = {
        lat: mapMarker.getPosition().lat(),
        lng: mapMarker.getPosition().lng()
      };

      data.pixel = this._getMarkerPixel(mapMarker);

      this.sendAction(encodedEventAction, this.get('mapFacade'), id, data);
    });
  },

  removeMarkerListener(id, eventName) {
    this.get('mapApi').maps.event.clearInstanceListeners(this.getMarker(id), this.decodeEventName(eventName));
  },

  clearMarkerListeners(id) {
    this.get('mapApi').maps.event.clearInstanceListeners(this.getMarker(id));
  },

  triggerMarkerEvent(id, eventName) {
    this.triggerEvent(this.getMarker(id), this.decodeEventName(eventName));
  },

  triggerEvent() {
    const eventApi = this.get('mapApi').maps.event;

    eventApi.trigger.apply(eventApi, [].slice.call(arguments));
  },

  removeMarker(id) {
    const mapMarker = this.getMarker(id);

    mapMarker.setMap(null);

    this.clearMarkerListeners(id);

    this.get('markerMap').delete(id);
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
    return this.positionToPixel(mapMarker.getPosition());
  },

  positionToPixel(position) {
    const overlayProjection = this.get('overlay').getProjection();
    const markerPixel = overlayProjection.fromLatLngToContainerPixel(position);

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
  },

  decodeEventName(eventName) {
    const alias = {
      click: 'click',
      animationChanged: 'animation_changed',
      clickableChanged: 'clickable_changed',
      cursorChanged: 'cursorChanged',
      doubleClick: 'dblclick',
      drag: 'drag',
      dragEnd: 'dragend',
      draggableChanged: 'draggable_changed',
      dragStart: 'dragstart',
      flatChanged: 'flat_changed',
      iconChanged: 'icon_changed',
      mouseDown: 'mousedown',
      mouseOut: 'mouseout',
      mouseOver: 'mouseover',
      mouseUp: 'mouseup',
      positionChanged: 'position_changed',
      rightClick: 'rightclick',
      shapeChanged: 'shape_changed',
      titleChanged: 'title_changed',
      visibleChanged: 'visible_changed',
      zIndexChanged: 'zindex_changed',
      boundsChanged: 'bounds_changed',
      centerChanged: 'center_changed',
      tilesLoaded: 'tilesloaded',
      zoomChanged: 'zoom_changed',
      headingChanged: 'heading_changed',
      idle: 'idle',
      mapTypeIdChanged: 'maptypeid_changed',
      projectionChanged: 'projection_changed',
      mouseMove: 'mousemove'
    }[eventName];

    assert(`there is no event mapping for the following marker event name: ${eventName}`, !!alias);

    return alias;
  },

  decodeMapType(type) {
    const mapTypes = this.get('mapApi').maps.MapTypeId;
    return {
        roadmap: mapTypes.ROADMAP,
        satellite: mapTypes.SATELLITE,
        terrain: mapTypes.TERRAIN,
        hybrid: mapTypes.HYBRID
      }[type] || mapTypes.ROADMAP;
  },

  encodeMapType(type) {
    const mapTypes = this.get('mapApi').maps.MapTypeId;
    switch (type) {
      case mapTypes.ROADMAP:
        return 'roadmap';
      case mapTypes.SATELLITE:
        return 'satellite';
      case mapTypes.TERRAIN:
        return 'terrain';
      case mapTypes.HYBRID:
        return 'hybrid';
    }
    return 'roadmap';
  },

  encodeMapEventAction(eventName) {
    const alias = {
      click: 'mapClickAction',
      bounds_changed: 'mapBoundsChangedAction',
      center_changed: 'mapCenterChangedAction',
      dblclick: 'mapDoubleClickAction',
      rightclick: 'mapRightClickAction',
      tilesloaded: 'mapTilesLoadedAction',
      zoom_changed: 'mapZoomChangedAction',
      drag: 'mapDragAction',
      dragend: 'mapDragEndAction',
      dragstart: 'mapDragStartAction',
      heading_changed: 'mapHeadingChangedAction',
      idle: 'mapIdleAction',
      maptypeid_changed: 'mapTypeIdChangedAction',
      projection_changed: 'mapProjectionChangedAction',
      mousemove: 'mapMouseMoveAction',
      mouseup: 'mapMouseUpAction',
      mousedown: 'mapMouseDownAction',
      mouseover: 'mapMouseOverAction',
      mouseout: 'mapMouseOutAction'
    }[eventName];

    assert(`there is no action mapping for the following map event name: ${eventName}`, !!alias);

    return alias;
  },

  encodeMarkerEventAction(eventName) {
    const alias = {
      'animation_changed': 'markerAnimationChangedAction',
      'click': 'markerClickAction',
      'clickable_changed': 'markerClickableChangedAction',
      'cursor_changed': 'markerCursorChangedAction',
      'dblclick': 'markerDoubleClickAction',
      'drag': 'markerDragAction',
      'dragend': 'markerDragEndAction',
      'draggable_changed': 'markerDraggableChangedAction',
      'dragstart': 'markerDragStartAction',
      'flat_changed': 'markerFlatChangedAction',
      'icon_changed': 'markerIconChangedAction',
      'mousedown': 'markerMouseDownAction',
      'mouseout': 'markerMouseOutAction',
      'mouseover': 'markerMouseOverAction',
      'mouseup': 'markerMouseUpAction',
      'position_changed': 'markerPositionChangedAction',
      'rightclick': 'markerRightClickAction',
      'shape_changed': 'markerShapeChangedAction',
      'title_changed': 'markerTitleChangedAction',
      'visible_changed': 'markerVisibleChangedAction',
      'zindex_changed': 'markerZIndexChangedAction'
    }[eventName];

    assert(`there is no action mapping for the following event name: ${eventName}`, !!alias);

    return alias;
  }
});

