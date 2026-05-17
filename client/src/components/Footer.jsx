import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-avd">AVD</span>
              <span className="logo-spark">Spark Decor</span>
            </div>
            <p className="footer-tagline">Crafting unforgettable moments with<br />elegance, creativity & heart.</p>
            <div className="footer-social">
              <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP || '919876543210'}`} target="_blank" rel="noreferrer" className="social-btn">WhatsApp</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn">Instagram</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Events We Decorate</h4>
            <ul>
              {['Wedding Ceremony', 'Birthday Parties', 'Baby Shower', 'Puberty Function', 'Surprise Party', 'Engagement'].map(e => (
                <li key={e}><Link to="/gallery">{e}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/admin/login">Owner Login</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul className="contact-list">
              <li>📍 perambalur, Tamil Nadu</li>
              <li>📞 <a href="tel:+9193842 17626">91 93842 17626 </a></li>
              <li>✉️ <a href="mailto:kingvibeeshraja@gmail.com">kingvibeeshraja@gmail.com</a></li>
              <li>⏰ Mon – Sun, 9am – 8pm</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="divider" style={{marginBottom: '24px'}} />
          <p>© {new Date().getFullYear()} AVD Spark Decor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
