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
  setup: Ember.on('didInsertElement', function () {
    const props = this.getProperties('map', 'actionHandlers');

    Ember.run.scheduleOnce('afterRender', this, function () {
      props.actionHandlers.forEach((handler) => {
        props.map.on(handler, this, function () {
          this.sendAction.apply(this, [handler].concat([].slice.call(arguments)));
        });
      });

      props.map.register(this);
    });
  }),

  /**
   *
   */
  teardown: Ember.on('willDestroyElement', function () {
    const props = this.getProperties('map', 'actionHandlers');

    props.actionHandlers.forEach((handler) => {
      props.map.off(handler, this);
    });

    props.map.unregister(this);
  })
});

