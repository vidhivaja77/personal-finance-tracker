const Budget = require('../models/Budget');

const createOrUpdateBudget = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide userId and amount' 
      });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId },
      { amount },
      { upsert: true, new: true }
    );

    res.status(201).json({ 
      success: true, 
      message: 'Budget saved successfully',
      budget 
    });
  } catch (error) {
    console.error('Budget error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while saving budget' 
    });
  }
};

const getBudgetByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const budget = await Budget.findOne({ userId });

    res.status(200).json({ 
      success: true, 
      budget 
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching budget' 
    });
  }
};

module.exports = {
  createOrUpdateBudget,
  getBudgetByUserId
};
