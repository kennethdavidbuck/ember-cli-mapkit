import Ember from 'ember';
import layout from '../templates/components/ui-map';

export default Ember.Component.extend({

  layout: layout,

  tagName: 'ui-map',

  classNames: ['ui-map'],

  action: 'mapEvent',

  markerAction: 'markerEvent',

  readyAction: 'mapReady',

  actionHandlers: ['readyAction', 'action', 'markerAction'],

  /**
   *
   */
  setup: function () {
    var map = this.get('map');
    var handlers = this.get('actionHandlers');

    Ember.run.scheduleOnce('afterRender', this, function () {
      handlers.forEach(function (handler) {
        map.on(handler, this, function () {
          this.sendAction.apply(this, [handler].concat([].slice.call(arguments)));
        });
      }, this);
      map.register(this);
    });
  }.on('didInsertElement'),

  /**
   *
   */
  teardown: function () {
    var map = this.get('map');
    var handlers = this.get('actionHandlers');
    handlers.forEach(function (handler) {
      map.off(handler, this);
    }, this);
    map.unregister(this);
  }.on('willDestroyElement')
});

