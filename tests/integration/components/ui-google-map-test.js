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

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: ['click']
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapClick', function () {
    assert.ok(true, 'should send marker click');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent('click', {lat: 0, lng: 0});
  });
});

test('sends configured map bounds changed action', function (assert) {
  // no expect because bounds changed is fired variably

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: ['boundsChanged']
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

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: ['centerChanged']
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapCenterChanged', function () {
    assert.ok(true, 'should send center changed');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent('centerChanged', {lat: 0, lng: 0});
  });
});

test('sends configured map double click action', function (assert) {
  assert.expect(1);

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: ['doubleClick']
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapDoubleClick', function () {
    assert.ok(true, 'should map double click');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent('doubleClick', {lat: 0, lng: 0});
  });
});

test('sends configured map right click action', function (assert) {
  assert.expect(1);

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: ['rightClick']
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapRightClick', function () {
    assert.ok(true, 'should send marker right click');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent('rightClick', {lat: 0, lng: 0});
  });
});

test('sends configured map tiles loaded action', function (assert) {
  assert.expect(1);

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: ['tilesLoaded']
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapTilesLoaded', function () {
    assert.ok(true, 'should send map tiles loaded');
  });

  stop();
  this.on('mapReady', () => {
    start();
  });
});

test('sends configured map zoom changed action', function (assert) {
  assert.expect(1);

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: ['zoomChanged']
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapZoomChanged', function () {
    assert.ok(true, 'should send map zoom changed');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent('zoomChanged', {lat: 0, lng: 0});
  });
});

test('sends configured map drag action', function (assert) {
  assert.expect(1);

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: ['drag']
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapDrag', function () {
    assert.ok(true, 'should send map drag');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent('drag', {lat: 0, lng: 0});
  });
});

test('sends configured map drag start action', function (assert) {
  assert.expect(1);

  this.setProperties({
    markers: [],
    mapApi: google,
    config: {
      mapEvents: ['dragStart']
    }
  });

  this.render(hbs`{{ui-google-map markers=markers mapApi=mapApi config=config}}`);

  this.on('mapDragStart', function () {
    assert.ok(true, 'should send map drag start');
  });

  stop();
  this.on('mapReady', (map) => {
    start();

    map.triggerMapEvent('dragStart', {lat: 0, lng: 0});
  });
});
