'use strict';

const Backbone = require('backbone');
const Clinic = require('../models/clinic');

class ClinicCollection extends Backbone.Collection {
  constructor(options) {
    super(options);
    this.url = '/api/clinics';
  }

  get model() {
    return Clinic;
  }
}

module.exports = ClinicCollection;
