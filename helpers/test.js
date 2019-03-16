const User = require('../models/User')

module.exports = {
  isTesting() {
    return process.env.NODE_ENV === 'test'
  },

  clearUser() {
    return User.deleteMany({}).exec()
  }
}