import { useEffect, useState } from 'react'
import { waLink } from '../config/site'
import { WhatsAppIcon } from './BrandIcons'

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
        <WhatsAppIcon size={30} />
      </a>
    </div>
  )
}
