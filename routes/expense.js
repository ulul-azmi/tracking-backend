const express = require('express');

const router = express.Router();

const { authentication, onlyAdmin } = require('../middleware/auth');

const ExpenseController = require('../controllers/expense');

router.post('/', authentication, onlyAdmin, ExpenseController.create);

router.patch('/revised/:id', authentication, onlyAdmin, ExpenseController.revised);

router.get('/summary', ExpenseController.summary);

router.get('/', ExpenseController.all);

module.exports = router;
