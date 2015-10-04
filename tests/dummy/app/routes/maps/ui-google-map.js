import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    markerClick(map, id, data) {
      console.log(data);
      return true;
    }
  }
});
