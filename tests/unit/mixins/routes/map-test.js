import Ember from 'ember';
import MapRouteMixin from '../../../../mixins/routes/map';
import { module, test } from 'qunit';

module('RoutesMapMixin');

// Replace this with your real tests.
test('it works', function (assert) {
	var RoutesMapObject = Ember.Object.extend(MapRouteMixin);
	var subject = RoutesMapObject.create();
	assert.ok(subject);
});
