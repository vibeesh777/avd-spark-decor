import { createContext, useContext, useState, useEffect } from 'react'

// New key on purpose: the old website stored a different kind of token under 'avd_admin_token',
// and an old token on the same address would be rejected by the server ("Unauthorized").
const TOKEN_KEY = 'avd_admin_session'
try { localStorage.removeItem('avd_admin_token') } catch { /* private mode */ }

const AdminContext = createContext(null)
const ToastContext = createContext(null)

export function AdminProvider({ children }) {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [toast, setToast] = useState(null)

  const login = (token) => {
    localStorage.setItem(TOKEN_KEY, token)
    setAdminToken(token)
  }
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setAdminToken(null)
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <AdminContext.Provider value={{ adminToken, login, logout, isAdmin: !!adminToken }}>
      <ToastContext.Provider value={{ toast, showToast }}>
        {children}
      </ToastContext.Provider>
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
export const useToast = () => useContext(ToastContext)
