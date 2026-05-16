# 🌟 AVD Spark Decor — Full Stack Website

A luxury event decoration website with customer gallery, booking requests, and owner admin panel.

---

## 📁 Project Structure

```
avd-spark-decor/
├── client/          ← React frontend (Vite)
│   └── src/
│       ├── pages/   ← Home, Gallery, DesignDetail, Contact, Admin
│       ├── components/  ← Navbar, Footer, Toast
│       └── context/ ← AdminContext (auth + toast)
├── server/          ← Node.js + Express backend
│   ├── routes/      ← designs.js, requests.js, admin.js
│   ├── middleware/  ← auth.js
│   ├── data/        ← designs.json, requests.json (auto-created)
│   └── uploads/     ← uploaded images (auto-created)
└── package.json     ← root scripts
```

---

## 🚀 Setup & Run

### Step 1 — Install dependencies

```bash
npm run install:all
```

### Step 2 — Configure environment

```bash
cd server
cp .env.example .env
# Edit .env with your Gmail and WhatsApp number
```

**Required .env values:**
| Variable | Value |
|---|---|
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Gmail App Password (not your regular password) |
| `OWNER_EMAIL` | Where booking emails go (can be same as EMAIL_USER) |
| `OWNER_WHATSAPP` | Your WhatsApp number with country code (e.g. `919876543210`) |
| `ADMIN_PASSWORD` | Your admin panel password |

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → create one for "Mail"

### Step 3 — Run development servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🔐 Admin Panel

URL: http://localhost:5173/admin/login

**Features:**
- 📊 Dashboard with stats (total requests, new, confirmed)
- 📋 View all customer requests with status management
- 🎨 Upload and manage design photos
- 💬 One-click WhatsApp reply to customers
- 🔄 Update booking status (New → Contacted → Confirmed → Completed)

---

## 🌐 Customer Features

- **Home page** — Hero, event categories, featured designs, testimonials
- **Gallery** — Filter by event type, masonry grid layout
- **Design Detail** — Photo gallery + booking request form
- **Contact page** — General enquiry form

---

## 📧 Notifications

When a customer submits a request:
1. **Owner gets an email** with all details + WhatsApp quick-reply link
2. **Customer gets a confirmation email** with their Request ID (if email provided)

---

## 🚀 Production Deployment

### Frontend (Vercel / Netlify)
```bash
cd client && npm run build
# Upload the `dist/` folder
# Set VITE_WHATSAPP=919876543210 in environment variables
```

### Backend (Railway / Render / VPS)
```bash
cd server && npm start
# Set all .env variables in the hosting dashboard
```

---

## 📱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express |
| Storage | JSON files (upgradeable to MongoDB) |
| Email | Nodemailer + Gmail SMTP |
| Images | Multer (local uploads) |
| Auth | Simple token-based admin auth |

---

*Made with ✨ for AVD Spark Decor, Chennai*
