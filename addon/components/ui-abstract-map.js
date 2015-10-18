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

  _isReady: false,

  markers: Ember.A([]),

  _registerFacade: on('willInsertElement', function () {
    let mapFacade = this.get('mapFacade');

    if (isEmpty(mapFacade)) {
      mapFacade = MapFacade.create();
      this.set('mapFacade', mapFacade);
    }
  }),

  _setup: on('didInsertElement', function () {
    run.scheduleOnce('afterRender', () => {
      this.setup().then(() => {
        this.addMarkers(this.get('markers'));
        this.get('mapFacade').register(this);
        this.set('_isReady', true);
        this.sendAction('readyAction', this.get('mapFacade'));
      });
    });
  }),

  _teardown: on('willDestroyElement', function () {
    const {mapFacade, markerMap} = this.getProperties('mapFacade', 'markerMap');

    this.teardown(markerMap).then(() => {
      mapFacade.unregister(this);

      this.set('_isReady', false);

      markerMap.clear();
    });
  }),

  markerMap: computed(function () {
    return Ember.Map.create();
  }),

  config: {
    options: {
      zoom: 13,
      center: {
        lat: 0,
        lng: 0
      }
    },
    mapEvents: [],
    markerEvents: []
  },

  isReady() {
    return this.get('_isReady');
  },

  getElement() {
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

  getMarkers() {
    return this.get('markerMap');
  },

  getMap() {
    return this.get('map');
  },

  setup() {
    return new Ember.RSVP.Promise((resolve) => {
      resolve();
    });
  },

  teardown() {
    return new Ember.RSVP.Promise((resolve) => {
      resolve();
    });
  },

  getCenter: K,

  setCenter: K,

  getZoom: K,

  setZoom: K,

  getBounds: K,

  setOptions: K,

  getTilt: K,

  getMapType: K,

  setMapType: K,

  setTitle: K,

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

  panTo: K,

  fitToMarkers: K,

  triggerMarkerEvent: K,

  triggerMapEvent: K
});

