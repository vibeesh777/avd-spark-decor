import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import useDesigns from '../hooks/useDesigns'
import useFavorites from '../hooks/useFavorites'
import useMeta from '../hooks/useMeta'
import useReveal from '../hooks/useReveal'
import SectionHead from '../components/SectionHead'
import DesignCard from '../components/DesignCard'
import { CATEGORIES } from '../config/site'

const TABS = ['All', ...CATEGORIES.map(c => c.name)]

export default function Gallery() {
  useMeta('Design Gallery', 'Browse wedding, birthday, baby shower, puberty function and engagement decoration designs.')
  const designs = useDesigns()
  const fav = useFavorites()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const category = params.get('category') || 'All'
  const savedOnly = params.get('saved') === '1'

  const update = patch => {
    const next = Object.fromEntries(params)
    Object.entries(patch).forEach(([k, v]) => (v ? (next[k] = v) : delete next[k]))
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    if (!designs) return null
    const q = query.trim().toLowerCase()
    return designs.filter(d =>
      (category === 'All' || d.category === category) &&
      (!savedOnly || fav.ids.includes(d.id)) &&
      (!q || `${d.title} ${d.category} ${(d.tags || []).join(' ')}`.toLowerCase().includes(q)))
  }, [designs, category, savedOnly, query, fav.ids])

  useReveal(`${category}|${savedOnly}|${query}|${list?.length}`)

  return (
    <div className="page">
      <div className="container">
        <SectionHead as="h1" eyebrow="Our portfolio" title="Design" accent="Gallery"
          sub="Browse our curated collection and select the perfect design for your special occasion." />

        <div className="toolbar">
          <div className="chips" aria-label="Event category">
            {TABS.map(t => (
              <button key={t} aria-pressed={category === t}
                className={`chip ${category === t ? 'active' : ''}`}
                onClick={() => update({ category: t === 'All' ? '' : t })}>{t}</button>
            ))}
          </div>
          <div className="tool-right">
            <input type="search" className="search" placeholder="Search designs…" value={query}
              onChange={e => setQuery(e.target.value)} aria-label="Search designs" />
            <button className={`chip ${savedOnly ? 'active' : ''}`} aria-pressed={savedOnly}
              onClick={() => update({ saved: savedOnly ? '' : '1' })}>♥ Saved ({fav.ids.length})</button>
          </div>
        </div>

        {!list ? (
          <div className="design-grid">{Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton" />)}</div>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <div className="big">✨</div>
            <h3>{savedOnly ? 'No saved designs yet' : 'No designs found'}</h3>
            <p>{savedOnly ? 'Tap the ♡ on any design to save it here.' : 'Try another category or contact us for a custom design!'}</p>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        ) : (
          <>
            <p className="result-count">{list.length} design{list.length > 1 ? 's' : ''}</p>
            <div className="design-grid">
              {list.map(d => <DesignCard key={d.id} design={d} favorite={fav.has(d.id)} onToggleFavorite={fav.toggle} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
