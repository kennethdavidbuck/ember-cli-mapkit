import Ember from 'ember';
import layout from '../templates/components/ui-test-map';
import UIAbstractMap from './ui-abstract-map';

export default UIAbstractMap.extend({
  layout: layout,
  tagName: 'ui-test-map',
  classNames: ['ui-test-map'],

  setup() {
    return new Ember.RSVP.Promise((resolve) => {
      resolve();
    });
  },

  teardown() {
    return new Ember.RSVP.Promise((resolve) => {
      resolve();
    });
  }
});
