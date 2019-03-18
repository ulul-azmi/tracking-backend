const Income = require('../models/Income');
const { filter } = require('../helpers/filter');
const { incomeCalculation } = require('../helpers/calculation');

module.exports = {
  async create(req, res) {
    try {
      const filteredData = {
        ...filter(Income, req.body),
        userId: req.user._id,
        meta: { ...req.body.meta, fromGuest: req.fromGuest },
      };

      const income = await Income.create(filteredData);

      res.status(201).json(income);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  async summary(req, res) {
    try {
      const incomes = await Income.find({
        status: 'done',
      }).exec();
      const result = incomes.reduce(
        (carry, income) => {
          const { amount, charity } = incomeCalculation(income);
          carry.amount += amount;
          carry.charity += charity;
          return carry;
        },
        {
          amount: 0,
          charity: 0,
        }
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  async all(req, res) {
    try {
      const incomesBuilder = Income.find({}).sort({ updatedAt: -1 });

      if (req.query.limit) {
        incomesBuilder.limit(Number(req.query.limit));
      }

      const incomes = await incomesBuilder
        .populate('userId')
        .lean()
        .exec();
      const mapIncomes = incomes.map(income => ({
        ...income,
        userId:
          !req.isAdmin && income.meta.anonymous
            ? income.userId._id
            : income.userId,
      }));

      res.status(200).json(mapIncomes);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  },

  async verify(req, res) {
    try {
      const newIncome = await Income.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        { new: true }
      );
      if (newIncome) {
        res.status(200).json(newIncome);
        return;
      }

      res.status(404).json({
        message: 'invalid id',
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  },
};
