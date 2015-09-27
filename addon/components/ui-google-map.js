import Ember from 'ember';
import layout from '../templates/components/ui-google-map';

export default Ember.Component.extend({

  layout: layout,

  tagName: 'ui-google-map',

  classNames: ['ui-map', 'ui-google-map'],

  readyAction: 'mapReady',

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

  setup: Ember.on('didInsertElement', function () {
    Ember.run.next(() => {
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

      let googleMap = new googleApi.maps.Map(this.$()[0], options);

      this.setProperties({
        googleMap: googleMap,
        mapTypeId: MAPKIT_ENV.MAP_TYPE
      });

      //fixes bug where fromLatLnToContainerPixel returns undefined.
      const overlay = new googleApi.maps.OverlayView();
      overlay.draw = function () {
      };
      overlay.setMap(googleMap);

      this.sendAction('readyAction', this);
    });
  })
});

