'use strict';

const _ = require('underscore');
const Backbone = require('backbone');
const ClinicListLayout = require('./views/clinicListLayout');
const SearchClinic = require('./views/clinicSearch');
const ClinicListView = require('./views/clinicListView');

class ClinicList {
  constructor(options) {
    this.region = options.region;

    _.extend(this, Backbone.Events);
  }

  showList(clinics) {
    const layout = new ClinicListLayout();
    const clinicList = new ClinicListView({collection: clinics});
    const searchClinic = new SearchClinic();

    this.region.show(layout);
    layout.getRegion('search').show(searchClinic);
    layout.getRegion('list').show(clinicList);
  }

  destroy() {
    this.region.remove();
    this.stopListening();
  }
}

module.exports = ClinicList;
