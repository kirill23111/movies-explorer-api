function extractBearerToken(inputString) {
  if (!inputString) return null;
  const strArr = inputString.split(' ');

  if (strArr[0] === 'Bearer') {
    return strArr[1];
  }
  return null;
}

module.exports = {
  extractBearerToken,
};
