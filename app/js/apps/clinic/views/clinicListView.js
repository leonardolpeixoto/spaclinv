'use strict';

const CollectionView = require('../../../common').CollectionView;
const ClinicListItemView = require('./clinicListItemView');

class ClinicListView extends CollectionView {
  constructor(options) {
    super(options);
    this.modelView = ClinicListItemView;
  }

  get className() {
    return 'row';
  }
}

module.exports = ClinicListView;
