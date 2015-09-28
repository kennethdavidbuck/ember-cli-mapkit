import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['ui-map'],

  readyAction: 'mapReady',

  mapClickAction: 'mapClick',
  mapBoundsChangedAction: 'mapBoundsChanged',
  mapCenterChangedAction: 'mapCenterChanged',
  mapDoubleClickAction: 'mapDoubleClick',
  mapRightClickAction: 'mapRightClick',
  mapTilesLoadedAction: 'mapTilesLoaded',
  mapZoomChangedAction: 'mapZoomChanged',
  mapDragAction: 'mapDrag',
  mapDragEndAction: 'mapDragEnd',
  mapDragStartAction: 'mapDragStart',
  mapHeadingChangedAction: 'mapHeadingChanged',
  mapIdleAction: 'mapIdle',
  mapTypeIdChangedAction: 'mapTypeIdChanged',
  mapProjectionChangedAction: 'mapProjectionChanged',
  mapMouseMoveAction: 'mapMouseMove',
  mapMouseUpAction: 'mapMouseUp',
  mapMouseDownAction: 'mapMouseDown',
  mapMouseOverAction: 'mapMouseOver',
  mapMouseOutAction: 'mapMouseOutAction',

  markerClickAction: 'markerClick',
  markerAnimationChangedAction: 'markerAnimationChanged',
  markerClickableChangedAction: 'markerClickableChanged',
  markerCursorChangedAction: 'markerCursorChanged',
  markerDoubleClickAction: 'markerDoubleClick',
  markerDragAction: 'markerDrag',
  markerDragEndAction: 'markerDragEnd',
  markerDraggableChangedAction: 'markerDraggableChanged',
  markerDragStartAction: 'markerDragStart',
  markerFlatChangedAction: 'markerFlatChanged',
  markerIconChangedAction: 'markerIconChanged',
  markerMouseDownAction: 'markerMouseDown',
  markerMouseOutAction: 'markerMouseOut',
  markerMouseOverAction: 'markerMouseOver',
  markerMouseUpAction: 'markerMouseUp',
  markerPositionChangedAction: 'markerPositionChanged',
  markerRightClickAction: 'markerRightClick',
  markerShapeChangedAction: 'markerShapeChanged',
  markerTitleChangedAction: 'markerTitleChanged',
  markerVisibleChangedAction: 'markerVisibleChanged',
  markerZIndexChangedAction: 'markerZIndexChanged',

  isLoaded: false,

  markers: [],

  markerMap: Ember.computed({
    get() {
      return Ember.Map.create();
    }
  }),

  config: {
    lat: 0,
    lng: 0,
    zoom: 13
  },

  getMapPixel() {
    return this.$().position();
  },

  getMarkerPixel(id) {
    const markerMap = this.get('markerMap');

    Ember.assert('MapKit: This marker has no mapping', markerMap.has(id));

    return this._getMarkerPixel(markerMap.get(id));
  },

  size: function () {
    return this.get('markerMap.size');
  }
});

