'use strict';

const App = require('../../../app');
const ModelView = require('../../../common').ModelView;
const template = require('../templates/clinicViewAbout.html');

class ClinicAbout extends ModelView {
  constructor(options) {
    super(options);
    this.template = template;
  }

  get className() {
    return 'card';
  }

  get events() {
    return {
      'click #back': 'goToList'
    };
  }

  goToList() {
    App.router.navigate('clinics', true);
  }
}

module.exports = ClinicAbout;
