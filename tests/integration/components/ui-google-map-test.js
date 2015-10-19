import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

/*global google, stop, start*/

moduleForComponent('ui-google-map', 'Integration | Component | ui google map', {
  integration: true
});

test('sends map ready action on successful initialization', function (assert) {
  assert.expect(1);

  this.setProperties({
    markers: [],
    mapApi: google
  });

  this.render(hbs`{{ui-google-map mapApi=mapApi}}`);

  stop();
  this.on('mapReady', () => {
    assert.ok(true, 'Should receive mapReady action after successful map initialization');
    start();
  });
});

test('sends configured map click action', function (assert) {
  assert.expect(1);

  const eventName = 'click';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapClick', function () {
    assert.ok(true, 'should send marker click');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent(eventName , {lat: 0, lng: 0});
  });
});

test('sends configured map bounds changed action', function (assert) {
  // no expect because bounds changed is fired variably

  const eventName = 'boundsChanged';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapBoundsChanged', function () {
    assert.ok(true, 'should send bounds changed');
  });

  stop();
  this.on('mapReady', () => {
    start();
  });
});

test('sends configured map bounds changed action', function (assert) {
  assert.expect(1);

  const eventName = 'centerChanged';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapCenterChanged', function () {
    assert.ok(true, 'should send center changed');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});

test('sends configured map double click action', function (assert) {
  assert.expect(1);

  const eventName = 'doubleClick';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapDoubleClick', function () {
    assert.ok(true, 'should map double click');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent(eventName , {lat: 0, lng: 0});
  });
});

test('sends configured map right click action', function (assert) {
  assert.expect(1);

  const eventName = 'rightClick';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapRightClick', function () {
    assert.ok(true, 'should send marker right click');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent(eventName , {lat: 0, lng: 0});
  });
});

test('sends configured map tiles loaded action', function (assert) {

  const eventName = 'tilesLoaded';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapTilesLoaded', function () {
    assert.ok(true, 'should send map tiles loaded');
  });

  stop();
  this.on('mapReady', () => {
    start();
    map.triggerMapEvent(eventName , {lat: 0, lng: 0});
  });
});

test('sends configured map zoom changed action', function (assert) {
  assert.expect(1);

  const eventName = 'zoomChanged';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapZoomChanged', function () {
    assert.ok(true, 'should send map zoom changed');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});

test('sends configured map drag action', function (assert) {
  assert.expect(1);

  const eventName = 'drag';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapDrag', function () {
    assert.ok(true, 'should send map drag');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});

test('sends configured map drag start action', function (assert) {
  assert.expect(1);

  const eventName = 'dragStart';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapDragStart', function () {
    assert.ok(true, 'should send map drag start');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});

test('sends configured map drag end action', function (assert) {
  assert.expect(1);

  const eventName = 'dragEnd';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapDragEnd', function () {
    assert.ok(true, 'should send map drag end');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});

test('sends map heading changed action', function (assert) {
  assert.expect(1);

  const eventName = 'headingChanged';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapHeadingChanged', function () {
    assert.ok(true, 'should send map heading changed');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});

test('sends map idle action', function (assert) {
  assert.expect(1);

  const eventName = 'idle';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapIdle', function () {
    assert.ok(true, 'should send map idle');
  });

  stop();
  this.on('mapReady', () => {
    start();
    // map sends idle action automatically
  });
});

test('sends map type id changed action', function (assert) {
  assert.expect(1);

  const eventName = 'mapTypeIdChanged';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapTypeIdChanged', function () {
    assert.ok(true, 'should send map type id changed');
  });

  stop();
  this.on('mapReady', (map) => {
    start();
    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});

test('sends map projection changed action', function (assert) {
  assert.expect(1);

  const eventName = 'projectionChanged';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapProjectionChanged', function () {
    assert.ok(true, 'should send projection changed');
  });

  stop();
  this.on('mapReady', () => {
    start();
    // map project changed is sent automatically
  });
});

test('sends map mouse move action', function (assert) {
  assert.expect(1);

  const eventName = 'mouseMove';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapMouseMove', function () {
    assert.ok(true, 'should send mouse move');
  });

  stop();
  this.on('mapReady', (map) => {
    start();
    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});

test('sends map mouse up action', function (assert) {
  assert.expect(1);

  const eventName = 'mouseUp';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapMouseUp', function () {
    assert.ok(true, 'should send mouse up');
  });

  stop();
  this.on('mapReady', (map) => {
    start();
    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});

test('sends map mouse down action', function (assert) {
  assert.expect(1);

  const eventName = 'mouseDown';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapMouseDown', function () {
    assert.ok(true, 'should send mouse down');
  });

  stop();
  this.on('mapReady', (map) => {
    start();
    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});

test('sends map mouse over action', function (assert) {
  assert.expect(1);

  const eventName = 'mouseOver';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapMouseOver', function () {
    assert.ok(true, 'should send mouse over');
  });

  stop();
  this.on('mapReady', (map) => {
    start();
    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});

test('sends map mouse out action', function (assert) {
  assert.expect(1);

  const eventName = 'mouseOut';

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: [eventName]
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapMouseOut', function () {
    assert.ok(true, 'should send mouse out');
  });

  stop();
  this.on('mapReady', (map) => {
    start();
    map.triggerMapEvent(eventName, {lat: 0, lng: 0});
  });
});
