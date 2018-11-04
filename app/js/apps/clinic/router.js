'use strict';

const Backbone = require('backbone');

class ClinicRouter extends Backbone.Router {
  constructor(options) {
    super(options);

    this.routes = {
      'clinics': 'showClinicList',
      'clinics/page/:page': 'showClinicList',
      'clinic/view/:id': 'showClinic'
    };

    this._bindRoutes();
  }

  showClinicList(page) {
    // Page should be a postive number grater than 0
    page = page || 1;
    page = page > 0 ? page : 1;

    var app = this.startApp();
    app.showClinicList(page);
  }

  showClinic(clinicId) {
    const app = this.startApp();
    app.showClinicById(clinicId);
  }

  startApp() {
    const App = require('../../app');
    const ClinicApp = require('./app');

    return App.startSubApplication(ClinicApp);
  }
}

module.exports = new ClinicRouter();
