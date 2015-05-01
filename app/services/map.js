/*global google, MarkerClusterer*/

import Ember from 'ember';
import ENV from '../config/environment';

var MAPKIT_ENV = ENV.APP.MAPKIT;

// classes
var GoogleMap = google.maps.Map;
var GoogleMarker = google.maps.Marker;
var LatLng = google.maps.LatLng;
var OverlayView = google.maps.OverlayView;

// functions
var addListener = google.maps.event.addListener;
var clearInstanceListeners = google.maps.event.clearInstanceListeners;
var SATELLITE = google.maps.MapTypeId.SATELLITE;
var ROADMAP = google.maps.MapTypeId.ROADMAP;
var TERRAIN = google.maps.MapTypeId.TERRAIN;
var HYBRID = google.maps.MapTypeId.HYBRID;

export default Ember.Namespace.extend({

  googleMap: null,

  component: null,

  markerMap: null,

  markerClusterer: null,

  init: function () {
    this.set('markerClusterer', new MarkerClusterer(null, [], MAPKIT_ENV.MARKER_CLUSTERER));
    this.set('markerMap', Ember.Map.create());
    this._super();
  },

  /**
   * Create map, and add handlers etc.
   * @param component
   */
  setup: function (component) {
    this.set('component', component);

    var googleMap;
    var options;

    options = {
      zoom: MAPKIT_ENV.MAP_DEFAULT_ZOOM,
      center: {
        lat: MAPKIT_ENV.MAP_DEFAULT_LAT,
        lng: MAPKIT_ENV.MAP_DEFAULT_LNG
      }
    };

    googleMap = new GoogleMap(component.$()[0], options);

    this.set('googleMap', googleMap);

    this.set('mapTypeId', MAPKIT_ENV.MAP_TYPE);

    MAPKIT_ENV.MAP_EVENTS.forEach(function (eventName) {
      this.addListener(eventName);
    }, this);

    //fixes bug where fromLatLnToContainerPixel returns undefined.
    var overlay = new OverlayView();
    overlay.draw = function () {
    };
    overlay.setMap(googleMap);

    this.get('markerClusterer').setMap(googleMap);

    component.sendAction('readyAction');
  },

  /**
   * Removes handlers etc.
   */
  teardown: function () {
    // clean up all listeners
    this.get('markerMap').forEach(function (googleMarker) {
      clearInstanceListeners(googleMarker);
    });

    clearInstanceListeners(this.get('googleMap'));

    this.setProperties({
      googleMap: null,
      component: null,
      markerMap: null
    });
  },

  /**
   * Add a listener to the map.
   */
  addListener: function (eventName) {
    var self = this;

    addListener(this.get('googleMap'), eventName, function (event) {
      var component = self.get('component');
      var position;
      var data = {};
      if (event) {
        position = component.$().position();
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

      component.sendAction('action', eventName, data);
    });
  },

  /**
   * Remove a listener from the map
   * @param eventName
   */
  removeListener: function (eventName) {
    clearInstanceListeners(this.get('googleMap'), eventName);
  },

  /**
   * The maps center property
   */
  center: function (key, position) {
    var center;
    var googleMap = this.get('googleMap');
    if (arguments.length > 1) {
      googleMap.setCenter(position);
    }

    center = googleMap.getCenter();
    return {
      lat: center.lat(),
      lng: center.lng()
    };
  }.property('googleMap').volatile(),

  /**
   * Pans the map to a specified position
   * @param position
   */
  panTo: function (position) {
    this.get('googleMap').panTo(position);
  },

  /**
   *
   */
  zoom: function (key, zoom) {
    var googleMap = this.get('googleMap');
    if (arguments.length > 1) {
      googleMap.setZoom(zoom);
    }

    return googleMap.getZoom();
  }.property('googleMap').volatile(),

  /**
   *
   */
  tilt: function () {
    return this.get('googleMap').getTilt();
  }.property('googleMap').volatile(),

  /**
   * The current map bounds
   */
  bounds: function () {
    var bounds = this.get('googleMap').getBounds();
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();

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
  }.property('googleMap').volatile(),

  /**
   * Type of map used for display (ex roadmap, hybrid)
   */
  mapTypeId: function (key, value) {
    var type;
    var googleMap = this.get('googleMap');

    if (arguments.length > 1) {
      switch (value) {
        case "roadmap":
          type = ROADMAP;
          break;
        case "satellite":
          type = SATELLITE;
          break;
        case "terrain":
          type = TERRAIN;
          break;
        case "hybrid":
          type = HYBRID;
          break;
        default:
          type = ROADMAP;
      }

      googleMap.setMapTypeId(type);
    }

    return googleMap.getMapTypeId();
  }.property('googleMap').volatile(),

  /**
   * Set map options
   */
  options: function (key, value) {
    if (arguments.length > 1) {
      this.get('googleMap').setOptions(value);
    }
  }.property('googleMap'),

  /* Marker Specific */

  /**
   *
   * @param markers
   */
  addMarkers: function (markers) {
    markers.forEach(function (marker) {
      this.addMarker(marker);
    }, this);
  },

  /**
   * Add a marker to the map
   * @param marker
   */
  addMarker: function (marker) {
    // force POJO for stand processing, and because passing an Ember Object
    // as params to a new google marker does not work.
    marker = JSON.parse(JSON.stringify(marker));

    var self = this;
    var googleMap = this.get('googleMap');
    var markerMap = this.get('markerMap');
    var component = this.get('component');
    var googleMarker = new GoogleMarker(marker);

    markerMap.set(marker.id, googleMarker);

    this.get('markerClusterer').addMarker(googleMarker);

    // apply default marker events
    MAPKIT_ENV.MARKER_EVENTS.forEach(function (eventName) {
      self.addMarkerListener(marker.id, eventName);
    }, googleMarker);
  },

  /**
   * Add an event listener for a given marker event
   * @param id
   * @param eventName
   */
  addMarkerListener: function (id, eventName) {
    var self = this;
    var data = {};
    var markerMap = this.get('markerMap');
    var component = self.get('component');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    var googleMarker = markerMap.get(id);

    addListener(googleMarker, eventName, function () {
      data = {
        id: id,
        position: {
          lat: googleMarker.getPosition().lat(),
          lng: googleMarker.getPosition().lng()
        },
        pixel: self._getMarkerPixel(googleMarker)
      };

      component.sendAction('markerAction', eventName, Ember.Object.create(data));
    });
  },

  /**
   * Remove a listener from a given marker
   */
  removeMarkerListener: function (id, eventName) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    clearInstanceListeners(markerMap.get(id), eventName);
  },

  /**
   * Remove a marker from the map
   * @param marker
   */
  removeMarker: function (id) {
    var googleMarker;
    var markerMap = this.get('markerMap');
    var markerClusterer = this.get('markerClusterer');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    googleMarker = markerMap.get(id);

    clearInstanceListeners(googleMarker);

    markerClusterer.removeMarker(googleMarker);

    markerMap.delete(id);
  },

  /**
   *
   */
  setMarkerIcon: function (id, icon) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setIcon(icon);
  },

  /**
   *
   */
  setMarkerPosition: function (id, position) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setPosition(position);
  },

  getMarkerPosition: function (id) {
    var position;
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    position = markerMap.get(id).getPosition();

    return {
      lat: position.lat(),
      lng: position.lng()
    };
  },

  /**
   *
   * @param id
   */
  getMarkerPixel: function (id) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    return this._getMarkerPixel(markerMap.get(id));
  },

  /**
   * Retrieve a given markers pixel values. Useful for
   * placement of context menus etc.
   * @private
   */
  _getMarkerPixel: function (googleMarker) {
    var googleMap = this.get('googleMap');
    var component = this.get('component');

    // Calculate the position of the marker click-style event
    var overlay = new OverlayView();
    overlay.draw = function () {
    };
    overlay.setMap(googleMap);

    var proj = overlay.getProjection();
    var pos = googleMarker.getPosition();
    var p = proj.fromLatLngToContainerPixel(pos);

    var position = component.$().position();

    return {
      x: parseInt(position.left + p.x, 10),
      y: parseInt(position.top + p.y, 10)
    };
  },

  /**
   *
   * @param id
   * @param isDraggable
   */
  setMarkerDraggable: function (id, draggable) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setDraggable(draggable);
  },

  /**
   *
   * @param id
   * @param visible
   */
  setMarkerVisible: function (id, visible) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setVisible(visible);
  },

  /**
   *
   */
  setMarkerTitle: function (id, title) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setTitle(title);
  }
});
