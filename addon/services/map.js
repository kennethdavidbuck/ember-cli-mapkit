/**
 * @module MapKit
 * @class Map
 */

import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  /**
   * @property component
   */
  component: null,

  /**
   * @property googleApi
   */
  googleApi: null,

  /**
   * @property googleMap
   */
  googleMap: null,

  /**
   * @property markerMap
   */
  markerMap: Ember.computed(function () {
    return Ember.Map.create();
  }),

  /**
   * @property markerClusterer
   */
  markerClusterer: Ember.computed('config', function () {
    var MarkerClusterer = this.get('MarkerClusterer');

    return new MarkerClusterer(null, [], this.get('config.MARKER_CLUSTERER'));
  }),

  /**
   * @property config
   */
  config: Ember.computed(function () {
    return this.get('application.MAPKIT');
  }),

  /**
   * @property isLoaded
   * @default false
   */
  isLoaded: false,

  /**
   * Create map, and add handlers etc.
   * @method register
   * @param {Component}
   */
  register(component) {
    this.set('component', component);

    var props = this.getProperties('config', 'googleApi', 'markerClusterer');

    var MAPKIT_ENV = props.config;
    var googleApi = props.googleApi;
    var markerClusterer = props.markerClusterer;
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
   * @method unregister
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
   * @method addListener
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
   * Remove an event listener from the map
   * @method removeListener
   * @param {String} eventName
   */
  removeListener(eventName) {
    var props = this.getProperties('googleApi', 'googleMap');

    props.googleApi.maps.event.clearInstanceListeners(props.googleMap, eventName);
  },

  /**
   * The maps center property.
   * @property center
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
   * @method panTo
   * @param {Object} position
   */
  panTo(position) {
    this.get('googleMap').panTo(position);
  },

  /**
   * @property zoom
   */
  zoom: function (key, zoom) {
    var googleMap = this.get('googleMap');
    if (arguments.length > 1) {
      googleMap.setZoom(zoom);
    }

    return googleMap.getZoom();
  }.property('googleMap').volatile(),

  /**
   * @property tilt
   */
  tilt: function () {
    return this.get('googleMap').getTilt();
  }.property('googleMap').volatile(),

  /**
   * The current map bounds.
   * @property bounds
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
   * Type of map used for display (ex roadmap, hybrid).
   * @property mapTypeId
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
   * Set map options.
   * @property options
   */
  options: Ember.computed('googleMap', function (key, value) {
    if (arguments.length > 1) {
      this.get('googleMap').setOptions(value);
    }
  }),

  /**
   * Fits the current map bounds to fit all markers.
   * @method fitToMarkers
   */
  fitToMarkers() {
    this.get('markerClusterer').fitMapToMarkers();
  },

  /**
   * Returns the number of markers that are currently on the map.
   * @return {Number} The number of markers on the map.
   */
  size: function () {
    return this.get('markerMap.size');
  },

  /* Marker Specific */

  /**
   * @method hasMarker
   * @param {*} id
   * @return {Boolean} Whether or not the current marker is on the map.
   */
  hasMarker(id) {
    var markerMap = this.get('markerMap');

    return markerMap.has(id);
  },

  /**
   * @method addMarkers
   * @param {Array} markers
   */
  addMarkers(markers) {
    markers.forEach((marker) => {
      this.addMarker(marker);
    });
  },

  /**
   * Add a marker to the map.
   * @method addMarker
   * @param {*} marker
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
   * Remove a listener from a given marker.
   * @method removeMarkerListener
   */
  removeMarkerListener(id, eventName) {
    var props = this.getProperties('googleApi', 'markerMap');

    Ember.assert('This marker has no mapping', props.markerMap.has(id));

    props.googleApi.maps.event.clearInstanceListeners(props.markerMap.get(id), eventName);
  },

  /**
   * Remove a marker from the map.
   * @method removeMarker
   * @param {*} marker The id of the marker to remove from the Map.
   */
  removeMarker(id) {
    var props = this.getProperties('googleApi', 'markerMap', 'markerClusterer');
    var googleMarker;

    Ember.assert('This marker has no mapping', props.markerMap.has(id));

    googleMarker = props.markerMap.get(id);

    props.googleApi.maps.event.clearInstanceListeners(googleMarker);

    props.markerClusterer.removeMarker(googleMarker);

    props.markerMap.delete(id);
  },

  /**
   * @method setMarkerIcon
   */
  setMarkerIcon(id, icon) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setIcon(icon);
  },

  /**
   * @method setMarkerPosition
   * @param {*} id The id of the marker to set the position for.
   * @param {{lat: *, lng: *}} position The new marker position to be used.
   */
  setMarkerPosition(id, position) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setPosition(position);
  },

  /**
   * @method getMarkerPosition
   * @param {*} id The id of the marker to get the position for.
   * @returns {{lat: *, lng: *}}
   */
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
   * Returns the x,y pixel position of the marker on the marker map. This value takes the position offset of the map
   * canvas into consideration.
   * @method getMarkerPixel
   * @param {*} id The id of the marker to get the pixel position of.
   * @returns {*}
   */
  getMarkerPixel(id) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    return this._getMarkerPixel(markerMap.get(id));
  },

  /**
   * Retrieve a given markers pixel values. Useful for placement of context menus etc.
   * @method _getMarkerPixel
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
   * Sets whether or not a given marker should be draggable on the map.
   * @method setMarkerDraggable
   * @param {*} id The id of the marker to set a draggable value on.
   * @param {Boolean} draggable Whether or not the marker should be draggable.
   */
  setMarkerDraggable(id, draggable) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setDraggable(draggable);
  },

  /**
   * Sets whether or not a given marker should be visible on the map.
   * @method setMarkerVisible
   * @param {*} id The id ofthe marker to set a visible value on.
   * @param {Boolean} visible Whether or not the marker should be visible.
   */
  setMarkerVisible(id, visible) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setVisible(visible);
  },

  /**
   * Sets a specified title onto a specified marker.
   * @method setMarkerTitle
   * @param {*} id The id of the marker to set the title on.
   * @param {String} title The title to be set on the marker.
   */
  setMarkerTitle(id, title) {
    var markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setTitle(title);
  }
});
