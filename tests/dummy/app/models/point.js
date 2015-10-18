import DS from 'ember-data';

const {attr} = DS;

export default DS.Model.extend({
  title: attr('string'),
  lat: attr('number'),
  lng: attr('number')
});
