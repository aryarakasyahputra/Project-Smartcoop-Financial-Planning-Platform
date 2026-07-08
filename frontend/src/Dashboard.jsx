import React, { useEffect, useState } from "react";
import { LogOut, Building, User, Settings, ShieldCheck, Sparkles, Database, LayoutDashboard, BarChart3, LineChart } from "lucide-react";

export default function Dashboard() {
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
          // Check if user has completed onboarding (has at least one company access)
          // ONLY founders need to go to /onboarding if they have no company access.
          if ((!data.company_accesses || data.company_accesses.length === 0) && roleName === "founder") {
            window.location.pathname = "/onboarding";
            return;
          }
          setUserData(data);
        } else {
          localStorage.removeItem("token");
          window.location.pathname = "/login";
        }
      } catch (err) {
        setError("Gagal memuat data pengguna.");
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
          <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
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

  // Check if user has no company access (waiting room case)
  const isCompanyEmpty = !userData?.company_accesses || userData.company_accesses.length === 0;

  if (isCompanyEmpty && userData?.role?.name !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card text-center" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
            <Building className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Menunggu Undangan Akses</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Akun Anda dengan role <strong className="capitalize">{userData?.role?.name}</strong> belum terhubung ke workspace perusahaan mana pun.
          </p>
          <div className="p-4 bg-muted rounded-xl mb-6 text-xs text-left text-muted-foreground space-y-2">
            <p><strong>Bagaimana cara terhubung?</strong></p>
            <p>Silakan hubungi Founder perusahaan Anda agar email <strong>{userData?.email}</strong> ditambahkan ke daftar anggota tim perusahaan mereka.</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-destructive/20 text-destructive hover:bg-destructive/5 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4" /> Keluar & Login Ulang
          </button>
        </div>
      </div>
    );
  }

  // Platform Admin view
  if (userData?.role?.name === "admin") {
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

  const primaryCompany = userData?.company_accesses?.[0]?.company;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-bold text-primary">smart<span className="text-[#f28c1f]">coop</span></span>
            <span className="text-[10px] font-medium text-primary/70 tracking-[0.2em] uppercase ml-0.5 mt-1">financial</span>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            <a href="#overview" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </a>
            <a href="#projections" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground text-sm font-medium transition-colors">
              <LineChart className="h-4 w-4" /> Proyeksi Keuangan
            </a>
            <a href="#metrics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground text-sm font-medium transition-colors">
              <BarChart3 className="h-4 w-4" /> SaaS Metrics
            </a>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="mt-8 pt-6 border-t border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{userData?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{userData?.role?.name}</p>
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
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Selamat Datang, {userData?.name}</h1>
            <p className="text-muted-foreground mt-1">Berikut adalah status perencanaan keuangan perusahaan Anda.</p>
          </div>
          {primaryCompany && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl">
              <Building className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{primaryCompany.name}</span>
            </div>
          )}
        </header>

        {/* Dashboard Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Role status */}
          <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="h-20 w-20 text-primary" />
            </div>
            <span className="text-xs text-primary font-semibold tracking-wider uppercase">Akses Akun</span>
            <h3 className="text-2xl font-bold mt-2 capitalize">{userData?.role?.name}</h3>
            <p className="text-sm text-muted-foreground mt-2">Anda memiliki akses penuh untuk mengubah parameter dan asumsi keuangan.</p>
          </div>

          {/* Card 2: Company details */}
          <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Building className="h-20 w-20 text-primary" />
            </div>
            <span className="text-xs text-primary font-semibold tracking-wider uppercase">Entitas Aktif</span>
            <h3 className="text-2xl font-bold mt-2 truncate">{primaryCompany?.name}</h3>
            <p className="text-sm text-muted-foreground mt-2">Dihubungkan melalui tabel user_company_access dengan ID #{primaryCompany?.id}.</p>
          </div>

          {/* Card 3: Model status */}
          <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-20 w-20 text-primary" />
            </div>
            <span className="text-xs text-primary font-semibold tracking-wider uppercase">Status Pemodelan</span>
            <h3 className="text-2xl font-bold mt-2">Auto Recalculation</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm text-muted-foreground">Terhubung ke Driver-Based Engine</span>
            </div>
          </div>
        </div>

        {/* Invite Team Member Section (Visible only to founder/admin) */}
        {(userData?.role?.name === 'founder' || userData?.role?.name === 'admin') && primaryCompany && (
          <section className="bg-card rounded-2xl border border-border p-6 md:p-8 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Undang Anggota Tim</h2>
                <p className="text-sm text-muted-foreground">Kirim undangan ke CFO, Finance, atau Investor untuk bergabung ke perusahaan Anda.</p>
              </div>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;
              const role_id = e.target.role_id.value;
              
              try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/invitations', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    email,
                    role_id,
                    company_id: primaryCompany.id
                  })
                });
                
                const data = await res.json();
                if (res.ok) {
                  alert("Undangan berhasil dikirim!");
                  e.target.reset();
                } else {
                  alert(data.message || "Gagal mengirim undangan");
                }
              } catch (err) {
                alert("Terjadi kesalahan sistem.");
              }
            }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Email Tujuan</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="email@contoh.com"
                  className="w-full mt-1 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Role Akses</label>
                <select 
                  name="role_id" 
                  required
                  className="w-full mt-1 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">-- Pilih Role --</option>
                  <option value="3">Finance (Akses Edit Asumsi)</option>
                  <option value="4">Investor Viewer (Hanya Baca)</option>
                </select>
              </div>
              <div className="col-span-1 flex items-end">
                <button 
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
                >
                  Kirim Undangan
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Feature Teasers */}
        <section className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Sumber Data Tunggal (Single Source of Truth)</h2>
              <p className="text-sm text-muted-foreground">Semua modul operasional dan finansial terintegrasi secara otomatis.</p>
            </div>
          </div>

          <div className="border-t border-border pt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">10+</div>
              <div className="text-xs text-muted-foreground mt-1">Modul Terintegrasi</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f28c1f]">Real-time</div>
              <div className="text-xs text-muted-foreground mt-1">Auto Recalculation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-xs text-muted-foreground mt-1">Konsistensi Laporan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f28c1f]">1</div>
              <div className="text-xs text-muted-foreground mt-1">Sumber Data Tunggal</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
