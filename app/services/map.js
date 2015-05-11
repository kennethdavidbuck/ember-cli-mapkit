/**
 *
 */

import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  googleMap: null,

  component: null,

  markerMap: null,

  markerClusterer: null,

  isLoaded: false,

  config: null,

  setup: function () {
    var container = this.get('container');
    var MAPKIT_ENV = container.lookup('application:main').MAPKIT;
    var MarkerClusterer = container.lookup('google:marker-clusterer');

    this.setProperties({
      config: MAPKIT_ENV,
      markerClusterer: new MarkerClusterer(null, [], MAPKIT_ENV.MARKER_CLUSTERER),
      markerMap: Ember.Map.create()
    });
  }.on('init'),

  /**
   * Create map, and add handlers etc.
   * @param component
   */
  register: function (component) {
    this.set('component', component);

    var props = this.getProperties('config', 'googleApi', 'markerClusterer');

    var MAPKIT_ENV = props.config;
    var googleApi = props.googleApi;
    var markerClusterer = props.markerClusterer;
    var self = this;
    var googleMap;
    var options;

    options = {
      zoom: MAPKIT_ENV.MAP_DEFAULT_ZOOM,
      center: {
        lat: MAPKIT_ENV.MAP_DEFAULT_LAT,
        lng: MAPKIT_ENV.MAP_DEFAULT_LNG
      }
    };

    googleMap = new googleApi.maps.Map(component.$()[0], options);

    this.setProperties({
      googleMap: googleMap,
      mapTypeId: MAPKIT_ENV.MAP_TYPE
    });

    MAPKIT_ENV.MAP_EVENTS.forEach(function (eventName) {
      this.addListener(eventName);
    }, this);

    //fixes bug where fromLatLnToContainerPixel returns undefined.
    var overlay = new googleApi.maps.OverlayView();
    overlay.draw = function () {
    };
    overlay.setMap(googleMap);

    markerClusterer.setMap(googleMap);

    //this part runs when the map object is created and rendered
    googleApi.maps.event.addListenerOnce(googleMap, 'tilesloaded', function () {
      self.set('isLoaded', true);

      self.trigger('readyAction');
    });
  },

  /**
   * Removes handlers etc.
   */
  unregister: function () {
    var props = this.getProperties('googleApi', 'googleMap', 'markerMap');
    var markerMap = props.markerMap;
    var googleApi = props.googleApi;
    var googleMap = props.googleMap;

    // clean up all listeners
    markerMap.forEach(function (googleMarker) {
      googleApi.maps.event.clearInstanceListeners(googleMarker);
    });

    googleApi.maps.event.clearInstanceListeners(googleMap);
  },

  /**
   * Add a listener to the map.
   */
  addListener: function (eventName) {
    var self = this;
    var props = this.getProperties('googleApi', 'googleMap');
    var googleApi = props.googleApi;
    var googleMap = props.googleMap;

    googleApi.maps.event.addListener(this.get('googleMap'), eventName, function (event) {
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

      self.trigger('action', eventName, data);
    });
  },

  /**
   * Remove a listener from the map
   * @param eventName
   */
  removeListener: function (eventName) {
    var props = this.getProperties('googleApi', 'googleMap');

    props.googleApi.maps.event.clearInstanceListeners(props.googleMap, eventName);
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
    var props = this.getProperties('googleApi', 'googleMap');
    var googleApi = props.googleApi;
    var googleMap = props.googleMap;

    var SATELLITE = googleApi.maps.MapTypeId.SATELLITE;
    var ROADMAP = googleApi.maps.MapTypeId.ROADMAP;
    var TERRAIN = googleApi.maps.MapTypeId.TERRAIN;
    var HYBRID = googleApi.maps.MapTypeId.HYBRID;

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
   * @param id
   */
  hasMarker: function (id) {
    var markerMap = this.get('markerMap');

    return markerMap.has(id);
  },

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
    // force POJO for standardized processing, and because passing an Ember Object as params to a new google marker does not work.
    marker = JSON.parse(JSON.stringify(marker));

    var self = this;
    var props = this.getProperties('config', 'googleApi', 'markerMap', 'markerClusterer');

    var MAPKIT_ENV = props.config;
    var googleApi = props.googleApi;
    var markerMap = props.markerMap;
    var markerClusterer = props.markerClusterer;
    var googleMarker = new googleApi.maps.Marker(marker);

    markerMap.set(marker.id, googleMarker);

    markerClusterer.addMarker(googleMarker);

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
    var googleApi = this.get('googleApi');
    var markerMap = this.get('markerMap');
    var component = self.get('component');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    var googleMarker = markerMap.get(id);

    googleApi.maps.event.addListener(googleMarker, eventName, function () {
      data = {
        id: id,
        position: {
          lat: googleMarker.getPosition().lat(),
          lng: googleMarker.getPosition().lng()
        },
        pixel: self._getMarkerPixel(googleMarker)
      };

      self.trigger('markerAction', eventName, Ember.Object.create(data));
    });
  },

  /**
   * Remove a listener from a given marker
   */
  removeMarkerListener: function (id, eventName) {
    var googleApi = this.get('googleApi');
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    googleApi.maps.event.clearInstanceListeners(markerMap.get(id), eventName);
  },

  /**
   * Remove a marker from the map
   * @param marker
   */
  removeMarker: function (id) {
    var googleApi = this.get('googleApi');
    var googleMarker;
    var markerMap = this.get('markerMap');
    var markerClusterer = this.get('markerClusterer');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    googleMarker = markerMap.get(id);

    googleApi.maps.event.clearInstanceListeners(googleMarker);

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
    var googleApi = this.get('googleApi');
    var googleMap = this.get('googleMap');
    var component = this.get('component');

    // Calculate the position of the marker click-style event
    var overlay = new googleApi.maps.OverlayView();
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
