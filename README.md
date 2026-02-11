# 🚀 Tracing App

Tracing App is a Full-Stack User Tracking & Analytics Web Application
built with:

-   Node.js (Express)
-   MySQL
-   Sequelize ORM
-   React.js
-   MVC Architecture
-   JWT Authentication

This application automatically tracks users when they visit the website
and stores their interaction data in a database.

------------------------------------------------------------------------

# 📌 What This App Does

When a user visits the homepage:

-   A session is automatically created
-   IP address is saved
-   Browser information is saved
-   Device information is saved
-   Approximate location (Country / City) is detected
-   Button clicks are tracked
-   Slider navigation (Next / Previous) is tracked
-   Question responses are stored

Admin panel allows:

-   Viewing all sessions
-   Viewing live activity
-   Managing responses
-   Exporting tracking data (CSV)
-   Bulk delete functionality

------------------------------------------------------------------------

# 🏗 Project Structure

tracing-app/ │ ├── client/ → React Frontend │ ├── server/ → Node.js
Backend (MVC) │ ├── config/ │ ├── controllers/ │ ├── models/ │ ├──
routes/ │ ├── middleware/ │ └── index.js │ └── README.md

------------------------------------------------------------------------

# ⚙️ Installation Guide

## ✅ Requirements

Make sure you have installed:

-   Node.js (v18+ recommended)
-   MySQL
-   Git

Check versions:

node -v npm -v mysql --version

------------------------------------------------------------------------

# 🖥 Step 1 --- Clone Repository

git clone https://github.com/YOUR_USERNAME/tracing-app.git cd
tracing-app

------------------------------------------------------------------------

# 🛠 Step 2 --- Setup Backend (Server)

## 1️⃣ Go to server folder

cd server

## 2️⃣ Install Node Modules (VERY IMPORTANT)

npm install

This will create:

node_modules/ package-lock.json

------------------------------------------------------------------------

## 3️⃣ Create MySQL Database

Login to MySQL and create database:

CREATE DATABASE tracing_app;

------------------------------------------------------------------------

## 4️⃣ Create .env File

Inside the server folder, create a file named:

.env

Add this configuration:

PORT=8080

DB_NAME=tracing_app DB_USER=root DB_PASSWORD=your_password
DB_HOST=localhost

JWT_SECRET=your_super_secret_key

🔹 Change DB_USER, DB_PASSWORD, DB_NAME, and JWT_SECRET according to
your system.

------------------------------------------------------------------------

## 5️⃣ Start Backend Server

npm start

OR (if using nodemon)

npm run dev

Server runs at:

http://localhost:8080

✅ Sequelize will automatically create tables if they do not exist.

------------------------------------------------------------------------

# 🎨 Step 3 --- Setup Frontend (Client)

Open a new terminal.

## 1️⃣ Go to client folder

cd client

## 2️⃣ Install Node Modules

npm install

## 3️⃣ Start React App

npm start

Frontend runs at:

http://localhost:3000

------------------------------------------------------------------------

# 🔐 Admin Authentication

Admin routes require JWT token.

Example header:

Authorization: Bearer YOUR_TOKEN

Admin login example:

POST /api/admin/login

------------------------------------------------------------------------

# 📡 API Endpoints

## 🔹 Tracking

POST /api/tracking/session POST /api/tracking/click POST
/api/tracking/response

## 🔹 Admin

GET /api/admin/sessions GET /api/admin/live GET
/api/admin/export/tracking.csv DELETE /api/admin/delete

------------------------------------------------------------------------

# 🛡 Technologies Used

-   Node.js
-   Express.js
-   MySQL
-   Sequelize ORM
-   React.js
-   Axios
-   JWT Authentication
-   MVC Architecture

------------------------------------------------------------------------

# 🔥 Example Workflow

1.  User opens homepage\
2.  Session created in database\
3.  User clicks a button\
4.  Click event stored\
5.  Admin views live data\
6.  Admin exports CSV report

------------------------------------------------------------------------

# 🚀 Production Deployment (Optional)

Recommended:

Backend: - VPS (DigitalOcean / AWS / Render)

Frontend: - Vercel / Netlify

Database: - Managed MySQL service

------------------------------------------------------------------------

# 👨‍💻 Author

Mohammad Mosa Agha Jahanmal\
Full Stack Developer (MERN + React Native)

GitHub: https://github.com/MohammadMosaAghaJahanmal

------------------------------------------------------------------------

# 📄 License

MIT License

------------------------------------------------------------------------

⭐ If you like this project, please give it a star.
