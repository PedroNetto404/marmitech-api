const bcrypt = require('bcrypt');
const { hashSalt } = require('../../config/env');

const hash = (value) => bcrypt.hash(value, hashSalt);

const compare = (value, hash) => bcrypt.compare(value, hash);

module.exports = {
  hash,
  compare,
};
