const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { sign } = require('./jwt');

const generatedUser = {
  email: 'kosasih@mail.com',
  password: '123456',
  profilePicture: '/',
  name: 'kosasih',
  phoneNumber: '087888587005',
  instagram: '@semmiverian',
};

const expense = {
  name: 'Buying milk tea',
  amount: 10000,
  date: '2019-03-22',
  description: 'lorem ipsum dolor sit amet',
  pictures: ['/', '/'],
};

const date = Date.now();

module.exports = {
  isTesting() {
    return process.env.NODE_ENV === 'test';
  },

  clearUser() {
    return User.deleteMany({}).exec();
  },

  clearIncome() {
    return Income.deleteMany({}).exec();
  },

  User,

  async login() {
    const user = await User.create(generatedUser);

    return { token: sign(user.toObject()), user };
  },

  async dummyIncome(userId) {
    const tenThousand = 10000;
    const twentyThousand = 20000;

    const incomeReport = [
      {
        destination: 'BSM',
        image: '/',
        amount: tenThousand,
        date: '2019-03-22',
        meta: {
          anonymous: false,
          charity: false,
        },
        status: 'done',
        userId,
        updatedAt: date,
      },
      {
        destination: 'BSM',
        image: '/',
        amount: twentyThousand,
        date: '2019-03-22',
        meta: {
          anonymous: true,
          charity: true,
        },
        status: 'done',
        userId,
        updatedAt: date,
      },
      {
        destination: 'BSM',
        image: '/',
        amount: twentyThousand,
        date: '2019-03-22',
        meta: {
          anonymous: true,
          charity: false,
        },
        status: 'done',
        userId,
        updatedAt: date,
      },
      {
        destination: 'BSM',
        image: '/',
        amount: twentyThousand,
        date: '2019-03-22',
        meta: {
          anonymous: true,
          charity: false,
        },
        userId,
        updatedAt: date,
      },
      {
        destination: 'BSM',
        image: '/',
        amount: twentyThousand,
        date: '2019-03-22',
        meta: {
          anonymous: true,
          charity: false,
        },
        userId,
        updatedAt: date,
      },
    ];

    return Income.insertMany(incomeReport);
  },

  async createAdmin() {
    const admin = await User.create({
      ...generatedUser,
      email: 'admin@mail.com',
      role: 'admin',
    });

    return { token: sign(admin.toObject()), admin };
  },

  generateUser() {
    return generatedUser;
  },

  dummyExpense() {
    return expense;
  },

  async clearExpense() {
    return Expense.deleteMany({}).exec();
  },

  async bulkCreateExpense() {
    const dummies = [
      {
        name: 'Buying milk tea',
        amount: 10000,
        date: '2019-03-22',
        description: 'lorem ipsum dolor sit amet',
        pictures: ['/', '/'],
      },
      {
        name: 'Buying coffee',
        amount: 20000,
        date: '2019-03-22',
        description: 'lorem ipsum dolor sit amet',
        pictures: ['/', '/'],
      },
      {
        name: 'Buying sandwich',
        amount: 30000,
        date: '2019-03-22',
        description: 'lorem ipsum dolor sit amet',
        pictures: ['/', '/'],
      },
    ];

    return Expense.insertMany(dummies);
  },
};
