const express = require('express');
const router = express.Router();
const { addIncome, getIncomeByUserId, deleteIncome, updateIncome } = require('../controllers/incomeController');

router.post('/add', addIncome);
router.get('/:userId', getIncomeByUserId);
router.delete('/:id', deleteIncome);
router.put('/:id', updateIncome);

module.exports = router;
