import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext(null)
const ToastContext = createContext(null)

export function AdminProvider({ children }) {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('avd_admin_token'))
  const [toast, setToast] = useState(null)

  const login = (token) => {
    localStorage.setItem('avd_admin_token', token)
    setAdminToken(token)
  }
  const logout = () => {
    localStorage.removeItem('avd_admin_token')
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
