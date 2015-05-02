import mapLoader from 'ember-cli-mapkit/utils/map-loader';

export function initialize(container, application) {
  container.register('util:mapLoader', mapLoader, {instantiate: false});
  application.inject('route', 'loadMap', 'util:mapLoader');
}

export default {
  name: 'inject-map-loader',
  initialize: initialize
};
