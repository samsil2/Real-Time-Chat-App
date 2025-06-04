# 💬 Real-Time Chat App

Live demo → https://real-time-chat-app-1-kb7c.onrender.com/

A **MERN + Socket.io** chat application with authentication, live messaging, profile pictures, and a modern Tailwind / daisyUI interface. Deployed on **Render**.

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express-4.18.2-blue" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb" />
  <img src="https://img.shields.io/badge/Socket.io-4.x-lightgrey?logo=socketdotio" />
  <img src="https://img.shields.io/badge/Render-live-blue?logo=render" />
</div>

---

## Table of Contents
1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Project Structure](#project-structure)  
4. [Local Setup](#local-setup)  
5. [Environment Variables](#environment-variables)  
6. [Deployment on Render](#deployment-on-render)  
7. [Troubleshooting](#troubleshooting)  


---

## 📦 Features

| Category          | Details                                                                                           |
|-------------------|---------------------------------------------------------------------------------------------------|
| **Authentication**| JWT cookies, signup / login / logout, session check on refresh                                    |
| **Real-time Chat**| Socket.io events, online/offline presence, typing indicator                                       |
| **Messages**      | Text and image (Cloudinary upload, max size 50kb), persistent history (MongoDB)                                  |
| **UI**            | Tailwind 3 + daisyUI, dark-mode aware, fully responsive                                           |
| **Dev DX**        | Vite + React 18 HMR, Zustand store, ESLint + Prettier                                             |
| **Prod**          | Single command build, SPA served by Express, one-click deploy on Render                           |

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, Zustand, Tailwind CSS, daisyUI, Socket.io-client  
- **Backend:** Node 20, Express 4.18, Socket.io server, Mongoose  
- **Database:** MongoDB Atlas  
- **Media Storage:** Cloudinary  
- **Hosting:** Render (monorepo build & run scripts)  

---

## 📂 Project Structure

```text
Real-Time-Chat-App/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/        # route handlers
│  │  ├─ middleware/         # auth, error, etc.
│  │  ├─ models/             # Mongoose models
│  │  ├─ routes/             # Express routers
│  │  ├─ lib/                # DB, socket.io, utils
│  │  └─ index.js            # entry point
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ store/
│  │  └─ main.jsx
│  └─ package.json
├─ .env.example              # copy to backend/.env for local dev
└─ README.md                 # you are here
```

🚀 Local Setup
```
# 1. Clone
git clone https://github.com/your-user/Real-Time-Chat-App.git
cd Real-Time-Chat-App

# 2. Install deps for both workspaces
npm install --prefix backend
npm install --prefix frontend

# 3. Create env file for backend
cp .env.example backend/.env
# → fill in Mongo URI, JWT secret, Cloudinary keys

# 4. Start dev servers (two terminals)
# Terminal A – backend on :5001
npm run dev --prefix backend
# Terminal B – frontend on :5173 (Vite)
npm run dev --prefix frontend
```

Open http://localhost:5173 – the app hot-reloads while the backend restarts with nodemon.

🔑 Environment Variables

| Key                     | Sample Value                                              | Description                           |
| ----------------------- | --------------------------------------------------------- | ------------------------------------- |
| `PORT`                  | `5001`                                                    | Backend port (Render injects its own) |
| `MONGODB_URI`           | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/chat_db` | Atlas connection string               |
| `JWT_SECRET`            | `supersecretkey`                                          | HMAC secret for JWT                   |
| `CLOUDINARY_CLOUD_NAME` | `demo`                                                    | Cloudinary cloud name                 |
| `CLOUDINARY_API_KEY`    | `123456`                                                  | Cloudinary API key                    |
| `CLOUDINARY_API_SECRET` | `abc123`                                                  | Cloudinary secret                     |

🛰 Deployment on Render
1. Create a new Web Service → GitHub → this repo.
2. Build Command
   ```npm run build```
3. Start Command
   ``` npm run start ```
4. Environment Variables – add keys from .env.example (do not set PORT).
5. Click Deploy – Render installs both workspaces, builds the React app, then starts the backend which serves dist/ as static files.

🐞 Troubleshooting
| Symptom                                  | Fix                                                                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `Error: Cannot find module './router'`   | Pin **express 4.18.2** in `backend/package.json` and commit `package-lock.json`.              |
| CORS errors in browser console           | Ensure backend `cors({ origin: "<your-site>", credentials: true })` matches production domain |
| `413 Payload Too Large` on avatar upload | Increase `express.json({ limit: "50kb" })` or switch to `multer` + `FormData` upload.         |


 






