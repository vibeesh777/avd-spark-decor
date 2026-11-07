import { Link } from 'react-router-dom'

const onImgError = e => { e.currentTarget.style.visibility = 'hidden' }

export default function DesignCard({ design, favorite, onToggleFavorite }) {
  const img = design.images?.[0]
  return (
    <article className="design-card reveal">
      <Link to={`/gallery/${design.id}`} className="design-img-wrap" aria-label={`View ${design.title}`}>
        {img ? <img src={img} alt={design.title} loading="lazy" decoding="async" onError={onImgError} />
             : <div className="design-placeholder">✨</div>}
        <span className="design-overlay"><span className="view-btn">View Design</span></span>
        {design.images?.length > 1 && <span className="photo-count">{design.images.length} photos</span>}
      </Link>
      {onToggleFavorite && (
        <button className={`heart ${favorite ? 'on' : ''}`} onClick={() => onToggleFavorite(design.id)}
          aria-pressed={favorite} aria-label={favorite ? 'Remove from saved' : 'Save design'}>
          {favorite ? '♥' : '♡'}
        </button>
      )}
      <div className="design-info">
        <span className="design-category">{design.category}</span>
        <h3 className="design-title">{design.title}</h3>
        {design.price && <span className="design-price">{design.price}</span>}
      </div>
    </article>
  )
}
