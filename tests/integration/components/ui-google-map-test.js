import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

/*global google*/

moduleForComponent('ui-google-map', 'Integration | Component | ui google map', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.setProperties({
    markers: [],
    mapApi: google
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi}}`);

  stop();
  this.on('mapReady', () => {
    assert.ok(true, 'Should receive mapReady action after successful map initialization');
    start();
  });
});
