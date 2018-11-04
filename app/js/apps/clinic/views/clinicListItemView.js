'use strict';

const App = require('../../../app');
const ModelView = require('../../../common').ModelView;
const template = require('../templates/clinicListItem.html');

class ClinicListItemView extends ModelView {
  constructor(options) {
    super(options);
    this.template = template;
  }

  get className() {
    return 'col-md-4';
  }

  get events() {
    return {
      'click #view': 'viewClinic'
    };
  }

  initialize(options) {
    this.listenTo(options.model, 'change', this.render);
  }

  viewClinic() {
    const clinicId = this.model.get('id');
    App.router.navigate(`clinic/view/${clinicId}`, true);
  }
}

module.exports = ClinicListItemView;
