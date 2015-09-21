
/* global google, MarkerClusterer */

export function initialize(container, application) {
  application.register('google:main', google, {instantiate:false});
  application.register('google:marker-clusterer', MarkerClusterer, {instantiate:false});

  application.inject('service:map', 'application', 'application:main');
  application.inject('service:map', 'MarkerClusterer', 'google:markerClusterer');
  application.inject('service:map', 'googleApi', 'google:main');

  application.inject('component:ui-map', 'application', 'application:main');
  application.inject('component:ui-map', 'MarkerClusterer', 'google:markerClusterer');
  application.inject('component:ui-map', 'googleApi', 'google:main');
}

export default {
  name: 'inject-map-service',
  initialize: initialize
};
