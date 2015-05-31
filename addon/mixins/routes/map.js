/**
 *
 */

import Ember from 'ember';

export default Ember.Mixin.create({

  actions: {

    /**
     * @method mapEvent
     * @param {String} eventName
     * @param {String} event
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
     * @method markerEvent
     * @param {String} eventName
     * @param {String} event
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
