
/* global google, MarkerClusterer */

export function initialize(container, application) {
  container.register('google:main', google, {instantiate:false});
  container.register('google:marker-clusterer', MarkerClusterer, {instantiate:false});

  application.inject('service:map', 'googleApi', 'google:main');
  application.inject('controller', 'map', 'service:map');
  application.inject('component:ui-map', 'map', 'service:map');
  application.inject('route', 'map', 'service:map');
}

export default {
  name: 'inject-map-service',
  initialize: initialize
};
