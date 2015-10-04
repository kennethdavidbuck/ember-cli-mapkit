import Ember from 'ember';
import MapFacade from '../facades/map';

const {isEmpty, computed, on, K, run} = Ember;

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
  mapMouseOutAction: 'mapMouseOut',

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

  markers: Ember.A([]),

  _registerFacade: on('willInsertElement', function () {
    let mapFacade = this.get('mapFacade');

    if (isEmpty(mapFacade)) {
      mapFacade = MapFacade.create();
      this.set('mapFacade', mapFacade);
    }

    mapFacade.register(this);
  }),

  _setup: on('didInsertElement', function () {
    run.next(() => {
      this.setup();
      this.addMarkers(this.get('markers'));
      this.sendAction('readyAction', this.get('mapFacade'));
    });
  }),

  _teardown: on('willDestroyElement', function () {
    const {mapFacade, markerMap} = this.getProperties('mapFacade', 'markerMap');

    mapFacade.unregister(this);

    this.teardown(markerMap);

    markerMap.clear();
  }),

  markerMap: computed(function () {
    return Ember.Map.create();
  }),

  config: {
    lat: 0,
    lng: 0,
    zoom: 13
  },

  getMapElement() {
    return this.$()[0];
  },

  getMapPixel() {
    return this.$().position();
  },

  getMarkerPixel(id) {
    return this._getMarkerPixel(this.getMarker(id));
  },

  size: function () {
    return this.get('markerMap.size');
  },

  hasMarker(id) {
    return this.get('markerMap').has(id);
  },

  getMarker(id) {
    Ember.assert('MapKit: This marker has no mapping', this.hasMarker(id));

    return this.get('markerMap').get(id);
  },

  addMarkers(markers) {
    markers.forEach((marker) => {
      this.addMarker(marker);
    });
  },

  addListeners(eventNames) {
    eventNames.forEach((eventName) => {
      this.addListener(eventName);
    });
  },

  setup: K,

  teardown: K,

  addListener: K,

  removeListener: K,

  addMarker: K,

  addMarkerListener: K,

  removeMarker: K,

  removeMarkerListener: K,

  setMarkerIcon: K,

  setMarkerPosition: K,

  getMarkerPosition: K,

  setMarkerDraggable: K,

  setMarkerVisible: K,

  setMarkerTitle: K,

  panTo: K
});

