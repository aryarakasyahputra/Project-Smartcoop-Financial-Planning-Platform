import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Landing from './Landing.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Onboarding from './Onboarding.jsx'
import Dashboard from './Dashboard.jsx'
import AuthCallback from './AuthCallback.jsx'

const path = window.location.pathname;
const token = localStorage.getItem("token");

let componentToRender = <Landing />;

if (path === '/login') {
  if (token) {
    // Redirect asynchronously to avoid React state/rendering warnings during import evaluation
    setTimeout(() => { window.location.pathname = '/dashboard'; }, 0);
  } else {
    componentToRender = <Login />;
  }
} else if (path === '/auth/callback') {
  componentToRender = <AuthCallback />;
} else if (path === '/register') {
  if (token) {
    setTimeout(() => { window.location.pathname = '/dashboard'; }, 0);
  } else {
    componentToRender = <Register />;
  }
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
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {componentToRender}
  </StrictMode>,
)
