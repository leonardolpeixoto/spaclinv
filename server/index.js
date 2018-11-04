const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const morgan = require('morgan');
const auth = require('./oauth2-middleware');
const controller = require('./clinics-controller');

const server = express();

// Show the requests in the console, useful for debug
server.use(morgan('dev'));

// Automatically parse JSON requests
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());

// Configure all available routes
server.post('/api/oauth/token', auth.authenticate);
server.get('/api/clinics', auth.authorizationRequired, controller.showClinics);
server.get('/api/clinic/:clinicId', auth.authorizationRequired, controller.findClinicById);

// Avatar endpoints
const upload = multer();
server.post('/api/clinic/:clinic/avatar', upload.single('avatar'),
  controller.uploadAvatar
);

server.use('/avatar', express.static(__dirname + '/avatar'));

http.createServer(server).listen(8000, () => {
  console.log('Express server is running on port 8000');
});
