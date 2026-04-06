const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  goalName: {
    type: String,
    required: [true, 'Goal name is required'],
    trim: true
  },
  target: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0, 'Target amount must be positive']
  },
  saved: {
    type: Number,
    default: 0,
    min: [0, 'Saved amount must be positive']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);
