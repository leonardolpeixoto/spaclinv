'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const crispy = require('crispy-string');

const ID_LENGTH = 10;
const AVATAR_PATH = __dirname + '/avatar';

function makeId() {
  return crispy.base32String(ID_LENGTH);
}

function isValidImage(mimetype) {
  return /jpeg|png|gif/.test(mimetype);
}

function generateFilename(len, extension) {
  return crispy.base32String(ID_LENGTH) + extension;
}

function generateFullPath(filename) {
  return AVATAR_PATH + '/' + filename;
}

function generateURLForAvatar(filename) {
  return 'http://localhost:3000/avatar/' + filename;
}

function getExtension(filename) {
  return path.extname(filename);
}

function removeAvatar(contact) {
  // Remove previous avatar if any
  if (_.has(contact, 'avatar.file')) {
    let currentAvatarPath = generateFullPath(contact.avatar.file);

    if (fs.existsSync(currentAvatarPath)) {
      fs.unlinkSync(currentAvatarPath);
    }
  }
}

var clinics = [{
  id: makeId(),
  name: 'Pet Shop Pinheiro',
  phones: [{
    description: 'bus',
    phone: '(85) 98793-5741'
  }],
  emails: [{
    description: 'personal',
    email: 'john.doe@example.com'
  }, {
    description: 'work',
    email: 'john.doe@acme.com'
  }],
  address1: 'Av. Dr. Mendel Steinbruch, 5310 - Pajuçara, Maracanaú - CE, 61934-040',
  facebook: 'https://www.facebook.com/John.Doe'
}, {
  id: makeId(),
  name: 'Jane Doe',
  emails: [{
    description: 'personal',
    email: 'jane.doe@example.com'
  }],
  address1: 'Tortilla Street 364',
  facebook: 'https://www.facebook.com/John.Doe',
  twitter: 'https://twitter.com/thejanedoe'
}, {
  id: makeId(),
  name: 'Abiee Alejandro',
  emails: [{
    description: 'personal',
    email: 'abiee@echamea.com'
  }],
  address1: 'Cuarzo 2369',
  facebook: 'https://www.facebook.com/abiee.alejandro',
  twitter: 'https://twitter.com/AbieeAlejandro',
  github: 'https://github.com/abiee'
}, {
  id: makeId(),
  name: 'Omare',
  email: 'me@omar-e.com',
  address1: 'Del Árbol street'
}];

// Extract and set default values of a contact from a standard
// express request object
function extractContactData(req) {
  var result = {};
  var data = req.body;

  var fields = ['name', 'phones', 'emails', 'address1', 'address2',
    'facebook', 'twitter', 'google', 'github'];

  fields.forEach(field => {
    if (data[field]) {
      result[field] = data[field];
    }
  });

  return result;
}

module.exports = {
  showClinics(req, res) {
    res.json(clinics);
  },

  // Locates an item in the contacts array with the id attribute equals
  // to the req.params.contactId value
  findClinicById(req, res, next) {
    const clinicId = req.params.clinicId;
    const clinic = _.find(clinics, 'id', clinicId);

    if (!clinic) {
      res.status(404);
      return next();
    }

    res.json(clinic);
  },

  uploadAvatar(req, res, next) {
    var clinicId = req.params.clinicId;
    var filename, fullpath;

    // Ensure that user has sent the file
    if (!_.has(req, 'file')) {
      return res.status(400).json({
        error: 'Please upload a file in the avatar field'
      });
    }

    // File should be in a valid format
    var metadata = req.file;
    if (!isValidImage(metadata.mimetype)) {
      res.status(400).json({
        error: 'Invalid format, please use jpg, png or gif files'
      });
      return next();
    }

    // Get target contact from database
    const clinic = _.find(clinics, 'id', clinicId);
    if (!clinic) {
      res.status(404).json({
        error: 'clinic not found'
      });
      return next();
    }

    // Ensure that avatar path exists
    if (!fs.existsSync(AVATAR_PATH)) {
      fs.mkdirSync(AVATAR_PATH);
    }

    // Ensure unique filename to prevent name colisions
    const extension = getExtension(metadata.originalname);
    do {
      filename = generateFilename(25, extension);
      fullpath = generateFullPath(filename);
    } while(fs.existsSync(fullpath));

    // Remove previous avatar if any
    removeAvatar(clinic);

    // Save the file in disk
    var wstream = fs.createWriteStream(fullpath);
    wstream.write(metadata.buffer);
    wstream.end();

    // Update contact by assingn the url of the uploaded file
    clinic.avatar = {
      file: filename,
      url: generateURLForAvatar(filename)
    };

    res.json({
      success: true,
      avatar: clinic.avatar
    });
  }
};
