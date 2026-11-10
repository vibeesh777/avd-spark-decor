import { Link } from 'react-router-dom'

/** Tile for one function: cover photo + photo count. Touching it opens all photos of that function. */
export default function FunctionCard({ fn, photos }) {
  const cover = photos?.[0]
  return (
    <Link to={`/gallery/${fn.slug}`} className="fn-card reveal">
      {cover
        ? <img src={cover} alt={`${fn.name} decoration`} loading="lazy" decoding="async" />
        : <div className="fn-ph">{fn.icon}</div>}
      <div className="fn-body">
        <h3><span>{fn.icon}</span> {fn.name}</h3>
        <p>{fn.desc}</p>
        <span className="fn-count">{photos?.length ? `${photos.length} photo${photos.length > 1 ? 's' : ''} →` : 'View →'}</span>
      </div>
    </Link>
  )
}
