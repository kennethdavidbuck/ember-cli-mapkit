import Ember from 'ember';
import layout from '../templates/components/ui-leaflet-map';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'ui-leaflet-map',
  classNames: ['ui-map', 'ui-leaflet-map']
});
