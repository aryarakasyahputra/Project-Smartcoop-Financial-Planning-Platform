import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import Landing from './pages/landing/Landing.jsx'
import Login from './pages/login/Login.jsx'
import Register from './pages/register/Register.jsx'
import Onboarding from './pages/onboarding/Onboarding.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AuthCallback from './pages/authCallback/AuthCallback.jsx'

import { LanguageProvider } from './context/LanguageContext.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CurrencyProvider>
    </LanguageProvider>
  </StrictMode>,
)
