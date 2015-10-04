import Ember from 'ember';

/*global JSON*/

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

  displayData(data) {
    const eventData = this.get('controller.eventData');
    eventData.insertAt(0, JSON.stringify(data, undefined, 2));
    if(eventData.get('length') > 100) {
      eventData.splice(100, 1);
    }
  },

  actions: {
    mapReady(/*map*/) {},
    mapMouseMove(map, data) {
      this.displayData(data);
    },
    mapDoubleClick(id, data) {
      this.displayData(data);
    },
    mapClick(map, data) {
      this.displayData(data);
    },
    markerDrag(map, markerId, data) {
      this.displayData(data);
    },
    markerClick(map, id, data) {
      this.displayData(data);
    },
    markerDragEnd(map, id, data) {
      this.get('currentModel').findBy('id', id).set('position', data.position);
      this.displayData(data);
    }
  }
});
