import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API, SITE_URL } from '../lib/api'
import { shrink } from '../lib/images'
import { ALL_CATEGORIES, slugify } from '../categories'
import { useAdmin, useToast } from '../context/AdminContext'
import './AdminDashboard.css'

const EMPTY = { category: '', title: '', description: '', price: '' }
const MAX_FILES = 10

export default function AdminDashboard() {
  const { adminToken, logout, isAdmin } = useAdmin()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(null)   // null = idle, 0–100 = uploading
  const [openId, setOpenId] = useState(null)       // album whose photos are being managed

  const headers = useMemo(() => ({ Authorization: `Bearer ${adminToken}` }), [adminToken])
  const previews = useMemo(() => files.map(f => URL.createObjectURL(f)), [files])
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews])

  const load = async () => {
    try { setDesigns((await axios.get(`${API}/api/designs`)).data.designs || []) }
    catch { showToast('Failed to load photos', 'error') }
    finally { setLoading(false) }
  }
  useEffect(() => { if (!isAdmin) navigate('/login'); else load() }, [isAdmin])

  /** One place for every admin request: handles expired logins and errors. */
  const send = async (method, path, data, onUploadProgress) => {
    try {
      return (await axios({ method, url: `${API}/api/designs${path}`, data, headers, onUploadProgress })).data
    } catch (e) {
      if (e.response?.status === 401) { showToast('Session expired — please log in again', 'error'); logout(); navigate('/login') }
      else showToast(e.response?.data?.message || 'Something went wrong', 'error')
      return null
    }
  }

  const pickFiles = e => {
    const list = Array.from(e.target.files)
    if (list.length > MAX_FILES) showToast(`Only the first ${MAX_FILES} photos were kept`, 'error')
    setFiles(list.slice(0, MAX_FILES))
  }

  const upload = async e => {
    e.preventDefault()
    if (!form.category) return showToast('Choose a function first', 'error')
    if (!files.length) return showToast('Choose at least one photo', 'error')
    setProgress(0)
    const fd = new FormData()
    fd.append('category', form.category)
    fd.append('title', form.title.trim() || form.category)
    if (form.description) fd.append('description', form.description)
    if (form.price) fd.append('price', form.price)
    for (const f of files) fd.append('images', await shrink(f))
    const res = await send('post', '', fd, ev => setProgress(Math.round((ev.loaded * 100) / (ev.total || 1))))
    setProgress(null)
    if (res) { showToast('Photos uploaded!'); setForm(EMPTY); setFiles([]); setShowForm(false); setCat(form.category); load() }
  }

  const addPhotos = async (id, list) => {
    if (!list.length) return
    const fd = new FormData()
    for (const f of Array.from(list).slice(0, MAX_FILES)) fd.append('images', await shrink(f))
    showToast('Uploading…')
    if (await send('put', `/${id}`, fd)) { showToast('Photos added'); load() }
  }
  const removePhoto = async (id, url) => {
    if (!confirm('Delete this photo?')) return
    const fd = new FormData(); fd.append('removeImages', JSON.stringify([url]))
    if (await send('put', `/${id}`, fd)) { showToast('Photo deleted'); load() }
  }
  const removeAlbum = async d => {
    if (!confirm(`Delete "${d.title}" and all its photos?`)) return
    if (await send('delete', `/${d.id}`)) { showToast('Deleted'); load() }
  }

  const photoCount = list => list.reduce((n, d) => n + (d.images?.length || 0), 0)
  const shown = cat === 'All' ? designs : designs.filter(d => d.category === cat)
  const stats = [
    { label: 'Albums', value: designs.length, color: 'var(--gold)' },
    { label: 'Photos', value: photoCount(designs), color: '#4a9eff' },
    { label: 'Functions with photos', value: new Set(designs.map(d => d.category)).size, color: '#4ade80' },
  ]

  return (
    <div className="admin-dash">
      <aside className="admin-sidebar">
        <div className="sidebar-logo"><span className="logo-avd">AVD</span><span className="logo-spark">Admin</span></div>
        <nav className="sidebar-nav"><button className="nav-item active"><span>📸</span>Photos</button></nav>
        <div className="sidebar-bottom">
          <a href={SITE_URL} target="_blank" rel="noreferrer" className="nav-item">← Website</a>
          <button className="nav-item logout" onClick={() => { logout(); navigate('/login') }}>🚪 Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="stats-row">
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <p className="stat-label">{s.label}</p>
              <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="section-block">
          <div className="section-header">
            <h2>Photos by function</h2>
            <button className="btn-gold" onClick={() => setShowForm(v => !v)}>{showForm ? '✕ Cancel' : '+ Upload photos'}</button>
          </div>

          {showForm && (
            <form className="add-design-form" onSubmit={upload}>
              <h3>Upload photos</h3>
              <div className="add-grid">
                <div className="form-field">
                  <label>Function *</label>
                  <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select…</option>
                    {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Album name (optional)</label>
                  <input placeholder="e.g. Royal Gold Stage" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Price (optional)</label>
                  <input placeholder="e.g. ₹15,000 onwards" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Description (optional)</label>
                  <input placeholder="Short note about this setup" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="form-field full">
                  <label>Photos * (up to {MAX_FILES}, big photos are shrunk automatically)</label>
                  <input type="file" multiple accept="image/*" onChange={pickFiles} />
                  {previews.length > 0 && <div className="photo-previews">{previews.map(u => <img key={u} src={u} alt="" />)}</div>}
                </div>
              </div>
              {progress !== null && <div className="progress"><span style={{ width: `${progress}%` }} /></div>}
              <button type="submit" className="btn-gold" disabled={progress !== null}>{progress !== null ? `Uploading ${progress}%…` : '✨ Upload'}</button>
            </form>
          )}

          <div className="admin-chips">
            {['All', ...ALL_CATEGORIES].map(c => {
              const n = photoCount(c === 'All' ? designs : designs.filter(d => d.category === c))
              return <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c} ({n})</button>
            })}
          </div>

          {loading ? <div className="spinner" /> : shown.length === 0 ? (
            <p className="empty-msg">No photos here yet. Tap “Upload photos” to add some.</p>
          ) : (
            <div className="admin-designs-grid">
              {shown.map(d => (
                <div key={d.id} className="admin-design-card">
                  <div className="admin-card-img">
                    {d.images?.[0] ? <img src={d.images[0]} alt={d.title} loading="lazy" /> : <div className="no-img">✨</div>}
                    <span className="img-count">{d.images?.length || 0} photo{d.images?.length === 1 ? '' : 's'}</span>
                  </div>
                  <div className="admin-card-info">
                    <span className="design-category">{d.category}</span>
                    <h4>{d.title}</h4>
                  </div>
                  {openId === d.id && (
                    <div className="manage-grid">
                      {(d.images || []).map(u => (
                        <div key={u} className="thumb"><img src={u} alt="" loading="lazy" /><button title="Delete photo" onClick={() => removePhoto(d.id, u)}>✕</button></div>
                      ))}
                    </div>
                  )}
                  <div className="admin-card-actions">
                    <label className="action-btn view">+ Photos
                      <input type="file" multiple accept="image/*" hidden onChange={e => { addPhotos(d.id, e.target.files); e.target.value = '' }} />
                    </label>
                    <button className="action-btn view" onClick={() => setOpenId(openId === d.id ? null : d.id)}>{openId === d.id ? 'Done' : 'Manage'}</button>
                    <a href={`${SITE_URL}/gallery/${slugify(d.category)}`} target="_blank" rel="noreferrer" className="action-btn view">View</a>
                    <button className="action-btn delete" onClick={() => removeAlbum(d)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
