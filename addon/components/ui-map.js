import Ember from 'ember';
import layout from '../templates/components/ui-map';

export default Ember.Component.extend({

  layout: layout,

  tagName: 'ui-map',

  classNames: ['ui-map'],

  action: 'mapEvent',

  markerAction: 'markerEvent',

  readyAction: 'mapReady',

  /**
   *
   */
  setup: function () {
    Ember.run.scheduleOnce('afterRender', this, function () {
      this.get('map').register(this);
    });
  }.on('didInsertElement'),

  /**
   *
   */
  teardown: function () {
    this.get('map').unregister(this);
  }.on('willDestroyElement')
});

