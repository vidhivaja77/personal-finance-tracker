const Goal = require('../models/Goal');

const createGoal = async (req, res) => {
  try {
    const { userId, goalName, target, saved } = req.body;

    if (!userId || !goalName || !target) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide userId, goalName, and target' 
      });
    }

    const goal = new Goal({
      userId,
      goalName,
      target,
      saved: saved || 0
    });

    await goal.save();

    res.status(201).json({ 
      success: true, 
      message: 'Goal created successfully',
      goal 
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating goal' 
    });
  }
};

const getGoalsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      goals 
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching goals' 
    });
  }
};

module.exports = {
  createGoal,
  getGoalsByUserId
};
