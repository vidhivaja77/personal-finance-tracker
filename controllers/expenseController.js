const Expense = require('../models/Expense');

const addExpense = async (req, res) => {
  try {
    const { userId, amount, category, date, note } = req.body;

    if (!userId || !amount || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide userId, amount, and category' 
      });
    }

    const expense = new Expense({
      userId,
      amount,
      category,
      date: date || new Date(),
      note: note || ''
    });

    await expense.save();

    res.status(201).json({ 
      success: true, 
      message: 'Expense added successfully',
      expense 
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding expense' 
    });
  }
};

const getExpenseByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    res.status(200).json({ 
      success: true, 
      expenses 
    });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching expenses' 
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense record not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Expense deleted successfully' 
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting expense' 
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, note, userId } = req.body;

    console.log('Updating expense:', { id, amount, category, date, note, userId });

    // Find expense record
    const expense = await Expense.findById(id);
    
    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense record not found' 
      });
    }

    // Verify ownership (optional but recommended)
    if (expense.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this record' 
      });
    }

    // Update fields
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        amount: amount || expense.amount,
        category: category || expense.category,
        date: date || expense.date,
        note: note || expense.note
      },
      { new: true, runValidators: true }
    );

    console.log('Expense updated successfully:', updatedExpense);

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      expense: updatedExpense
    });

  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating expense',
      error: error.message
    });
  }
};

module.exports = {
  addExpense,
  getExpenseByUserId,
  deleteExpense,
  updateExpense
};
