import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useDesigns from '../hooks/useDesigns'
import useFavorites from '../hooks/useFavorites'
import useMeta from '../hooks/useMeta'
import useReveal from '../hooks/useReveal'
import BookingOptions from '../components/BookingOptions'
import DesignCard from '../components/DesignCard'
import Lightbox from '../components/Lightbox'
import { useToast } from '../context/ToastContext'

export default function DesignDetail() {
  const { id } = useParams()
  const designs = useDesigns()
  const fav = useFavorites()
  const { showToast } = useToast()
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)

  const design = designs?.find(d => d.id === id)
  const related = designs && design ? designs.filter(d => d.category === design.category && d.id !== id).slice(0, 3) : []

  useMeta(design?.title && design.title.replace(/^./, c => c.toUpperCase()), design && `${design.category} decoration design by AVD Spark Decor. Book this look for your event.`)
  useReveal(id + (designs ? 1 : 0))
  useEffect(() => setActive(0), [id])

  const share = async () => {
    const data = { title: design.title, text: `Check out this ${design.category} decoration design`, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(data)
      else { await navigator.clipboard.writeText(data.url); showToast('Link copied!') }
    } catch { /* user cancelled */ }
  }

  if (!designs) return <div className="page"><div className="spinner" /></div>
  if (!design) return (
    <div className="page"><div className="container empty-state">
      <div className="big">🔍</div><h3>Design not found</h3>
      <Link to="/gallery" className="btn-outline">← Back to Gallery</Link>
    </div></div>
  )

  const images = design.images || []

  return (
    <div className="page">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/gallery">Gallery</Link> / <Link to={`/gallery?category=${encodeURIComponent(design.category)}`}>{design.category}</Link>
        </nav>

        <div className="detail-grid">
          <div className="gallery-view">
            <button className="main-img" onClick={() => images.length && setZoom(true)} aria-label="Enlarge image">
              {images[active] ? <img src={images[active]} alt={design.title} decoding="async" /> : <div className="design-placeholder">✨</div>}
              <span className="zoom-hint">⤢ Tap to enlarge</span>
            </button>
            {images.length > 1 && (
              <div className="thumbs">
                {images.map((src, i) => (
                  <button key={src} className={i === active ? 'active' : ''} onClick={() => setActive(i)} aria-label={`Photo ${i + 1}`}>
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-side">
            <span className="design-category">{design.category}</span>
            <h1 className="detail-title">{design.title}</h1>
            {design.price && <p className="design-price big-price">{design.price}</p>}
            {design.description && <p className="muted">{design.description}</p>}
            {design.tags?.length > 0 && <div className="tag-row">{design.tags.map(t => <span key={t} className="tag">#{t}</span>)}</div>}

            <div className="detail-actions">
              <button className={`chip ${fav.has(id) ? 'active' : ''}`} onClick={() => fav.toggle(id)} aria-pressed={fav.has(id)}>
                {fav.has(id) ? '♥ Saved' : '♡ Save'}
              </button>
              <button className="chip" onClick={share}>↗ Share</button>
            </div>

            <div className="form-card" id="book">
              <h2>Book this design</h2>
              <p className="muted book-intro">Order on WhatsApp or Instagram — tell us your date and venue.</p>
              <BookingOptions design={design} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="related">
            <h2 className="sub-title">More <span className="gold-text">{design.category}</span> designs</h2>
            <div className="design-grid">
              {related.map(d => <DesignCard key={d.id} design={d} favorite={fav.has(d.id)} onToggleFavorite={fav.toggle} />)}
            </div>
          </section>
        )}
      </div>
      {zoom && <Lightbox images={images} index={active} onChange={setActive} onClose={() => setZoom(false)} />}
    </div>
  )
}
