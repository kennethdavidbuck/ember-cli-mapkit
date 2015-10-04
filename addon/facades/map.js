import Ember from 'ember';

export default Ember.Object.extend({

  mapComponent: null,

  registerComponent(component) {
    this.set('mapComponent', component);
  },

  unregisterComponent(/*component*/) {
    this.set('mapComponent', null);
  },

  getMapElement() {
    return this.get('mapComponent').getMapElement();
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
    this.get('mapComponent').addMarkerListener(id, eventName);
  },

  removeMarker() {
    this.get('mapComponent').removeMarker(id);
  },

  removeMarkerListener(id, eventName) {
    this.get('mapComponent').removeMarkerListener(id, eventName);
  },

  setMarkerIcon(id, icon) {
    this.get('mapComponent').setMarkerIcon(id, icon);
  },

  setMarkerPosition(id, position) {
    this.get('mapComponent').setMarkerPosition(id, position);
  },

  getMarkerPosition(id) {
    this.get('mapComponent').getMarkerPosition(id);
  },

  setMarkerDraggable(id, draggable) {
    this.get('mapComponent').setMarkerDraggable(id, draggable);
  },

  setMarkerVisible(id, visible) {
    this.get('mapComponent').setMarkerVisible(id, visible);
  },

  setMarkerTitle(id, title) {
    this.get('mapComponent').setMarkerTitle(id, title);
  },

  panTo(position) {
    this.get('mapComponent').panTo(position);
  }
});
