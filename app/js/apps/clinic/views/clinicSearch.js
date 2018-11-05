'use strict';

const ModelView = require('../../../common').ModelView;
const template = require('../templates/clinicSearch.html');
const App = require('../../../app');

class ClinicSearch extends ModelView {
  constructor(options) {
    super(options);
    this.template = template;
  }

  get className() {
    return 'card';
  }

  get events() {
    return {
      'keydown': 'searchClinic'
    };
  }

  searchClinic(event) {
    let name = this.$('#searchName').val();

    if(event.keyCode === 13 && name !== '') {
      App.router.navigate(`clinic/name/${name}`,  true);
      event.preventDefault();
    }
  }
}

module.exports = ClinicSearch;
