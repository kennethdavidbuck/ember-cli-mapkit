import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    controller.set('model', model.map((point) => {
      const {id, title, lat, lng} = point.getProperties('id', 'title', 'lat', 'lng');

      return {
        id: id,
        title: title,
        position: {
          lat: lat,
          lng: lng
        }
      };
    }));
  }
});
