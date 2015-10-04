import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('ui-abstract-map', {});

test('it renders', function (assert) {
  assert.expect(2);

  const component = this.subject();
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});

test('sets own map facade when not present', function (assert) {
  assert.expect(1);

  const component = this.subject();

  // renders the component to the page
  this.render();

  assert.ok(component.get('mapFacade'), 'should have an instance of MapFacade');
});

test('initial marker map size is 0', function (assert) {
  assert.expect(1);

  const component = this.subject();

  this.render();

  assert.strictEqual(component.size(), 0, 'map size should be empty on initial render');
});
