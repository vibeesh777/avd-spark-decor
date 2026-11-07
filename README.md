# AVD Spark Decor — Event Decoration Website

React (Vite) frontend + Node/Express backend. Gold-and-black theme built around the AVD logo.

## Quick start

```bash
npm run install:all          # installs root, client and server
cp server/.env.example server/.env   # then fill it in (see below)
npm run dev                  # site → http://localhost:5173   API → http://localhost:5000
```

Bookings are taken **only by phone call, WhatsApp and Instagram** — there is no booking form.
The site works even with no backend: designs fall back to `client/public/data/designs.json`.

## Change business details in ONE place

Open **`client/src/config/site.js`**: name, city, phone, WhatsApp number, hours,
packages, FAQ, testimonials, event categories.
(Set `city` to your real location — it appears in the footer, contact page, map and Google description.)

Optional frontend env vars (Vercel → Settings → Environment Variables):

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | URL of your deployed backend (leave empty for local dev) |
| `VITE_WHATSAPP` | WhatsApp number with country code, e.g. `919384217626` |
| `VITE_INSTAGRAM_HANDLE` | Your Instagram username, e.g. `avdsparkdecor` (the Instagram button stays hidden until set) |

## Backend environment (`server/.env`)

| Variable | Notes |
|---|---|
| `ADMIN_PASSWORD` | **Required.** Admin login is disabled until it is set. Use a long unique password. |
| `CLIENT_URL` | Your site URL(s), comma-separated (CORS). |
| `CLOUDINARY_*` | Image uploads. |
| `JSONBIN_API_KEY`, `JSONBIN_BIN_ID` | Storage for designs (needed on Vercel). Create one bin starting as `{"designs":[]}`. |

Without JSONBin the server stores data in `server/data/*.json` (fine on your own PC/VPS, not on Vercel).

## Pages & features

- **Home** — animated logo hero, scrolling highlights, event categories, featured designs, why-us, how-it-works, packages, testimonials, FAQ, call-to-action
- **Gallery** — instant category filter, search, ♥ saved designs (remembered in the browser), skeleton loading
- **Design page** — photo viewer with full-screen lightbox, share / copy link, related designs, Call / WhatsApp / Instagram booking buttons
- **Contact** — how-to-book buttons, location and Google map
- **Booking** — one-tap Call / WhatsApp (pre-filled with the chosen design) / Instagram buttons
- **Admin** (`/admin/login`) — upload and delete designs
- Floating WhatsApp button, back-to-top, mobile menu, SEO tags per page, link-preview (Open Graph) tags, `robots.txt`

## Security & performance notes

- Admin tokens are signed and expire after 12 h (the password is never inside the token); no default password.
- The admin login is rate-limited.
- Admin code is lazy-loaded; React is split into its own cached chunk; designs are fetched once and shared by all pages;
  images are lazy-loaded; animations respect "reduce motion".

## Deploy

- **Frontend (Vercel):** root directory `client`, build `npm run build`, output `dist`.
- **Backend:** Railway / Render / VPS — `cd server && npm start`, set all variables above.
