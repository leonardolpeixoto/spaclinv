'use strict';

const _ = require('underscore');
const crispy = require('crispy-string');

const DEFAULT_EXPIRATION_TIME = 3600; // seconds (1 hour)
const TOKEN_LENGTH = 20;

let validTokens = {};
let refreshTokens = {};

function generateToken() {
  return crispy.base32String(TOKEN_LENGTH);
}

function issueAuthorization(username, callback) {
  const accessToken = generateToken();
  const refreshToken = generateToken();

  const token = {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: DEFAULT_EXPIRATION_TIME,
    refresh_token: refreshToken
  };

  saveValidToken(token, username);
  callback(token);
}

function saveValidToken(token, username) {
  const tokenCopy = _.clone(token);
  tokenCopy.username = username;

  validTokens[token.access_token] = tokenCopy;
  refreshTokens[token.refresh_token] = tokenCopy;

  setTimeout(function() {
    expireToken(tokenCopy.access_token);
  }, DEFAULT_EXPIRATION_TIME * 1000);
}

function expireToken(token) {
  delete validTokens[token];
}

function authorize(data, callback) {
  const grantType = data.grant_type;
  const username = data.username;
  const password = data.password;

  if (grantType !== 'password') {
    return callback({error: 'invalid_grant'});
  }

  if (!username || !password) {
    return callback({error: 'invalid_request'});
  }

  if (username === 'pet' && password === '1234') {
    issueAuthorization(username, callback);
  } else {
    callback({error: 'invalid_grant'});
  }
}

function authenticate(token, callback) {
  if (_.has(validTokens, token)) {
    callback({valid: true, token: validTokens[token]});
  } else {
    callback({valid: false, token: null});
  }
}

module.exports = {
  authenticate(req, res) {
    authorize(req.body || {}, _.bind(res.json, res));
  },

  authorizationRequired(req, res, next) {
    const authorization = req.headers.authorization || '';

    if (!authorization) {
      return res.sendStatus(401);
    }

    const splitValues = authorization.split(' ');
    const tokenType = splitValues[0];
    const token = splitValues[1];

    if (!tokenType || tokenType !== 'Bearer' || !token) {
      return res.sendStatus(401);
    }

    authenticate(token, function(response) {
      if (response.valid) {
        next();
      } else {
        return res.sendStatus(401);
      }
    });
  }
};
