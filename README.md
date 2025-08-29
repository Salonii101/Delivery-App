# 🚚 Delivery-App (Backend)

> ⚠️ **Work In Progress**: This is the backend of a Delivery Application.  
> Currently under development – new features, improvements, and frontend integration are being added.

---

## 📖 Overview
The **Delivery-App Backend** is a Node.js & Fastify-based API service that powers a food delivery application.  
It manages **users, categories, products, and orders** with support for authentication, sessions, and JWT tokens.  

This project is meant to be **scalable, modular, and production-ready** with MongoDB as the database.

---

## ✨ Features (Completed & Planned)

### ✅ Implemented
- 👤 **User Authentication** (Customer, Delivery Partner, Admin – basic version)
- 🔐 **Session Management** using `@fastify/session` & `connect-mongodb-session`
- 🗄️ **MongoDB Models** for Category & Product
- 🌱 **Database Seeding Script** for sample categories and products
- 📡 **API Endpoints** for categories, products, and orders
- ⚡ **Fastify framework** for better performance

### 🔜 In Progress
- 🔄 Refresh tokens and role-based access (Admin vs Delivery Partner vs Customer)
- 🔑 Password hashing with **bcrypt**
- 📦 Order management (status update, confirmation, etc.)
- 🖥️ Frontend (React/Next.js) integration
- 🚀 Deployment on Render/Heroku/AWS

---

## 🛠️ Tech Stack
- **Node.js (v22+)**
- **Fastify** (API framework)
- **MongoDB** with **Mongoose**
- **dotenv** for environment variables
- **@fastify/session** for session handling
- **connect-mongodb-session** for persisting sessions
  

---

## 📂 Project Structure

<img width="805" height="480" alt="delivery app" src="https://github.com/user-attachments/assets/dcc8335f-4989-4e0d-ac3a-ff80b3f88164" />

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
``
git clone https://github.com/<your-username>/Delivery-App.git
cd Delivery-App

---

### 2️⃣ Install dependencies
npm install

---

### 3️⃣ Setup environment variables

Create a .env file in the root:

PORT=3000

MONGO_URI=mongodb://localhost:27017/DeliveryApp

COOKIE_PASSWORD=your_secret_cookie_password

JWT_SECRET=your_jwt_secret

---

### 4️⃣ Seed the database

Populate MongoDB with sample categories and products:

node seedScript.js

---

### 5️⃣ Start the server
npm start

Server will be available at 👉 http://localhost:3000

---

### 📝 Future Improvements

- Password hashing with bcrypt
- Role-based authorization
- Admin panel endpoints
- Frontend with React/Next.js
- Docker support for easier setup
- Deployment to production cloud provider

---

### 🤝 Contributing

Contributions are welcome!
If you’d like to add new features or fix bugs:

Fork the repo

Create a new branch (feature/your-feature)

Commit and push

Open a Pull Request 🚀
