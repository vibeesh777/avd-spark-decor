import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import Toast from './components/Toast'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Toast />
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  )
}
