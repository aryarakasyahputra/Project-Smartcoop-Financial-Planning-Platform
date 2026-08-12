import React, { useState, useEffect, useMemo } from "react";
import { 
  LogOut, Building, ShieldCheck, Sparkles, Database, 
  LayoutDashboard, BarChart3, LineChart, Shield, Download,
  TrendingUp, Wallet, Award, ArrowUpRight, BarChart4, FileText,
  Activity, Calculator, Users, Layers, Info
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, LineChart as ReLineChart, 
  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import ProjectionModelTab from "../cfo/components/ProjectionModelTab";
import { simulateProjections, formatRupiah } from "../cfo/utils/financialModel";
import { useValuationModel } from "../cfo/utils/valuationHelper";
import ValuationWaterfallChart from "../../components/charts/ValuationWaterfallChart";
import { RevenueChart, ARRChart, EBITDAChart, CoopsChart } from "../../components/charts/FinancialMetricCharts";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../context/CurrencyContext";
import CurrencySwitcher from "../../components/CurrencySwitcher";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const MetricTooltip = ({ label, textEn, textId, language, align = "left" }) => (
  <div className="relative group flex items-center gap-1 w-fit">
    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{label}</span>
    <Info className="w-3 h-3 text-muted-foreground/60 cursor-pointer" />
    <div className={`absolute bottom-full mb-2 w-64 p-2.5 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-2xl font-normal normal-case tracking-normal leading-relaxed pointer-events-none ${
      align === "right" ? "right-0 text-right" : align === "center" ? "left-1/2 -translate-x-1/2 text-center" : "left-0 text-left"
    }`}>
      {language === "en" ? textEn : textId}
      <div className={`absolute top-full border-[5px] border-transparent border-t-slate-900 dark:border-t-slate-800 ${
        align === "right" ? "right-4" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-4"
      }`}></div>
    </div>
  </div>
);

export default function InvestorDashboard({ userData, handleLogout }) {
  const { language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const formatRupiah = formatCurrency;
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
        const response = await fetch(`/api/projects/${projectId}/assumptions`, {
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

  const data2029 = useMemo(() => {
    if (!detailedProjectionData || detailedProjectionData.length === 0) return {};
    return detailedProjectionData[detailedProjectionData.length - 1] || {};
  }, [detailedProjectionData]);

  const chartData = useMemo(() => {
    return detailedProjectionData.map(d => ({
      year: d.year,
      revenueB: Number((d.totalRevenue / 1_000_000_000).toFixed(2)),
      arrB: Number((d.arr / 1_000_000_000).toFixed(2)),
      ebitdaB: Number((d.ebitda / 1_000_000_000).toFixed(2)),
      endingCashB: Number((d.endingCash / 1_000_000_000).toFixed(2)),
      endingCoops: d.endingCoops
    }));
  }, [detailedProjectionData]);

  const activeExitVal = useMemo(() => {
    return (data2029.totalRevenue || 0) * (valuation.exitMultipleBase || 5);
  }, [data2029, valuation]);

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
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="mt-8 pt-6 border-t border-white/15 space-y-4">
          {/* Currency & Language Switchers */}
          <div className="flex items-center gap-2">
            <CurrencySwitcher variant="sidebar" />
            <LanguageSwitcher variant="sidebar" />
          </div>

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
          <div className="flex items-center gap-2">
            {primaryCompany && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl">
                <Building className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold text-foreground">{primaryCompany.name}</span>
              </div>
            )}
          </div>
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
            <div className="space-y-6">
              {/* Unit Economics */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2"><Wallet className="w-5 h-5 text-primary" /> Unit Economics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="CAC" language={language} textEn="(Sales & Marketing Opex + 35% Payroll) / New Coops. If 0, check marketing assumptions & new customer targets." textId="(Opex Sales & Marketing + 35% Payroll) / Koperasi Baru. Jika Rp 0, pastikan asumsi biaya marketing & target pelanggan baru sudah diisi." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{formatRupiah(data2029.estimatedCac || 0)}</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="LTV" language={language} textEn="(MRR * Gross Margin) / Churn Rate. If 0, check churn rate and revenue assumptions." textId="(MRR * Gross Margin) / Churn Rate. Jika Rp 0, periksa asumsi tingkat churn dan pendapatan." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{formatRupiah(data2029.estimatedLtv || 0)}</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="LTV/CAC Ratio" language={language} textEn="LTV divided by CAC. >3x is considered healthy." textId="LTV dibagi dengan CAC. Rasio >3x dianggap sangat sehat." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">{(data2029.ltvCacRatio || 0).toFixed(1)}x</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="Payback Period" language={language} textEn="Months to recover CAC. CAC / (MRR * Gross Margin). <12 months is ideal." textId="Bulan yang dibutuhkan untuk balik modal CAC. CAC / (MRR * Gross Margin). Kurang dari 12 bulan sangat ideal." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{(data2029.cacPaybackMonths || 0).toFixed(1)} {language === "en" ? "Mos" : "Bulan"}</h3>
                  </div>
                </div>
              </div>

              {/* SaaS Metrics */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500" /> SaaS Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="MRR" language={language} textEn="Monthly Recurring Revenue = ARR / 12." textId="Pendapatan Berulang Bulanan (ARR dibagi 12)." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{formatRupiah(data2029.mrr || 0)}</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="Churn Rate" language={language} textEn="Annual percentage of customers who cancel their subscription." textId="Persentase tahunan koperasi yang membatalkan langganan." />
                    <h3 className="text-xl font-black mt-1 text-rose-500">{(data2029.annualChurn || 0).toFixed(1)}%</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="NRR" language={language} textEn="Net Revenue Retention. Revenue retained from existing customers including upsells." textId="Net Revenue Retention. Retensi pendapatan dari pelanggan lama termasuk upsell." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">{(data2029.nrr || 0).toFixed(1)}%</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="Gross Margin" language={language} textEn="(Total Revenue - COGS) / Total Revenue. >80% is typical for SaaS." textId="(Total Revenue - HPP) / Total Revenue. Margin >80% sangat khas untuk bisnis SaaS." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{(data2029.grossMargin || 0).toFixed(1)}%</h3>
                  </div>
                </div>
              </div>

              {/* Growth Metrics */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" /> Growth Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="Revenue Growth YoY" language={language} textEn="Percentage growth of Total Revenue compared to the previous year." textId="Persentase pertumbuhan Total Pendapatan dibandingkan tahun sebelumnya." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">{((data2029.revYoyGrowth || 0) * 100).toFixed(1)}%</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="Customer Growth YoY" language={language} textEn="Percentage growth of Active Cooperatives compared to the previous year." textId="Persentase pertumbuhan jumlah Koperasi Aktif dibandingkan tahun sebelumnya." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">{((data2029.yoyCoopGrowth || 0) * 100).toFixed(1)}%</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="ARR Growth YoY" language={language} textEn="Percentage growth of Annual Recurring Revenue compared to the previous year." textId="Persentase pertumbuhan Pendapatan Berulang Tahunan (ARR) dibandingkan tahun sebelumnya." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">{((data2029.arrYoyGrowth || 0) * 100).toFixed(1)}%</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="EBITDA Margin" language={language} textEn="EBITDA divided by Total Revenue. Measures operational profitability." textId="EBITDA dibagi Total Pendapatan. Mengukur tingkat keuntungan operasional." />
                    <h3 className={`text-xl font-black mt-1 ${(data2029.ebitdaMargin || 0) >= 0 ? "text-foreground" : "text-rose-500"}`}>{(data2029.ebitdaMargin || 0).toFixed(1)}%</h3>
                  </div>
                </div>
              </div>

              {/* Investor Metrics */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Investor Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="Burn Rate / Mo" language={language} textEn="Average monthly cash deficit. Only applies if EBITDA is negative." textId="Rata-rata defisit kas per bulan. Berlaku saat perusahaan membukukan EBITDA negatif (bakar uang)." />
                    <h3 className="text-xl font-black mt-1 text-rose-500">{formatRupiah(data2029.monthlyBurn || 0)}</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="Runway" language={language} textEn="Ending Cash / Monthly Burn Rate. Shows how many months before cash runs out." textId="Saldo Kas / Burn Rate Bulanan. Menunjukkan berapa bulan kas bertahan sebelum habis." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{(data2029.runwayMonths || 0) >= 999 ? "Unlimited" : `${(data2029.runwayMonths || 0).toFixed(1)} ${language === "en" ? "Mos" : "Bln"}`}</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="Cash Balance" language={language} textEn="Ending cash balance for the year after all inflows (funding) and outflows." textId="Saldo akhir kas di penghujung tahun setelah dikurangi seluruh pengeluaran operasional dan investasi." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{formatRupiah(data2029.endingCash || 0)}</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="Break-even Year" language={language} textEn="The first year where EBITDA becomes positive." textId="Tahun pertama dimana EBITDA (keuntungan operasional) berubah menjadi positif." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">
                      {detailedProjectionData.find(row => row.ebitda > 0)?.year || (language === "en" ? "Not Reached" : "Belum")}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Visualizations */}
            <div id="valuations" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-extrabold flex items-center gap-2 text-foreground mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> {language === "en" ? "Revenue Trajectory (5 Years)" : "Lintasan Pendapatan (5 Tahun)"}
                </h3>
                <RevenueChart data={chartData} />
              </div>
              
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-extrabold flex items-center gap-2 text-foreground mb-2">
                  <Activity className="h-5 w-5 text-indigo-500" /> {language === "en" ? "ARR Growth" : "Pertumbuhan ARR"}
                </h3>
                <ARRChart data={chartData} />
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-extrabold flex items-center gap-2 text-foreground mb-2">
                  <Calculator className="h-5 w-5 text-amber-500" /> {language === "en" ? "EBITDA Projection" : "Proyeksi EBITDA"}
                </h3>
                <EBITDAChart data={chartData} />
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-extrabold flex items-center gap-2 text-foreground mb-2">
                  <Users className="h-5 w-5 text-emerald-500" /> {language === "en" ? "Cooperative Growth" : "Pertumbuhan Koperasi"}
                </h3>
                <CoopsChart data={chartData} />
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-2">
                <h3 className="text-base font-extrabold flex items-center gap-2 text-foreground mb-2">
                  <Layers className="h-5 w-5 text-primary" /> {language === "en" ? "Valuation Waterfall (Exit Year 5)" : "Waterfall Valuasi (Exit Tahun 5)"}
                </h3>
                <ValuationWaterfallChart valuation={valuation} activeExitVal={activeExitVal} />
              </div>
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
