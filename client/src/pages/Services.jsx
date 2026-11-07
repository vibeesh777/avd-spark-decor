import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { WhatsAppIcon } from '../components/BrandIcons'
import SectionHead from '../components/SectionHead'
import BookingOptions from '../components/BookingOptions'
import Lightbox from '../components/Lightbox'
import useDesigns from '../hooks/useDesigns'
import useMeta from '../hooks/useMeta'
import useReveal from '../hooks/useReveal'
import { SITE, waLink, FEATURE_SERVICES, TEDDY_PLANS, MASCOTS, MACHINES, PERFECT_FOR, A_TO_Z, VISION, MISSION } from '../config/site'

const [DJ, TEDDY, SPRAY] = FEATURE_SERVICES

/** Photos the owner uploaded in the admin panel under this service's category. */
function PhotoStrip({ designs, category }) {
  const [open, setOpen] = useState(null)
  const images = (designs || []).filter(d => d.category === category).flatMap(d => d.images || [])
  if (!images.length) return null
  return (
    <>
      <div className="photo-strip reveal">
        {images.map((src, i) => (
          <button key={src} onClick={() => setOpen(i)} aria-label={`${category} photo ${i + 1}`}><img src={src} alt="" loading="lazy" /></button>
        ))}
      </div>
      {open !== null && <Lightbox images={images} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </>
  )
}

export default function Services() {
  useMeta('Services & Rentals', `DJ music setup, teddy mascot dancers, paper spray confetti machines and A to Z event services by ${SITE.name}, ${SITE.address}.`)
  const designs = useDesigns()
  useReveal(designs)
  const { hash } = useLocation()

  useEffect(() => {            // jump to #dj / #teddy / #spray when coming from the home page
    if (!hash) return
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <div className="page">
      <div className="container">
        <SectionHead as="h1" eyebrow="A to Z event services" title="Services &" accent="Rentals"
          sub={SITE.tagline} />

        {/* DJ */}
        <section id="dj" className="svc-block reveal">
          <img src={DJ.img} alt={DJ.title} loading="lazy" className="svc-photo tall" />
          <div className="svc-text">
            <span className="eyebrow">{DJ.icon} Music &amp; lights</span>
            <h2 className="sub-title">{DJ.title}</h2>
            <p className="muted">{DJ.desc}</p>
            <ul className="tick-list"><li>DJ sound system &amp; music</li><li>Stage lighting &amp; smoke effects</li><li>Birthdays, weddings, receptions &amp; surprise parties</li></ul>
            <a className="btn-gold" target="_blank" rel="noreferrer" href={waLink('Hi! I want to book the DJ Music Setup for my event.')}><WhatsAppIcon size={18} /> Order DJ on WhatsApp</a>
          </div>
        </section>

        <PhotoStrip designs={designs} category="DJ Setup" />

        {/* TEDDY */}
        <section id="teddy" className="svc-block flip reveal">
          <img src={TEDDY.img} alt="Panda, gorilla and blue fox mascot costumes" loading="lazy" className="svc-photo" />
          <div className="svc-text">
            <span className="eyebrow">{TEDDY.icon} Special event offer</span>
            <h2 className="sub-title">{TEDDY.title}</h2>
            <p className="muted">{TEDDY.desc}</p>
            <div className="tag-row">{MASCOTS.map(m => <span key={m} className="tag">{m}</span>)}</div>
          </div>
        </section>
        <div className="plan-grid">
          {TEDDY_PLANS.map(p => (
            <div key={p.count} className={`plan-card reveal ${p.best ? 'best' : ''}`}>
              {p.best && <span className="plan-flag">Popular</span>}
              <h3>{p.count} Teddy{p.count > 1 ? 's' : ''}</h3>
              <p className="plan-hours">{p.hours}</p>
              <p className="plan-price gold-text">{p.price}</p>
              <a className="btn-outline" target="_blank" rel="noreferrer"
                href={waLink(`Hi! I want to book ${p.count} teddy dancer${p.count > 1 ? 's' : ''} for ${p.hours} (${p.price}).`)}><WhatsAppIcon size={16} /> Order on WhatsApp</a>
            </div>
          ))}
        </div>

        <PhotoStrip designs={designs} category="Teddy Dancers" />

        {/* SPRAY */}
        <section id="spray" className="svc-block reveal" style={{ marginTop: 80 }}>
          <div className="svc-text">
            <span className="eyebrow">{SPRAY.icon} Grand entries &amp; effects</span>
            <h2 className="sub-title">{SPRAY.title}</h2>
            <p className="muted">{SPRAY.desc}</p>
            <a className="btn-gold" target="_blank" rel="noreferrer" href={waLink('Hi! I want to book a paper spray / confetti machine for my event.')}><WhatsAppIcon size={18} /> Ask about machines</a>
          </div>
        </section>
        <div className="machine-grid">
          {MACHINES.map(m => (
            <article key={m.name} className="machine-card reveal">
              <img src={m.img} alt={m.name} loading="lazy" />
              <h3>{m.name}</h3>
              <p>{m.desc}</p>
            </article>
          ))}
        </div>

        <PhotoStrip designs={designs} category="Paper Spray" />

        {/* PERFECT FOR */}
        <div className="center reveal" style={{ marginTop: 80 }}>
          <p className="eyebrow">Perfect for</p>
          <div className="tag-row" style={{ justifyContent: 'center' }}>{PERFECT_FOR.map(t => <span key={t} className="chip">{t}</span>)}</div>
        </div>

        {/* A TO Z */}
        <div style={{ marginTop: 90 }}>
          <SectionHead eyebrow="One roof" title="We Provide" accent="A to Z Services" />
          <ul className="az-grid reveal">{A_TO_Z.map(s => <li key={s}>{s}</li>)}</ul>
        </div>

        {/* VISION / MISSION */}
        <div className="vm-grid">
          <div className="why-card reveal"><h3>Vision</h3><p>{VISION}</p></div>
          <div className="why-card reveal"><h3>Mission</h3><p>{MISSION}</p></div>
        </div>

        {/* BOOK */}
        <div className="form-card narrow-card reveal" style={{ marginTop: 80 }}>
          <h2>Order your services</h2>
          <BookingOptions />
        </div>
      </div>
    </div>
  )
}
