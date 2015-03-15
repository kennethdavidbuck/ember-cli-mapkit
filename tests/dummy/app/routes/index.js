import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    mapReady: function () {
      Ember.Logger.log('Map ready');

      this.get('map').addMarkers([
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
      ]);
    },

    mapEvent: function (name, data) {
      Ember.Logger.log(name, data);
    },

    markerEvent: function (name, data) {
      Ember.Logger.log(name, data);
    }
  }
});
