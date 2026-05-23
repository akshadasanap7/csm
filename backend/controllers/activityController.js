const Activity = require('../models/Activity');

exports.getAll = async (req, res) => {
  const activities = await Activity.find()
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(activities);
};
