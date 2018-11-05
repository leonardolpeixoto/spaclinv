'use strict';

const _ = require('underscore');
const Backbone = require('backbone');
const Region = require('./common').Region;

require('./apps/clinic/router');
require('./apps/login/router');

class DefaultRouter extends Backbone.Router {
  constructor(options) {
    super(options);
    this.routes = {
      '': 'defaultRoute',
      'logout': 'logout'
    };
    this._bindRoutes();
  }


  defaultRoute() {
    this.navigate('clinics', true);
  }


  logout() {
    App.dropAuth();
    this.navigate('login', true);
  }
}

const App = {
  start() {
    App.mainRegion = new Region({el: '#main'});

    this.initializeAuth();

    App.router = new DefaultRouter();
    Backbone.history.start();
  },



  startSubApplication(SubApplication) {
    if (this.currentSubapp && this.currentSubapp instanceof SubApplication) {
      return this.currentSubapp;
    }

    if (this.currentSubapp && this.currentSubapp.destroy) {
      this.currentSubapp.destroy();
    }

    this.currentSubapp = new SubApplication({region: App.mainRegion});
    return this.currentSubapp;
  },

  initializeAuth() {
    let authConfig = sessionStorage.getItem('auth');

    if (!authConfig) {
      return window.location.replace('/#login');
    }

    let splittedAuth = authConfig.split(':');
    let type = splittedAuth[0];
    let token = splittedAuth[1];

    this.setAuth(type, token);
  },


  saveAuth(type, token) {
    let authConfig = type + ':' + token;

    sessionStorage.setItem('auth', authConfig);
    this.setAuth(type, token);
  },


  dropAuth() {
    sessionStorage.removeItem('auth');
    this.setupAjax(null);
  },


  setAuth(type, token) {
    let authString = type + ' ' + token;
    this.setupAjax(authString);
  },


  setupAjax(authString) {
    let headers = {};

    if (authString) {
      headers = {
        Authorization: authString
      };
    }

    Backbone.$.ajaxSetup({
      statusCode: {
        401: () => {
          App.router.navigate('login', true);
        }
      },
      headers: headers
    });
  }
};

_.extend(App, Backbone.Events);

module.exports = App;
