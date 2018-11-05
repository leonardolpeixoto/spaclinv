const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const auth = require('./oauth2-middleware');
const controller = require('./clinics-controller');

const server = express();

server.use(morgan('dev'));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded());

server.post('/api/oauth/token', auth.authenticate);
server.get('/api/clinics', auth.authorizationRequired, controller.showClinics);
server.get('/api/clinic/:clinicId', auth.authorizationRequired, controller.findClinicById);
server.get('/api/clinic/name/:name', auth.authorizationRequired, controller.findClinicByName);


http.createServer(server).listen(8000, () => {
  console.log('Express server is running on port 8000');
});
