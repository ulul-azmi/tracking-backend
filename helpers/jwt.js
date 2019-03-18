const jwt = require('jsonwebtoken');

module.exports = {
  sign(data) {
    return jwt.sign(data, process.env.SECRET);
  },

  verify(token) {
    return jwt.verify(token, process.env.SECRET);
  },
};
