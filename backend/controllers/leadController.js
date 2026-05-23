const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

exports.getAll = async (req, res) => {
  const filter = req.user.role === 'sales' ? { assignedTo: req.user.id } : {};
  const leads = await Lead.find(filter).populate('customer', 'name').populate('assignedTo', 'name');
  res.json(leads);
};

exports.create = async (req, res) => {
  try {
    const lead = await Lead.create({ ...req.body, assignedTo: req.body.assignedTo || req.user.id });
    await Activity.create({ user: req.user.id, action: 'Created lead', entity: 'Lead', entityId: lead._id });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await Activity.create({ user: req.user.id, action: `Updated lead status to ${lead.status}`, entity: 'Lead', entityId: lead._id });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.pipeline = async (req, res) => {
  const statuses = ['New', 'Interested', 'Contacted', 'Negotiation', 'Converted', 'Rejected'];
  const result = await Promise.all(
    statuses.map(async (s) => ({ status: s, count: await Lead.countDocuments({ status: s }) }))
  );
  res.json(result);
};
