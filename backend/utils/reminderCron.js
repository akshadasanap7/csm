const cron = require('node-cron');
const FollowUp = require('../models/FollowUp');
const User = require('../models/User');
const sendEmail = require('./sendEmail');

// Runs every day at 8 AM
cron.schedule('0 8 * * *', async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueFollowups = await FollowUp.find({
    date: { $gte: today, $lt: tomorrow },
    reminded: false,
    completed: false,
  }).populate('customer', 'name').populate('assignedTo', 'name email');

  for (const f of dueFollowups) {
    if (f.assignedTo?.email) {
      await sendEmail(
        f.assignedTo.email,
        `Follow-up Reminder: ${f.customer?.name}`,
        `You have a follow-up scheduled today with ${f.customer?.name}.\nNote: ${f.note || 'N/A'}`
      );
      f.reminded = true;
      await f.save();
    }
  }
  console.log(`Reminders sent for ${dueFollowups.length} follow-ups`);
});
