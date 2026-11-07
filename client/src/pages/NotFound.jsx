import { Link } from 'react-router-dom'
import useMeta from '../hooks/useMeta'

export default function NotFound() {
  useMeta('Page not found')
  return (
    <div className="page"><div className="container empty-state">
      <div className="big">✨</div>
      <h1 className="section-title">Page not <span className="gold-text">found</span></h1>
      <p>The page you’re looking for doesn’t exist or has moved.</p>
      <Link to="/" className="btn-gold">Back to Home</Link>
    </div></div>
  )
}
