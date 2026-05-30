const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const FollowUp = require('../models/FollowUp');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;

  // Sales: only their own data
  const customerFilter = role === 'sales' ? { assignedTo: userId } : {};
  const leadFilter = role === 'sales' ? { assignedTo: userId } : {};
  const followupFilter = role === 'sales' ? { assignedTo: userId, completed: false } : { completed: false };

  const [totalCustomers, totalLeads, convertedLeads, pendingFollowups, totalEmployees] = await Promise.all([
    Customer.countDocuments(customerFilter),
    Lead.countDocuments(leadFilter),
    Lead.countDocuments({ ...leadFilter, status: 'Converted' }),
    FollowUp.countDocuments(followupFilter),
    User.countDocuments(),
  ]);

  const conversionRate = totalLeads ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

  const monthlyLeads = await Lead.aggregate([
    { $match: leadFilter },
    { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
    { $sort: { '_id': 1 } },
  ]);

  const leadsByStatus = await Lead.aggregate([
    { $match: leadFilter },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const revenueByMonth = await Lead.aggregate([
    { $match: { ...leadFilter, status: 'Converted' } },
    { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$value' } } },
    { $sort: { '_id': 1 } },
  ]);

  res.json({ totalCustomers, totalLeads, convertedLeads, pendingFollowups, totalEmployees, conversionRate, monthlyLeads, leadsByStatus, revenueByMonth, role });
};
