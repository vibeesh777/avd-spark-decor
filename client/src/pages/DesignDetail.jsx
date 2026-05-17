import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../context/AdminContext'
import './DesignDetail.css'

const EVENT_TYPES = ['Wedding', 'Birthday', 'Baby Shower', 'Puberty Function', 'Surprise Party', 'Engagement', 'Other']

export default function DesignDetail() {
  const { id } = useParams()
  const { showToast } = useToast()
  const [design, setDesign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [requestId, setRequestId] = useState('')

  const [form, setForm] = useState({
    customerName: '', phone: '', email: '',
    eventType: '', eventDate: '', venue: '',
    budget: '', message: ''
  })

  useEffect(() => {
    fetch('/data/designs.json')
      .then(res => res.json())
      .then(data => {
        const found = (data.designs || []).find(d => d.id === id)
        setDesign(found || null)
        if (found) setForm(f => ({ ...f, eventType: found.category || '' }))
      })
      .catch(() => setDesign(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customerName || !form.phone || !form.eventType || !form.eventDate) {
      showToast('Please fill all required fields', 'error'); return
    }
    setSubmitting(true)
    const whatsappNumber = import.meta.env.VITE_WHATSAPP || '919876543210'
    const message = `Hi! I'd like to book a decoration.\n\nName: ${form.customerName}\nPhone: ${form.phone}\nEvent: ${form.eventType}\nDate: ${form.eventDate}\nDesign: ${design?.title || 'N/A'}\nVenue: ${form.venue || 'Not specified'}\nBudget: ${form.budget || 'Not specified'}\nNotes: ${form.message || 'None'}`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
    setSubmitted(true)
    setRequestId(Date.now().toString(36).toUpperCase())
    showToast('Redirecting to WhatsApp!', 'success')
    setSubmitting(false)
  }

  if (loading) return <div style={{paddingTop: 120}}><div className="spinner" /></div>
  if (!design) return (
    <div style={{paddingTop: 120, textAlign: 'center'}}>
      <h2 style={{color: 'var(--gold)', marginBottom: 16}}>Design not found</h2>
      <Link to="/gallery" className="btn-outline">Back to Gallery</Link>
    </div>
  )

  return (
    <div className="detail-page">
      <div className="container">
        <div className="detail-breadcrumb">
          <Link to="/gallery">Gallery</Link>
          <span>/</span>
          <span>{design.category}</span>
          <span>/</span>
          <span>{design.title}</span>
        </div>

        <div className="detail-layout">
          {/* IMAGES */}
          <div className="detail-images">
            <div className="main-image">
              {design.images?.[activeImg] ? (
                <img src={design.images[activeImg]} alt={design.title} />
              ) : (
                <div className="detail-img-placeholder">✨</div>
              )}
            </div>
            {design.images?.length > 1 && (
              <div className="image-thumbs">
                {design.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`View ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO + FORM */}
          <div className="detail-info">
            <span className="detail-category">{design.category}</span>
            <h1 className="detail-title">{design.title}</h1>
            {design.description && <p className="detail-desc">{design.description}</p>}
            <div className="detail-price">{design.price}</div>
            {design.tags?.length > 0 && (
              <div className="detail-tags">
                {design.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            )}

            <div className="detail-divider" />

            {submitted ? (
              <div className="request-success">
                <div className="success-icon">✓</div>
                <h3>Request Sent!</h3>
                <p>Your Request ID: <strong>{requestId}</strong></p>
                <p>The owner will contact you within 24 hours to confirm your booking.</p>
                <div className="success-actions">
                  <Link to="/gallery" className="btn-outline">Browse More</Link>
                  <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP || '9193842 17626'}`}
                    target="_blank" rel="noreferrer" className="btn-gold">
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form className="request-form" onSubmit={handleSubmit}>
                <h3 className="form-title">📋 Request This Design</h3>

                <div className="form-grid">
                  <div className="form-field">
                    <label>Your Name *</label>
                    <input type="text" placeholder="Enter your name"
                      value={form.customerName}
                      onChange={e => setForm({...form, customerName: e.target.value})} required />
                  </div>
                  <div className="form-field">
                    <label>Phone Number *</label>
                    <input type="tel" placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})} required />
                  </div>
                  <div className="form-field">
                    <label>Email Address</label>
                    <input type="email" placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="form-field">
                    <label>Event Type *</label>
                    <select value={form.eventType} onChange={e => setForm({...form, eventType: e.target.value})} required>
                      <option value="">Select event type</option>
                      {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Event Date *</label>
                    <input type="date" value={form.eventDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setForm({...form, eventDate: e.target.value})} required />
                  </div>
                  <div className="form-field">
                    <label>Venue / Location</label>
                    <input type="text" placeholder="Hall name or area"
                      value={form.venue}
                      onChange={e => setForm({...form, venue: e.target.value})} />
                  </div>
                  <div className="form-field full">
                    <label>Budget (Optional)</label>
                    <input type="text" placeholder="e.g. ₹10,000 – ₹20,000"
                      value={form.budget}
                      onChange={e => setForm({...form, budget: e.target.value})} />
                  </div>
                  <div className="form-field full">
                    <label>Special Requests or Notes</label>
                    <textarea rows={3} placeholder="Any specific requirements, color preferences, etc."
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className="btn-gold" style={{width:'100%', justifyContent:'center'}} disabled={submitting}>
                  {submitting ? 'Sending...' : '✨ Send Booking Request'}
                </button>
                <p className="form-note">We'll respond within 24 hours via phone/WhatsApp.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
