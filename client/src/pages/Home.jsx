import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Home.css'

const CATEGORIES = [
  { name: 'Wedding', icon: '💍', desc: 'Timeless elegance' },
  { name: 'Birthday', icon: '🎂', desc: 'Colorful celebrations' },
  { name: 'Baby Shower', icon: '🍼', desc: 'Sweet beginnings' },
  { name: 'Puberty Function', icon: '🌸', desc: 'A sacred milestone' },
  { name: 'Surprise Party', icon: '🎉', desc: 'Magical moments' },
  { name: 'Engagement', icon: '💑', desc: 'Love in bloom' },
]

const TESTIMONIALS = [
  { name: 'Priya Rajan', event: 'Wedding', text: 'AVD Spark Decor transformed our wedding hall into a fairy tale. Every detail was perfect, and the floral arrangements were breathtaking!' },
  { name: 'Kavitha S.', event: 'Baby Shower', text: 'I was completely surprised by how beautiful everything looked. The team was professional and delivered beyond expectations.' },
  { name: 'Arun Kumar', event: 'Birthday', text: 'My son\'s birthday party was absolutely magical. The balloon decorations and theme setup were exactly what we imagined!' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/designs?limit=6')
      .then(res => setFeatured(res.data.designs?.slice(0, 6) || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-particles" />
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">Welcome to</p>
          <h1 className="hero-title">
            <span className="hero-avd">AVD</span>
            <span className="hero-spark">Spark Decor</span>
          </h1>
          <div className="divider" style={{margin: '24px auto'}} />
          <p className="hero-subtitle">
            Crafting unforgettable memories through the art of decoration.<br />
            Weddings · Birthdays · Baby Showers · Puberty Functions & More
          </p>
          <div className="hero-actions">
            <Link to="/gallery" className="btn-gold">Explore Designs</Link>
            <Link to="/contact" className="btn-outline">Get in Touch</Link>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll to discover</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories-section">
        <div className="container">
          <p className="section-eyebrow">What we celebrate</p>
          <h2 className="section-title">Events We <span className="gold-text">Decorate</span></h2>
          <div className="divider" style={{margin: '12px auto 48px'}} />
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link to={`/gallery?category=${encodeURIComponent(cat.name)}`} key={cat.name} className="cat-card">
                <div className="cat-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
                <span className="cat-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DESIGNS */}
      <section className="section featured-section">
        <div className="container">
          <p className="section-eyebrow">Portfolio highlights</p>
          <h2 className="section-title">Featured <span className="gold-text">Designs</span></h2>
          <div className="divider" style={{margin: '12px auto 48px'}} />
          {loading ? (
            <div className="spinner" />
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <p>✨ Designs coming soon. Check back later!</p>
              <Link to="/contact" className="btn-outline" style={{marginTop: 20}}>Contact Us</Link>
            </div>
          ) : (
            <div className="designs-grid">
              {featured.map(design => (
                <Link to={`/gallery/${design.id}`} key={design.id} className="design-card">
                  <div className="design-img-wrap">
                    {design.images?.[0] ? (
                      <img src={design.images[0]} alt={design.title} loading="lazy" />
                    ) : (
                      <div className="design-img-placeholder">
                        <span>✨</span>
                      </div>
                    )}
                    <div className="design-overlay">
                      <span className="view-btn">View Design</span>
                    </div>
                  </div>
                  <div className="design-info">
                    <span className="design-category">{design.category}</span>
                    <h3 className="design-title">{design.title}</h3>
                    <span className="design-price">{design.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div style={{textAlign: 'center', marginTop: 48}}>
            <Link to="/gallery" className="btn-outline">View Full Gallery →</Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section why-section">
        <div className="container">
          <h2 className="section-title">Why Choose <span className="gold-text">AVD?</span></h2>
          <div className="divider" style={{margin: '12px auto 48px'}} />
          <div className="why-grid">
            {[
              { icon: '🎨', title: 'Custom Designs', desc: 'Every event is unique. We create designs tailored exclusively for you.' },
              { icon: '⭐', title: 'Premium Quality', desc: 'Only the finest flowers, fabrics and materials for every decoration.' },
              { icon: '⏱️', title: 'On-Time Delivery', desc: 'We respect your timeline and deliver flawless setups every time.' },
              { icon: '💬', title: 'Personal Support', desc: 'Dedicated consultation from design to execution with your vision at heart.' },
            ].map(w => (
              <div key={w.title} className="why-card">
                <div className="why-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials-section">
        <div className="container">
          <p className="section-eyebrow">What clients say</p>
          <h2 className="section-title">Happy <span className="gold-text">Memories</span></h2>
          <div className="divider" style={{margin: '12px auto 48px'}} />
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.event}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Create <span className="gold-text">Magic?</span></h2>
          <p>Browse our gallery, pick your favorite design, and send us a request.<br />We'll make your dream event a beautiful reality.</p>
          <Link to="/gallery" className="btn-gold" style={{fontSize: 14}}>Browse Gallery & Book</Link>
        </div>
      </section>
    </div>
  )
}
