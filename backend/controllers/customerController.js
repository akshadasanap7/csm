const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

exports.getAll = async (req, res) => {
  const filter = req.user.role === 'sales' ? { assignedTo: req.user.id } : {};
  const customers = await Customer.find(filter).populate('assignedTo', 'name email');
  res.json(customers);
};

exports.getOne = async (req, res) => {
  const customer = await Customer.findById(req.params.id).populate('assignedTo', 'name email');
  if (!customer) return res.status(404).json({ msg: 'Customer not found' });
  res.json(customer);
};

exports.create = async (req, res) => {
  try {
    const customer = await Customer.create({ ...req.body, assignedTo: req.user.id });
    await Activity.create({ user: req.user.id, action: 'Created customer', entity: 'Customer', entityId: customer._id });
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await Activity.create({ user: req.user.id, action: 'Updated customer', entity: 'Customer', entityId: customer._id });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    await Activity.create({ user: req.user.id, action: 'Deleted customer', entity: 'Customer', entityId: req.params.id });
    res.json({ msg: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
