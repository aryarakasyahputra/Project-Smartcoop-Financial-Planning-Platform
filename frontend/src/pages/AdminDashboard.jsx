import React, { useEffect, useState } from "react";
import { LogOut, Building, User, Settings, ShieldCheck, Sparkles, Database, LayoutDashboard, BarChart3, LineChart } from "lucide-react";

export default function AdminDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.pathname = "/login";
        return;
      }

      try {
        const res = await fetch("/api/me", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          const roleName = data.role?.name;

          // Route Guard: only permit admin role
          if (roleName !== "admin") {
            window.location.pathname = "/dashboard";
            return;
          }

          setUserData(data);
        } else {
          localStorage.removeItem("token");
          window.location.pathname = "/login";
        }
      } catch (err) {
        setError("Gagal memuat data administrator.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error("Logout failed on server:", err);
      }
    }
    localStorage.removeItem("token");
    window.location.pathname = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Memuat panel admin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-card border border-destructive/20 rounded-xl text-center">
          <p className="text-destructive font-semibold mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-bold text-primary">smart<span className="text-[#f28c1f]">coop</span></span>
            <span className="text-[10px] font-medium text-red-500 tracking-[0.2em] uppercase ml-0.5 mt-1">admin panel</span>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            <a href="#overview" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
              <LayoutDashboard className="h-4 w-4" /> System Overview
            </a>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="mt-8 pt-6 border-t border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-bold">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{userData?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">Platform Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-destructive/20 text-destructive hover:bg-destructive/5 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Platform Admin Console</h1>
          <p className="text-muted-foreground mt-1">Kelola lisensi, pengguna, dan data global platform Smartcoop.</p>
        </header>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border">
            <span className="text-xs text-primary font-semibold uppercase">Total Users</span>
            <h3 className="text-3xl font-bold mt-2">142</h3>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border">
            <span className="text-xs text-primary font-semibold uppercase">Active Companies</span>
            <h3 className="text-3xl font-bold mt-2">48</h3>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border">
            <span className="text-xs text-primary font-semibold uppercase">Active Models</span>
            <h3 className="text-3xl font-bold mt-2">32</h3>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border">
            <span className="text-xs text-green-500 font-semibold uppercase">System Status</span>
            <h3 className="text-3xl font-bold mt-2 text-green-500">100% OK</h3>
          </div>
        </div>

        {/* Admin Tools Placeholder */}
        <section className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold">Menu Administrasi Global</h2>
          <p className="text-sm text-muted-foreground">Sebagai Admin Platform, Anda dapat memantau performa SaaS global dan memberikan bantuan integrasi ERP kepada perusahaan terdaftar.</p>
          <div className="grid md:grid-cols-2 gap-4 pt-4">
            <div className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
              <h4 className="font-semibold mb-1">Manajemen Pengguna</h4>
              <p className="text-xs text-muted-foreground">Atur role dan hak akses pengguna platform.</p>
            </div>
            <div className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
              <h4 className="font-semibold mb-1">Konfigurasi ERP & API</h4>
              <p className="text-xs text-muted-foreground">Atur integrasi ERP pihak ketiga untuk paket Enterprise.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
