import Ember from 'ember';
import MapRouteMixin from '../mixins/routes/map';

export default Ember.Route.extend(MapRouteMixin, {

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
  },

  setupController: function (controller, model) {
    this.get('map').addMarkers(model);
  },

  actions: {
    mapReady() {
      this.get('map').fitToMarkers();
    }
  }
});
