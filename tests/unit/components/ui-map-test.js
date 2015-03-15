import {
  moduleForComponent,
  test
  } from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('ui-map', {
  // specify the other units that are required for this test
  needs: ['service:map'],

  setup: function () {
    this.subject().set('map', Ember.Object.create({
      setup: function () {

      },
      teardown: function () {

      }
    }));
  }
});

test('it renders', function (assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
