/**
 *
 */

import Ember from 'ember';

export default Ember.Mixin.create({

  actions: {

    mapEvent(eventName, event) {
      this.send(Ember.String.camelize(`map-${eventName}`), event);
    },

    markerEvent(eventName, event) {
      this.send(Ember.String.camelize(`marker-${eventName}`), event);
    },

    // Marker Events

    markerMouseover() {
    },

    markerMouseout() {
    },

    markerMouseup() {
    },

    markerMousedown() {
    },

    markerClick() {
    },

    markerRightclick() {
    },

    markerDblclick() {
    },

    markerDrag() {
    },

    markerDragstart() {
    },

    markerDragend() {
    },

    markerPositionChanged() {
    },

    // Map Events

    mapMousemove() {
    },

    mapRightclick() {
    },

    mapClick() {
    },

    mapMouseover() {
    },

    mapMousedown() {
    },

    mapMouseup() {
    },

    mapBoundsChanged() {
    },

    mapHeadingChanged() {
    },

    mapTilesloaded() {
    },

    mapIdle() {
    },

    mapProjectionChanged() {
    },

    mapCenterChanged() {
    },

    mapZoomChanged() {
    },

    mapMouseout() {
    },

    mapDrag() {
    },

    mapDragstart() {
    },

    mapDragend() {
    },

    mapDblclick() {
    }
  }
});
