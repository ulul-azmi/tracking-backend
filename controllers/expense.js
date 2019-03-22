const Expense = require('../models/Expense');
const { filter } = require('../helpers/filter');

module.exports = {
  async create(req, res) {
    try {
      const filteredData = {
        ...filter(Expense, req.body),
        submitBy: req.user._id,
      };

      const expense = await Expense.create(filteredData);

      res.status(201).json(expense);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async summary(req, res) {
    try {
      const data = await Expense.find({}).exec();

      const summary = data.reduce((carry, item) => (carry += item.amount), 0);

      res.status(200).json({ summary });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async all(req, res) {
    try {
      const incomesBuilder = Expense.find({}).sort({ updatedAt: -1 });

      if (req.query.limit) {
        incomesBuilder.limit(Number(req.query.limit));
      }

      const expenses = await incomesBuilder.exec();

      res.status(200).json(expenses);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async revised(req, res) {
    try {
      const expense = await Expense.findById(req.params.id);
      expense.logs.push({
        oldAmount: expense.amount,
        newAmount: req.body.amount,
        reason: req.body.reason,
      });
      expense.amount = req.body.amount;

      await expense.save();

      res.status(200).json(expense);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
