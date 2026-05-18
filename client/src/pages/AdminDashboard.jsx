import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAdmin, useToast } from '../context/AdminContext'
import './AdminDashboard.css'

const API = import.meta.env.VITE_API_URL
const CATEGORIES = ['Wedding', 'Birthday', 'Baby Shower', 'Puberty Function', 'Surprise Party', 'Engagement']
const STATUS_COLORS = { new: '#ffd700', contacted: '#4a9eff', confirmed: '#4ade80', completed: '#888', cancelled: '#f87171' }

export default function AdminDashboard() {
  const { adminToken, logout, isAdmin } = useAdmin()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState('requests')
  const [designs, setDesigns] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddDesign, setShowAddDesign] = useState(false)
  const [editDesign, setEditDesign] = useState(null)
  const fileInputRef = useRef()

  const [form, setForm] = useState({ title: '', category: '', description: '', price: '', tags: '' })
  const [files, setFiles] = useState([])

  const headers = { Authorization: `Bearer ${adminToken}` }

  useEffect(() => {
    if (!isAdmin) { navigate('/admin/login'); return }
    fetchAll()
  }, [isAdmin])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [dr, rr] = await Promise.all([
        axios.get(`${API}/api/designs`, { headers }),
        axios.get(`${API}/api/requests`, { headers })
      ])
      setDesigns(dr.data.designs || [])
      setRequests(rr.data.requests || [])
    } catch { showToast('Failed to load data', 'error') }
    finally { setLoading(false) }
  }

  const handleAddDesign = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, k === 'tags' ? JSON.stringify(v.split(',').map(t=>t.trim()).filter(Boolean)) : v))
    files.forEach(f => fd.append('images', f))
    try {
      await axios.post(`${API}/api/designs`, fd, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } })
      showToast('Design added!'); setShowAddDesign(false)
      setForm({ title: '', category: '', description: '', price: '', tags: '' }); setFiles([])
      fetchAll()
    } catch { showToast('Failed to add design', 'error') }
  }

  const handleDeleteDesign = async (id) => {
    if (!confirm('Delete this design?')) return
    try {
      await axios.delete(`${API}/api/designs/${id}`, { headers })
      showToast('Design deleted'); fetchAll()
    } catch { showToast('Delete failed', 'error') }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`${API}/api/requests/${id}/status`, { status }, { headers })
      setRequests(r => r.map(req => req.id === id ? { ...req, status } : req))
      showToast('Status updated')
    } catch { showToast('Update failed', 'error') }
  }

  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    confirmed: requests.filter(r => r.status === 'confirmed').length,
    designs: designs.length
  }

  return (
    <div className="admin-dash">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="logo-avd">AVD</span>
          <span className="logo-spark">Admin</span>
        </div>
        <nav className="sidebar-nav">
          {[
            { id: 'requests', icon: '📋', label: 'Requests' },
            { id: 'designs', icon: '🎨', label: 'Designs' },
          ].map(item => (
            <button key={item.id} className={`nav-item ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
              <span>{item.icon}</span>{item.label}
              {item.id === 'requests' && stats.new > 0 && <span className="badge">{stats.new}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link to="/" className="nav-item">← Website</Link>
          <button className="nav-item logout" onClick={() => { logout(); navigate('/admin/login') }}>🚪 Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="stats-row">
          {[
            { label: 'Total Requests', value: stats.total, color: 'var(--gold)' },
            { label: 'New Requests', value: stats.new, color: '#ffd700' },
            { label: 'Confirmed', value: stats.confirmed, color: '#4ade80' },
            { label: 'Designs Posted', value: stats.designs, color: '#4a9eff' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <p className="stat-label">{s.label}</p>
              <p className="stat-value" style={{color: s.color}}>{s.value}</p>
            </div>
          ))}
        </div>

        {loading ? <div className="spinner" /> : (
          tab === 'requests' ? (
            <div className="section-block">
              <h2>Customer Requests</h2>
              {requests.length === 0 ? (
                <p className="empty-msg">No requests yet. They'll appear here when customers submit booking requests.</p>
              ) : (
                <div className="requests-table-wrap">
                  <table className="requests-table">
                    <thead>
                      <tr>
                        <th>Customer</th><th>Event</th><th>Date</th><th>Design</th><th>Contact</th><th>Status</th><th>Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(r => (
                        <tr key={r.id}>
                          <td>
                            <strong>{r.customerName}</strong>
                            {r.message && <p className="req-msg">"{r.message.slice(0, 60)}{r.message.length > 60 ? '…' : ''}"</p>}
                          </td>
                          <td>
                            <span className="event-badge">{r.eventType}</span>
                            {r.venue && <p className="small-text">{r.venue}</p>}
                          </td>
                          <td>{new Date(r.eventDate).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</td>
                          <td>{r.designTitle || <span style={{color:'var(--white-muted)'}}>General</span>}</td>
                          <td>
                            <a href={`tel:${r.phone}`} className="contact-link">📞 {r.phone}</a>
                            {r.email && <a href={`mailto:${r.email}`} className="contact-link small">✉ {r.email}</a>}
                            <a href={`https://wa.me/${r.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${r.customerName}, regarding your ${r.eventType} decoration request on ${r.eventDate}...`)}`}
                              target="_blank" rel="noreferrer" className="wa-btn">WhatsApp</a>
                          </td>
                          <td>
                            <select
                              value={r.status}
                              onChange={e => handleStatusUpdate(r.id, e.target.value)}
                              className="status-select"
                              style={{color: STATUS_COLORS[r.status]}}
                            >
                              {['new','contacted','confirmed','completed','cancelled'].map(s =>
                                <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                              )}
                            </select>
                          </td>
                          <td className="small-text">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="section-block">
              <div className="section-header">
                <h2>Designs Gallery</h2>
                <button className="btn-gold" onClick={() => setShowAddDesign(!showAddDesign)}>
                  {showAddDesign ? '✕ Cancel' : '+ Add Design'}
                </button>
              </div>

              {showAddDesign && (
                <form className="add-design-form" onSubmit={handleAddDesign}>
                  <h3>Add New Design</h3>
                  <div className="add-grid">
                    <div className="form-field">
                      <label>Title *</label>
                      <input type="text" placeholder="e.g. Royal Gold Wedding Setup" required
                        value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                    </div>
                    <div className="form-field">
                      <label>Category *</label>
                      <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                        <option value="">Select</option>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-field full">
                      <label>Description</label>
                      <textarea rows={2} placeholder="Describe this design..."
                        value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                    </div>
                    <div className="form-field">
                      <label>Price</label>
                      <input type="text" placeholder="e.g. ₹15,000 onwards"
                        value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                    </div>
                    <div className="form-field">
                      <label>Tags (comma separated)</label>
                      <input type="text" placeholder="floral, arch, mandap"
                        value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
                    </div>
                    <div className="form-field full">
                      <label>Upload Images (max 10)</label>
                      <input type="file" multiple accept="image/*" ref={fileInputRef}
                        onChange={e => setFiles(Array.from(e.target.files))} />
                      {files.length > 0 && <p style={{fontSize:12,color:'var(--gold)',marginTop:4}}>{files.length} image(s) selected</p>}
                    </div>
                  </div>
                  <button type="submit" className="btn-gold">✨ Upload Design</button>
                </form>
              )}

              {designs.length === 0 ? (
                <p className="empty-msg">No designs yet. Add your first design above!</p>
              ) : (
                <div className="admin-designs-grid">
                  {designs.map(d => (
                    <div key={d.id} className="admin-design-card">
                      <div className="admin-card-img">
                        {d.images?.[0] ? <img src={d.images[0]} alt={d.title} /> : <div className="no-img">✨</div>}
                        <span className="img-count">{d.images?.length || 0} photos</span>
                      </div>
                      <div className="admin-card-info">
                        <span className="design-category">{d.category}</span>
                        <h4>{d.title}</h4>
                        <p className="design-price">{d.price}</p>
                      </div>
                      <div className="admin-card-actions">
                        <Link to={`/gallery/${d.id}`} target="_blank" className="action-btn view">View</Link>
                        <button className="action-btn delete" onClick={() => handleDeleteDesign(d.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </main>
    </div>
  )
}