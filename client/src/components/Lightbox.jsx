import { useEffect } from 'react'

/** Full-screen image viewer with keyboard (← → Esc) support. */
export default function Lightbox({ images, index, onClose, onChange }) {
  const next = () => onChange((index + 1) % images.length)
  const prev = () => onChange((index - 1 + images.length) % images.length)

  useEffect(() => {
    const key = e => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', key)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = '' }
  })

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="lb-close" onClick={onClose} aria-label="Close">✕</button>
      {images.length > 1 && <button className="lb-nav lb-prev" onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous">‹</button>}
      <img src={images[index]} alt="" onClick={e => e.stopPropagation()} />
      {images.length > 1 && <button className="lb-nav lb-next" onClick={e => { e.stopPropagation(); next() }} aria-label="Next">›</button>}
      {images.length > 1 && <span className="lb-count">{index + 1} / {images.length}</span>}
    </div>
  )
}
