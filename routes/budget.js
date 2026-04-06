const express = require('express');
const router = express.Router();
const { createOrUpdateBudget, getBudgetByUserId } = require('../controllers/budgetController');

router.post('/', createOrUpdateBudget);
router.get('/:userId', getBudgetByUserId);

module.exports = router;
