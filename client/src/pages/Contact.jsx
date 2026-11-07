import SectionHead from '../components/SectionHead'
import BookingOptions from '../components/BookingOptions'
import useMeta from '../hooks/useMeta'
import useReveal from '../hooks/useReveal'
import { SITE } from '../config/site'

export default function Contact() {
  useMeta('Book Your Event', `Book your event decoration with ${SITE.name} in ${SITE.address} on WhatsApp or Instagram.`)
  useReveal()

  return (
    <div className="page">
      <div className="container">
        <SectionHead as="h1" eyebrow="Get in touch" title="Book Your" accent="Event"
          sub="Orders are placed on WhatsApp or Instagram — tell us your date, venue and the design you like. Calls are for emergencies." />

        <div className="contact-grid">
          <div className="form-card reveal">
            <h2>How to order</h2>
            <BookingOptions />
          </div>

          <aside className="contact-info reveal">
            <a className="ci" href={SITE.mapUrl} target="_blank" rel="noreferrer">
              <span className="ci-icon">📍</span><span><small>Location</small><strong>{SITE.address}</strong></span>
            </a>
            <div className="ci">
              <span className="ci-icon">⏰</span><span><small>Hours</small><strong>{SITE.hours}</strong></span>
            </div>
            <iframe title={`Map of ${SITE.address}`} className="map" src={SITE.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </aside>
        </div>
      </div>
    </div>
  )
}
