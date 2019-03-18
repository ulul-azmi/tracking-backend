require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const incomeRouter = require('./routes/income');

const state = process.env.NODE_ENV || 'dev';
mongoose.connect(`mongodb://localhost:27017/ulul-azmi-${state}`, {
  useNewUrlParser: true,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/users', userRouter);
app.use('/incomes', incomeRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

module.exports = app;
