'use strict';

const Layout = require('../../../common').Layout;
const template = require('../templates/clinicListLayout.html');

class ClinicListLayout extends Layout {
  constructor(options) {
    super(options);
    this.template = template;
    this.regions = {
      list: '.list-container'
    };
  }

  get className() {
    return 'row page-container';
  }
}

module.exports = ClinicListLayout;
