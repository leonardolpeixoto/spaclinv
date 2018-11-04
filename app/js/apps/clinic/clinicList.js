'use strict';

const _ = require('underscore');
const Backbone = require('backbone');
const App = require('../../app');
const ClinicListView = require('./views/clinicListView');

class ClinicList {
  constructor(options) {
    // Region where the application will be placed
    this.region = options.region;

    // Allow subapplication to listen and trigger events,
    // useful for subapplication wide events
    _.extend(this, Backbone.Events);
  }

  showList(clinics) {
    // Create the views
    const clinicList = new ClinicListView({collection: clinics});

    // Show the views
    App.mainRegion.show(clinicList);

    this.listenTo(clinicList, 'item:clinic:delete', this.deleteClinic);
  }

  deleteClinic(view, clinic) {
    App.askConfirmation('The clinic will be deleted', (isConfirm) => {
      if (isConfirm) {
        clinic.destroy({
          success() {
            App.notifySuccess('Clinic was deleted');
          },
          error() {
            App.notifyError('Ooops... Something went wrong');
          }
        });
      }
    });
  }

  // Close any active view and remove event listeners
  // to prevent zombie functions
  destroy() {
    this.region.remove();
    this.stopListening();
  }
}

module.exports = ClinicList;
