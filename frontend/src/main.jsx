import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AuthCallback from './pages/AuthCallback.jsx'

const path = window.location.pathname;
const token = sessionStorage.getItem("token");

let componentToRender = <Landing />;

if (path === '/login') {
  componentToRender = <Login />;
} else if (path === '/auth/callback') {
  componentToRender = <AuthCallback />;
} else if (path === '/register') {
  componentToRender = <Register />;
} else if (path === '/onboarding') {
  if (!token) {
    setTimeout(() => { window.location.pathname = '/login'; }, 0);
  } else {
    componentToRender = <Onboarding />;
  }
} else if (path === '/dashboard') {
  if (!token) {
    setTimeout(() => { window.location.pathname = '/login'; }, 0);
  } else {
    componentToRender = <Dashboard />;
  }
} else if (path === '/admin' || path === '/admin/dashboard') {
  if (!token) {
    setTimeout(() => { window.location.pathname = '/login'; }, 0);
  } else {
    componentToRender = <AdminDashboard />;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {componentToRender}
  </StrictMode>,
)
