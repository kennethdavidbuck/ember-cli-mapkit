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
  markerMap: Ember.computed({
    get() {
      return Ember.Map.create();
    }
  }),

  /**
   * @property markerClusterer
   */
  markerClusterer: Ember.computed('config',{
    get() {
      const MarkerClusterer = this.get('MarkerClusterer');

      return new MarkerClusterer(null, [], this.get('config.MARKER_CLUSTERER'));
    }
  }),

  /**
   * @property config
   */
  config: Ember.computed({
    get() {
      return this.get('application.MAPKIT');
    }
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

    const props = this.getProperties('config', 'googleApi', 'markerClusterer');

    const MAPKIT_ENV = props.config;
    const googleApi = props.googleApi;
    const markerClusterer = props.markerClusterer;

    let options = {
      zoom: MAPKIT_ENV.MAP_DEFAULT_ZOOM,
      center: {
        lat: MAPKIT_ENV.MAP_DEFAULT_LAT,
        lng: MAPKIT_ENV.MAP_DEFAULT_LNG
      }
    };

    let googleMap = new googleApi.maps.Map(component.$()[0], options);

    this.setProperties({
      googleMap: googleMap,
      mapTypeId: MAPKIT_ENV.MAP_TYPE
    });

    MAPKIT_ENV.MAP_EVENTS.forEach((eventName) => {
      this.addListener(eventName);
    });

    //fixes bug where fromLatLnToContainerPixel returns undefined.
    const overlay = new googleApi.maps.OverlayView();
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
    const props = this.getProperties('googleApi', 'googleMap', 'markerMap', 'markerClusterer');
    const markerMap = props.markerMap;
    const googleApi = props.googleApi;
    const googleMap = props.googleMap;
    const markerClusterer = props.markerClusterer;

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
    const props = this.getProperties('googleApi', 'googleMap');
    const googleApi = props.googleApi;
    const googleMap = props.googleMap;

    googleApi.maps.event.addListener(googleMap, eventName, (event) => {
      const component = this.get('component');
      let position;
      let data = {};
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
    const props = this.getProperties('googleApi', 'googleMap');

    props.googleApi.maps.event.clearInstanceListeners(props.googleMap, eventName);
  },

  /**
   * The maps center property.
   * @property center
   */
  center: Ember.computed('googleMap', {
    get() {
      const center = this.get('googleMap').getCenter();
      return {
        lat: center.lat(),
        lng: center.lng()
      };
    },
    set(key, position) {
      this.get('googleMap').setCenter(position);

      return position;
    }
  })['volatile'](),

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
  zoom: Ember.computed('googleMap', {
    get() {
      return this.get('googleMap').getZoom();
    },
    set(key, zoom) {
      this.get('googleMap').setZoom(zoom);

      return zoom;
    }
  })['volatile'](),

  /**
   * @property tilt
   */
  tilt: Ember.computed('googleMap', {
    get() {
      return this.get('googleMap').getTilt();
    }
  })['volatile'](),

  /**
   * The current map bounds.
   * @property bounds
   */
  bounds: Ember.computed('googleMap', {
    get() {
      const bounds = this.get('googleMap').getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

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
    }
  })['volatile'](),

  /**
   * Type of map used for display (ex roadmap, hybrid).
   * @property mapTypeId
   */
  mapTypeId: Ember.computed('googleMap', {
    get() {
      return this.get('googleMap').getMapTypeId();
    },
    set(key, value) {
      let type;
      const props = this.getProperties('googleApi', 'googleMap');
      const googleApi = props.googleApi;
      const googleMap = props.googleMap;

      var SATELLITE = googleApi.maps.MapTypeId.SATELLITE;
      var ROADMAP = googleApi.maps.MapTypeId.ROADMAP;
      var TERRAIN = googleApi.maps.MapTypeId.TERRAIN;
      var HYBRID = googleApi.maps.MapTypeId.HYBRID;

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

      return googleMap.getMapTypeId();
    }
  })['volatile'](),

  /**
   * Set map options.
   * @property options
   */
  options: Ember.computed('googleMap', {
    set(key, value) {
      this.get('googleMap').setOptions(value);

      return value;
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
    const markerMap = this.get('markerMap');

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

    const self = this;
    const props = this.getProperties('config', 'googleApi', 'markerMap', 'markerClusterer');

    const MAPKIT_ENV = props.config;
    const googleApi = props.googleApi;
    const markerMap = props.markerMap;
    const markerClusterer = props.markerClusterer;
    const googleMarker = new googleApi.maps.Marker(marker);

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
    let data = {};
    const props = this.getProperties('googleApi', 'markerMap', 'component');

    Ember.assert('This marker has no mapping', props.markerMap.has(id));

    const googleMarker = props.markerMap.get(id);

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
    const props = this.getProperties('googleApi', 'markerMap');

    Ember.assert('This marker has no mapping', props.markerMap.has(id));

    props.googleApi.maps.event.clearInstanceListeners(props.markerMap.get(id), eventName);
  },

  /**
   * Remove a marker from the map.
   * @method removeMarker
   * @param {*} marker The id of the marker to remove from the Map.
   */
  removeMarker(id) {
    const props = this.getProperties('googleApi', 'markerMap', 'markerClusterer');

    Ember.assert('This marker has no mapping', props.markerMap.has(id));

    const googleMarker = props.markerMap.get(id);

    props.googleApi.maps.event.clearInstanceListeners(googleMarker);

    props.markerClusterer.removeMarker(googleMarker);

    props.markerMap.delete(id);
  },

  /**
   * @method setMarkerIcon
   */
  setMarkerIcon(id, icon) {
    const markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setIcon(icon);
  },

  /**
   * @method setMarkerPosition
   * @param {*} id The id of the marker to set the position for.
   * @param {{lat: *, lng: *}} position The new marker position to be used.
   */
  setMarkerPosition(id, position) {
    const markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setPosition(position);
  },

  /**
   * @method getMarkerPosition
   * @param {*} id The id of the marker to get the position for.
   * @returns {{lat: *, lng: *}}
   */
  getMarkerPosition(id) {
    const markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    const position = markerMap.get(id).getPosition();

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
    const markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    return this._getMarkerPixel(markerMap.get(id));
  },

  /**
   * Retrieve a given markers pixel values. Useful for placement of context menus etc.
   * @method _getMarkerPixel
   * @private
   */
  _getMarkerPixel(googleMarker) {
    const props = this.getProperties('googleApi', 'googleMap', 'component');

    // Calculate the position of the marker click-style event
    const overlay = new props.googleApi.maps.OverlayView();
    overlay.draw = function () {
    };
    overlay.setMap(props.googleMap);

    const proj = overlay.getProjection();
    const pos = googleMarker.getPosition();
    const p = proj.fromLatLngToContainerPixel(pos);

    const position = props.component.$().position();

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
    const markerMap = this.get('markerMap');

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
    const markerMap = this.get('markerMap');

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
    const markerMap = this.get('markerMap');

    Ember.assert('This marker has no mapping', markerMap.has(id));

    markerMap.get(id).setTitle(title);
  }
});
