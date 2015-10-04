import Ember from 'ember';
import UIAbstractMap from './ui-abstract-map';

import layout from '../templates/components/ui-test-map';

export default UIAbstractMap.extend({
  layout: layout,
  tagName: 'ui-test-map',
  classNames: ['ui-test-map']
});

