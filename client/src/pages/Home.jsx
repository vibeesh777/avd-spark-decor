import { Link } from 'react-router-dom'
import usePhotos from '../hooks/usePhotos'
import useMeta from '../hooks/useMeta'
import useReveal from '../hooks/useReveal'
import SectionHead from '../components/SectionHead'
import FunctionCard from '../components/FunctionCard'
import { WhatsAppIcon } from '../components/BrandIcons'
import { SITE, waLink, FUNCTIONS, FEATURE_SERVICES, HIGHLIGHTS, WHY_US, STEPS, TESTIMONIALS, FAQ } from '../config/site'

export default function Home() {
  useMeta()
  const photos = usePhotos()
  useReveal(photos)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="sparkles" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
        <div className="hero-content">
          <img src="/logo.png" alt={`${SITE.name} ${SITE.suffix}, ${SITE.city}`} className="hero-logo" width="640" height="427" />
          <p className="hero-sub">
            {SITE.tagline}<br />
            Weddings · Birthdays · Baby Showers · Puberty Functions · DJ · Teddy Dancers
          </p>
          <div className="hero-actions">
            <Link to="/gallery" className="btn-gold">View Gallery</Link>
            <a href={waLink()} target="_blank" rel="noreferrer" className="btn-outline"><WhatsAppIcon size={18} /> Chat on WhatsApp</a>
          </div>
        </div>
        <a href="#events" className="scroll-hint" aria-label="Scroll down"><span /></a>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...HIGHLIGHTS, ...HIGHLIGHTS].map((h, i) => <span key={i}>✦ {h}</span>)}
        </div>
      </div>

      {/* FUNCTIONS — touch one to see all its photos */}
      <section className="section" id="events">
        <div className="container">
          <SectionHead eyebrow="Touch a function to see all photos" title="Events We" accent="Decorate" />
          <div className="fn-grid">
            {FUNCTIONS.filter(f => !f.service).map(f => <FunctionCard key={f.slug} fn={f} photos={photos?.[f.name]} />)}
          </div>
        </div>
      </section>

      {/* EXTRA SERVICES */}
      <section className="section alt">
        <div className="container">
          <SectionHead eyebrow="Beyond decoration" title="Make It" accent="Unforgettable"
            sub="DJ, dancing teddies and confetti effects — book them with your decor." />
          <div className="svc-teaser">
            {FEATURE_SERVICES.map(f => (
              <Link key={f.id} to={`/services#${f.id}`} className="svc-card reveal">
                <img src={f.img} alt={f.title} loading="lazy" />
                <div className="svc-card-body"><span className="svc-icon">{f.icon}</span><h3>{f.title}</h3><p>{f.desc}</p><span className="svc-more">Details &amp; prices →</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="container">
          <SectionHead title="Why Choose" accent="AVD?" />
          <div className="why-grid">
            {WHY_US.map(w => (
              <div key={w.title} className="why-card reveal">
                <span className="why-icon">{w.icon}</span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section alt">
        <div className="container">
          <SectionHead eyebrow="Simple process" title="How It" accent="Works" />
          <ol className="steps">
            {STEPS.map(s => (
              <li key={s.n} className="step reveal">
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="What clients say" title="Happy" accent="Memories" />
          <div className="testi-grid">
            {TESTIMONIALS.map(t => (
              <figure key={t.name} className="testi-card reveal">
                <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>“{t.text}”</blockquote>
                <figcaption><span className="avatar">{t.name[0]}</span><span><strong>{t.name}</strong><small>{t.event}</small></span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section alt">
        <div className="container narrow">
          <SectionHead eyebrow="Good to know" title="Frequently Asked" accent="Questions" />
          <div className="faq reveal">
            {FAQ.map(f => (
              <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container reveal">
          <h2>Ready to Create <span className="gold-text">Magic?</span></h2>
          <p>Browse the gallery, pick your favourite function and place your order on WhatsApp or Instagram.<br />We’ll make your dream event a beautiful reality.</p>
          <div className="hero-actions">
            <Link to="/gallery" className="btn-gold">Browse Gallery</Link>
            <a href={waLink()} target="_blank" rel="noreferrer" className="btn-outline"><WhatsAppIcon size={18} /> Order on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  )
}
