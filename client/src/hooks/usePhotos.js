import { useMemo } from 'react'
import useDesigns from './useDesigns'

/** Photos grouped by function: { Wedding: [url, …], Birthday: [...] }  (null while loading). */
export default function usePhotos() {
  const designs = useDesigns()
  return useMemo(() => designs && designs.reduce((map, d) => {
    (map[d.category] ||= []).push(...(d.images || []))
    return map
  }, {}), [designs])
}
