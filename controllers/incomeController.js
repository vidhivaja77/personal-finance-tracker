const Income = require('../models/Income');

const addIncome = async (req, res) => {
  try {
    const { userId, amount, source, date, note } = req.body;

    if (!userId || !amount || !source) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide userId, amount, and source' 
      });
    }

    const income = new Income({
      userId,
      amount,
      source,
      date: date || new Date(),
      note: note || ''
    });

    await income.save();

    res.status(201).json({ 
      success: true, 
      message: 'Income added successfully',
      income 
    });
  } catch (error) {
    console.error('Add income error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding income' 
    });
  }
};

const getIncomeByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const income = await Income.find({ userId }).sort({ date: -1 });

    res.status(200).json({ 
      success: true, 
      income 
    });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching income' 
    });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const income = await Income.findByIdAndDelete(id);

    if (!income) {
      return res.status(404).json({ 
        success: false, 
        message: 'Income record not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Income deleted successfully' 
    });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting income' 
    });
  }
};

const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, source, date, note, userId } = req.body;

    console.log('Updating income:', { id, amount, source, date, note, userId });

    // Find the income record
    const income = await Income.findById(id);
    
    if (!income) {
      return res.status(404).json({ 
        success: false, 
        message: 'Income record not found' 
      });
    }

    // Verify ownership (optional but recommended)
    if (income.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this record' 
      });
    }

    // Update fields
    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      {
        amount: amount || income.amount,
        source: source || income.source,
        date: date || income.date,
        note: note || income.note
      },
      { new: true, runValidators: true }
    );

    console.log('Income updated successfully:', updatedIncome);

    res.status(200).json({
      success: true,
      message: 'Income updated successfully',
      income: updatedIncome
    });

  } catch (error) {
    console.error('Error updating income:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating income',
      error: error.message
    });
  }
};

module.exports = {
  addIncome,
  getIncomeByUserId,
  deleteIncome,
  updateIncome
};
