
/* global google, MarkerClusterer */

export function initialize(container, application) {
  container.register('google:main', google, {instantiate:false});
  container.register('google:marker-clusterer', MarkerClusterer, {instantiate:false});

  application.inject('service:map', 'googleApi', 'google:main');
  application.inject('controller:index', 'map', 'service:map');
  application.inject('component:ui-map', 'map', 'service:map');
  application.inject('route:index', 'map', 'service:map');
}

export default {
  name: 'inject-map-service',
  initialize: initialize
};
