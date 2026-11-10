import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import FloatingActions from './components/FloatingActions'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import FunctionPage from './pages/FunctionPage'
import Services from './pages/Services'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'


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
    <ToastProvider>
      <BrowserRouter>
        <Toast />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/:slug" element={<FunctionPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
