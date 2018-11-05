'use strict';

const Backbone = require('backbone');

class ClinicRouter extends Backbone.Router {
  constructor(options) {
    super(options);

    this.routes = {
      'clinics': 'showClinicList',
      'clinics/page/:page': 'showClinicList',
      'clinic/view/:id': 'showClinic',
      'clinic/name/:name': 'showClinicName'
    };

    this._bindRoutes();
  }

  showClinicList(page) {
    page = page || 1;
    page = page > 0 ? page : 1;

    let app = this.startApp();
    app.showClinicList(page);
  }

  showClinic(clinicId) {
    const app = this.startApp();
    app.showClinicById(clinicId);
  }

  showClinicName(name) {
    const app = this.startApp();
    app.showClinicByName(name);
  }

  startApp() {
    const App = require('../../app');
    const ClinicApp = require('./app');

    return App.startSubApplication(ClinicApp);
  }
}

module.exports = new ClinicRouter();
