import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Building2, Users, LayoutDashboard, Settings, LogOut, 
  ChevronRight, Brain, PieChart, Activity, Calculator, Search, Bell, TrendingUp, RefreshCw,
  AlertTriangle, X, Printer, Globe
} from "lucide-react";

import FinancialAnalystTab from "./components/FinancialAnalystTab";
import AssumptionDriversTab from "./components/AssumptionDriversTab";
import ProjectionModelTab from "./components/ProjectionModelTab";

import { simulateProjections, formatRupiah, getAnalystInsights } from "./utils/financialModel";
import { useValuationModel } from "./utils/valuationHelper";
import { toast } from "sonner";
import { useLanguage } from "../../context/LanguageContext";

export default function CfoDashboard({ userData, handleLogout }) {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("analyst");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sidebarTabs = [
    { id: "analyst", label: t("finance.sidebar.modelOverview", "Ringkasan Model"), icon: TrendingUp },
    { id: "drivers", label: t("finance.sidebar.financialAssumptions", "Asumsi Keuangan"), icon: Activity },
    { id: "projection", label: t("finance.sidebar.financialProjections", "Proyeksi Keuangan"), icon: PieChart }
  ];

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
  const insights = useMemo(() => getAnalystInsights(data, sanitizedAssumptions, language), [data, sanitizedAssumptions, language]);
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

      {/* Sidebar - Smartcoop Brand Blue Theme */}
      <aside className="w-64 bg-gradient-to-b from-[#003d6b] via-[#005fa4] to-[#002d50] text-white hidden md:flex flex-col flex-shrink-0 justify-between p-6 shadow-xl z-10 print:hidden border-r border-blue-900/40 relative overflow-hidden">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-start leading-none group pt-1">
            <span className="text-[24px] font-extrabold text-white tracking-tight flex items-center">
              smart<span className="text-[#FFD700]">coop</span>
            </span>
            <span className="text-[8.5px] font-bold text-blue-200/80 tracking-[0.22em] uppercase mt-1">
              FINANCIAL
            </span>
          </div>

          <div className="space-y-1.5 relative">
            <p className="px-3 text-[11px] font-extrabold text-[#FFD700] uppercase tracking-wider mb-3">
              {t("finance.sidebar.sectionTitle", "FINANSIAL & STRATEGI")}
            </p>
            {sidebarTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl transition-all duration-200 font-bold text-left text-sm border-l-4 cursor-pointer ${
                    isActive 
                      ? "bg-white/15 backdrop-blur-md text-white border-[#FFD700] shadow-md shadow-black/10" 
                      : "border-transparent text-blue-100/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <tab.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-[#FFD700]" : "text-blue-200/60 group-hover:text-white"}`} /> 
                    <span className="truncate text-xs sm:text-sm">{tab.label}</span>
                  </div>
                  {isActive && <div className="h-2 w-2 rounded-full bg-[#FFD700] shadow-2xs shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-white/15 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="h-9 w-9 rounded-xl bg-[#FFD700] text-[#003d6b] flex items-center justify-center font-extrabold text-xs shadow-md shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{t("finance.sidebar.financeTeam", "Tim Keuangan")}</p>
              <p className="text-[10px] font-bold text-[#FFD700] flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" /> {t("finance.sidebar.cfoMode", "CFO Mode")}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-black/20 transition-all duration-200 cursor-pointer border-none"
          >
            <LogOut className="h-4 w-4 text-white" /> 
            <span>{t("finance.sidebar.logout", "Keluar")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden print:h-auto print:overflow-visible">
        {/* Header - Workspace & Company Info with Language Switcher Toggle */}
        <header className="h-16 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 print:hidden">
          <div className="flex items-center gap-3 text-sm font-semibold shrink-0 whitespace-nowrap">
            <div className="h-8 w-8 rounded-lg bg-[#005fa4]/10 dark:bg-blue-950/40 flex items-center justify-center text-[#005fa4] dark:text-blue-400 shrink-0 border border-[#005fa4]/15">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
                {companyAccess?.company?.name || t("finance.header.smartcoopDefault", "Koperasi Smartcoop")}
              </span>
            </div>
          </div>

          {/* Right Header Actions: Navigation Portal Target & Language Switcher */}
          <div className="flex items-center justify-between flex-1 min-w-0 ml-4">
            <div id="header-portal-target" className="flex items-center justify-center overflow-hidden flex-1 mx-2 min-w-0"></div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
              <Globe className="h-3.5 w-3.5 text-slate-400 ml-1.5 shrink-0" />
              <button
                onClick={() => setLanguage("id")}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  language === "id"
                    ? "bg-[#005fa4] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-[#005fa4] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 print:p-0 print:h-auto print:overflow-visible print:bg-white">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Header Title Section with Integrated Inline Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-2 border-b border-slate-200/60 dark:border-slate-800">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {activeTab === "analyst" && t("finance.header.analystTitle", "Analisis & Rekomendasi Finansial")}
                  {activeTab === "drivers" && t("finance.header.driversTitle", "Input Asumsi Keuangan")}
                  {activeTab === "projection" && t("finance.header.projectionTitle", "Laporan Laba Rugi Proforma")}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs md:text-sm font-medium">
                  {activeTab === "analyst" && (language === "en" ? "Automated cooperative financial analysis, profitability status, and strategic insights." : "Analisis otomatis kelayakan keuangan koperasi, status profitabilitas, dan rekomendasi strategis.")}
                  {activeTab === "drivers" && (language === "en" ? "Configure operational & business assumptions below to see real-time impact on your financial projections." : "Atur asumsi bisnis dan operasional di bawah ini untuk melihat dampaknya secara langsung pada proyeksi keuangan Anda.")}
                  {activeTab === "projection" && (language === "en" ? "Proforma profit and loss report based on assumptions configured in the previous tab." : "Laporan laba rugi berdasarkan input asumsi yang diatur di tab sebelumnya.")}
                </p>
              </div>

              {activeTab === "projection" && (
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 text-xs font-bold bg-[#005fa4] hover:bg-[#004b82] text-white px-4 py-2.5 rounded-xl shadow-md shadow-[#005fa4]/20 transition-all cursor-pointer shrink-0 print:hidden"
                >
                  <Printer className="h-4 w-4 text-[#FFD700]" />
                  <span>{t("finance.projections.exportPdf", "Export PDF")}</span>
                </button>
              )}
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
                onAssumptionChange={handleInputChange}
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
