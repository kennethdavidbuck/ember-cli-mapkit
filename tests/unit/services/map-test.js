import {
  moduleFor,
  test
  } from 'ember-qunit';

moduleFor('service:map', {
  needs: ['container'],
  setup: function () {
  },
  teardown: function () {
  }
});

// Replace this with your real tests.
test('it exists', function (assert) {
  var service = this.subject();
  assert.ok(service);
});
