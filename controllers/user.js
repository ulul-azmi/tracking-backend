const User = require('../models/User')
const { filter } = require('../helpers/filter')
const { generate } = require('../helpers/error')
const { sign } = require('../helpers/jwt')
const { compare } = require('../helpers/password')

module.exports = {
  async register(req, res) {
    try {
      const filteredData = filter(User, req.body)

      const user = await User.create(filteredData)

      res.status(201).json(user)
    } catch (err) {
      console.log(err)
      const generateError = generate(err)
      res.status(generateError.status).json(generateError.data)
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({
        email: req.body.email
      })

      if (!user) {
        res.status(401).json({ message: 'unauthorized' })
        return
      } else if (!compare(req.body.password, user.password)) {
        res.status(401).json({ message: 'unauthorized' })
        return
      }

      const userData = {
        userId: user.id,
        _id: user.id,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }

      const token = sign(userData)

      res.status(200).json({
        token,
        user: userData
      })

    } catch (err) {
      console.log(err)
      const generateError = generate(err)
      res.status(generateError.status).json(generateError.data)
    }
  }
}