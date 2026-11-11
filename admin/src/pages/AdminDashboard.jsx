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
const BATCH_BYTES = 3.2 * 1024 * 1024   // stay under typical host request limits (Vercel: 4.5 MB)

/** Say what actually went wrong, not just "something went wrong". */
const describe = e => {
  if (!e.response) return "Can't reach the server. Check VITE_API_URL on this admin site, and that CLIENT_URL on the server includes this admin site's address."
  const { status, data } = e.response
  if (data?.message) return data.message
  if (status === 413) return 'The photos are too large to send together — try fewer photos at a time.'
  if (status === 404) return 'Server address not found — make sure VITE_API_URL points to the API, not the website.'
  return `Server error (${status}). Please try again.`
}

/** Split photos into groups that fit in one request. */
const toBatches = list => {
  const out = [[]]; let size = 0
  for (const f of list) {
    if (size + f.size > BATCH_BYTES && out.at(-1).length) { out.push([]); size = 0 }
    out.at(-1).push(f); size += f.size
  }
  return out
}

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
  const [editing, setEditing] = useState(null)       // album being edited in the pop-up
  const [problems, setProblems] = useState(null)   // server self-check: null = checking, [] = all good

  const headers = useMemo(() => ({ Authorization: `Bearer ${adminToken}` }), [adminToken])
  const previews = useMemo(() => files.map(f => URL.createObjectURL(f)), [files])
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews])

  const load = async () => {
    try { setDesigns((await axios.get(`${API}/api/designs?fresh=1`)).data.designs || []) }
    catch (e) { showToast(describe(e), 'error') }
    finally { setLoading(false) }
  }
  const checkServer = async () => {
    setProblems(null)
    try { setProblems((await axios.get(`${API}/api/admin/status`, { headers })).data.problems || []) }
    catch (e) {
      if (e.response?.status === 401) { showToast(e.response.data?.message || 'Please log in again.', 'error'); logout(); navigate('/login'); return }
      setProblems([e.response?.status === 404 ? 'The server is out of date — redeploy the server with the latest code.' : describe(e)])
    }
  }
  useEffect(() => { if (!isAdmin) navigate('/login'); else { load(); checkServer() } }, [isAdmin])

  /** One place for every admin request: handles expired logins and errors. */
  const send = async (method, path, data, onUploadProgress) => {
    try {
      return (await axios({ method, url: `${API}/api/designs${path}`, data, headers, onUploadProgress })).data
    } catch (e) {
      if (e.response?.status === 401) { showToast('Session expired — please log in again', 'error'); logout(); navigate('/login') }
      else showToast(describe(e), 'error')
      return null
    }
  }

  const pickFiles = e => {
    const list = Array.from(e.target.files)
    if (list.length > MAX_FILES) showToast(`Only the first ${MAX_FILES} photos were kept`, 'error')
    setFiles(list.slice(0, MAX_FILES))
  }

  /** Sends photos in small batches: the first creates the album, the rest are added to it. */
  const sendBatches = async (list, { albumId, fields }) => {
    const shrunk = []
    for (const f of list) shrunk.push(await shrink(f))
    const batches = toBatches(shrunk)
    let id = albumId
    for (let i = 0; i < batches.length; i++) {
      const fd = new FormData()
      if (!id) Object.entries(fields).forEach(([k, v]) => v && fd.append(k, v))
      batches[i].forEach(f => fd.append('images', f))
      const onProgress = ev => setProgress(Math.round(((i + ev.loaded / (ev.total || 1)) / batches.length) * 100))
      const res = id ? await send('put', `/${id}`, fd, onProgress) : await send('post', '', fd, onProgress)
      if (!res) return { ok: false, done: i }
      id = id || res.design?.id
    }
    return { ok: true, done: batches.length }
  }

  const upload = async e => {
    e.preventDefault()
    if (!form.category) return showToast('Choose a function first', 'error')
    if (!files.length) return showToast('Choose at least one photo', 'error')
    setProgress(0)
    const r = await sendBatches(files, { fields: { category: form.category, title: form.title.trim() || form.category, description: form.description, price: form.price } })
    setProgress(null)
    if (r.ok) { showToast('Photos uploaded!'); setForm(EMPTY); setFiles([]); setShowForm(false); setCat(form.category) }
    else if (r.done > 0) showToast('Only some photos were uploaded — see the message above and try the rest again', 'error')
    load()
  }

  const addPhotos = async (id, list) => {
    if (!list.length) return
    setProgress(0)
    const r = await sendBatches(Array.from(list).slice(0, MAX_FILES), { albumId: id })
    setProgress(null)
    if (r.ok) showToast('Photos added')
    load()
  }
  const removePhoto = async (id, url) => {
    if (!confirm('Delete this photo?')) return
    const fd = new FormData(); fd.append('removeImages', JSON.stringify([url]))
    if (await send('put', `/${id}`, fd)) { showToast('Photo deleted'); load() }
  }
  const openEdit = d => setEditing({ id: d.id, category: d.category, title: d.title || '', description: d.description || '', price: d.price || '' })
  const saveEdit = async e => {
    e.preventDefault()
    const fd = new FormData()
    ;['category', 'title', 'description', 'price'].forEach(k => fd.append(k, editing[k]))
    if (await send('put', `/${editing.id}`, fd)) { showToast('Changes saved'); setEditing(null); load() }
  }
  const removeAlbum = async d => {
    if (!confirm(`Delete "${d.title}" and all ${d.images?.length || 0} of its photos? This cannot be undone.`)) return
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
        {problems === null && <div className="ok-box">Checking the server…</div>}
        {problems?.length === 0 && <div className="ok-box good">✓ Server check passed — photo uploads are ready.</div>}
        {problems?.length > 0 && (
          <div className="alert-box" role="alert">
            <strong>⚠ Uploads won’t work until this is fixed</strong>
            <ul>{problems.map(p => <li key={p}>{p}</li>)}</ul>
            <details>
              <summary>Show me how to fix it (about 5 minutes)</summary>
              <ol>
                <li>Go to <b>cloudinary.com</b>, sign up (free) and open your <b>Dashboard</b>. Copy the <b>Cloud name</b>, <b>API Key</b> and <b>API Secret</b>.</li>
                <li>Open your <b>server's</b> hosting (for example Vercel → the API project → Settings → Environment Variables) and add three variables with exactly these names:
                  <code>CLOUDINARY_CLOUD_NAME</code> <code>CLOUDINARY_API_KEY</code> <code>CLOUDINARY_API_SECRET</code></li>
                <li><b>Redeploy</b> the server (Vercel → Deployments → ⋯ → Redeploy). New settings only work after a redeploy.</li>
                <li>Come back here and press <b>check again</b>. That is all — Cloudinary alone stores both the photos and the photo list.</li>
              </ol>
            </details>
            <p><button onClick={checkServer}>Check again</button></p>
          </div>
        )}
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
                      <p className="manage-hint">Tap ✕ on a photo to delete it</p>
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
                    <button className="action-btn view" onClick={() => openEdit(d)}>Edit</button>
                    <a href={`${SITE_URL}/gallery/${slugify(d.category)}`} target="_blank" rel="noreferrer" className="action-btn view">View</a>
                    <button className="action-btn delete" onClick={() => removeAlbum(d)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <form className="modal" onClick={e => e.stopPropagation()} onSubmit={saveEdit}>
            <h3>Edit album</h3>
            <div className="form-field">
              <label>Function (move this album to another function)</label>
              <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field"><label>Album name</label><input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
            <div className="form-field"><label>Price</label><input value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })} /></div>
            <div className="form-field"><label>Description</label><input value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="modal-actions">
              <button type="button" className="btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn-gold">Save changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
