import { useEffect, useState } from 'react'
import { getDesigns } from '../lib/api'

/** Returns `null` while loading, then the array of designs. */
export default function useDesigns() {
  const [designs, setDesigns] = useState(null)
  useEffect(() => {
    let live = true
    getDesigns().then(d => live && setDesigns(d))
    return () => { live = false }
  }, [])
  return designs
}
