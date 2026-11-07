import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import FloatingActions from './components/FloatingActions'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import DesignDetail from './pages/DesignDetail'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Admin code is only downloaded when the owner opens /admin
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main><Outlet /></main>
      <Footer />
      <FloatingActions />
    </>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Toast />
        <Suspense fallback={<div className="spinner" />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/:id" element={<DesignDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AdminProvider>
  )
}
