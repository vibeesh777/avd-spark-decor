# Setup guide — get photo uploads working (about 5 minutes)

You only need **one free account: Cloudinary**. It stores your photos *and* the photo list.

## 1. Create the Cloudinary account
1. Go to **cloudinary.com** → **Sign up for free**.
2. After logging in, open the **Dashboard** (home page). You will see three values:
   - **Cloud name**
   - **API Key**
   - **API Secret** (click the eye icon to reveal it)

## 2. Add them to your server
Do this on the project that hosts your **server / API** — *not* the website or the admin site.

On **Vercel**: open the API project → **Settings** → **Environment Variables** → add each row below (tick Production, Preview and Development):

| Name (type exactly) | Value |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | your Cloud name |
| `CLOUDINARY_API_KEY` | your API Key |
| `CLOUDINARY_API_SECRET` | your API Secret |
| `ADMIN_PASSWORD` | a long password only you know (you log in to the admin with this) |
| `CLIENT_URL` | your website address, a comma, then your admin site address — e.g. `https://avd-spark-decor.vercel.app,https://avd-spark-admin.vercel.app` |

Paste values **without quotes and without spaces**.

On **Render / Railway / other hosts**: the same five names go in that host's "Environment" / "Variables" page.

## 3. Redeploy the server
New settings only work after a redeploy.
On Vercel: **Deployments** → the latest one → **⋯** → **Redeploy**.

## 4. Check
Open your admin site and log in. At the top you will see a **server check**:
- ✅ green *"Server check passed — photo uploads are ready"* → you can upload.
- ⚠ red box → it tells you exactly what is still wrong. Fix that, redeploy, press **Check again**.

## Also needed on the other two projects
| Project | Setting | Value |
|---|---|---|
| Admin site | `VITE_API_URL` | your server address, e.g. `https://avd-spark-api.vercel.app` |
| Admin site | `VITE_SITE_URL` | your website address |
| Website | `VITE_API_URL` | your server address |

(After changing these, redeploy that project too.)

## JSONBin is optional
Older setups used JSONBin (`JSONBIN_API_KEY`, `JSONBIN_BIN_ID`). If you already set it up it keeps working, but you do **not** need it any more.
