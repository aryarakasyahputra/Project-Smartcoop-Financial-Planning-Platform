import React, { useState, useEffect, useMemo } from "react";
import { 
  LogOut, Building, ShieldCheck, Sparkles, Database, 
  LayoutDashboard, BarChart3, LineChart, Shield, Download,
  TrendingUp, Wallet, Award, ArrowUpRight, BarChart4, FileText
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, LineChart as ReLineChart, 
  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import ProjectionModelTab from "../cfo/components/ProjectionModelTab";
import { simulateProjections, formatRupiah } from "../cfo/utils/financialModel";
import { useValuationModel } from "../cfo/utils/valuationHelper";

export default function InvestorDashboard({ userData, handleLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [downloadingDeck, setDownloadingDeck] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
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

  const detailedProjectionData = useMemo(() => simulateProjections(assumptionsByYear), [assumptionsByYear]);
  const valuation = useValuationModel(detailedProjectionData);

  // Mock static financial projection data for investors (Read-Only)
  const projectionData = [
    { name: "Tahun 1", ARR: 1800, EBITDA: 216, margin: 12 },
    { name: "Tahun 2", ARR: 2560, EBITDA: 410, margin: 16 },
    { name: "Tahun 3", ARR: 3640, EBITDA: 728, margin: 20 },
    { name: "Tahun 4", ARR: 5180, EBITDA: 1191, margin: 23 },
    { name: "Tahun 5", ARR: 7370, EBITDA: 1916, margin: 26 },
  ];

  const formatRupiahBillions = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 1
    }).format(value / 1000) + " Miliar";
  };

  const handleDownloadDeck = () => {
    setDownloadingDeck(true);
    setTimeout(() => {
      setDownloadingDeck(false);
      alert("Pitch Deck berhasil diunduh!");
    }, 2000);
  };

  const handleDownloadReport = () => {
    setDownloadingReport(true);
    setTimeout(() => {
      setDownloadingReport(false);
      alert("Laporan Finansial Lengkap (PDF) berhasil diunduh!");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row md:h-screen md:overflow-hidden">
      {/* Sidebar - Smartcoop Brand Blue Theme */}
      <aside className="w-full md:w-64 bg-gradient-to-b from-[#003d6b] via-[#005fa4] to-[#002d50] text-white border-b md:border-b-0 md:border-r border-blue-900/40 flex flex-col justify-between p-6 md:sticky md:top-0 md:h-screen shadow-xl z-10 relative overflow-hidden">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-start leading-none group pt-1">
            <span className="text-[24px] font-extrabold text-white tracking-tight flex items-center">
              smart<span className="text-[#FFD700]">coop</span>
            </span>
            <span className="text-[8.5px] font-bold text-blue-200/80 tracking-[0.22em] uppercase mt-1">
              INVESTOR PANEL
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border-l-4 transition-all duration-200 cursor-pointer ${
                activeTab === "overview" 
                  ? "bg-white/15 backdrop-blur-md text-white font-bold border-[#FFD700] shadow-md shadow-black/10" 
                  : "border-transparent text-blue-100/75 hover:bg-white/10 hover:text-white font-semibold"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <LayoutDashboard className={`h-4 w-4 shrink-0 transition-colors ${activeTab === "overview" ? "text-[#FFD700]" : "text-blue-200/60 group-hover:text-white"}`} />
                <span className="whitespace-nowrap truncate">Portfolio Review</span>
              </div>
              {activeTab === "overview" && <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-2xs shrink-0 ml-1" />}
            </button>

            <button 
              onClick={() => setActiveTab("projections")}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border-l-4 transition-all duration-200 cursor-pointer ${
                activeTab === "projections" 
                  ? "bg-white/15 backdrop-blur-md text-white font-bold border-[#FFD700] shadow-md shadow-black/10" 
                  : "border-transparent text-blue-100/75 hover:bg-white/10 hover:text-white font-semibold"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <LineChart className={`h-4 w-4 shrink-0 transition-colors ${activeTab === "projections" ? "text-[#FFD700]" : "text-blue-200/60 group-hover:text-white"}`} />
                <span className="whitespace-nowrap truncate">Model Proyeksi Keuangan</span>
              </div>
              {activeTab === "projections" && <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-2xs shrink-0 ml-1" />}
            </button>

            <button 
              onClick={() => { setActiveTab("overview"); setTimeout(() => window.location.hash = "valuations", 100); }}
              className="group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-100/75 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer border-l-4 border-transparent"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Wallet className="h-4 w-4 shrink-0 text-blue-200/60 group-hover:text-white" />
                <span className="whitespace-nowrap truncate">Valuasi & Fundraising</span>
              </div>
            </button>

            <button 
              onClick={() => { setActiveTab("overview"); setTimeout(() => window.location.hash = "downloads", 100); }}
              className="group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-100/75 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer border-l-4 border-transparent"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-4 w-4 shrink-0 text-blue-200/60 group-hover:text-white" />
                <span className="whitespace-nowrap truncate">Dokumen Pelaporan</span>
              </div>
            </button>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="mt-8 pt-6 border-t border-white/15 space-y-4">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-xl bg-[#FFD700] text-[#003d6b] flex items-center justify-center font-extrabold text-sm shadow-md shrink-0">
              {userData?.name?.charAt(0).toUpperCase() || "I"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{userData?.name}</p>
              <p className="text-[10px] font-bold text-[#FFD700] capitalize flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" /> Investor Viewer
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-black/20 transition-all duration-200 cursor-pointer border-none"
          >
            <LogOut className="h-4 w-4 text-white" /> 
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto md:h-screen">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {activeTab === "overview" ? "Investor Reporting Console" : "Model Proyeksi Keuangan"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeTab === "overview" ? "Akses eksklusif read-only ke proyeksi model finansial, skenario, dan valuasi koperasi/SME." : "Proyeksi laba rugi komprehensif berdasarkan asumsi yang telah diatur oleh tim CFO."}
            </p>
          </div>
          {primaryCompany && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl">
              <Building className="h-4 w-4 text-emerald-500" />
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
            ) : detailedProjectionData && detailedProjectionData.length > 0 ? (
              <div className="overflow-x-auto">
                <ProjectionModelTab data={detailedProjectionData} formatRupiah={formatRupiah} valuation={valuation} />
              </div>
            ) : (
              <div className="text-center p-12 text-muted-foreground bg-card border border-border rounded-2xl">
                Data asumsi belum tersedia. Proyeksi tidak dapat ditampilkan.
              </div>
            )}
          </section>
        )}

        {activeTab === "overview" && (
          <>
            {/* Investor Performance KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
                <span className="text-xs text-emerald-500 font-semibold uppercase">Implied Valuation (DCF)</span>
                <h3 className="text-2xl font-bold mt-2">Rp 24.5 Miliar</h3>
                <p className="text-xs text-muted-foreground mt-2">Berdasarkan CAGR Revenue 42%</p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
                <span className="text-xs text-primary font-semibold uppercase">Gross Margin %</span>
                <h3 className="text-2xl font-bold mt-2">85.4%</h3>
                <p className="text-xs text-green-500 flex items-center gap-0.5 mt-2"><ArrowUpRight className="h-3 w-3" /> Sangat Sehat</p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
                <span className="text-xs text-[#f28c1f] font-semibold uppercase">Target IRR Perkiraan</span>
                <h3 className="text-2xl font-bold mt-2">35.2%</h3>
                <p className="text-xs text-muted-foreground mt-2">Proyeksi pengembalian 5 tahun</p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
                <span className="text-xs text-indigo-500 font-semibold uppercase">Cash Runway</span>
                <h3 className="text-2xl font-bold mt-2">18.5 Bulan</h3>
                <p className="text-xs text-muted-foreground mt-2">Tingkat pengeluaran terkendali</p>
              </div>
            </div>

            {/* Chart Visuals */}
            <div id="valuations" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ARR Growth Bar Chart */}
              <section className="bg-card border border-border rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between" style={{ boxShadow: "var(--shadow-card)" }}>
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-emerald-500" /> Proyeksi Pendapatan Berulang Tahunan (ARR)
                  </h2>
                  <p className="text-sm text-muted-foreground">Proyeksi pertumbuhan top-line model bisnis SaaS Smartcoop.</p>
                </div>

                <div className="h-64 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={projectionData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} label={{ value: 'Juta Rp', angle: -90, position: 'insideLeft', fill: '#888888' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }}
                      />
                      <Bar name="ARR (Juta)" dataKey="ARR" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                      <Bar name="EBITDA (Juta)" dataKey="EBITDA" fill="#f28c1f" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Valuation model summaries */}
              <section className="bg-card border border-border rounded-2xl p-6 lg:col-span-1 space-y-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-3">
                  <Award className="h-5 w-5 text-emerald-500" /> Ringkasan Analisis Valuasi
                </h2>

                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-xl bg-background">
                    <h4 className="font-semibold text-sm">Metode Kelipatan Pendapatan (Multiples)</h4>
                    <p className="text-xs text-muted-foreground mt-1">Menggunakan rata-rata multiples SaaS regional sebesar 6.5x ARR.</p>
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span className="text-muted-foreground">Implied Value</span>
                      <span className="font-bold text-emerald-500">Rp 11.7 Miliar</span>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-xl bg-background">
                    <h4 className="font-semibold text-sm">Arus Kas Terdiskonto (DCF)</h4>
                    <p className="text-xs text-muted-foreground mt-1">Menggunakan WACC 12.5% dan Terminal Growth Rate 3.0%.</p>
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span className="text-muted-foreground">Implied Value</span>
                      <span className="font-bold text-emerald-500">Rp 24.5 Miliar</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Download reports and pitch deck */}
            <section id="downloads" className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-500" /> Pusat Unduh Dokumen Pendukung
              </h2>
              <p className="text-sm text-muted-foreground">Unduh laporan audit model keuangan, slide pitch deck, dan lembar asumsi lengkap perusahaan.</p>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={handleDownloadDeck}
                  disabled={downloadingDeck}
                  className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors text-left disabled:opacity-50"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Pitch Deck Perusahaan</h4>
                    <p className="text-xs text-muted-foreground">PPTX format - Rangkuman Model Bisnis & Rencana Fundraising.</p>
                  </div>
                  <Download className={`h-5 w-5 text-primary ${downloadingDeck ? "animate-pulse" : ""}`} />
                </button>

                <button
                  onClick={handleDownloadReport}
                  disabled={downloadingReport}
                  className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors text-left disabled:opacity-50"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Laporan Finansial Lengkap (5-Tahun)</h4>
                    <p className="text-xs text-muted-foreground">PDF format - Proyeksi Laba Rugi, Neraca, & Arus Kas.</p>
                  </div>
                  <Download className={`h-5 w-5 text-emerald-500 ${downloadingReport ? "animate-pulse" : ""}`} />
                </button>
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Sebagai Investor Viewer, semua data yang disajikan bersifat rahasia dan tidak dapat diubah (Read-Only).</span>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
