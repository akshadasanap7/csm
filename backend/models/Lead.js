const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['New', 'Interested', 'Contacted', 'Negotiation', 'Converted', 'Rejected'],
    default: 'New',
  },
  value: { type: Number, default: 0 },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
