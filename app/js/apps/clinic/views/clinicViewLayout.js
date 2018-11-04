'use strict';

const Layout = require('../../../common').Layout;
const template = require('../templates/clinicViewLayout.html');

class ClinicViewLayout extends Layout {
  constructor(options) {
    super(options);
    this.template = template;
    this.regions = {
      widget: '#contact-widget',
      about: '#about-container'
    };
  }

  get className() {
    return 'row page-container';
  }
}

module.exports = ClinicViewLayout;
