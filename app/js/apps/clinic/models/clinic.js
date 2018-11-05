'use strict';

const Backbone = require('backbone');

class Clinic extends Backbone.Model {
  constructor(options) {
    super(options);
    this.urlRoot = '/api/clinic';
  }

  static searchName(name) {
    return `/api/clinic/name/${name}`;
  }

  get defaults() {
    return {
      name: '',
      phone: '',
      email: '',
      address1: '',
      avatar: null
    };
  }

  toJSON() {
    let result = Backbone.Model.prototype.toJSON.call(this);

    if (result.phones && result.phones.length > 0) {
      result.phone = result.phones[0].phone;
    }

    if (result.emails && result.emails.length > 0) {
      result.email = result.emails[0].email;
    }

    return result;
  }
}

module.exports = Clinic;
