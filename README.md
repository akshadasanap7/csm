# SmartCRM – Customer & Sales Management System

A full-stack CRM system built with React.js, Node.js, Express, and MongoDB.

## Project Structure

```
crm/
├── backend/        # Node.js + Express API
└── frontend/       # React.js UI
```

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
# Edit .env with your MongoDB URI, JWT secret, and email credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

App runs at: http://localhost:3000  
API runs at: http://localhost:5000

## Modules

| Module | Description |
|---|---|
| Auth | JWT login/register with role-based access (admin, manager, sales) |
| Customers | Add, edit, delete, search customers |
| Leads | Track leads through pipeline stages |
| Follow-Ups | Schedule follow-ups with email reminders via cron |
| Activities | Employee activity log |
| Reports | Dashboard with Bar, Pie, Line charts |

## Lead Pipeline Stages
`New → Interested → Contacted → Negotiation → Converted / Rejected`

## Tech Stack
- **Frontend**: React.js, Tailwind CSS v4, Chart.js, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: JWT + bcrypt
- **Email**: Nodemailer (Gmail)
- **Scheduler**: node-cron (daily 8AM reminders)
