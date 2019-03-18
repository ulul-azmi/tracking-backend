const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { generate } = require('../helpers/password')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'member'
  },
  profilePicture: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  instagram: {
    type: String
  }
})

userSchema.pre('save', function (next) {
  this.password = generate(this.password)
  next()
})

const User = mongoose.model('User', userSchema)


User.fillable = ['email', 'password', 'role', 'profilePicture', 'name', 'phoneNumber', 'instagram']

User.firstOrCreate = async function (condition, data) {
  const exist = await this.findOne(condition)

  if (exist) {
    return exist
  }
  return await this.create(data)
}

module.exports = User