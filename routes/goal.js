const express = require('express');
const router = express.Router();
const { createGoal, getGoalsByUserId } = require('../controllers/goalController');

router.post('/', createGoal);
router.get('/:userId', getGoalsByUserId);

module.exports = router;
