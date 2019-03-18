const express = require('express')
const router = express.Router()

const IncomeController = require('../controllers/income')
const { firstOrCreate, authentication, onlyAdmin, adminPrivilege } = require('../middleware/auth')

router.post('/', firstOrCreate, IncomeController.create);
router.get('/', adminPrivilege, IncomeController.all)
router.get('/summary', IncomeController.summary)
router.patch('/verify/:id', authentication, onlyAdmin, IncomeController.verify)

module.exports = router