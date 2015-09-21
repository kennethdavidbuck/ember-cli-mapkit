
export function initialize(container, application) {
  application.inject('route', 'map', 'service:map');
}

export default {
  name: 'configure-map-service',
  after: 'inject-map-service',
  initialize: initialize
};
