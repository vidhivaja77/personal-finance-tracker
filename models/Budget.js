const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount must be positive']
  }
}, {
  timestamps: true
});

budgetSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
