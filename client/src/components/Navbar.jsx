import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SITE } from '../config/site'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/gallery', label: 'Gallery' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false); window.scrollTo({ top: 0 }) }, [pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  return (
    <header className={`navbar ${scrolled || open ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label={`${SITE.name} home`}>
          <img src="/logo-mark.png" alt="" width="133" height="50" />
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className="nav-link">{l.label}</NavLink>
          ))}
          <Link to="/contact" className="btn-gold nav-cta">Book Now</Link>
        </nav>

        <button className={`hamburger ${open ? 'x' : ''}`} onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu" aria-expanded={open}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
