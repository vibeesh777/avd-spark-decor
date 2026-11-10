# AVD Spark Decor — Event Decoration Website

Three parts: **`client/`** (public website) · **`admin/`** (separate owner site for uploading photos) · **`server/`** (API). Gold-and-black theme built around the AVD logo.

## Quick start

```bash
npm run install:all          # installs root, client and server
cp server/.env.example server/.env   # then fill it in (see below)
npm run dev                  # website → :5173   admin → :5174   API → :5000
```

Orders are placed **on WhatsApp (3 numbers) or Instagram** — there is no booking form. Phone calls are for emergencies only (numbers 2 and 3).
The site works even with no backend: designs fall back to `client/public/data/designs.json`.

## Change business details in ONE place

Open **`client/src/config/site.js`**: name, city, the three phone/WhatsApp numbers, Instagram, hours,
teddy prices, machines, A-to-Z list, FAQ, testimonials, event categories.
(Set `city` to your real location — it appears in the footer, contact page, map and Google description.)

Optional frontend env vars (Vercel → Settings → Environment Variables):

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | URL of your deployed backend (leave empty for local dev) |
| `VITE_INSTAGRAM_HANDLE` | Instagram username (defaults to `avd_sparkdecor`) |

## Backend environment (`server/.env`)

| Variable | Notes |
|---|---|
| `ADMIN_PASSWORD` | **Required.** Admin login is disabled until it is set. Use a long unique password. |
| `CLIENT_URL` | Your site URL(s), comma-separated (CORS). |
| `CLOUDINARY_*` | Image uploads. |
| `JSONBIN_API_KEY`, `JSONBIN_BIN_ID` | Storage for designs (needed on Vercel). Create one bin starting as `{"designs":[]}`. |

Without JSONBin the server stores data in `server/data/*.json` (fine on your own PC/VPS, not on Vercel).

## Pages & features

- **Services & Rentals** (`/services`) — DJ music setup, teddy dancers with 1/2/3-teddy prices, paper-spray/confetti & LED smoke machines, A-to-Z service list, vision & mission, booking buttons
- **Home** — animated logo hero, scrolling highlights, function tiles (cover photo + count), services teaser, why-us, how-it-works, testimonials, FAQ, call-to-action
- **Gallery** (`/gallery`) — a tile for every function. **Touching a function opens `/gallery/wedding`, `/gallery/puberty-function`, `/gallery/engagement` …** with *all* photos of that function in one wall (tap a photo for full screen), plus order buttons
- **Contact** — how-to-book buttons, location and Google map
- **Ordering** — WhatsApp buttons for all three numbers (pre-filled with the function the visitor was viewing), Instagram, and emergency Call buttons for numbers 2 and 3
- **Admin site** (separate project in `admin/`, e.g. avd-spark-admin.vercel.app) — **Photos by function**: upload photos to Wedding, Birthday, Baby Shower, Puberty Function, Surprise Party, Engagement, DJ Setup, Teddy Dancers and Paper Spray; add more photos, delete single photos, delete albums. Every photo you upload to a function automatically appears on that function's page. Phone photos are shrunk before upload. Uploaded DJ / Teddy / Paper Spray photos appear automatically on the Services page.
- Floating WhatsApp button, back-to-top, mobile menu, SEO tags per page, link-preview (Open Graph) tags, `robots.txt`

## Security & performance notes

- Admin tokens are signed and expire after 12 h (the password is never inside the token); no default password.
- The admin login is rate-limited.
- The admin is a separate site (no admin code on the public website); photos are fetched once and shared by all pages;
  images are lazy-loaded; animations respect "reduce motion".

## Deploy (three small projects)

| Part | Where | Settings |
|---|---|---|
| **Website** (`client/`) | Vercel — your existing `avd-spark-decor` project | Root directory `client` · env: `VITE_API_URL` (your API URL) · optional `VITE_INSTAGRAM_HANDLE` |
| **Admin site** (`admin/`) | A **new** Vercel project (e.g. `avd-spark-admin`) | Root directory `admin` · env: `VITE_API_URL` (same API URL) · `VITE_SITE_URL` (your website URL) |
| **API** (`server/`) | Railway / Render / VPS — `cd server && npm start` | All variables from `server/.env.example`. Put **both** site URLs in `CLIENT_URL`, comma-separated |

The admin site is hidden from Google (`noindex`) and is not linked from the public website — open its address directly and log in with `ADMIN_PASSWORD`.

Admin and website share the function list: if you add a new function, add it in `client/src/config/site.js` **and** `admin/src/categories.js`.
