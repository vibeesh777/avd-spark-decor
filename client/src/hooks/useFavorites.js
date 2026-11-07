import { useCallback, useEffect, useState } from 'react'

const KEY = 'avd_favorites'
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }

/** Saved designs, remembered in this browser. */
export default function useFavorites() {
  const [ids, setIds] = useState(read)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* private mode */ } }, [ids])
  const toggle = useCallback(id => setIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), [])
  return { ids, toggle, has: id => ids.includes(id) }
}
