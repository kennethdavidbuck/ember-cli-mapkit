import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  lat: 62.9945,
  lng: -96.329,
  title: function () {
    return faker.name.firstName();
  }
});
