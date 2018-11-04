'use strict';

const App = require('../../app');
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
    App.trigger('app:clinic:started');

    new ClinicCollection().fetch({
      success: (collection) => {
        // Show the contact list subapplication if
        // the list can be fetched
        this.showList(collection);
        App.trigger('loading:stop');
      },
      fail: (collection, response) => {
        // Show error message if something goes wrong
        App.trigger('loading:stop');
        App.trigger('server:error', response);
      }
    });
  }

  showClinicById(clinicId) {
    App.trigger('loading:start');
    App.trigger('app:clinics:started');

    new Clinic({id: clinicId}).fetch({
      success: (model) => {
        this.showViewer(model);
        App.trigger('loading:stop');
      },
      fail: (collection, response) => {
        App.trigger('loading:stop');
        App.trigger('server:error', response);
      }
    });
  }

  showList(clinics) {
    const clinicList = this.startController(ClinicList);
    clinicList.showList(clinics);
  }


  showViewer(clinic) {
    var clinicViewer = this.startController(ClinicViewer);
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
