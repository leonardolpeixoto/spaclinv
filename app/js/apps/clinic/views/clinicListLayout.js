'use strict';

const Layout = require('../../../common').Layout;
const template = require('../templates/clinicListLayout.html');

class ClinicListLayout extends Layout {
  constructor(options) {
    super(options);
    this.template = template;

    this.regions = {
      search: '.search',
      list: '.list-container'
    };
  }
}

module.exports = ClinicListLayout;