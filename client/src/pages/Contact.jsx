import { useState } from 'react'
import axios from 'axios'
import { useToast } from '../context/AdminContext'
import './Contact.css'

const EVENT_TYPES = ['Wedding', 'Birthday', 'Baby Shower', 'Puberty Function', 'Surprise Party', 'Engagement', 'Other']

export default function Contact() {
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    customerName: '', phone: '', email: '',
    eventType: '', eventDate: '', venue: '', budget: '', message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customerName || !form.phone || !form.eventType || !form.eventDate) {
      showToast('Please fill required fields', 'error'); return
    }
    setSubmitting(true)
    try {
      await axios.post('/api/requests', form)
      setSubmitted(true)
      showToast('Message sent!', 'success')
    } catch {
      showToast('Failed to send. Try calling us directly.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <p className="section-eyebrow">Get in touch</p>
        <h1 className="section-title">Contact <span className="gold-text">Us</span></h1>
        <div className="divider" style={{margin: '12px auto'}} />
      </div>
      <div className="container contact-layout">
        <div className="contact-info">
          <h2>Let's Create Your<br /><span className="gold-text">Dream Event</span></h2>
          <p className="contact-intro">Tell us about your event and we'll reach out with a custom plan just for you.</p>
          <div className="contact-cards">
            {[
              { icon: '📞', label: 'Call / WhatsApp', value: '+91 93842 17626', link: 'tel :+91 93842 17626' },
              { icon: '✉️', label: 'Email', value: 'kingvibeeshraja@gmail.com', link: 'mailto:kingvibeeshraja@gmail.com' },
              { icon: '📍', label: 'Location', value: 'perambalur, Tamil Nadu', link: null },
              { icon: '⏰', label: 'Working Hours', value: 'Mon – Sun, everytime', link: null },
            ].map(c => (
              <div key={c.label} className="info-card">
                <span className="info-icon">{c.icon}</span>
                <div>
                  <p className="info-label">{c.label}</p>
                  {c.link ? <a href={c.link} className="info-value">{c.value}</a> : <p className="info-value">{c.value}</p>}
                </div>
              </div>
            ))}
          </div>
          <a href={`https://wa.me/9193842 17626?text=${encodeURIComponent('Hi! I want to book a decoration for my event.')}`}
            target="_blank" rel="noreferrer" className="btn-gold whatsapp-btn">
            💬 Chat on WhatsApp
          </a>
        </div>

        <div className="contact-form-wrap">
          {submitted ? (
            <div className="contact-success">
              <div className="success-sparkle">✨</div>
              <h3>Thank You!</h3>
              <p>We've received your request and will contact you within 24 hours.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Send a Request</h3>
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Name *</label>
                  <input type="text" placeholder="Your full name" value={form.customerName}
                    onChange={e => setForm({...form, customerName: e.target.value})} required />
                </div>
                <div className="form-field">
                  <label>Phone *</label>
                  <input type="tel" placeholder="+91 ..." value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})} required />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input type="email" placeholder="Optional" value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-field">
                  <label>Event Type *</label>
                  <select value={form.eventType} onChange={e => setForm({...form, eventType: e.target.value})} required>
                    <option value="">Select</option>
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
                  <label>Venue</label>
                  <input type="text" placeholder="Hall or location" value={form.venue}
                    onChange={e => setForm({...form, venue: e.target.value})} />
                </div>
                <div className="form-field" style={{gridColumn: 'span 2'}}>
                  <label>Budget</label>
                  <input type="text" placeholder="e.g. ₹15,000 – ₹25,000" value={form.budget}
                    onChange={e => setForm({...form, budget: e.target.value})} />
                </div>
                <div className="form-field" style={{gridColumn: 'span 2'}}>
                  <label>Message</label>
                  <textarea rows={4} placeholder="Describe your vision, theme, colors..."
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn-gold" style={{width:'100%',justifyContent:'center'}} disabled={submitting}>
                {submitting ? 'Sending...' : '✨ Send Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
