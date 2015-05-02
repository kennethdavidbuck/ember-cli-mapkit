import Ember from 'ember';

export default Ember.Route.extend({

  model: function () {
    var model = [
      Ember.Object.create({
        title: 'Example 1',
        position: {
          lat: 62.9945,
          lng: -96.3293
        },
        createdAt: "0000-00-00 00:00:00",
        id: 1,
        visible: true
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

    return this.loadMap(model);
  },

  setupController: function (controller, model) {
    this.get('map').addMarkers(model);
    this._super(controller, model);
  },

  actions: {
    mapReady: function () {
      Ember.Logger.log('Map ready');
    },

    mapEvent: function (name, event) {
      Ember.Logger.log(name, event);
    },

    markerEvent: function (name, event) {
      Ember.Logger.log(name, event);
    }
  }
});
