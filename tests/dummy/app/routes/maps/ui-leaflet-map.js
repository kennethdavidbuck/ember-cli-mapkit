import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    mapReady(/*map*/) {},
    mapClick(/*map, data*/) { },
    markerDrag(/*map, data*/) { },
    markerClick(/*map, markerId, data*/) { }
  }
});
