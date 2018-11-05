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

const clinics = [{
  id: makeId(),
  name: 'teste',
  // name: 'Pet Shop Pinheiro',
  phone: '(85) 98793-5741',
  email: 'pet@clinic.com',
  address1: 'Av. Dr. Mendel Steinbruch, 5310 - Pajuçara, Maracanaú - CE, 61934-040'
},{
  id: makeId(),
  name: 'PClinica Veterinária e Pet Shop',
  phone: '(85) 3382-2072',
  email: 'pet@clinic.com',
  address1: 'Av. VII, 417 - Jereissati I, Maracanaú - CE, 61936-460',
  facebook: 'https://www.facebook.com/BixoLindo'
},{
  id: makeId(),
  name: 'Clínica Veterinária Salão Dog',
  phone: '(85) 3382-4430',
  email: 'pet@clinic.com',
  address1: 'Av. III, 536 - Jereissati I, Maracanaú - CE, 61900-360'
}];

module.exports = {
  showClinics(req, res) {
    res.json(clinics);
  },

  findClinicById(req, res, next) {
    const clinicId = req.params.clinicId;
    const clinic = _.find(clinics, 'id', clinicId);

    if (!clinic) {
      res.status(404);
      return next();
    }

    res.json(clinic);
  },

  findClinicByName(req, res, next) {
    const name = req.params.name;
    const clinic = _.find(clinics, 'name', name);

    if (!clinic) {
      res.status(404);
      return next();
    }

    res.json(clinic);
  }
};
