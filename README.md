<div align="center">
  <h1>⚡ Codify</h1>
  <p><strong>Competitive Programming Revision — Structured. Persistent. Yours.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Stack-MERN-00d4aa?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img src="https://img.shields.io/badge/Auth-Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" />
    <img src="https://img.shields.io/badge/DB-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img src="https://img.shields.io/badge/License-MIT-gold?style=for-the-badge" />
  </p>
</div>

---

## 🚀 What is Codify?

**Codify** is a full-stack competitive programming revision tool. Organise problems into **topics**, track **solved / starred** status, write personal **notes**, and auto-import problem statements from **LeetCode & Codeforces** — all persisted to MongoDB and tied to your Google account.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📋 **Topic Sheets** | Create named sheets (e.g. *DSA Revision*, *Graph Theory*) per user |
| 🗂️ **Topic Organisation** | Group problems under topics with custom icons & colours |
| ✅ **Progress Tracking** | Mark problems solved / starred; write revision notes |
| 🔗 **Auto-Import** | Paste a LeetCode or Codeforces URL → fetch title, difficulty, constraints & examples automatically |
| 🔐 **Google Sign-In** | One-click OAuth — data scoped per Google account |
| 💾 **Persistent Data** | Everything stored in MongoDB Atlas — survives server restarts |

---

## 🛠️ Tech Stack

```
Frontend  →  React 18 + Vite + Tailwind CSS
Backend   →  Express.js (Node 22, ESM)
Database  →  MongoDB Atlas via Mongoose
Auth      →  Google Identity Services (GSI) + JWT (httpOnly cookie)
```

---

## 📁 Project Structure

```
Codify/
├── server/
│   ├── db.js                 # Mongoose connection
│   ├── index.js              # Express entry point
│   ├── middleware/
│   │   └── auth.js           # JWT cookie verification
│   ├── models/
│   │   ├── User.js
│   │   ├── Topic.js          # Embeds problems[]
│   │   ├── Progress.js
│   │   └── Sheet.js
│   └── routes/
│       ├── auth.js           # Google OAuth → JWT
│       ├── problems.js
│       ├── progress.js
│       ├── sheets.js
│       └── fetch.js          # Auto-import from LC/CF
│
└── client/
    └── src/
        ├── api/index.js      # Axios ↔ Express bridge
        ├── context/AppContext.jsx
        └── pages/
            ├── Landing.jsx   # Google Sign-In
            ├── Home.jsx      # Sheet dashboard
            └── Sheet.jsx     # Topic + problem view
```

---

## ⚙️ Local Setup

### 1 — Clone & install

```bash
git clone https://github.com/adaharshsingh/Codify.git
cd Codify
npm run install:all
```

### 2 — Environment variables

Create **`Codify/.env`** (never commit this):

```env
PORT=5000
MONGO=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
GOOGLE_CLIENT_ID=<your_google_client_id>.apps.googleusercontent.com
JWT_SECRET=change_this_to_a_long_random_string
```

Create **`Codify/client/.env`**:

```env
VITE_GOOGLE_CLIENT_ID=<your_google_client_id>.apps.googleusercontent.com
```

> **Getting credentials**
> - MongoDB → [cloud.mongodb.com](https://cloud.mongodb.com) → Create cluster → Get connection string
> - Google → [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 Client ID  
>   Add `http://localhost:5173` to **Authorised JavaScript origins**

### 3 — Run

```bash
# From project root — starts server + client concurrently
npm run dev
```

| Service | URL |
|---|---|
| React client | http://localhost:5173 |
| Express API | http://localhost:5000 |

---

## 🔑 API Reference

All routes (except `/api/auth/*` and `/api/health`) require a valid JWT cookie set by sign-in.

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/google` | Verify Google credential → set JWT cookie |
| `GET` | `/api/auth/me` | Return current user from cookie |
| `POST` | `/api/auth/logout` | Clear JWT cookie |
| `GET` | `/api/problems/topics` | All topics + problems (current user) |
| `POST` | `/api/problems/topics` | Create topic |
| `DELETE` | `/api/problems/topics/:id` | Delete topic |
| `POST` | `/api/problems/topics/:id/problems` | Add problem to topic |
| `DELETE` | `/api/problems/:id` | Delete problem |
| `GET` | `/api/progress` | Progress map for current user |
| `POST` | `/api/progress` | Upsert problem progress |
| `GET` | `/api/sheets` | All sheets for current user |
| `POST` | `/api/sheets` | Create sheet |
| `DELETE` | `/api/sheets/:id` | Delete sheet |
| `GET` | `/api/fetch-problem?url=` | Auto-import problem from URL |
| `GET` | `/api/health` | Health check |

---

## 📜 License

MIT © [Adarsh Kumar Singh](https://github.com/adaharshsingh)
