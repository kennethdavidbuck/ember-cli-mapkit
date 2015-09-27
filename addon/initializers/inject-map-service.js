
/* global google, MarkerClusterer*/

export function initialize(container, application) {
  application.register('google:main', google, {instantiate:false});
  application.register('google:marker-clusterer', MarkerClusterer, {instantiate:false});

  application.inject('service:map', 'application', 'application:main');
  application.inject('service:map', 'MarkerClusterer', 'google:markerClusterer');
  application.inject('service:map', 'googleApi', 'google:main');

  // ui-google-map
  application.inject('component:ui-google-map', 'application', 'application:main');
  application.inject('component:ui-google-map', 'MarkerClusterer', 'google:markerClusterer');
  application.inject('component:ui-google-map', 'googleApi', 'google:main');

  // ui-leaflet-map
  application.inject('component:ui-leaflet-map', 'application', 'application:main');
}

export default {
  name: 'inject-map-service',
  initialize: initialize
};
