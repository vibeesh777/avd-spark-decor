import { Link } from 'react-router-dom'
import { SITE, CATEGORIES } from '../config/site'
import { WhatsAppIcon, InstagramIcon } from './BrandIcons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img src="/logo.png" alt={`${SITE.name} ${SITE.suffix}`} className="footer-logo" loading="lazy" width="220" height="147" />
          <p className="muted">{SITE.tagline}</p>
          <div className="social-row">
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="social-btn"><WhatsAppIcon size={15} /> WhatsApp</a>
            {SITE.instagram && <a href={SITE.instagram} target="_blank" rel="noreferrer" className="social-btn"><InstagramIcon size={15} /> Instagram</a>}
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
            <li><Link to="/services">Services &amp; Rentals</Link></li>
            <li><Link to="/contact">Book Now</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="contact-list">
            <li>📍 <a href={SITE.mapUrl} target="_blank" rel="noreferrer">{SITE.address}</a></li>
            {SITE.phones.map(p => (
              <li key={p.number}><WhatsAppIcon size={16} className="ico wa" /> <a href={`https://wa.me/${p.number}`} target="_blank" rel="noreferrer">+91 {p.label}</a>
                {p.call && <> · <a href={`tel:+${p.number}`}>📞 call</a></>}</li>
            ))}
            <li className="muted"><small>WhatsApp for orders · calls for emergencies (numbers 2 &amp; 3)</small></li>
            {SITE.instagram && <li><InstagramIcon size={16} className="ico ig" /> <a href={SITE.instagram} target="_blank" rel="noreferrer">@{SITE.instagramHandle}</a></li>}
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
