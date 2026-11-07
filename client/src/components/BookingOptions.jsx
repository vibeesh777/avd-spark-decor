import { SITE, waLink } from '../config/site'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
  </svg>
)

/**
 * Bookings are taken ONLY by phone call, WhatsApp or Instagram.
 * Pass `design` to pre-fill the WhatsApp message with the chosen design.
 */
export default function BookingOptions({ design }) {
  const message = design
    ? `Hi! I'd like to book this decoration: ${design.title} (${design.category}). ${window.location.href}`
    : 'Hi! I want to book a decoration for my event.'

  return (
    <div className="book-options">
      <a className="book-btn call" href={SITE.tel}>
        <span className="bi">📞</span>
        <span><strong>Call us</strong><small>{SITE.phone}</small></span>
      </a>
      <a className="book-btn wa" href={waLink(message)} target="_blank" rel="noreferrer">
        <span className="bi"><WhatsAppIcon /></span>
        <span><strong>WhatsApp</strong><small>{design ? 'Send this design to us' : 'Chat with us'}</small></span>
      </a>
      {SITE.instagramDM && (
        <a className="book-btn ig" href={SITE.instagramDM} target="_blank" rel="noreferrer">
          <span className="bi">📸</span>
          <span><strong>Instagram</strong><small>@{SITE.instagramHandle}</small></span>
        </a>
      )}
      <p className="book-note muted">⏰ {SITE.hours}</p>
    </div>
  )
}
