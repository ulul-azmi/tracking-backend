const mongoose = require('mongoose');

const { Schema } = mongoose;

const incomeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    destination: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    date: {
      type: Date,
      required: true,
    },
    meta: {},
  },
  { timestamps: true }
);

const Income = mongoose.model('Income', incomeSchema);

Income.fillable = ['userId', 'destination', 'image', 'amount', 'date', 'meta'];

module.exports = Income;
