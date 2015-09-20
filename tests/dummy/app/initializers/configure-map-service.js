
export function initialize(container, application) {
  application.inject('controller', 'map', 'service:map');
  application.inject('route', 'map', 'service:map');
}

export default {
  name: 'configure-map-service',
  after: 'inject-map-service',
  initialize: initialize
};
