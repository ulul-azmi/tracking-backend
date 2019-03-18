const { verify } = require('../helpers/jwt')
const User = require('../models/User')
const { filter } = require('../helpers/filter')

module.exports = {
  authentication(req, res, next) {
    try {
      const data = verify(req.headers.token)
      req.user = data
      next()
    } catch (err) {
      res.status(401).json({
        message: 'unauthorized'
      })
    }
  },

  async firstOrCreate(req, res, next) {
    try {
      if (req.headers.token) {
        const data = verify(req.headers.token)
        req.user = data
        req.fromGuest = false
        next()
        return
      }

      const user = await User.create(filter(User, req.body.user))
      req.user = user.toObject()
      req.fromGuest = true

      next()
    } catch (err) {
      console.log(err)
      res.status(401).json({
        message: 'unauthorized'
      })
    }
  },

  async onlyAdmin(req, res, next) {
    if (req.user.role === 'admin') {
      next()
    } else {
      res.status(401).json({
        message: 'unauthorized'
      })
    }
  },

  async adminPrivilege(req, res, next) {
    try {
      if (req.headers.token) {
        const data = verify(req.headers.token)
        req.isAdmin = data.role === 'admin'
      }
      next()
    } catch (err) {
      console.log(err)
      req.isAdmin = false
      next()
    }
  }
}