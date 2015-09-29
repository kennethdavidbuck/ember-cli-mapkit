import Ember from 'ember';

export default Ember.Route.extend({

  cache: Ember.A(),

  model() {
    let cache = this.get('cache');

    if(cache.get('length') === 0) {
       cache.pushObjects([
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
      ]);
    }

    return cache;
  },

  actions: {
    mapReady(/*map*/) {},
    mapClick(/*map, id, data*/) {},
    markerDrag(map, markerId, data) {
      console.log(data);
    },
    markerClick(map, id, data) {
      console.log(data);
    },
    markerDragEnd(map, id, data) {
      console.log(data);
      this.get('currentModel').findBy('id', id).set('position', data.position);
    }
  }
});
