// Backend API (leave empty in local dev — the Vite proxy forwards /api to http://localhost:5000)
export const API = import.meta.env.VITE_API_URL || ''
// Public website (used for the "← Website" and "View" links)
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://avd-spark-decor.vercel.app').replace(/\/$/, '')
