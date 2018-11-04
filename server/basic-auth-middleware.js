var basicAuth = require('basic-auth');

var authorizationRequired = function (req, res, next) {
  var credentials = basicAuth(req) || {};
  if (credentials.name === 'pet' && credentials.pass === '1234') {
    return next();
  } else {
    return res.sendStatus(401);
  }
};

module.exports = authorizationRequired;
