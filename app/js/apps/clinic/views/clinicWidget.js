'use strict';

const ModelView = require('../../../common').ModelView;
const template = require('../templates/clinicViewWidget.html');

class ClinictWidget extends ModelView {
  constructor(options) {
    super(options);
    this.template = template;
  }

  get className() {
    return 'box contact-summary';
  }
}

module.exports = ClinictWidget;
