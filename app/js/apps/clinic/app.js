'use strict';

const App = require('../../app');
const swal = require('sweetalert');
const ClinicList = require('./clinicList');
const ClinicViewer = require('./clinicViewer');
const Clinic = require('./models/clinic');
const ClinicCollection = require('./collections/clinicCollection');

class ClinicApp {
  constructor(options) {
    this.region = options.region;
  }

  showClinicList() {
    App.trigger('loading:start');
    App.trigger('app:clinics:started');

    new ClinicCollection().fetch({
      success: (collection) => {
        this.showList(collection);
        App.trigger('loading:stop');
      },
      fail: (collection, response) => {
        App.trigger('loading:stop');
        App.trigger('server:error', response);
      }
    });
  }

  showClinicById(clinicId) {
    App.trigger('loading:start');
    App.trigger('app:clinic:started');

    new Clinic({id: clinicId}).fetch({
      success: (model) => {
        this.showViewer(model);
        App.trigger('loading:stop');
      },
      fail: (model, response) => {
        App.trigger('loading:stop');
        App.trigger('server:error', response);
      }
    });
  }

  showClinicByName(name) {
    App.trigger('loading:start');
    App.trigger('app:clinic:started');

    new Clinic().fetch({
      url: Clinic.searchName(name),
      success: (model) => {
        this.showViewer(model);
        App.trigger('loading:stop');
      },
      fail: (model, response) => {
        App.trigger('loading:stop');
        App.trigger('server:error', response);
      },
      statusCode: {
        404: function() {
          swal('Clínica não foi encontrada.', '', 'info');
        }
      }
    });
  }

  showList(clinics) {
    const clinicList = this.startController(ClinicList);
    clinicList.showList(clinics);
  }


  showViewer(clinic) {
    let clinicViewer = this.startController(ClinicViewer);
    clinicViewer.showClinic(clinic);
  }

  startController(Controller) {
    if (this.currentController &&
        this.currentController instanceof Controller) {
      return this.currentController;
    }

    if (this.currentController && this.currentController.destroy) {
      this.currentController.destroy();
    }

    this.currentController = new Controller({region: this.region});
    return this.currentController;
  }
}

module.exports = ClinicApp;
