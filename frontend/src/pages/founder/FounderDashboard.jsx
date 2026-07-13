import React, { useState, useEffect, useMemo } from "react";
import { 
  LogOut, Building, User, Settings, ShieldCheck, Sparkles, 
  Database, LayoutDashboard, BarChart3, LineChart, Users, 
  Mail, UserPlus, RefreshCw, Compass, Shield, ArrowUpRight
} from "lucide-react";
import ProjectionModelTab from "../cfo/components/ProjectionModelTab";
import { simulateProjections, formatRupiah } from "../cfo/utils/financialModel";

export default function FounderDashboard({ userData, handleLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeScenario, setActiveScenario] = useState("base");
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [loadingProjections, setLoadingProjections] = useState(true);
  const [assumptionsByYear, setAssumptionsByYear] = useState({});

  const primaryCompany = userData?.company_accesses?.[0]?.company;
  const projectId = primaryCompany?.projects?.[0]?.id;

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      if (!projectId) {
        setLoadingProjections(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${projectId}/assumptions`, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        
        if (response.ok) {
          const responseData = await response.json();
          const mapped = {};
          if (responseData && responseData.assumptions && Array.isArray(responseData.assumptions)) {
            responseData.assumptions.forEach(item => {
              const parsedItem = {};
              for (const key in item) {
                if (typeof item[key] === 'string' && !isNaN(item[key]) && item[key].trim() !== '') {
                  parsedItem[key] = Number(item[key]);
                } else {
                  parsedItem[key] = item[key];
                }
              }
              mapped[item.year] = parsedItem;
            });
          }
          setAssumptionsByYear(mapped);
        }
      } catch (err) {
        console.error("Gagal memuat asumsi:", err);
      } finally {
        setLoadingProjections(false);
      }
    };

    fetchData();
  }, [projectId]);

  const projectionData = useMemo(() => simulateProjections(assumptionsByYear), [assumptionsByYear]);

  // Mock financial data that changes based on scenario
  const scenarioData = {
    base: {
      runway: 14,
      revenue: "Rp 1.2B",
      ebitda: "+12%",
      burnRate: "Rp 85M/mo",
      color: "border-primary"
    },
    optimistic: {
      runway: 22,
      revenue: "Rp 1.8B",
      ebitda: "+24%",
      burnRate: "Rp 75M/mo",
      color: "border-[#f28c1f]"
    },
    pessimistic: {
      runway: 9,
      revenue: "Rp 850M",
      ebitda: "-5%",
      burnRate: "Rp 98M/mo",
      color: "border-destructive"
    }
  };

  const currentFinance = scenarioData[activeScenario];

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteRole || !primaryCompany) {
      alert("Harap isi semua kolom!");
      return;
    }

    setInviting(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email: inviteEmail,
          role_id: inviteRole,
          company_id: primaryCompany.id
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Undangan kolaborasi berhasil dikirim!");
        setInviteEmail("");
        setInviteRole("");
      } else {
        alert(data.message || "Gagal mengirim undangan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem saat mengirim undangan.");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row md:h-screen md:overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border flex flex-col justify-between p-6 md:sticky md:top-0 md:h-screen shadow-sm z-10">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-start leading-none group">
            <span className="text-[22px] font-bold text-[#005fa4] tracking-tight">
              smart<span className="text-[#FFD700]">coop</span>
            </span>
            <span className="text-[8px] font-medium text-[#005fa4]/70 tracking-[0.2em] uppercase mt-1">
              founder panel
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "overview" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
            >
              <LayoutDashboard className="h-4 w-4" /> Workspace Overview
            </button>
            <button 
              onClick={() => setActiveTab("projections")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "projections" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
            >
              <LineChart className="h-4 w-4" /> Proyeksi Keuangan
            </button>
            <button 
              onClick={() => { setActiveTab("overview"); setTimeout(() => window.location.hash = "scenarios", 100); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground`}
            >
              <Sparkles className="h-4 w-4" /> Skenario Bisnis
            </button>
            <button 
              onClick={() => { setActiveTab("overview"); setTimeout(() => window.location.hash = "team", 100); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground`}
            >
              <Users className="h-4 w-4" /> Manajemen Tim
            </button>
          </nav>
        </div>

        {/* Profile Info & Logout */}
        <div className="mt-8 pt-6 border-t border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{userData?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">Founder (Owner)</p>
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

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto md:h-screen">
        {/* Header */}
        <header id="overview" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {activeTab === "overview" ? "Founder Workspace" : "Model Proyeksi Keuangan"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeTab === "overview" ? "Kelola perusahaan, skenario pertumbuhan, dan undang tim finansial Anda." : "Proyeksi laba rugi komprehensif berdasarkan asumsi yang telah diatur oleh tim CFO."}
            </p>
          </div>
          {primaryCompany && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl">
              <Building className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{primaryCompany.name}</span>
            </div>
          )}
        </header>

        {activeTab === "projections" && (
          <section id="projections" className="space-y-6">
            {loadingProjections ? (
              <div className="flex justify-center p-12">
                <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : projectionData && projectionData.length > 0 ? (
              <div className="overflow-x-auto">
                <ProjectionModelTab data={projectionData} formatRupiah={formatRupiah} />
              </div>
            ) : (
              <div className="text-center p-12 text-muted-foreground bg-card border border-border rounded-2xl">
                Data asumsi belum tersedia. Silakan hubungi tim CFO untuk mengatur asumsi finansial.
              </div>
            )}
          </section>
        )}

        {activeTab === "overview" && (
          <>
            {/* Scenario and Quick Metrics Selector */}
            <section id="scenarios" className="bg-card border border-border rounded-2xl p-6 space-y-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#f28c1f]" /> Simulasi Skenario Bisnis
              </h2>
              <p className="text-sm text-muted-foreground">Pilih skenario aktif untuk melihat dampak instan pada metrik perencanaan keuangan.</p>
            </div>
            <div className="flex gap-2 bg-background p-1 border border-border rounded-xl">
              <button 
                onClick={() => setActiveScenario("base")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeScenario === "base" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                Base Case
              </button>
              <button 
                onClick={() => setActiveScenario("optimistic")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeScenario === "optimistic" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                Optimistic
              </button>
              <button 
                onClick={() => setActiveScenario("pessimistic")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeScenario === "pessimistic" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                Pessimistic
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className={`bg-background p-5 rounded-xl border-l-4 ${currentFinance.color} space-y-1`}>
              <span className="text-xs text-muted-foreground font-semibold uppercase">Cash Runway</span>
              <h3 className="text-2xl font-bold">{currentFinance.runway} Bulan</h3>
              <div className="w-full bg-border h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${currentFinance.runway > 12 ? "bg-green-500" : currentFinance.runway > 6 ? "bg-[#f28c1f]" : "bg-destructive"}`} 
                  style={{ width: `${Math.min((currentFinance.runway / 24) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-background p-5 rounded-xl border border-border space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Proyeksi Pendapatan</span>
              <h3 className="text-2xl font-bold text-foreground">{currentFinance.revenue}</h3>
              <p className="text-xs text-green-500 flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" /> Target Tahunan</p>
            </div>

            <div className="bg-background p-5 rounded-xl border border-border space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Margin EBITDA</span>
              <h3 className="text-2xl font-bold text-foreground">{currentFinance.ebitda}</h3>
              <p className="text-xs text-muted-foreground">Operasional Efisiensi</p>
            </div>

            <div className="bg-background p-5 rounded-xl border border-border space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Net Burn Rate</span>
              <h3 className="text-2xl font-bold text-foreground">{currentFinance.burnRate}</h3>
              <p className="text-xs text-muted-foreground">Pengeluaran Bulanan</p>
            </div>
          </div>
        </section>

        {/* Lower Grid (Invite widget + Team listing) */}
        <div id="team" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Invite Widget */}
          <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Undang Kolaborator Tim</h2>
                <p className="text-xs text-muted-foreground">Berikan akses workspace perusahaan Anda ke CFO atau Investor Viewer.</p>
              </div>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">Email Tujuan</label>
                <input 
                  type="email" 
                  required 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="cfo@perusahaan.com"
                  className="w-full mt-1.5 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">Role Hak Akses</label>
                <select 
                  required
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full mt-1.5 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">-- Pilih Akses Peran --</option>
                  <option value="3">Finance / CFO (Akses Penuh Edit Drivers)</option>
                  <option value="4">Investor Viewer (Hanya Baca Proyeksi)</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={inviting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {inviting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Mengirim Undangan...
                  </>
                ) : (
                  "Kirim Link Undangan"
                )}
              </button>
            </form>
          </section>

          {/* Company Workspace Status */}
          <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Informasi Perusahaan</h2>
                <p className="text-xs text-muted-foreground">Detail registrasi entitas hukum dan status driver-based engine.</p>
              </div>
            </div>

            <div className="space-y-4 divide-y divide-border">
              <div className="flex justify-between items-center py-2 text-sm">
                <span className="text-muted-foreground">Nama Entitas</span>
                <span className="font-semibold">{primaryCompany?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 text-sm">
                <span className="text-muted-foreground">Akses Database ID</span>
                <code className="px-2 py-0.5 bg-muted border border-border rounded text-xs">#{primaryCompany?.id}</code>
              </div>
              <div className="flex justify-between items-center py-2.5 text-sm">
                <span className="text-muted-foreground">Status Engine</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-500">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> Auto-Recalculating
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 text-sm">
                <span className="text-muted-foreground">Hak Akses Anda</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-xs font-semibold text-primary">
                  <Shield className="h-3 w-3" /> Owner / Founder
                </span>
              </div>
            </div>
          </section>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
