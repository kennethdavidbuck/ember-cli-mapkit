import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return [
      Ember.Object.create({
        title: 'Example 1',
        position: {
          lat: 62.9945,
          lng: -96.3293
        },
        createdAt: "0000-00-00 00:00:00",
        id: 1,
        visible: true,
        draggable: true
      }),
      Ember.Object.create({
        title: 'Example 2',
        position: {
          lat: 60.4799,
          lng: -94.8187
        },
        createdAt: "0000-00-00 00:00:00",
        id: 2,
        visible: true
      })
    ];
  },

  setupController(controller, model, transition) {
    this._super(controller, model, transition);
  },

  actions: {
    mapReady(/*map*/) {},
    mapClick(/*map, data*/) { },
    markerDrag(/*map, data*/) { },
    markerClick(/*map, markerId, data*/) { }
  }
});
