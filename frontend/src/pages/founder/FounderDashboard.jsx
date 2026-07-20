import React, { useState, useEffect, useMemo } from "react";
import { 
  LogOut, Building, User, Settings, ShieldCheck, Sparkles, 
  Database, LayoutDashboard, BarChart3, LineChart as LineChartIcon, Users, 
  Mail, UserPlus, RefreshCw, Compass, Shield, ArrowUpRight,
  TrendingUp, Wallet, Award, ShieldAlert, ChevronRight, ChevronDown, Coins, Activity, Calculator, Layers, Trash2
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import ProjectionModelTab from "../cfo/components/ProjectionModelTab";
import { toast } from "sonner";
import { simulateProjections, formatRupiah } from "../cfo/utils/financialModel";
import { useValuationModel } from "../cfo/utils/valuationHelper";

function getScenarioAssumptions(baseAssumptions, scenario) {
  if (scenario === "base") return baseAssumptions;
  
  const modified = {};
  const years = [2025, 2026, 2027, 2028, 2029];
  
  years.forEach(year => {
    const a = baseAssumptions[year] || {};
    modified[year] = { ...a };
    
    if (scenario === "optimistic") {
      // 1. Boost active cooperatives acquisition by 20%
      if (a.new_coops_acquired !== undefined) {
        modified[year].new_coops_acquired = Math.round(a.new_coops_acquired * 1.20);
      }
      // 2. Reduce churn rate by 20%
      if (a.monthly_churn_rate !== undefined) {
        modified[year].monthly_churn_rate = a.monthly_churn_rate * 0.8;
      }
      // 3. Increase pricing fees (setup, monthly sub) by 10%
      if (a.monthly_subscription_fee !== undefined) {
        modified[year].monthly_subscription_fee = Math.round(a.monthly_subscription_fee * 1.10);
      }
      if (a.setup_fee !== undefined) {
        modified[year].setup_fee = Math.round(a.setup_fee * 1.10);
      }
    } else if (scenario === "pessimistic") {
      // 1. Decrease active cooperatives acquisition by 20%
      if (a.new_coops_acquired !== undefined) {
        modified[year].new_coops_acquired = Math.round(a.new_coops_acquired * 0.80);
      }
      // 2. Increase churn rate by 25%
      if (a.monthly_churn_rate !== undefined) {
        modified[year].monthly_churn_rate = a.monthly_churn_rate * 1.25;
      }
      // 3. Lower pricing fees by 10%
      if (a.monthly_subscription_fee !== undefined) {
        modified[year].monthly_subscription_fee = Math.round(a.monthly_subscription_fee * 0.90);
      }
      if (a.setup_fee !== undefined) {
        modified[year].setup_fee = Math.round(a.setup_fee * 0.90);
      }
    }
  });
  
  return modified;
}

export default function FounderDashboard({ userData, handleLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeScenario, setActiveScenario] = useState("base");
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [loadingProjections, setLoadingProjections] = useState(true);
  const [assumptionsByYear, setAssumptionsByYear] = useState({});
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

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

  useEffect(() => {
    const fetchMembers = async () => {
      if (!primaryCompany) return;
      setLoadingMembers(true);
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/companies/${primaryCompany.id}/members`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          setMembers(data.members || []);
        }
      } catch (err) {
        console.error("Gagal memuat anggota tim:", err);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, [primaryCompany]);

  // Dynamic scenario assumptions
  const activeScenarioAssumptions = useMemo(() => {
    return getScenarioAssumptions(assumptionsByYear, activeScenario);
  }, [assumptionsByYear, activeScenario]);

  const projectionData = useMemo(() => {
    return simulateProjections(activeScenarioAssumptions);
  }, [activeScenarioAssumptions]);

  const valuation = useValuationModel(projectionData);

  const [hoveredYear, setHoveredYear] = useState(null);
  const [chartMetric, setChartMetric] = useState("revenue");

  const getColHighlightClass = (year) => {
    return hoveredYear === year ? "bg-primary/5 border-x border-primary/10" : "";
  };

  const chartData = useMemo(() => {
    return projectionData.map(d => ({
      year: d.year.toString(),
      revenueB: d.totalRevenue ? Number((d.totalRevenue / 1000000000).toFixed(2)) : 0,
      arrB: d.arr ? Number((d.arr / 1000000000).toFixed(2)) : 0,
      ebitdaB: d.ebitda ? Number((d.ebitda / 1000000000).toFixed(2)) : 0,
      endingCashB: d.endingCash ? Number((d.endingCash / 1000000000).toFixed(2)) : 0,
      endingCoops: d.endingCoops || 0
    }));
  }, [projectionData]);

  const data2029 = useMemo(() => {
    if (!projectionData || projectionData.length === 0) return {};
    return projectionData.find(y => y.year === 2029) || projectionData[projectionData.length - 1] || {};
  }, [projectionData]);

  const activeExitVal = useMemo(() => {
    if (activeScenario === "optimistic") return valuation.exitValOpt;
    if (activeScenario === "pessimistic") return valuation.exitValCons;
    return valuation.exitValBase;
  }, [valuation, activeScenario]);

  const activeMOIC = useMemo(() => {
    if (activeScenario === "optimistic") return valuation.moicOpt;
    if (activeScenario === "pessimistic") return valuation.moicCons;
    return valuation.moicBase;
  }, [valuation, activeScenario]);

  const activeIRR = useMemo(() => {
    if (activeScenario === "optimistic") return valuation.irrOpt;
    if (activeScenario === "pessimistic") return valuation.irrCons;
    return valuation.irrBase;
  }, [valuation, activeScenario]);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteRole || !primaryCompany) {
      toast.error("Harap isi semua kolom!");
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
        toast.success("Undangan kolaborasi berhasil dikirim!");
        setInviteEmail("");
        setInviteRole("");
      } else {
        toast.error(data.message || "Gagal mengirim undangan.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem saat mengirim undangan.");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus akses pengguna ini dari perusahaan?")) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/companies/${primaryCompany.id}/members/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      if (res.ok) {
        toast.success("Anggota berhasil dihapus.");
        setMembers(members.filter(m => m.id !== userId));
      } else {
        const data = await res.json();
        toast.error(data.message || "Gagal menghapus anggota.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem saat menghapus anggota.");
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
              <LineChartIcon className="h-4 w-4" /> Proyeksi Keuangan
            </button>
            <button 
              onClick={() => { setActiveTab("overview"); setTimeout(() => window.location.hash = "scenarios", 100); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground`}
            >
              <Sparkles className="h-4 w-4" /> Skenario Bisnis
            </button>
            <button 
              onClick={() => setActiveTab("team")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "team" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
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
              {activeTab === "overview" ? "Founder Workspace" : activeTab === "projections" ? "Model Proyeksi Keuangan" : "Manajemen Tim"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeTab === "overview" ? "Kelola perusahaan, skenario pertumbuhan, dan operasional Anda." : activeTab === "projections" ? "Proyeksi laba rugi komprehensif berdasarkan asumsi yang telah diatur oleh tim CFO." : "Kelola anggota tim dan hak akses mereka pada workspace Anda."}
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
                <ProjectionModelTab data={projectionData} formatRupiah={formatRupiah} valuation={valuation} />
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
            {/* Scenario Selector Banner */}
            <section id="scenarios" className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Sparkles className="h-5 w-5 text-[#f28c1f]" /> Simulasi Skenario Bisnis
                  </h2>
                  <p className="text-xs text-muted-foreground">Pilih skenario aktif untuk memicu re-kalkulasi instan pada KPI dan proyeksi finansial.</p>
                </div>
                <div className="flex gap-2 bg-background p-1 border border-border rounded-xl">
                  <button 
                    onClick={() => setActiveScenario("base")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeScenario === "base" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Base Case
                  </button>
                  <button 
                    onClick={() => setActiveScenario("optimistic")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeScenario === "optimistic" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Optimistic Case
                  </button>
                  <button 
                    onClick={() => setActiveScenario("pessimistic")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeScenario === "pessimistic" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Pessimistic Case
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: 2029 Revenue */}
                <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-emerald-600" /> Proyeksi Revenue (2029)
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800">{formatRupiah(data2029.totalRevenue || 0)}</h3>
                  <p className="text-[10px] text-muted-foreground">Target pendapatan di akhir tahun ke-5</p>
                </div>

                {/* Card 2: 2029 ARR */}
                <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-indigo-600" /> Proyeksi ARR (2029)
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800">{formatRupiah(data2029.arr || 0)}</h3>
                  <p className="text-[10px] text-muted-foreground">Annual Recurring Revenue tahun ke-5</p>
                </div>

                {/* Card 3: 2029 EBITDA */}
                <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="h-4 w-4 text-amber-600" /> EBITDA Proyeksi (2029)
                  </span>
                  <h3 className={`text-xl font-extrabold ${(data2029.ebitda || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {formatRupiah(data2029.ebitda || 0)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Operasional profitabilitas tahun ke-5</p>
                </div>

                {/* Card 4: 2029 Active Coops */}
                <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" /> Koperasi Aktif (2029)
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800">
                    {new Intl.NumberFormat('id-ID').format(data2029.endingCoops || 0)} Unit
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Target jumlah koperasi terlayani</p>
                </div>

                {/* Card 5: Seed Equity % */}
                <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-indigo-500" /> Porsi Kepemilikan Investor
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800">
                    {(valuation.dynamicInvestorEquityFrac * 100).toFixed(1)}%
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Porsi saham investor pasca-funding Seed</p>
                </div>

                {/* Card 6: Exit Valuation */}
                <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-primary" /> Estimasi Exit Valuation
                  </span>
                  <h3 className="text-xl font-extrabold text-primary">
                    {formatRupiah(activeExitVal)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Valuasi keluar perusahaan (2029)</p>
                </div>

                {/* Card 7: MOIC */}
                <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-500" /> Proyeksi MOIC Investor
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800">
                    {activeMOIC.toFixed(2)}x
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Multiple on Invested Capital</p>
                </div>

                {/* Card 8: IRR */}
                <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-500" /> Proyeksi IRR Investor
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800">
                    {(activeIRR * 100).toFixed(1)}%
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Internal Rate of Return (5 Tahun)</p>
                </div>
              </div>
            </section>

            {/* Interactive Trend Chart Card */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2 text-slate-800">
                    <TrendingUp className="h-5 w-5 text-primary" /> Grafik Tren Proyeksi Finansial
                  </h3>
                  <p className="text-xs text-muted-foreground">Visualisasi pertumbuhan indikator finansial utama berdasarkan skenario terpilih.</p>
                </div>
                
                {/* Metric Selector Tabs */}
                <div className="flex flex-wrap gap-2 bg-background p-1 border border-border rounded-xl">
                  <button
                    onClick={() => setChartMetric("revenue")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${chartMetric === "revenue" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Revenue & ARR
                  </button>
                  <button
                    onClick={() => setChartMetric("ebitda")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${chartMetric === "ebitda" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    EBITDA
                  </button>
                  <button
                    onClick={() => setChartMetric("cash")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${chartMetric === "cash" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Ending Cash
                  </button>
                  <button
                    onClick={() => setChartMetric("coops")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${chartMetric === "coops" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Koperasi Aktif
                  </button>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorARR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEBITDA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCoops" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => chartMetric === "coops" ? `${value} Unit` : `Rp ${value}B`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                      formatter={(value, name) => {
                        if (name === "Koperasi Aktif") return [`${value} Unit`, name];
                        return [`Rp ${value} Miliar`, name];
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    
                    {chartMetric === "revenue" && (
                      <>
                        <Area type="monotone" dataKey="revenueB" name="Total Revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                        <Area type="monotone" dataKey="arrB" name="ARR" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorARR)" />
                      </>
                    )}
                    {chartMetric === "ebitda" && (
                      <Area type="monotone" dataKey="ebitdaB" name="EBITDA" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEBITDA)" />
                    )}
                    {chartMetric === "cash" && (
                      <Area type="monotone" dataKey="endingCashB" name="Ending Cash" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCash)" />
                    )}
                    {chartMetric === "coops" && (
                      <Area type="monotone" dataKey="endingCoops" name="Koperasi Aktif" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCoops)" />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metric / Driver Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border bg-muted/10">
                <h3 className="text-base font-bold flex items-center gap-2 text-slate-800">
                  <Wallet className="h-5 w-5 text-primary" /> Ringkasan Proyeksi & Driver Finansial (Rp)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] uppercase bg-muted/30 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">Metric / Driver</th>
                      {projectionData.map((col) => (
                        <th 
                          key={col.year} 
                          className={`px-5 py-3.5 font-bold text-right transition-colors duration-150 ${getColHighlightClass(col.year)}`}
                          onMouseEnter={() => setHoveredYear(col.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          {col.year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {/* Active Cooperatives */}
                    <tr className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-2.5 font-medium text-slate-700">Active Cooperatives</td>
                      {projectionData.map((c) => (
                        <td 
                          key={c.year} 
                          className={`px-5 py-2.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          {new Intl.NumberFormat('id-ID').format(c.endingCoops)}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Members */}
                    <tr className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-2.5 text-muted-foreground pl-8">Cooperative Members</td>
                      {projectionData.map((c) => (
                        <td 
                          key={c.year} 
                          className={`px-5 py-2.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          {new Intl.NumberFormat('id-ID').format(c.totalMembers)}
                        </td>
                      ))}
                    </tr>

                    {/* Revenue */}
                    <tr className="hover:bg-muted/10 transition-colors bg-emerald-50/10">
                      <td className="px-5 py-2.5 font-semibold text-emerald-700">Revenue</td>
                      {projectionData.map((c) => (
                        <td 
                          key={c.year} 
                          className={`px-5 py-2.5 text-right font-mono font-semibold text-emerald-700 transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          {formatRupiah(c.totalRevenue)}
                        </td>
                      ))}
                    </tr>

                    {/* ARR */}
                    <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                      <td className="px-5 py-2.5 pl-8">ARR</td>
                      {projectionData.map((c) => (
                        <td 
                          key={c.year} 
                          className={`px-5 py-2.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          {formatRupiah(c.arr)}
                        </td>
                      ))}
                    </tr>

                    {/* Gross Margin */}
                    <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                      <td className="px-5 py-2.5 pl-8">Gross Margin %</td>
                      {projectionData.map((c) => (
                        <td 
                          key={c.year} 
                          className={`px-5 py-2.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          {c.grossMargin.toFixed(1)}%
                        </td>
                      ))}
                    </tr>

                    {/* EBITDA */}
                    <tr className="hover:bg-muted/10 transition-colors bg-amber-50/10">
                      <td className="px-5 py-2.5 font-semibold text-amber-700">EBITDA</td>
                      {projectionData.map((c) => (
                        <td 
                          key={c.year} 
                          className={`px-5 py-2.5 text-right font-mono font-semibold transition-colors duration-150 ${getColHighlightClass(c.year)} ${c.ebitda >= 0 ? 'text-green-600' : 'text-red-500'}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          {formatRupiah(c.ebitda)}
                        </td>
                      ))}
                    </tr>

                    {/* EBITDA Margin */}
                    <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                      <td className="px-5 py-2.5 pl-8">EBITDA Margin %</td>
                      {projectionData.map((c) => (
                        <td 
                          key={c.year} 
                          className={`px-5 py-2.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          {c.ebitdaMargin.toFixed(1)}%
                        </td>
                      ))}
                    </tr>

                    {/* Ending Cash */}
                    <tr className="hover:bg-muted/10 transition-colors font-medium bg-blue-50/5">
                      <td className="px-5 py-2.5 font-semibold text-blue-700">Ending Cash</td>
                      {projectionData.map((c) => (
                        <td 
                          key={c.year} 
                          className={`px-5 py-2.5 text-right font-mono font-semibold text-blue-700 transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          {formatRupiah(c.endingCash)}
                        </td>
                      ))}
                    </tr>

                    {/* Cash Runway */}
                    <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                      <td className="px-5 py-2.5 pl-8 font-semibold">Runway (Months)</td>
                      {projectionData.map((c) => (
                        <td 
                          key={c.year} 
                          className={`px-5 py-2.5 text-right transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          {c.ebitda >= 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-800">
                              Profitable
                            </span>
                          ) : (
                            <span className="font-bold text-slate-700 font-mono">
                              {c.runwayMonths ? (c.runwayMonths % 1 === 0 ? c.runwayMonths.toFixed(0) : c.runwayMonths.toFixed(1)) : '0'} Bulan
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "team" && (
          <div className="space-y-8">
            {/* Team Grid (Invite widget + Company Status) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

        {/* Team Members List */}
        <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Daftar Anggota Tim</h2>
              <p className="text-xs text-muted-foreground">Kelola pengguna yang memiliki akses ke workspace perusahaan Anda.</p>
            </div>
          </div>
          
          {loadingMembers ? (
             <div className="flex justify-center p-8">
               <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
             </div>
          ) : members.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nama</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {members.map(member => (
                    <tr key={member.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 font-medium">{member.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{member.email}</td>
                      <td className="px-4 py-3 capitalize">{member.role?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-right">
                        {member.id !== userData?.id && member.role?.name !== 'founder' ? (
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            title="Hapus Akses"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Owner</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center p-4 border border-dashed rounded-lg">Belum ada anggota tim lain di perusahaan ini.</p>
          )}
        </section>
          </div>
        )}
      </main>
    </div>
  );
}
