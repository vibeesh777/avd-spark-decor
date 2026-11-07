import { useEffect, useState } from 'react'
import { waLink } from '../config/site'

/** Floating WhatsApp button + back-to-top, shown on every public page. */
export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="floating">
      <button className={`fab fab-top ${showTop ? 'show' : ''}`} aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
      <a className="fab fab-wa" href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>
      </a>
    </div>
  )
}
