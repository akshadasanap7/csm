const FollowUp = require('../models/FollowUp');

exports.getAll = async (req, res) => {
  const filter = req.user.role === 'sales' ? { assignedTo: req.user.id } : {};
  const followups = await FollowUp.find(filter).populate('customer', 'name phone').populate('assignedTo', 'name');
  res.json(followups);
};

exports.create = async (req, res) => {
  try {
    const followup = await FollowUp.create({ ...req.body, assignedTo: req.user.id });
    res.status(201).json(followup);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const followup = await FollowUp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(followup);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await FollowUp.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Follow-up deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
