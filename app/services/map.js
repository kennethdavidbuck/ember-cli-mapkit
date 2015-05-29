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

  setup: Ember.on('init', function () {
    var container = this.get('container');
    var MAPKIT_ENV = container.lookup('application:main').MAPKIT;
    var MarkerClusterer = container.lookup('google:marker-clusterer');

    this.setProperties({
      config: MAPKIT_ENV,
      markerClusterer: new MarkerClusterer(null, [], MAPKIT_ENV.MARKER_CLUSTERER),
      markerMap: Ember.Map.create()
    });
  }),

  /**
   * Create map, and add handlers etc.
   * @param component
   */
  register(component) {
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

    MAPKIT_ENV.MAP_EVENTS.forEach((eventName) => {
      this.addListener(eventName);
    });

    //fixes bug where fromLatLnToContainerPixel returns undefined.
    var overlay = new googleApi.maps.OverlayView();
    overlay.draw = function () {
    };
    overlay.setMap(googleMap);

    markerClusterer.setMap(googleMap);

    //this part runs when the map object is created and rendered
    googleApi.maps.event.addListenerOnce(googleMap, 'tilesloaded', () => {
      this.set('isLoaded', true);

      this.trigger('readyAction');
    });
  },

  /**
   * Removes handlers etc.
   */
  unregister() {
    var props = this.getProperties('googleApi', 'googleMap', 'markerMap', 'markerClusterer');
    var markerMap = props.markerMap;
    var googleApi = props.googleApi;
    var googleMap = props.googleMap;
    var markerClusterer = props.markerClusterer;

    // clean up all listeners
    markerMap.forEach((googleMarker) => {
      googleApi.maps.event.clearInstanceListeners(googleMarker);
    });

    googleApi.maps.event.clearInstanceListeners(googleMap);

    markerClusterer.clearMarkers();
    markerMap.clear();
  },

  /**
   * Add a listener to the map.
   */
  addListener(eventName) {
    var props = this.getProperties('googleApi', 'googleMap');
    var googleApi = props.googleApi;
    var googleMap = props.googleMap;

    googleApi.maps.event.addListener(googleMap, eventName, (event) => {
      var component = this.get('component');
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

      this.trigger('action', eventName, data);
    });
  },

  /**
   * Remove a listener from the map
   * @param eventName
   */
  removeListener(eventName) {
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
  panTo(position) {
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
  options: Ember.computed ('googleMap' ,function (key, value) {
    if (arguments.length > 1) {
      this.get('googleMap').setOptions(value);
    }
  }),

  /* Marker Specific */

  /**
   *
   * @param id
   */
  hasMarker(id) {
    var markerMap = this.get('markerMap');

    return markerMap.has(id);
  },

  /**
   *
   * @param markers
   */
  addMarkers(markers) {
    markers.forEach((marker) => {
      this.addMarker(marker);
    });
  },

  /**
   * Add a marker to the map
   * @param marker
   */
  addMarker(marker) {
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
  addMarkerListener(id, eventName) {
    var data = {};
    var props = this.getProperties('googleApi', 'markerMap', 'component');

    Ember.assert('This marker has no mapping', props.markerMap.has(id));

    var googleMarker = props.markerMap.get(id);

    props.googleApi.maps.event.addListener(googleMarker, eventName, () => {
      data = {
        id: id,
        position: {
          lat: googleMarker.getPosition().lat(),
          lng: googleMarker.getPosition().lng()
        },
        pixel: this._getMarkerPixel(googleMarker)
      };

      this.trigger('markerAction', eventName, Ember.Object.create(data));
    });
  },

  /**
   * Remove a listener from a given marker
   */
  removeMarkerListener(id, eventName) {
    var props = this.getProperties('googleApi', 'markerMap');

    Ember.assert('This marker has no mapping', props.markerMap.has(id));

    props.googleApi.maps.event.clearInstanceListeners(props.markerMap.get(id), eventName);
  },

  /**
   * Remove a marker from the map
   * @param marker
   */
  removeMarker(id) {
    var props = this.getProperties('googleApi', 'markerMap', 'markerClusterer');
    var googleMarker;

    Ember.assert('This marker has no mapping', props.markerMap.has(id));

    googleMarker = props.markerMap.get(id);

    props.googleApi.maps.event.clearInstanceListeners(googleMarker);

    markerClusterer.removeMarker(googleMarker);

    props.markerMap.delete(id);
  },

  /**
   *
   */
  setMarkerIcon(id, icon) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setIcon(icon);
  },

  /**
   *
   */
  setMarkerPosition(id, position) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setPosition(position);
  },

  getMarkerPosition(id) {
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
  getMarkerPixel(id) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    return this._getMarkerPixel(markerMap.get(id));
  },

  /**
   * Retrieve a given markers pixel values. Useful for placement of context menus etc.
   * @private
   */
  _getMarkerPixel(googleMarker) {
    var props = this.getProperties('googleApi', 'googleMap', 'component');

    // Calculate the position of the marker click-style event
    var overlay = new props.googleApi.maps.OverlayView();
    overlay.draw = function () {
    };
    overlay.setMap(props.googleMap);

    var proj = overlay.getProjection();
    var pos = googleMarker.getPosition();
    var p = proj.fromLatLngToContainerPixel(pos);

    var position = props.component.$().position();

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
  setMarkerDraggable(id, draggable) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setDraggable(draggable);
  },

  /**
   *
   * @param id
   * @param visible
   */
  setMarkerVisible(id, visible) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setVisible(visible);
  },

  /**
   *
   */
  setMarkerTitle(id, title) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setTitle(title);
  }
});
