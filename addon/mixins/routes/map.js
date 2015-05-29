/**
 *
 */

import Ember from 'ember';

export default Ember.Mixin.create({

  actions: {

    /**
     *
     */
    mapEvent(eventName, event) {
      try {
        eventName = 'map-%@'.fmt(eventName).camelize();

        this.send(eventName, event);
      } catch(e) {
        Ember.Logger.warn(eventName);
      }
    },

    /**
     *
     */
    markerEvent(eventName, event) {
      try {
        eventName = 'marker-%@'.fmt(eventName).camelize();

        this.send(eventName, event);
      } catch(e) {
        Ember.Logger.warn(eventName);
      }
    }
  }
});
