import React, { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      
      // Try to fetch user info to decide where to go
      fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.company_accesses || data.company_accesses.length === 0) {
          window.location.pathname = '/onboarding';
        } else {
          window.location.pathname = '/dashboard';
        }
      })
      .catch(() => {
        window.location.pathname = '/dashboard';
      });

    } else {
      window.location.pathname = '/login';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Memproses Login...</h2>
        <p className="text-muted-foreground">Mohon tunggu sebentar.</p>
      </div>
    </div>
  );
}
