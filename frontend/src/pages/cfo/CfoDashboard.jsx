import React, { useState, useEffect, useMemo } from "react";
import { 
  Building2, Users, LayoutDashboard, Settings, LogOut, 
  ChevronRight, Brain, PieChart, Activity, Calculator, Search, Bell
} from "lucide-react";

import FinancialAnalystTab from "./components/FinancialAnalystTab";
import AssumptionDriversTab from "./components/AssumptionDriversTab";
import ProjectionModelTab from "./components/ProjectionModelTab";

import { simulateProjections, getAnalystInsights, formatRupiah } from "./utils/financialModel";
import { toast } from "sonner";

export default function CfoDashboard({ userData, handleLogout }) {
  const [activeTab, setActiveTab] = useState("analyst");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const companyAccess = userData?.company_accesses?.[0];
  const projectId = companyAccess?.company?.projects?.[0]?.id;
  
  // States
  const [selectedEditYear, setSelectedEditYear] = useState(2025);
  const [assumptionsByYear, setAssumptionsByYear] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    growth: true,
    revenue: false,
    cogs: false,
    opex: false,
    funding: false
  });

  // Auth check & data load
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchData = async () => {
      if (!projectId) {
        setLoading(false);
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
          // Convert array to object keyed by year
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
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle inputs
  const handleInputChange = (year, field, value) => {
    setAssumptionsByYear(prev => ({
      ...prev,
      [year]: {
        ...(prev[year] || { year }),
        [field]: value
      }
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSaveAssumptions = async () => {
    if (!projectId) return;
    const token = sessionStorage.getItem("token");
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8000/api/projects/${projectId}/assumptions`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(assumptionsByYear)
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Asumsi berhasil disimpan dan sekarang dapat dilihat oleh Founder!");
    } catch (err) {
      console.error("Gagal menyimpan asumsi:", err);
      toast.error("Gagal menyimpan data ke server.");
    } finally {
      setSaving(false);
    }
  };

  // Logout handled by parent (Dashboard.jsx) or fallback
  const onLogout = handleLogout || (() => {
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  });

  // Run projections based on current assumptions
  const data = useMemo(() => simulateProjections(assumptionsByYear), [assumptionsByYear]);
  const insights = useMemo(() => getAnalystInsights(data, assumptionsByYear), [data, assumptionsByYear]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-semibold">Memuat Model Finansial...</p>
        </div>
      </div>
    );
  }

  const activeAssumptions = assumptionsByYear[selectedEditYear] || {};

  return (
    <div className="min-h-screen bg-[#f8fafc] text-foreground flex font-sans selection:bg-primary/20">
      
      {/* Sidebar - Identical to previous */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col sticky top-0 h-screen shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-border bg-background">
          <a href="/" className="flex flex-col items-start leading-none group">
            <span className="text-[22px] font-bold text-[#005fa4] tracking-tight">
              smart<span className="text-[#FFD700]">coop</span>
            </span>
            <span className="text-[8px] font-medium text-[#005fa4]/70 tracking-[0.2em] uppercase mt-0.5">
              financial
            </span>
          </a>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-1">
            <p className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Finance & Strategy</p>
             <button
              onClick={() => setActiveTab("analyst")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold ${
                activeTab === "analyst" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Brain className="h-4 w-4" /> Rekomendasi & Analisis AI
            </button>
            <button
              onClick={() => setActiveTab("drivers")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold ${
                activeTab === "drivers" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Activity className="h-4 w-4" /> Input Asumsi Keuangan
            </button>
            <button
              onClick={() => setActiveTab("projection")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold ${
                activeTab === "projection" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <PieChart className="h-4 w-4" /> Laporan Detail Proforma
            </button>
          </div>
          
          <div className="space-y-1">
            <p className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Perusahaan</p>
            <a href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all font-semibold">
              <Settings className="h-4 w-4" /> Pengaturan Data
            </a>
          </div>
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-muted/50 border border-border">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Tim Keuangan</p>
              <p className="text-xs text-muted-foreground truncate">CFO Mode</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full mt-3 flex items-center gap-2 justify-center px-4 py-2 text-sm text-red-500 font-semibold hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <span className="hidden sm:inline">Finance</span>
            <ChevronRight className="h-4 w-4 hidden sm:inline" />
            <span className="text-foreground font-bold">
              {activeTab === "analyst" ? "Rekomendasi & Analisis AI" : 
               activeTab === "drivers" ? "Input Asumsi Keuangan" : "Laporan Detail Proforma"}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Cari metrik..." 
                className="pl-9 pr-4 py-1.5 bg-muted/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 transition-all"
              />
            </div>
            <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-card"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Title section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  {activeTab === "analyst" && "Analisis & Rekomendasi Finansial"}
                  {activeTab === "drivers" && "Input Asumsi Keuangan"}
                  {activeTab === "projection" && "Laporan Laba Rugi Proforma"}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm font-medium">
                  {activeTab === "analyst" && "Analisis otomatis kelayakan keuangan koperasi, status profitabilitas, dan rekomendasi strategis."}
                  {activeTab === "drivers" && "Masukkan target pertumbuhan dan struktur biaya di bawah ini untuk memperbarui kalkulasi proyeksi."}
                  {activeTab === "projection" && "Laporan laba rugi berdasarkan input asumsi yang diatur di tab sebelumnya."}
                </p>
              </div>
            </div>

            {/* Render Active Component */}
            {activeTab === "analyst" && (
              <FinancialAnalystTab 
                insights={insights} 
                data={data} 
              />
            )}

            {activeTab === "drivers" && (
              <AssumptionDriversTab
                selectedEditYear={selectedEditYear}
                setSelectedEditYear={setSelectedEditYear}
                activeAssumptions={activeAssumptions}
                handleInputChange={handleInputChange}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                handleSaveAssumptions={handleSaveAssumptions}
                saving={saving}
                data={data}
              />
            )}

            {activeTab === "projection" && (
              <ProjectionModelTab 
                data={data} 
                formatRupiah={formatRupiah} 
              />
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
