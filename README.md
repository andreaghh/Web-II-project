# University Transport Booking System

A full-stack web application that allows **students, staff, and professors** to request transportation services for university-related activities such as airport pickups, site visits, or academic events.

The system includes **role-based access**, **real-time support chat**, and **admin management tools** to handle transport requests efficiently.

---

# Features

##  User Features
- User authentication (JWT)
- Create transport booking requests
- View booking history
- Upload justification documents (PDF or image)
- Real-time support chat with administrators
- Dashboard showing current and past bookings

## Admin Features
- Admin dashboard
- Manage bookings
- Manage users
- Manage vehicles and transport types
- Respond to user support chats in real time
- View analytics and booking statistics

---

# Tech Stack

## Frontend
- React
- Vite
- Axios
- Socket.IO Client

## Backend
- Node.js
- Express.js
- Sequelize ORM
- Socket.IO

## Databases
- **MySQL** → Core application data
- **MongoDB** → Sessions and real-time chat messages

---

# Project Structure
src
├── client
│ ├── components
│ ├── pages
│ ├── services
│ └── App.jsx
│
└── server
├── config
├── controllers
├── models
├── routes
├── sockets
└── main.js

# Installation

## 1️ Clone the repository

## 2️ Install dependencies : npm install
## 3️ Configure environment variables

Create a `.env` file in the root directory.

Example:
PORT=3000

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=transport_db
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword

MONGO_URI=mongodb://localhost:27017/transport_sessions

SESSION_SECRET=your_secret_key
JWT_SECRET=your_jwt_secret

# Running the Application

Start the development server: npm run dev  


Screenshots:
Login:
<img width="1919" height="1159" alt="image" src="https://github.com/user-attachments/assets/ceac9424-399d-4579-891a-64c8d3696358" />

Register:
<img width="1918" height="1006" alt="image" src="https://github.com/user-attachments/assets/0d12607e-ba74-4db0-aa41-869844e438be" />

Booking:
<img width="1919" height="1108" alt="image" src="https://github.com/user-attachments/assets/d3a362a5-8427-4da1-a079-f928a2ffae9f" />





