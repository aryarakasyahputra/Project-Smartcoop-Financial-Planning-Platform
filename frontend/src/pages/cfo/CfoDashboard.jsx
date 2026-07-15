import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Building2, Users, LayoutDashboard, Settings, LogOut, 
  ChevronRight, Brain, PieChart, Activity, Calculator, Search, Bell, TrendingUp, RefreshCw
} from "lucide-react";

import FinancialAnalystTab from "./components/FinancialAnalystTab";
import AssumptionDriversTab from "./components/AssumptionDriversTab";
import ProjectionModelTab from "./components/ProjectionModelTab";

import { simulateProjections, formatRupiah, getAnalystInsights } from "./utils/financialModel";
import { useValuationModel } from "./utils/valuationHelper";
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
  const [isDirty, setIsDirty] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    growth: true,
    revenue: false,
    cogs: false,
    opex: false,
    funding: false
  });

  // Auth check & data load function
  const fetchData = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
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
        setIsDirty(false);
      }
    } catch (err) {
      console.error("Gagal memuat asumsi:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle inputs updating only the target year's input value
  const handleInputChange = (year, field, value) => {
    setAssumptionsByYear(prev => {
      const updated = { ...prev };
      const parsedYear = Number(year);
      
      // Update target year only
      updated[parsedYear] = {
        ...(updated[parsedYear] || { year: parsedYear }),
        [field]: value
      };
      
      return updated;
    });
    setIsDirty(true);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sanitizedAssumptions = useMemo(() => {
    const sanitized = {};
    for (const yr in assumptionsByYear) {
      sanitized[yr] = {};
      for (const key in assumptionsByYear[yr]) {
        const val = assumptionsByYear[yr][key];
        sanitized[yr][key] = val === "" ? 0 : val;
      }
    }
    return sanitized;
  }, [assumptionsByYear]);

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
        body: JSON.stringify(sanitizedAssumptions)
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Asumsi berhasil disimpan dan sekarang dapat dilihat oleh Founder!");
      setIsDirty(false);
    } catch (err) {
      console.error("Gagal menyimpan asumsi:", err);
      toast.error("Gagal menyimpan data ke server.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    if (!projectId) return;
    if (!confirm("Apakah Anda yakin ingin menghapus semua data dan mereset ke nol? Tindakan ini tidak dapat dibatalkan.")) return;
    
    const token = sessionStorage.getItem("token");
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8000/api/projects/${projectId}/reset`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to reset");
      const responseData = await res.json();
      
      // Update local state with zeroes
      const mapped = {};
      if (responseData && responseData.data && responseData.data.assumptions && Array.isArray(responseData.data.assumptions)) {
        responseData.data.assumptions.forEach(item => {
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
      setIsDirty(false);
      toast.success("Seluruh data asumsi berhasil direset ke nol!");
    } catch (err) {
      console.error("Gagal mereset asumsi:", err);
      toast.error("Gagal mereset data di server.");
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
  const data = useMemo(() => simulateProjections(sanitizedAssumptions), [sanitizedAssumptions]);
  const insights = useMemo(() => getAnalystInsights(data, sanitizedAssumptions), [data, sanitizedAssumptions]);
  const valuation = useValuationModel(data);

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
    <div className="h-screen overflow-hidden print:h-auto print:overflow-visible bg-[#f8fafc] text-foreground flex font-sans selection:bg-primary/20">
      
      {/* Sidebar - Identical to previous */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col flex-shrink-0 shadow-sm z-10 print:hidden">
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
              <TrendingUp className="h-4 w-4" /> Analisis & Ringkasan Model
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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden print:h-auto print:overflow-visible">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm print:hidden">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground shrink-0 whitespace-nowrap">
            <span className="hidden sm:inline">Finance</span>
            <ChevronRight className="h-4 w-4 hidden sm:inline" />
             <span className="text-foreground font-bold">
              {activeTab === "analyst" ? "Rekomendasi & Analisis AI" : 
               activeTab === "drivers" ? "Input Asumsi Keuangan" : 
               "Laporan Detail Proforma"}
            </span>
          </div>

          <div id="header-portal-target" className="flex-1 flex justify-end overflow-hidden mx-4 min-w-0"></div>
          
        </header>

        {/* Dynamic Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 print:p-0 print:h-auto print:overflow-visible print:bg-white">
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
                isDirty={isDirty}
              />
            )}

             {activeTab === "projection" && (
              <ProjectionModelTab 
                data={data} 
                formatRupiah={formatRupiah} 
                valuation={valuation}
              />
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
