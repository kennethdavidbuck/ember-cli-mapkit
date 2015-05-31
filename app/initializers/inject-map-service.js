
/* global google, MarkerClusterer */

export function initialize(container, application) {
  container.register('google:main', google, {instantiate:false});
  container.register('google:marker-clusterer', MarkerClusterer, {instantiate:false});

  application.inject('service:map', 'application', 'application:main');
  application.inject('service:map', 'MarkerClusterer', 'google:markerClusterer');
  application.inject('service:map', 'googleApi', 'google:main');
}

export default {
  name: 'inject-map-service',
  initialize: initialize
};
