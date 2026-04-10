# 🚀 CryptoCurrency Trading Platform

A full-stack cryptocurrency trading platform developed using modern web technologies. The application provides a complete trading simulation environment with authentication, wallet management, transaction tracking, and an admin panel.

---

## 📌 Overview

This project demonstrates a **full-stack architecture** where a React frontend communicates with a Node.js & Express backend using REST APIs. It includes JWT-based authentication and role-based access control.

---

## ✨ Key Features

* 🔐 Authentication using JWT
* 📊 Dashboard with real-time style charts
* 💰 Wallet management system
* 📈 Buy/Sell trading simulation
* 📜 Transaction history tracking
* 👤 User profile management
* 🛠️ Admin panel with role-based access
* 🎨 Responsive modern UI

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Context API (Auth & Theme Management)
* JavaScript (ES6+)
* CSS3 (Custom Styling)
* Lightweight Charts (for visualization)

### Backend

* Node.js
* Express.js
* MongoDB (Database)
* Mongoose (ODM)
* JSON Web Token (JWT)
* Middleware (Authentication & Validation)

### Tools & Environment

* VS Code
* Postman (API Testing)
* MongoDB Compass
* Git & GitHub

---

 📸 Screenshots



### 🔐 Login Page
<img width="1918" height="1047" alt="image" src="https://github.com/user-attachments/assets/b9214a9a-d7bf-4228-b95f-42824e599558" />



### 📊 Dashboard
<img width="1918" height="1056" alt="image" src="https://github.com/user-attachments/assets/68d3858d-3115-4ce8-af88-3f041e01c6d9" />


### 📈 Trading

<img width="1918" height="1046" alt="image" src="https://github.com/user-attachments/assets/162b2c09-a502-4c39-9ec7-aa71cb922ec4" />


### 💰 Wallet

<img width="1918" height="961" alt="image" src="https://github.com/user-attachments/assets/daf57dc5-f2f9-4903-b802-aa4746e901e5" />


### 🛠️ Admin Panel

<img width="1918" height="931" alt="image" src="https://github.com/user-attachments/assets/56fc8706-fabf-4f12-89f8-3ff6928b2032" />


---

## 📂 Project Structure

```bash id="s6"
crypto-app/
│
├── backend/
│   ├── node_modules/
│   ├── .env
│   ├── admin.js
│   ├── auth.js
│   ├── authMiddleware.js
│   ├── jwt.js
│   ├── market.js
│   ├── Order.js
│   ├── rateLimit.js
│   ├── server.js
│   ├── Trade.js
│   ├── trading.js
│   ├── Transaction.js
│   ├── User.js
│   ├── validation.js
│   ├── Wallet.js
│   ├── walletRoute.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── Admin.js
│   │   ├── Admin.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── AuthContext.js
│   │   ├── Auth.css
│   │   ├── Chart.js
│   │   ├── Dashboard.js
│   │   ├── Dashboard.css
│   │   ├── History.js
│   │   ├── History.css
│   │   ├── Login.js
│   │   ├── Navbar.js
│   │   ├── Navbar.css
│   │   ├── PrivateRoute.js
│   │   ├── Profile.js
│   │   ├── Profile.css
│   │   ├── Register.js
│   │   ├── ThemeContext.js
│   │   ├── TradeBox.js
│   │   ├── TradeBox.css
│   │   ├── Wallet.js
│   │   ├── Wallet.css
│   │   ├── api.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── screenshots/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash id="s7"
git clone https://github.com/your-username/crypto-currency-trading-platform.git
cd crypto-currency-trading-platform
```

---

### 2️⃣ Backend Setup

```bash id="s8"
cd crypto-app/backend
npm install
```

Create `.env` file:

```env id="s9"
PORT=6000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash id="s10"
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash id="s11"
cd ../frontend
npm install
npm start
```

---

## 🌐 Application Access

* Frontend: http://localhost:3000
* Backend: http://localhost:6000

---

## 🔐 Authentication

* Accepts any email and password (demo mode)
* Automatically creates user if not exists
* Admin access if email contains `admin`

---

## 🔗 API Endpoints

### Authentication

* `POST /api/auth/login`
* `POST /api/auth/register`

### Wallet

* `GET /api/wallet`
* `POST /api/wallet/add`

### Trading

* `POST /api/trade`
* `GET /api/history`

---

## 🧠 System Workflow

1. User logs in or registers
2. Backend validates or creates user
3. JWT token is generated
4. Token stored in frontend
5. Protected routes enabled
6. User performs trading and wallet operations

---

## ⚠️ Disclaimer

This project is developed for **academic and demonstration purposes only**.
It does not handle real cryptocurrency transactions.

---

## 👨‍💻 Author

**Diya Karmakar**

---
