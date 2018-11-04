'use strict';

const _ = require('underscore');
const Backbone = require('backbone');
const App = require('../../app');
const ClinicAbout = require('./views/clinicAbout');

class ClinicViewer {
  constructor(options) {
    // Region where the application will be placed
    this.region = options.region;

    // Allow subapplication to listen and trigger events,
    // useful for subapplication wide events
    _.extend(this, Backbone.Events);
  }

  showClinic(clinic) {
    // Create the views
    const clinicAbout = new ClinicAbout({model: clinic});

    // Show the views
    App.mainRegion.show(clinicAbout);

    this.listenTo(clinicAbout, 'clinic:delete', this._deleteClinic);
  }

  _deleteClinic(clinic) {
    App.askConfirmation('The clinic will be deleted', isConfirm => {
      if (isConfirm) {
        clinic.destroy({
          success() {
            // Regirect user to the contacts list after
            // deletion
            App.notifySuccess('Clinic was deleted');
            App.router.navigate('/clinics', true);
          },
          error() {
            // Show error message when something is wrong
            App.notifyError('Something goes wrong');
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

module.exports = ClinicViewer;
