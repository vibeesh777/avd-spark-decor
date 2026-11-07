import axios from 'axios'

export const API = import.meta.env.VITE_API_URL || ''
export const http = axios.create({ baseURL: API, timeout: 12000 })

// One fetch for the whole site; falls back to the bundled JSON if the API is down.
let cache = null
export async function getDesigns() {
  if (cache) return cache
  let list
  try { list = (await http.get('/api/designs')).data?.designs } catch { /* API offline */ }
  if (!Array.isArray(list)) {            // API missing / returned HTML → use bundled designs
    try { list = (await (await fetch('/data/designs.json')).json()).designs } catch { /* ignore */ }
  }
  return (cache = Array.isArray(list) ? list : [])
}
