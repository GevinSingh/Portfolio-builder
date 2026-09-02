# Tech Humans Portfolio - Backend Server Setup

## 🏗️ Architecture Overview

This project uses a **self-hosted Express.js backend** — no Supabase, no Firebase, no paid subscriptions required.

```
┌─────────────────────────────────────┐
│         Vite Frontend (port 3000)   │
│         React + Tailwind CSS        │
└────────────────┬────────────────────┘
                 │  /api/* proxy
                 ▼
┌─────────────────────────────────────┐
│       Express Backend (port 5000)   │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ data/    │  │ uploads/resumes/ │ │
│  │ ├ portfolios.json              │ │
│  │ ├ messages.json                │ │
│  │ └ users.json                   │ │
│  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────┘
```

## 🚀 Development (Local)

Open **two terminals** side-by-side:

**Terminal 1 – Start the backend:**
```bash
node server.js
# or
npm run server
```

**Terminal 2 – Start the frontend:**
```bash
npm run dev
```

Then open: **http://localhost:3000**

The Vite dev server automatically proxies `/api` and `/uploads` requests to `http://localhost:5000`.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/portfolios` | List all portfolios |
| GET | `/api/portfolios/:slug` | Get portfolio by slug |
| POST | `/api/portfolios` | Save / upsert portfolio |
| DELETE | `/api/portfolios/:slug` | Delete portfolio |
| POST | `/api/messages` | Save recruiter contact message |
| GET | `/api/messages` | Get all messages |
| GET | `/api/messages/:slug` | Get messages for portfolio |
| DELETE | `/api/messages/:id` | Delete a message |
| POST | `/api/upload/resume` | Upload resume PDF (base64) |
| POST | `/api/upload/avatar` | Upload avatar image (base64) |

---

## ☁️ Deploy to Render.com (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Port**: `5000`

The Express server will serve both the API and the built frontend from `dist/`.

---

## ☁️ Deploy to Railway.app (Free tier)

```bash
railway login
railway init
railway up
```

Set environment variable: `PORT=5000`

---

## 📁 Data Storage

All data is stored as JSON files in the `data/` folder:

- `data/portfolios.json` — All portfolio records
- `data/messages.json` — Recruiter contact messages  
- `data/users.json` — User accounts
- `uploads/resumes/` — Uploaded resume PDF files
- `uploads/avatars/` — Avatar images

> **Tip**: Back up the `data/` and `uploads/` directories regularly when deployed.

---

## 🔑 Environment Variables

```env
PORT=5000          # Express server port (default: 5000)
NODE_ENV=production
```

The frontend environment variables (`VITE_*`) are for optional Supabase fallback only.
