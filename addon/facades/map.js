import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {

  mapComponent: null,

  register(mapComponent) {
    this.set('mapComponent', mapComponent);
    this.trigger('mapReady');
  },

  unregister(/*component*/) {
    this.set('mapComponent', null);
    this.trigger('mapCleared');
  },

  getElement() {
    return this.get('mapComponent').getElement();
  },

  getMapPixel() {
    return this.get('mapComponent').getMapPixel();
  },

  getMarkerPixel(id) {
    return this.get('mapComponent').getMarkerPixel(id);
  },

  size: function () {
    return this.get('mapComponent').size();
  },

  getCenter() {
    return this.get('mapComponent').getCenter();
  },

  setCenter(position) {
    return this.get('mapComponent').setCenter(position);
  },

  getZoom() {
    return this.get('mapComponent').getZoom();
  },

  setZoom(zoom) {
    return this.get('mapComponent').setZoom(zoom);
  },

  getMapType() {
    return this.get('mapComponent').getMapType();
  },

  setMapType(type) {
    return this.get('mapComponent').setMapType(type);
  },

  getBounds() {
    return this.get('mapComponent').getBounds();
  },

  getTilt() {
    return this.get('mapComponent').getTilt();
  },

  mapIsReady() {
    const mapComponent = this.get('mapComponent');

    return !!mapComponent && mapComponent.get('isLoaded');
  },

  hasMarker(id) {
    return this.get('mapComponent').hasMarker(id);
  },

  getMarker(id) {
    return this.get('mapComponent').getMarker(id);
  },

  addMarkers(markers) {
    return this.get('mapComponent').addMarkers(markers);
  },

  addListeners(eventNames) {
    return this.get('mapComponent').addListeners(eventNames);
  },

  addListener(eventName) {
    return this.get('mapComponent').addListener(eventName);
  },

  removeListener(eventName) {
    return this.get('mapComponent').removeListener(eventName);
  },

  addMarker(marker) {
    return this.get('mapComponent').addMarker(marker);
  },

  addMarkerListener(id, eventName) {
    return this.get('mapComponent').addMarkerListener(id, eventName);
  },

  removeMarker(id) {
    return this.get('mapComponent').removeMarker(id);
  },

  removeMarkerListener(id, eventName) {
    return this.get('mapComponent').removeMarkerListener(id, eventName);
  },

  setMarkerIcon(id, icon) {
    return this.get('mapComponent').setMarkerIcon(id, icon);
  },

  setMarkerPosition(id, position) {
    return this.get('mapComponent').setMarkerPosition(id, position);
  },

  getMarkerPosition(id) {
    return this.get('mapComponent').getMarkerPosition(id);
  },

  setMarkerDraggable(id, draggable) {
    return this.get('mapComponent').setMarkerDraggable(id, draggable);
  },

  setMarkerVisible(id, visible) {
    return this.get('mapComponent').setMarkerVisible(id, visible);
  },

  setMarkerTitle(id, title) {
    return this.get('mapComponent').setMarkerTitle(id, title);
  },

  panTo(position) {
    return this.get('mapComponent').panTo(position);
  },

  fitToMarkers() {
    return this.get('mapComponent').fitToMarkers();
  }
});
