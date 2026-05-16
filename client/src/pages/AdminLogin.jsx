import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAdmin, useToast } from '../context/AdminContext'
import './AdminLogin.css'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/admin/login', { password })
      login(res.data.token)
      showToast('Welcome back!', 'success')
      navigate('/admin')
    } catch {
      showToast('Incorrect password', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-avd">AVD</span>
          <span className="logo-spark">Spark Decor</span>
        </div>
        <p className="login-subtitle">Owner Portal</p>
        <form onSubmit={handleLogin}>
          <div className="form-field" style={{marginBottom: 20}}>
            <label>Admin Password</label>
            <input type="password" placeholder="Enter password"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-gold" style={{width:'100%',justifyContent:'center'}} disabled={loading}>
            {loading ? 'Logging in...' : '→ Enter Dashboard'}
          </button>
        </form>
        <Link to="/" className="back-home">← Back to website</Link>
      </div>
    </div>
  )
}
