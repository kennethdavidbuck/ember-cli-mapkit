
export function initialize(container, application) {
  application.inject('model:point', 'map', 'service:map');
  application.inject('controller:index', 'map', 'service:map');
  application.inject('component:ui-map', 'map', 'service:map');
  application.inject('route:index', 'map', 'service:map');
}

export default {
  name: 'inject-map-service',
  initialize: initialize
};
