const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  note: { type: String },
  reminded: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', followUpSchema);
