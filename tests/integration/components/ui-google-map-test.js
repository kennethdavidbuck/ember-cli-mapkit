import { moduleForComponent, test } from 'ember-qunit';
//import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-google-map', 'Integration | Component | ui google map', {
  integration: true
});

test('temp', function (assert) {
  assert.ok(true);
});
//
//test('it renders', function(assert) {
//  assert.expect(2);
//
//  // Set any properties with this.set('myProperty', 'value');
//  // Handle any actions with this.on('myAction', function(val) { ... });
//
//  this.render(hbs`{{ui-google-map}}`);
//
//  assert.equal(this.$().text().trim(), '');
//
//  // Template block usage:
//  this.render(hbs`
//    {{#ui-google-map}}
//      template block text
//    {{/ui-google-map}}
//  `);
//
//  assert.equal(this.$().text().trim(), 'template block text');
//});