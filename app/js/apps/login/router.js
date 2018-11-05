'use strict';

let Backbone = require('backbone');
let LoginView = require('./views/loginView');

class LoginRouter extends Backbone.Router {
  constructor(options) {
    super(options);

    this.routes = {
      'login': 'showLogin'
    };

    this._bindRoutes();
  }

  showLogin() {
    let App = require('../../app');
    let login = new LoginView();

    App.mainRegion.show(login);
  }
}

module.exports = new LoginRouter();
