import {
  moduleForComponent,
  test
  } from 'ember-qunit';

moduleForComponent('ui-map', {
  // specify the other units that are required for this test
  needs: ['service:map'],

  setup: function () {
    this.subject().set('map', {
      on: function () {},
      off: function () {},
      register: function () {},
      unregister:function () {}
    });
  },

  teardown: function () {
    //this.subject().set('map', null);
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
