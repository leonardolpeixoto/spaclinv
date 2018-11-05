'use strict';

const _ = require('underscore');
const Backbone = require('backbone');
const App = require('../../app');
const ClinicAbout = require('./views/clinicAbout');

class ClinicViewer {
  constructor(options) {
    this.region = options.region;

    _.extend(this, Backbone.Events);
  }

  showClinic(clinic) {
    const clinicAbout = new ClinicAbout({model: clinic});

    App.mainRegion.show(clinicAbout);
  }

  destroy() {
    this.region.remove();
    this.stopListening();
  }
}

module.exports = ClinicViewer;
