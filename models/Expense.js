const mongoose = require('mongoose');

const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    submitBy: { type: Schema.Types.ObjectId, ref: 'User' },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pictures: {
      type: Array,
      required: true,
    },
    logs: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);

Expense.fillable = [
  'submitBy',
  'name',
  'amount',
  'date',
  'description',
  'pictures',
];

module.exports = Expense;
