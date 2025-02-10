const jwt = require('jsonwebtoken');
const moment = require('moment');
const {
  jwt: { issuer, expiresIn, audience, secret },
} = require('../../config/env');

module.exports.sign = async (payload) => {
  const token = jwt.sign(payload, secret, {
    issuer,
    expiresIn: `${expiresIn}h`,
    audience,
  });

  return {
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn: moment().unix() + expiresIn * 60 * 60,
  };
};

module.exports.verify = (token) => jwt.verify(token, secret);
