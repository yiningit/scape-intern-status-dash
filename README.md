# 📊 Scape Internal Service Status Dashboard
A full-stack monitoring solution built during my 6-week Technology Internship at The Living Company | Scape Australia. This dashboard provides real-time visibility into internal service health, allowing technical teams to monitor uptime and respond to outages efficiently.

## 🚀 Key Features
- **Automated Service "Heartbeat":** The system automatically pings configured services to verify connectivity.
- **Visibility-Aware Polling:** Optimized performance using the Page Visibility API:
    - Active: Pings every 60 seconds when the tab is focused.
    - Background: Pings every 5 minutes when the tab is hidden to save resources.
- **Status Indicators:** Visual feedback for three distinct states: Operational, Down, or Error (request failures).
- **Secure Authentication:** User registration and login flow powered by JWT and bcrypt for salted password hashing.
- **Modern UI:** A clean, professional interface built with Material UI (MUI).

## 🛠 Tech Stack
### Frontend:
- React (Vite)
- Material UI
- Axios (API Calls)

### Backend:
- Node.js & Express
- MongoDB & Mongoose (ODM)
- JWT (Authentication)
- bcrypt (Security)

## 📂 Project Structure
```text
.
├── frontend/     # React + Vite application (UI)
└── server/       # Node.js + Express API (Logic & Database)
```

## 📋 Prerequisites
Before you begin, ensure you have the following installed:
* **Node.js** (v18.0.0 or higher)
* **npm** (comes with Node.js)
* A **MongoDB Atlas** account or a local MongoDB instance

## ⚙️ Setup & Installation
**1. Clone the repository**
```Bash
git clone https://github.com/yiningit/scape-intern-status-dash.git
cd scape-intern-status-dash
```
**2. Backend Setup**
```Bash
cd server
npm install
```

Create a .env file in the /server directory:
```env
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
```

Start the server:
```Bash
npm run dev
```

**3. Frontend Setup**
```Bash
cd ../frontend
npm install
```

Create a .env file in the /frontend directory:
```env
VITE_API_BASE=http://localhost:5000/api
```

Start the application:
```Bash
npm run dev
```

## 🔒 Security Implementation
While this project served as an internal prototype, security was a priority:
- Passwords: Never stored in plain text; encrypted using bcrypt before database entry.
- Session Management: verifies JSON Web Tokens to ensure only logged-in users can access the dashboard.

## 🎓 Internship Context
This project was developed as part of the 2026 Scape Australia Internship Program. It represents my first experience building a full-stack application within a corporate tech environment during my first year of a BSc in Computer Science at USYD.