const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;
const jwtKey = 'authorization';
const randomKey = `sda-dsa-sda-asd-asd`;
const isProduction = process.env.NODE_ENV === 'production';
let localJWT_SECRET = JWT_SECRET;
if (JWT_SECRET === undefined && isProduction === false) localJWT_SECRET = `${randomKey}`;

const generateJwtToken = (obj) => {
  if (JWT_SECRET === undefined && isProduction === true) throw new Error('JWT_SECRET не задан');

  const token = jwt.sign(obj, localJWT_SECRET);

  return token;
};

module.exports = {
  generateJwtToken,
  jwtKey,
  JWT_SECRET: localJWT_SECRET,
};
