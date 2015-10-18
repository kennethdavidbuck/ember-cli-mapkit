import Ember from 'ember';

/*global JSON*/

export default Ember.Route.extend({

  model() {
    return this.store.findAll('point');
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
      this.get('store').peekRecord('point', id).setProperties({
        lat: data.position.lat,
        lng: data.position.lng
      });

      this.displayData(data);
    }
  }
});
