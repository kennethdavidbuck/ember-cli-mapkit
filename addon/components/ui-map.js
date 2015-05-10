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
    var map = this.get('map');
    Ember.run.scheduleOnce('afterRender', this, function () {
      map.register(this);
    });
  }.on('didInsertElement'),

  /**
   *
   */
  teardown: function () {
    var map = this.get('map');
    map.unregister(this);
  }.on('willDestroyElement')
});

