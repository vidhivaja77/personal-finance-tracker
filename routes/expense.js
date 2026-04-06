const express = require('express');
const router = express.Router();
const { addExpense, getExpenseByUserId, deleteExpense, updateExpense } = require('../controllers/expenseController');

router.post('/add', addExpense);
router.get('/:userId', getExpenseByUserId);
router.delete('/:id', deleteExpense);
router.put('/:id', updateExpense);

module.exports = router;
