require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/user');
const incomeRouter = require('./routes/income');
const expenseRouter = require('./routes/expense');
const uploadRouter = require('./routes/upload');

const state = process.env.NODE_ENV || 'dev';
const host = process.env.HOST;
mongoose.connect(`${host}/ulul-azmi-${state}`, {
  useNewUrlParser: true,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/users', userRouter);
app.use('/incomes', incomeRouter);
app.use('/expenses', expenseRouter);
app.use('/upload', uploadRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

module.exports = app;
