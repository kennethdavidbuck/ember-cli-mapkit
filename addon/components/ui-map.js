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


      map.on('action', this, function () {
        this.sendAction.apply(this, ['action'].concat([].slice.call(arguments)));
      });

      map.on('markerAction', this, function () {
        this.sendAction.apply(this, ['markerAction'].concat([].slice.call(arguments)));
      });

      map.one('readyAction', this, function () {
        this.sendAction.apply(this, ['readyAction'].concat([].slice.call(arguments)));
      });

      map.register(this);
    });
  }.on('didInsertElement'),

  /**
   *
   */
  teardown: function () {
    var map = this.get('map');

    map.off('action', this);
    map.off('markerAction', this);

    map.unregister(this);
  }.on('willDestroyElement')
});

