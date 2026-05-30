require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('./utils/reminderCron');

const app = express();
connectDB();

app.use(cors({ origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:3001'], credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/followups', require('./routes/followUpRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
