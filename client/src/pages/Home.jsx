import { Link } from 'react-router-dom'
import useDesigns from '../hooks/useDesigns'
import useFavorites from '../hooks/useFavorites'
import useMeta from '../hooks/useMeta'
import useReveal from '../hooks/useReveal'
import { WhatsAppIcon } from '../components/BrandIcons'
import SectionHead from '../components/SectionHead'
import DesignCard from '../components/DesignCard'
import { SITE, waLink, CATEGORIES, FEATURE_SERVICES, HIGHLIGHTS, WHY_US, STEPS, PACKAGES, TESTIMONIALS, FAQ } from '../config/site'

export default function Home() {
  useMeta()
  const designs = useDesigns()
  const fav = useFavorites()
  useReveal(designs)

  const featured = designs && [...designs].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 6)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="sparkles" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
        <div className="hero-content">
          <img src="/logo.png" alt={`${SITE.name} ${SITE.suffix}, ${SITE.city}`} className="hero-logo" width="640" height="427" fetchpriority="high" />
          <p className="hero-sub">
            Crafting unforgettable memories through the art of decoration.<br />
            Weddings · Birthdays · Baby Showers · Puberty Functions &amp; More
          </p>
          <div className="hero-actions">
            <Link to="/gallery" className="btn-gold">Explore Designs</Link>
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

      {/* EVENTS */}
      <section className="section" id="events">
        <div className="container">
          <SectionHead eyebrow="What we celebrate" title="Events We" accent="Decorate" />
          <div className="cat-grid">
            {CATEGORIES.map(c => (
              <Link key={c.name} to={`/gallery?category=${encodeURIComponent(c.name)}`} className="cat-card reveal">
                <span className="cat-icon">{c.icon}</span>
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <span className="cat-arrow">→</span>
              </Link>
            ))}
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

      {/* FEATURED */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Portfolio highlights" title="Featured" accent="Designs" />
          {!featured ? (
            <div className="design-grid">{Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton" />)}</div>
          ) : featured.length === 0 ? (
            <div className="empty-state"><p>✨ Designs coming soon.</p><Link to="/contact" className="btn-outline">Contact Us</Link></div>
          ) : (
            <div className="design-grid">
              {featured.map(d => <DesignCard key={d.id} design={d} favorite={fav.has(d.id)} onToggleFavorite={fav.toggle} />)}
            </div>
          )}
          <div className="center mt"><Link to="/gallery" className="btn-outline">View Full Gallery →</Link></div>
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

      {/* PACKAGES */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Decor packages" title="Choose Your" accent="Style"
            sub="Every package is customised to your venue, theme and budget." />
          <div className="pkg-grid">
            {PACKAGES.map(p => (
              <div key={p.name} className={`pkg-card reveal ${p.featured ? 'featured' : ''}`}>
                <span className="pkg-tag">{p.tag}</span>
                <h3>{p.name}</h3>
                <ul>{p.items.map(i => <li key={i}>{i}</li>)}</ul>
                <a href={waLink(`Hi! I'm interested in the ${p.name} decoration package.`)} target="_blank" rel="noreferrer"
                  className={p.featured ? 'btn-gold' : 'btn-outline'}>Get a Quote</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section alt">
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
      <section className="section">
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
          <p>Browse the gallery, pick your favourite design and place your order on WhatsApp or Instagram.<br />We’ll make your dream event a beautiful reality.</p>
          <div className="hero-actions">
            <Link to="/gallery" className="btn-gold">Browse Gallery</Link>
            <a href={waLink()} target="_blank" rel="noreferrer" className="btn-outline"><WhatsAppIcon size={18} /> Order on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  )
}
