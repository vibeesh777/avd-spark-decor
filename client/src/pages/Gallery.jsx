import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import './Gallery.css'

const CATEGORIES = ['All', 'Wedding', 'Birthday', 'Baby Shower', 'Puberty Function', 'Surprise Party', 'Engagement']

export default function Gallery() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'All'

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/designs${activeCategory !== 'All' ? `?category=${encodeURIComponent(activeCategory)}` : ''}`)
      .then(res => setDesigns(res.data.designs || []))
      .catch(() => setDesigns([]))
      .finally(() => setLoading(false))
  }, [activeCategory])

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <p className="section-eyebrow">Our portfolio</p>
        <h1 className="section-title">Design <span className="gold-text">Gallery</span></h1>
        <div className="divider" style={{margin: '12px auto 24px'}} />
        <p style={{color: 'var(--white-muted)', fontSize: 15, textAlign: 'center', maxWidth: 480, margin: '0 auto'}}>
          Browse our curated collection and select the perfect design for your special occasion.
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="gallery-filters">
        <div className="filter-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{paddingBottom: 80}}>
        {loading ? (
          <div className="spinner" />
        ) : designs.length === 0 ? (
          <div className="empty-state" style={{padding: '80px 20px'}}>
            <div style={{fontSize: 48, marginBottom: 16}}>✨</div>
            <h3 style={{marginBottom: 8, color: 'var(--gold)'}}>No designs yet</h3>
            <p>Designs for this category will be added soon. Contact us for a custom design!</p>
            <Link to="/contact" className="btn-outline" style={{marginTop: 24, display: 'inline-flex'}}>Contact Owner</Link>
          </div>
        ) : (
          <div className="gallery-grid">
            {designs.map((design, i) => (
              <Link
                to={`/gallery/${design.id}`}
                key={design.id}
                className={`gallery-item ${i % 7 === 0 || i % 7 === 4 ? 'large' : ''}`}
              >
                <div className="gallery-img-wrap">
                  {design.images?.[0] ? (
                    <img src={design.images[0]} alt={design.title} loading="lazy" />
                  ) : (
                    <div className="gallery-img-placeholder">✨</div>
                  )}
                  <div className="gallery-item-overlay">
                    <span className="gallery-item-category">{design.category}</span>
                    <h3 className="gallery-item-title">{design.title}</h3>
                    <span className="gallery-item-cta">View & Request →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
