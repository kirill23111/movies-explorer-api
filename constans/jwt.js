const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;
const jwtKey = 'authorization';
const randomNumber = Math.floor(Math.random() * 10000000);

const generateJwtToken = (obj) => {
  const token = jwt.sign(obj, JWT_SECRET, {
    expiresIn: '7d',
  });

  return token;
};

module.exports = {
  generateJwtToken,
  jwtKey,
  JWT_SECRET,
};
