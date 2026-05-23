# SmartCRM – Customer & Sales Management System

A full-stack CRM system built with **React.js**, **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Live Demo

> Coming soon — Deploy on Render (backend) + Vercel (frontend)

---

## 📁 Project Structure

```
crm/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Business logic
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Email + cron scheduler
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
└── frontend/
    └── src/
        ├── api/        # Axios instance
        ├── components/ # Layout, Sidebar, PrivateRoute
        ├── context/    # Auth context
        └── pages/      # All page components
```

---

## ⚙️ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo
```bash
git clone https://github.com/navaletejas47/smartcrm.git
cd smartcrm
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartcrm
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |

---

## 🧩 Modules

| Module       | Description                                              |
|--------------|----------------------------------------------------------|
| Auth         | JWT login/register with role-based access control        |
| Customers    | Add, edit, delete, search customers                      |
| Leads        | Track leads through a 6-stage sales pipeline             |
| Follow-Ups   | Schedule follow-ups with automated daily email reminders |
| Activities   | Employee activity log with timestamps                    |
| Reports      | Dashboard with Bar, Pie, and Line charts                 |

---

## 🔄 Lead Pipeline

```
New → Interested → Contacted → Negotiation → Converted / Rejected
```

---

## 👥 User Roles

| Role    | Access                                      |
|---------|---------------------------------------------|
| Admin   | Full access to all data and modules         |
| Manager | View all data, reports, activity logs       |
| Sales   | Access only their own customers and leads   |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | /api/auth/register   | Register new user  |
| POST   | /api/auth/login      | Login              |
| GET    | /api/auth/me         | Get current user   |

### Customers
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | /api/customers        | Get all customers   |
| POST   | /api/customers        | Create customer     |
| PUT    | /api/customers/:id    | Update customer     |
| DELETE | /api/customers/:id    | Delete customer     |

### Leads
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | /api/leads         | Get all leads        |
| GET    | /api/leads/pipeline| Get pipeline stats   |
| POST   | /api/leads         | Create lead          |
| PUT    | /api/leads/:id     | Update lead          |
| DELETE | /api/leads/:id     | Delete lead          |

### Follow-Ups
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/followups        | Get all follow-ups   |
| POST   | /api/followups        | Schedule follow-up   |
| PUT    | /api/followups/:id    | Update follow-up     |
| DELETE | /api/followups/:id    | Delete follow-up     |

### Reports
| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| GET    | /api/reports/dashboard   | Get dashboard stats   |

---

## 🛠️ Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | React.js, Tailwind CSS v4         |
| Charts       | Chart.js, react-chartjs-2         |
| Routing      | React Router v6                   |
| Backend      | Node.js, Express.js               |
| Database     | MongoDB, Mongoose                 |
| Auth         | JWT, bcryptjs                     |
| Email        | Nodemailer (Gmail)                |
| Scheduler    | node-cron (daily 8AM reminders)   |
| HTTP Client  | Axios                             |
| Notifications| react-hot-toast                   |
| Icons        | react-icons                       |

---

## 📧 Email Reminders

The system automatically sends email reminders every day at **8:00 AM** for all pending follow-ups scheduled for that day.

To enable:
1. Use a Gmail account
2. Enable [2-Step Verification](https://myaccount.google.com/security)
3. Generate an [App Password](https://myaccount.google.com/apppasswords)
4. Set `EMAIL_USER` and `EMAIL_PASS` in `backend/.env`

---

## 🚢 Deployment

### Backend → Render
1. Push code to GitHub
2. Create new **Web Service** on [Render](https://render.com)
3. Set root directory to `backend`
4. Add all `.env` variables in Render's environment settings
5. Build command: `npm install` | Start command: `npm start`

### Frontend → Vercel
1. Create new project on [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `REACT_APP_API_URL=https://your-render-url.onrender.com/api`
4. Deploy

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Tejas Navale**
- GitHub: [@navaletejas47](https://github.com/navaletejas47)
- Email: navaletejas47@gmail.com
