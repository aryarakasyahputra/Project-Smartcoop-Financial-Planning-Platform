import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Building2, Users, LayoutDashboard, Settings, LogOut, 
  ChevronRight, Brain, PieChart, Activity, Calculator, Search, Bell, TrendingUp, RefreshCw,
  AlertTriangle, X
} from "lucide-react";

import FinancialAnalystTab from "./components/FinancialAnalystTab";
import AssumptionDriversTab from "./components/AssumptionDriversTab";
import ProjectionModelTab from "./components/ProjectionModelTab";

import { simulateProjections, formatRupiah, getAnalystInsights } from "./utils/financialModel";
import { useValuationModel } from "./utils/valuationHelper";
import { toast } from "sonner";

const SIDEBAR_TABS = [
  { id: "analyst", label: "Analisis & Ringkasan Model", icon: TrendingUp },
  { id: "drivers", label: "Input Asumsi Keuangan", icon: Activity },
  { id: "projection", label: "Laporan Detail Proforma", icon: PieChart }
];

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
  const [showResetModal, setShowResetModal] = useState(false);
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

  // Open the reset confirmation modal
  const handleResetData = () => {
    if (!projectId) return;
    setShowResetModal(true);
  };

  // Actually perform the reset after user confirms via modal
  const executeReset = async () => {
    setShowResetModal(false);
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
          <div className="space-y-1.5 relative">
            <p className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Finance & Strategy</p>
            {SIDEBAR_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-semibold text-left outline-none ${
                    isActive ? "text-primary-foreground" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="cfoSidebarIndicator"
                      className="absolute inset-0 bg-primary shadow-md rounded-xl z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <tab.icon className="h-5 w-5 relative z-10 shrink-0" /> 
                  <span className="relative z-10 leading-tight">{tab.label}</span>
                </button>
              );
            })}
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
              {activeTab === "analyst" ? "Ringkasan Model Finansial" :
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
                  {activeTab === "drivers" && "Atur asumsi bisnis dan operasional di bawah ini untuk melihat dampaknya secara langsung pada proyeksi keuangan Anda."}
                  {activeTab === "projection" && "Laporan laba rugi berdasarkan input asumsi yang diatur di tab sebelumnya."}
                </p>
              </div>
            </div>

            {/* Render Active Component */}
            {activeTab === "analyst" && (
              <FinancialAnalystTab
                insights={insights}
                data={data}
                onRecalculateClick={() => setActiveTab("drivers")}
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
                handleResetData={handleResetData}
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
      {/* Custom Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Transparent click-away layer */}
          <div
            className="absolute inset-0"
            onClick={() => setShowResetModal(false)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 p-0">
            {/* Close button */}
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon & Content */}
            <div className="p-6 pb-0 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Reset Semua Data Asumsi?
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Seluruh data asumsi keuangan akan <span className="font-semibold text-red-600">direset ke nol</span> untuk semua tahun proyeksi. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={executeReset}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all shadow-sm"
              >
                Ya, Reset Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
