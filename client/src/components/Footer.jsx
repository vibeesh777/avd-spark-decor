import { Link } from 'react-router-dom'
import { SITE, CATEGORIES } from '../config/site'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img src="/logo.jpg" alt={`${SITE.name} ${SITE.suffix}`} className="footer-logo" loading="lazy" width="220" height="147" />
          <p className="muted">Crafting unforgettable moments with elegance, creativity &amp; heart.</p>
          <div className="social-row">
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="social-btn">WhatsApp</a>
            {SITE.instagram && <a href={SITE.instagram} target="_blank" rel="noreferrer" className="social-btn">Instagram</a>}
          </div>
        </div>

        <div>
          <h4>Events We Decorate</h4>
          <ul>
            {CATEGORIES.map(c => (
              <li key={c.name}><Link to={`/gallery?category=${encodeURIComponent(c.name)}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contact">Book Now</Link></li>
            <li><Link to="/admin/login">Owner Login</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="contact-list">
            <li>📍 <a href={SITE.mapUrl} target="_blank" rel="noreferrer">{SITE.address}</a></li>
            <li>📞 <a href={SITE.tel}>{SITE.phone}</a></li>
            <li>⏰ {SITE.hours}</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
      </div>
    </footer>
  )
}
