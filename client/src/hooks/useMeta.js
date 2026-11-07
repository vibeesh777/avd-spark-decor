import { useEffect } from 'react'
import { SITE } from '../config/site'

/** Sets <title> and meta description per page (helps SEO + WhatsApp previews). */
export default function useMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE.name}` : `${SITE.name} — Luxury Event Decorations in ${SITE.city}`
    const d = description || `Premium wedding, birthday, baby shower, puberty function and party decorations in ${SITE.address}. Browse designs and book your event with ${SITE.name}.`
    document.querySelector('meta[name="description"]')?.setAttribute('content', d)
  }, [title, description])
}
