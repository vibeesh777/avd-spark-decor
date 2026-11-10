import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import usePhotos from '../hooks/usePhotos'
import useMeta from '../hooks/useMeta'
import useReveal from '../hooks/useReveal'
import Lightbox from '../components/Lightbox'
import BookingOptions from '../components/BookingOptions'
import NotFound from './NotFound'
import { FUNCTIONS, SITE } from '../config/site'

/** /gallery/wedding, /gallery/puberty-function … → every photo of that function. */
export default function FunctionPage() {
  const { slug } = useParams()
  const fn = FUNCTIONS.find(f => f.slug === slug)
  const all = usePhotos()
  const images = (fn && all?.[fn.name]) || []
  const [open, setOpen] = useState(null)

  useMeta(fn && `${fn.name} Decoration Photos`, fn && `${fn.name} photos by ${SITE.name}, ${SITE.address}. See all our ${fn.name.toLowerCase()} work.`)
  useReveal(`${slug}|${images.length}`)

  if (!fn) return <NotFound />

  return (
    <div className="page">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb"><Link to="/gallery">Gallery</Link> / {fn.name}</nav>
        <div className="section-head">
          <p className="eyebrow">{fn.icon} {fn.desc}</p>
          <h1 className="section-title">{fn.name} <span className="gold-text">Photos</span></h1>
          <div className="divider" />
          {all && <p className="section-sub">{images.length ? `${images.length} photo${images.length > 1 ? 's' : ''}` : 'Photos coming soon'}</p>}
        </div>

        <div className="fn-tabs">
          {FUNCTIONS.map(f => <Link key={f.slug} to={`/gallery/${f.slug}`} className={`chip ${f.slug === slug ? 'active' : ''}`}>{f.name}</Link>)}
        </div>

        {!all ? <div className="spinner" /> : images.length === 0 ? (
          <div className="empty-state"><div className="big">{fn.icon}</div><h3>Photos coming soon</h3><p>Message us on WhatsApp to see more {fn.name.toLowerCase()} work.</p></div>
        ) : (
          <div className="photo-wall">
            {images.map((src, i) => (
              <button key={src} className="reveal" onClick={() => setOpen(i)} aria-label={`${fn.name} photo ${i + 1}`}>
                <img src={src} alt={`${fn.name} decoration ${i + 1}`} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        )}

        <div className="form-card narrow-card reveal" style={{ marginTop: 70 }}>
          <h2>Want this for your event?</h2>
          <BookingOptions message={`Hi! I like your ${fn.name} decoration photos. I want to book for my event.`} />
        </div>
      </div>
      {open !== null && <Lightbox images={images} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </div>
  )
}
