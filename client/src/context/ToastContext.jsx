import { createContext, useContext, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 3500)
  }
  return <ToastContext.Provider value={{ toast, showToast }}>{children}</ToastContext.Provider>
}

export const useToast = () => useContext(ToastContext)
