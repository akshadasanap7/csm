const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const FollowUp = require('../models/FollowUp');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  const [totalCustomers, totalLeads, convertedLeads, pendingFollowups, totalEmployees] = await Promise.all([
    Customer.countDocuments(),
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'Converted' }),
    FollowUp.countDocuments({ completed: false }),
    User.countDocuments(),
  ]);

  const conversionRate = totalLeads ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

  const monthlyLeads = await Lead.aggregate([
    { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
    { $sort: { '_id': 1 } },
  ]);

  const leadsByStatus = await Lead.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const revenueByMonth = await Lead.aggregate([
    { $match: { status: 'Converted' } },
    { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$value' } } },
    { $sort: { '_id': 1 } },
  ]);

  res.json({ totalCustomers, totalLeads, convertedLeads, pendingFollowups, totalEmployees, conversionRate, monthlyLeads, leadsByStatus, revenueByMonth });
};
