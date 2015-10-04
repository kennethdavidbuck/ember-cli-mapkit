import Ember from 'ember';
import MapFacade from '../../facades/map';

export default Ember.Route.extend({

  setupController(controller, model) {
    this._super(controller,model);
    controller.set('map', MapFacade.create());
  },

  actions: {
    markerClick(map, id, data) {
      console.log(data);
      return true;
    }
  }
});
