'use strict';

var Backbone = require('backbone');
var Common = require('../../../common');
var template = require('../templates/login.html');

class LoginView extends Common.ModelView {
  constructor(options) {
    super(options);
    this.template = template;
  }

  get className() {
    return 'row';
  }

  get events() {
    return {
      'click button': 'makeLogin'
    };
  }


  makeLogin(event) {
    event.preventDefault();

    const username = this.$el.find('#username').val();
    const password = this.$el.find('#password').val();

    Backbone.$.ajax({
      method: 'POST',
      url: '/api/oauth/token',
      data: {
        grant_type: 'password',
        username: username,
        password: password
      },
      success: response => {
        const App = require('../../../app');
        const accessToken = response.access_token;
        const tokenType = response.token_type;

        App.saveAuth(tokenType, accessToken);
        App.router.navigate('clinics', true);
      },
      error: jqxhr => {
        if (jqxhr.status === 401) {
          this.showError('User/Password are not valid');
        } else {
          this.showError('Oops... Unknown error happens');
        }
      }
    });
  }

  buildAuthenticationString(token) {
    return 'Bearer ' + token;
  }

  showError(message) {
    this.$('#message').html(message);
  }
}

module.exports = LoginView;
