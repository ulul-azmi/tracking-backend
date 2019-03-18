const User = require('../models/User')
const Income = require('../models/Income')
const { sign } = require('./jwt')

module.exports = {
  isTesting() {
    return process.env.NODE_ENV === 'test'
  },

  clearUser() {
    return User.deleteMany({}).exec()
  },

  clearIncome() {
    return Income.deleteMany({}).exec()
  },

  User,

  async login() {
    const user = await User.create({
      email: 'kosasih@mail.com',
      password: '123456',
      profilePicture: '/',
    })

    return { token: sign(user.toObject()), user }
  },

  async dummyIncome() {
    const tenThousand = 10000
    const twentyThousand = 20000

    const incomeReport = [{
      destination: 'BSM',
      image: '/',
      amount: tenThousand,
      date: '2019-03-22',
      meta: {
        anonymous: false,
        charity: false
      },
      status: 'done'
    },
    {
      destination: 'BSM',
      image: '/',
      amount: twentyThousand,
      date: '2019-03-22',
      meta: {
        anonymous: true,
        charity: true
      },
      status: 'done'
    },
    {
      destination: 'BSM',
      image: '/',
      amount: twentyThousand,
      date: '2019-03-22',
      meta: {
        anonymous: true,
        charity: false
      },
      status: 'done'
    },
    {
      destination: 'BSM',
      image: '/',
      amount: twentyThousand,
      date: '2019-03-22',
      meta: {
        anonymous: true,
        charity: false
      }
    },
    {
      destination: 'BSM',
      image: '/',
      amount: twentyThousand,
      date: '2019-03-22',
      meta: {
        anonymous: true,
        charity: false
      }
    }
    ]

    return await Income.insertMany(incomeReport)
  },

  async createAdmin() {
    const admin = await User.create({
      email: 'admin@mail.com',
      password: '123456',
      role: 'admin',
      profilePicture: '/'
    })

    return { token: sign(admin.toObject()), admin }
  }
}