# 🏠 FlatFinderApp
A full-stack real estate web app that helps users find and book flats across the UK and Europe. Includes a React frontend, Node.js/Express backend, and MySQL + Prisma for database.

---

## 🚀 Features

- 🔍 Filter & search listings by city and keywords
- 📍 Flat cards with images, price, location, description
- 🔐 Sign up & log in system (with localStorage or MySQL)
- 🌐 Full routing: Home, Listings, Login, Signup
- 🎨 Responsive, Airbnb-style layout with clean UI
- 🛠 Prisma ORM with MySQL backend integration

---

## 🧱 Tech Stack

### Frontend:
- React
- React Router DOM
- Lucide React (icons)
- Tailwind CSS or custom CSS (if added)

### Backend:
- Node.js + Express
- Prisma (ORM)
- MySQL (local or remote)

---

## 📦 Installation

Clone the repo:
```bash
git clone https://github.com/jishadhoque/FlatFinderApp.git
cd FlatFinderApp
```

Install frontend dependencies:
```bash
cd client
npm install
```

Install backend dependencies:
```bash
cd ../backend
npm install
```

Install lucide-react:
```bash
npm install lucide-react
```

---

## 🛠 Setup & Configuration

### 1. Configure MySQL
Ensure MySQL is installed and running.

Create a database:
```bash
mysql -u root -p
CREATE DATABASE flatfinder;
```

### 2. Configure Prisma
Update `/backend/.env`:
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/flatfinder"
```

Then run:
```bash
npx prisma migrate dev --name init
npx prisma studio # Optional to view/edit data
```

### 3. Start Servers
In one terminal:
```bash
cd backend
node server.js
```
In another:
```bash
cd client
npm start
```

---

## 🧪 Testing Login/Signup

- Signup: Create an account at `/signup`
- Login: Use same credentials at `/login`
- Login uses `localStorage` or MySQL depending on config

---

## 📁 Project Structure
```
FlatFinderApp/
├── backend/
│   ├── prisma/
│   ├── server.js
│   └── .env
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── css/
│   ├── App.js
│   └── index.js
```

---

## 🧠 Notes
- You must run both backend and frontend servers.
- All flat listings are stored in MySQL via Prisma.
- Signup/Login can be extended to use JWTs later.

---

## 🤝 Contributing
Pull requests welcome. Let’s build together.

---

## 📜 License
MIT License. Use freely, but give credit if you fork or launch publicly.

---

## 📸 UI Preview
<img src="/screenshots/login-screen.png" alt="Login UI" width="400" />

---

## ✨ Built by [@jishadhoque](https://github.com/jishadhoque)

