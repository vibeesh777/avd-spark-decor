import { SITE, waLink } from '../config/site'
import { WhatsAppIcon, InstagramIcon } from './BrandIcons'

/**
 * Orders are placed on WhatsApp (any of the 3 numbers) or Instagram.
 * Phone calls are for emergencies only (numbers 2 and 3).
 * Pass `design` / `message` to pre-fill the WhatsApp text.
 */
export default function BookingOptions({ design, message: custom }) {
  const message = custom ? custom : design
    ? `Hi! I'd like to book this decoration: ${design.title} (${design.category}). ${window.location.href}`
    : 'Hi! I want to book a decoration for my event.'

  return (
    <div className="book-options">
      <p className="book-label">Place your order on WhatsApp</p>
      {SITE.phones.map(p => (
        <a key={p.number} className="book-btn wa" href={waLink(message, p.number)} target="_blank" rel="noreferrer">
          <span className="bi"><WhatsAppIcon /></span>
          <span><strong>+91 {p.label}</strong><small>{p.main ? 'Main WhatsApp number' : 'WhatsApp orders & enquiries'}</small></span>
        </a>
      ))}
      {SITE.instagramDM && (
        <a className="book-btn ig" href={SITE.instagramDM} target="_blank" rel="noreferrer">
          <span className="bi"><InstagramIcon /></span>
          <span><strong>Instagram</strong><small>@{SITE.instagramHandle}</small></span>
        </a>
      )}

      <p className="book-label urgent">🚨 Emergency? Call us</p>
      {SITE.callPhones.map(p => (
        <a key={p.number} className="book-btn call" href={`tel:+${p.number}`}>
          <span className="bi">📞</span>
          <span><strong>+91 {p.label}</strong><small>Emergency calls only</small></span>
        </a>
      ))}
      <p className="book-note muted">⏰ {SITE.hours}</p>
    </div>
  )
}
