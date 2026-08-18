import React, { useState, useEffect, useMemo } from "react";
import { 
  LogOut, Building, ShieldCheck, Sparkles, Database, 
  LayoutDashboard, BarChart3, LineChart, Shield, Download,
  TrendingUp, Wallet, Award, ArrowUpRight, BarChart4, FileText,
  Activity, Calculator, Users, Layers, Info, ChevronLeft, ChevronRight, X, Eye, FileSpreadsheet
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, LineChart as ReLineChart, 
  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import ProjectionModelTab from "../cfo/components/ProjectionModelTab";
import ExcelPreviewModal from "../cfo/components/ExcelPreviewModal";
import { simulateProjections, formatRupiah } from "../cfo/utils/financialModel";
import { useValuationModel } from "../cfo/utils/valuationHelper";
import ValuationWaterfallChart from "../../components/charts/ValuationWaterfallChart";
import { RevenueChart, ARRChart, EBITDAChart, CoopsChart } from "../../components/charts/FinancialMetricCharts";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../context/CurrencyContext";
import CurrencySwitcher from "../../components/CurrencySwitcher";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { toast } from "sonner";

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
  const { currency, formatCurrency } = useCurrency();
  const formatRupiah = formatCurrency;
  const [activeTab, setActiveTab] = useState("overview");
  const [downloadingDeck, setDownloadingDeck] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [showDeckPreview, setShowDeckPreview] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
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
  const [exportingExcel, setExportingExcel] = useState(false);
  const [showExcelPreview, setShowExcelPreview] = useState(false);

  const handleExportExcel = async () => {
    try {
      setExportingExcel(true);
      toast.loading(language === "en" ? "Generating Excel Model with formulas..." : "Membuat file Excel Financial Model beserta rumus...", { id: "excel-export" });
      
      const targetProjectId = projectId || 1;
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`/api/projects/${targetProjectId}/export-excel?currency=${encodeURIComponent(currency || 'IDR')}&lang=${encodeURIComponent(language || 'en')}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const compName = primaryCompany?.name || 'Smartcoop';
      link.download = `Smartcoop_Financial_Model_${compName.replace(/[^A-Za-z0-9_]/g, '_')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(language === "en" ? "Excel Financial Model exported successfully!" : "Berhasil mengunduh Excel Financial Model!", { id: "excel-export" });
    } catch (err) {
      console.error(err);
      toast.error((language === "en" ? "Failed to export Excel model: " : "Gagal mengunduh Excel model: ") + (err.message || ""), { id: "excel-export" });
    } finally {
      setExportingExcel(false);
    }
  };

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
      const companyName = primaryCompany?.name || "Koperasi Smartcoop";
      const exitYear = data2029.year || 2029;
      const numYears = detailedProjectionData.length || 5;
      const seedInvFormatted = formatCurrency(valuation.seedInv || 10_000_000_000, { lang: language });
      const seedInvShort = formatCurrency(valuation.seedInv || 10_000_000_000, { compact: true, lang: language });
      const equityPct = ((valuation.dynamicInvestorEquityFrac || 0.23) * 100).toFixed(0);
      const ebitdaMarginPct = (data2029.ebitdaMargin > 1 ? data2029.ebitdaMargin : (data2029.ebitdaMargin || 0.606) * 100).toFixed(1).replace(".", ",");
      const irrPct = ((valuation.irrBase || 0.223) * 100).toFixed(1).replace(".", ",");
      const exitValShort = formatCurrency(valuation.exitValBase || 117_900_000_000, { compact: true, lang: language });
      const invValShort = formatCurrency(valuation.invValBase || 27_400_000_000, { compact: true, lang: language });
      const moicVal = (valuation.moicBase || 2.7).toFixed(1);

      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Executive Pitch Deck Summary - ${companyName}</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              th { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background-color: #1d4370 !important; color: #ffffff !important; }
              tr.highlight-row td { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background-color: #dce6f2 !important; }
              tr.section-header-row td { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background-color: #d9e2ec !important; }
            }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              color: #0f172a; 
              margin: 0; 
              padding: 0; 
              background: #ffffff; 
              line-height: 1.5; 
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important; 
            }
            .header { background: linear-gradient(135deg, #003d6b, #005fa4) !important; color: white !important; padding: 24px; border-radius: 12px; margin-bottom: 20px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .header h1 { margin: 0; font-size: 22px; font-weight: 800; color: white !important; }
            .header p { margin: 4px 0 0 0; opacity: 0.9; font-size: 13px; font-weight: 600; color: white !important; }
            
            .section-title { font-size: 13px; font-weight: 800; color: #005fa4; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 2px solid #005fa4; padding-bottom: 4px; }
            
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; margin-bottom: 20px; }
            .card { border: 2px solid #fbbf24; border-radius: 12px; padding: 16px; background: #fffdf5 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .card-pill { background: #fef3c7 !important; border: 1px solid #fde68a; padding: 12px; border-radius: 10px; text-align: center; margin-bottom: 12px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .card-pill .big-val { font-size: 22px; font-weight: 900; color: #0f172a; }
            .card-pill .sub-txt { font-size: 10px; font-weight: 800; color: #b45309; text-transform: uppercase; }
            
            .table-details { width: 100%; border-collapse: collapse; font-size: 11px; }
            .table-details tr { border-bottom: 1px solid #cbd5e1; }
            .table-details td { padding: 5px 4px; }
            .table-details td.label { color: #64748b; font-weight: 500; }
            .table-details td.val { font-weight: 800; color: #0f172a; text-align: right; }
            
            .table-projections { width: 100%; border-collapse: collapse; font-size: 10.5px; margin-top: 10px; border: 1.5px solid #64748b; }
            .table-projections th { background-color: #1d4370 !important; color: #ffffff !important; padding: 7px 9px; text-align: right; font-weight: 800; border: 1px solid #475569; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .table-projections th:first-child { text-align: left; }
            .table-projections td { padding: 6px 9px; border: 1px solid #94a3b8; text-align: right; color: #0f172a; }
            .table-projections td:first-child { text-align: left; font-weight: 600; color: #0f172a; background-color: #f8fafc !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .table-projections tr.highlight-row td { background-color: #dce6f2 !important; font-weight: 800; color: #0f172a !important; border-top: 1.5px solid #64748b; border-bottom: 1.5px solid #64748b; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .table-projections tr.section-header-row td { background-color: #d9e2ec !important; font-weight: 900; text-transform: uppercase; text-align: left; color: #0f172a !important; padding: 7px 9px; border-top: 1.5px solid #64748b; border-bottom: 1.5px solid #64748b; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

            .footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>EXECUTIVE PITCH DECK & FINANCIAL PROJECTION</h1>
            <p>${companyName.toUpperCase()} — Smartcoop Financial Planning Platform</p>
          </div>
          <div class="section-title">Ringkasan Proyeksi Keuangan ${numYears}-Tahun</div>
          <table class="table-projections">
            <thead>
              <tr>
                <th>Metric / Driver</th>
                ${detailedProjectionData.map(d => `<th>${d.year}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Active Cooperatives</td>
                ${detailedProjectionData.map(d => `<td>${new Intl.NumberFormat('id-ID').format(Math.round(d.endingCoops || 0))}</td>`).join('')}
              </tr>
              <tr>
                <td>Members</td>
                ${detailedProjectionData.map(d => `<td>${new Intl.NumberFormat('id-ID').format(Math.round(d.totalMembers || 0))}</td>`).join('')}
              </tr>
              <tr class="section-header-row">
                <td colspan="${detailedProjectionData.length + 1}">EBITDA</td>
              </tr>
              <tr>
                <td style="font-weight: 800;">Total Revenue</td>
                ${detailedProjectionData.map(d => `<td style="font-weight: 800;">${formatCurrency(d.totalRevenue || 0, { maximumFractionDigits: 0 })}</td>`).join('')}
              </tr>
              <tr>
                <td>Annual Recurring Revenue (ARR)</td>
                ${detailedProjectionData.map(d => `<td>${formatCurrency(d.arr || 0, { maximumFractionDigits: 0 })}</td>`).join('')}
              </tr>
              <tr>
                <td>COGS</td>
                ${detailedProjectionData.map(d => `<td>${formatCurrency(d.totalCogs || 0, { maximumFractionDigits: 0 })}</td>`).join('')}
              </tr>
              <tr class="highlight-row">
                <td style="font-weight: 800;">Gross Profit</td>
                ${detailedProjectionData.map(d => `<td style="font-weight: 800;">${formatCurrency(d.grossProfit || 0, { maximumFractionDigits: 0 })}</td>`).join('')}
              </tr>
              <tr>
                <td>Gross Margin</td>
                ${detailedProjectionData.map(d => `<td>${(d.grossMargin > 1 ? d.grossMargin : (d.grossMargin || 0) * 100).toFixed(1).replace(".", ",")}%</td>`).join('')}
              </tr>
              <tr>
                <td>OPEX</td>
                ${detailedProjectionData.map(d => `<td>${formatCurrency(d.totalOpex || 0, { maximumFractionDigits: 0 })}</td>`).join('')}
              </tr>
              <tr class="highlight-row">
                <td style="font-weight: 900;">EBITDA</td>
                ${detailedProjectionData.map(d => `<td style="font-weight: 900;">${formatCurrency(d.ebitda || 0, { maximumFractionDigits: 0 })}</td>`).join('')}
              </tr>
              <tr>
                <td>EBITDA Margin</td>
                ${detailedProjectionData.map(d => `<td>${(d.ebitdaMargin > 1 ? d.ebitdaMargin : (d.ebitdaMargin || 0) * 100).toFixed(1).replace(".", ",")}%</td>`).join('')}
              </tr>
              <tr class="highlight-row">
                <td style="font-weight: 900;">Net Profit</td>
                ${detailedProjectionData.map(d => `<td style="font-weight: 900;">${formatCurrency(d.netProfit || 0, { maximumFractionDigits: 0 })}</td>`).join('')}
              </tr>
              <tr>
                <td>Net Margin</td>
                ${detailedProjectionData.map(d => `<td>${(d.netMargin > 1 ? d.netMargin : (d.netMargin || 0) * 100).toFixed(1).replace(".", ",")}%</td>`).join('')}
              </tr>
            </tbody>
          </table>

          <div class="section-title" style="margin-top: 24px;">Struktur Pendanaan & Target Return Investor</div>
          <div class="grid">
            <div class="card">
              <div class="card-pill">
                <div class="big-val">${seedInvShort}</div>
                <div class="sub-txt">Required Investment</div>
              </div>
              <table class="table-details">
                <tr><td class="label">Investment Stage</td><td class="val">Seed Round</td></tr>
                <tr><td class="label">Investment Sought</td><td class="val">${seedInvFormatted}</td></tr>
                <tr><td class="label">Investment Instrument</td><td class="val">Preferred Equity (Seed Preferred Shares)</td></tr>
                <tr><td class="label">Growth Target (${exitYear})</td><td class="val">${new Intl.NumberFormat("id-ID").format(data2029.endingCoops || 1400)} Active Cooperatives</td></tr>
                <tr><td class="label">Coop Members (${exitYear})</td><td class="val">${new Intl.NumberFormat("id-ID").format(data2029.totalMembers || 1050000)} Members</td></tr>
                <tr><td class="label">Projected ARR (${exitYear})</td><td class="val">${formatCurrency(data2029.arr || 0, { compact: true, lang: language })}</td></tr>
                <tr><td class="label">Projected Revenue (${exitYear})</td><td class="val">${formatCurrency(data2029.totalRevenue || 0, { compact: true, lang: language })}</td></tr>
              </table>
            </div>

            <div class="card">
              <div class="card-pill">
                <div class="big-val">${equityPct}%</div>
                <div class="sub-txt">Equity Offered</div>
              </div>
              <table class="table-details">
                <tr><td class="label">Target Equity Offering</td><td class="val">${equityPct} – ${Number(equityPct) + 2}%</td></tr>
                <tr><td class="label">Projected EBITDA Margin (${exitYear})</td><td class="val">${ebitdaMarginPct}%</td></tr>
                <tr><td class="label">Estimated IRR (${numYears} years)</td><td class="val">${irrPct}%</td></tr>
                <tr><td class="label">Estimated Exit Valuation (${exitYear})</td><td class="val">${exitValShort}</td></tr>
                <tr><td class="label">Investor Equity Value</td><td class="val">${invValShort}</td></tr>
                <tr><td class="label">MOIC Multiple Assumption</td><td class="val">${moicVal}x</td></tr>
              </table>
            </div>
          </div>

          <div class="footer">
            DOKUMEN RAHASIA (CONFIDENTIAL) — Diterbitkan oleh Investor Console Smartcoop Financial Platform.
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }, 200);
  };

  const handleDownloadReport = () => {
    setActiveTab("projections");
    setTimeout(() => {
      window.print();
    }, 150);
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
                <span className="whitespace-nowrap truncate">{language === "en" ? "Portfolio Review" : "Ulasan Portofolio"}</span>
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
                <span className="whitespace-nowrap truncate">{language === "en" ? "Financial Projection Model" : "Model Proyeksi Keuangan"}</span>
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
            <span>{language === "en" ? "Logout" : "Keluar"}</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto md:h-screen">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {activeTab === "overview" 
                ? (language === "en" ? "Investor Reporting Console" : "Konsol Pelaporan Investor") 
                : (language === "en" ? "Financial Projection Model" : "Model Proyeksi Keuangan")
              }
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeTab === "overview" 
                ? (language === "en" ? "Exclusive read-only access to financial projections, scenarios, and valuation." : "Akses eksklusif read-only ke proyeksi model finansial, skenario, dan valuasi koperasi/SME.") 
                : (language === "en" ? "Comprehensive profit and loss projections based on assumptions set by the CFO team." : "Proyeksi laba rugi komprehensif berdasarkan asumsi yang telah diatur oleh tim CFO.")
              }
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
                {language === "en" ? "Assumption data is not available yet. Projections cannot be displayed." : "Data asumsi belum tersedia. Proyeksi tidak dapat ditampilkan."}
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
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2"><Wallet className="w-5 h-5 text-primary" /> {language === "en" ? "Unit Economics" : "Ekonomi Unit"}</h3>
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
                    <MetricTooltip label={language === "en" ? "LTV/CAC Ratio" : "Rasio LTV/CAC"} language={language} textEn="LTV divided by CAC. >3x is considered healthy." textId="LTV dibagi dengan CAC. Rasio >3x dianggap sangat sehat." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">{(data2029.ltvCacRatio || 0).toFixed(1)}x</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label={language === "en" ? "Payback Period" : "Periode Payback"} language={language} textEn="Months to recover CAC. CAC / (MRR * Gross Margin). <12 months is ideal." textId="Bulan yang dibutuhkan untuk balik modal CAC. CAC / (MRR * Gross Margin). Kurang dari 12 bulan sangat ideal." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{(data2029.cacPaybackMonths || 0).toFixed(1)} {language === "en" ? "Mos" : "Bulan"}</h3>
                  </div>
                </div>
              </div>

              {/* SaaS Metrics */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500" /> {language === "en" ? "SaaS Metrics" : "Metrik SaaS"}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="MRR" language={language} textEn="Monthly Recurring Revenue = ARR / 12." textId="Pendapatan Berulang Bulanan (ARR dibagi 12)." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{formatRupiah(data2029.mrr || 0)}</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label={language === "en" ? "Churn Rate" : "Tingkat Churn"} language={language} textEn="Annual percentage of customers who cancel their subscription." textId="Persentase tahunan koperasi yang membatalkan langganan." />
                    <h3 className="text-xl font-black mt-1 text-rose-500">{(data2029.annualChurn || 0).toFixed(1)}%</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label="NRR" language={language} textEn="Net Revenue Retention. Revenue retained from existing customers including upsells." textId="Net Revenue Retention. Retensi pendapatan dari pelanggan lama termasuk upsell." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">{(data2029.nrr || 0).toFixed(1)}%</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label={language === "en" ? "Gross Margin" : "Margin Laba Kotor"} language={language} textEn="(Total Revenue - COGS) / Total Revenue. >80% is typical for SaaS." textId="(Total Revenue - HPP) / Total Revenue. Margin >80% sangat khas untuk bisnis SaaS." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{(data2029.grossMargin || 0).toFixed(1)}%</h3>
                  </div>
                </div>
              </div>

              {/* Growth Metrics */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" /> {language === "en" ? "Growth Metrics" : "Metrik Pertumbuhan"}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label={language === "en" ? "Revenue Growth YoY" : "Pertumbuhan Pendapatan YoY"} language={language} textEn="Percentage growth of Total Revenue compared to the previous year." textId="Persentase pertumbuhan Total Pendapatan dibandingkan tahun sebelumnya." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">{((data2029.revYoyGrowth || 0) * 100).toFixed(1)}%</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label={language === "en" ? "Customer Growth YoY" : "Pertumbuhan Koperasi YoY"} language={language} textEn="Percentage growth of Active Cooperatives compared to the previous year." textId="Persentase pertumbuhan jumlah Koperasi Aktif dibandingkan tahun sebelumnya." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">{((data2029.yoyCoopGrowth || 0) * 100).toFixed(1)}%</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label={language === "en" ? "ARR Growth YoY" : "Pertumbuhan ARR YoY"} language={language} textEn="Percentage growth of Annual Recurring Revenue compared to the previous year." textId="Persentase pertumbuhan Pendapatan Berulang Tahunan (ARR) dibandingkan tahun sebelumnya." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">{((data2029.arrYoyGrowth || 0) * 100).toFixed(1)}%</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label={language === "en" ? "EBITDA Margin" : "Margin EBITDA"} language={language} textEn="EBITDA divided by Total Revenue. Measures operational profitability." textId="EBITDA dibagi Total Pendapatan. Mengukur tingkat keuntungan operasional." />
                    <h3 className={`text-xl font-black mt-1 ${(data2029.ebitdaMargin || 0) >= 0 ? "text-foreground" : "text-rose-500"}`}>{(data2029.ebitdaMargin || 0).toFixed(1)}%</h3>
                  </div>
                </div>
              </div>

              {/* Investor Metrics */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> {language === "en" ? "Investor Metrics" : "Metrik Investor"}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label={language === "en" ? "Burn Rate / Mo" : "Bakar Uang / Bln"} language={language} textEn="Average monthly cash deficit. Only applies if EBITDA is negative." textId="Rata-rata defisit kas per bulan. Berlaku saat perusahaan membukukan EBITDA negatif (bakar uang)." />
                    <h3 className="text-xl font-black mt-1 text-rose-500">{formatRupiah(data2029.monthlyBurn || 0)}</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label={language === "en" ? "Runway" : "Ketahanan Kas (Runway)"} language={language} textEn="Ending Cash / Monthly Burn Rate. Shows how many months before cash runs out." textId="Saldo Kas / Burn Rate Bulanan. Menunjukkan berapa bulan kas bertahan sebelum habis." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{(data2029.runwayMonths || 0) >= 999 ? (language === "en" ? "Unlimited" : "Tidak Terbatas") : `${(data2029.runwayMonths || 0).toFixed(1)} ${language === "en" ? "Mos" : "Bln"}`}</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label={language === "en" ? "Cash Balance" : "Saldo Kas"} language={language} textEn="Ending cash balance for the year after all inflows (funding) and outflows." textId="Saldo akhir kas di penghujung tahun setelah dikurangi seluruh pengeluaran operasional dan investasi." />
                    <h3 className="text-xl font-black mt-1 text-foreground">{formatRupiah(data2029.endingCash || 0)}</h3>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border">
                    <MetricTooltip label={language === "en" ? "Break-even Year" : "Tahun Impas (Break-even)"} language={language} textEn="The first year where EBITDA becomes positive." textId="Tahun pertama dimana EBITDA (keuntungan operasional) berubah menjadi positif." />
                    <h3 className="text-xl font-black mt-1 text-emerald-500">
                      {detailedProjectionData.find(row => row.ebitda > 0)?.year || (language === "en" ? "Not Reached" : "Belum")}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

        <div id="valuations" className="space-y-6 mt-8">
              {/* Financial Projection Table Section */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#005fa4]/10 text-[#005fa4] dark:bg-blue-950/50 dark:text-blue-400 border border-[#005fa4]/20">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {language === "en" ? "Financial Projection" : "Proyeksi Keuangan"}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {language === "en" ? "Proforma P&L statement, unit economics, and operational growth forecasts." : "Laporan Laba Rugi Proforma, unit ekonomis, dan proyeksi pertumbuhan operasional."}
                    </p>
                  </div>
                </div>

                {/* Table matching Photo 2 */}
                <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#1d4370] text-white">
                      <tr>
                        <th className="px-4 py-3 font-extrabold text-white text-xs md:text-sm bg-[#1d4370] border-r border-blue-900/30">
                          {language === "en" ? "Metric / Driver" : "Metrik / Asumsi"}
                        </th>
                        {detailedProjectionData.map((col) => (
                          <th key={col.year} className="px-4 py-3 font-extrabold text-white text-right text-xs md:text-sm bg-[#1d4370]">
                            {col.year}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {/* Active Cooperatives */}
                      <tr className="hover:bg-muted/5 transition-colors text-slate-700 dark:text-slate-200">
                        <td className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-800">
                          {language === "en" ? "Active Cooperatives" : "Koperasi Aktif"}
                        </td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono font-medium">
                            {new Intl.NumberFormat(language === "en" ? "en-US" : "id-ID").format(Math.round(c.endingCoops || 0))}
                          </td>
                        ))}
                      </tr>

                      {/* Members */}
                      <tr className="hover:bg-muted/5 transition-colors text-slate-700 dark:text-slate-200">
                        <td className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-800">
                          {language === "en" ? "Members" : "Anggota Koperasi"}
                        </td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono font-medium">
                            {new Intl.NumberFormat(language === "en" ? "en-US" : "id-ID").format(Math.round(c.totalMembers || 0))}
                          </td>
                        ))}
                      </tr>

                      {/* Section Header Bar: EBITDA */}
                      <tr className="bg-[#d9e2ec] dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold">
                        <td colSpan={detailedProjectionData.length + 1} className="px-4 py-2.5 text-xs md:text-sm uppercase tracking-wider font-black">
                          EBITDA
                        </td>
                      </tr>

                      {/* Total Revenue */}
                      <tr className="hover:bg-muted/5 transition-colors text-slate-900 dark:text-white font-extrabold">
                        <td className="px-4 py-3 font-extrabold border-r border-slate-200 dark:border-slate-800">
                          {language === "en" ? "Total Revenue" : "Total Pendapatan"}
                        </td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono font-extrabold">
                            {formatCurrency(c.totalRevenue || 0, { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                      </tr>

                      {/* ARR */}
                      <tr className="hover:bg-muted/5 transition-colors text-slate-700 dark:text-slate-300">
                        <td className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-800">
                          {language === "en" ? "Annual Recurring Revenue (ARR)" : "Pendapatan Berulang Tahunan (ARR)"}
                        </td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono">
                            {formatCurrency(c.arr || 0, { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                      </tr>

                      {/* COGS */}
                      <tr className="hover:bg-muted/5 transition-colors text-slate-700 dark:text-slate-300">
                        <td className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-800">
                          {language === "en" ? "COGS" : "HPP / COGS"}
                        </td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono">
                            {formatCurrency(c.totalCogs || 0, { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                      </tr>

                      {/* Gross Profit (Highlighted row) */}
                      <tr className="bg-[#dce6f2] dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white">
                        <td className="px-4 py-3 font-extrabold border-r border-slate-300 dark:border-slate-700">
                          {language === "en" ? "Gross Profit" : "Laba Kotor"}
                        </td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono font-extrabold">
                            {formatCurrency(c.grossProfit || 0, { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                      </tr>

                      {/* Gross Margin */}
                      <tr className="hover:bg-muted/5 transition-colors text-slate-600 dark:text-slate-400">
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                          {language === "en" ? "Gross Margin" : "Margin Laba Kotor"}
                        </td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono">
                            {(c.grossMargin > 1 ? c.grossMargin : (c.grossMargin || 0) * 100).toFixed(1).replace(".", ",")}%
                          </td>
                        ))}
                      </tr>

                      {/* OPEX */}
                      <tr className="hover:bg-muted/5 transition-colors text-slate-700 dark:text-slate-300">
                        <td className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-800">
                          {language === "en" ? "OPEX" : "Beban Operasional (OPEX)"}
                        </td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono">
                            {formatCurrency(c.totalOpex || 0, { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                      </tr>

                      {/* EBITDA (Highlighted row) */}
                      <tr className="bg-[#dce6f2] dark:bg-slate-800/80 font-black text-slate-900 dark:text-white">
                        <td className="px-4 py-3 font-black border-r border-slate-300 dark:border-slate-700">EBITDA</td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono font-black">
                            {formatCurrency(c.ebitda || 0, { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                      </tr>

                      {/* EBITDA Margin */}
                      <tr className="hover:bg-muted/5 transition-colors text-slate-600 dark:text-slate-400">
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                          {language === "en" ? "EBITDA Margin" : "Margin EBITDA"}
                        </td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono">
                            {(c.ebitdaMargin > 1 ? c.ebitdaMargin : (c.ebitdaMargin || 0) * 100).toFixed(1).replace(".", ",")}%
                          </td>
                        ))}
                      </tr>

                      {/* Net Profit */}
                      <tr className="bg-[#e8f0fe] dark:bg-slate-800/40 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                        <td className="px-4 py-3 font-bold border-r border-slate-300 dark:border-slate-700">
                          {language === "en" ? "Net Profit" : "Laba Bersih"}
                        </td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold">
                            {formatCurrency(c.netProfit || 0, { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                      </tr>

                      {/* Net Margin */}
                      <tr className="hover:bg-muted/5 transition-colors text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                          {language === "en" ? "Net Margin" : "Margin Laba Bersih"}
                        </td>
                        {detailedProjectionData.map((c) => (
                          <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono">
                            {(c.netMargin > 1 ? c.netMargin : (c.netMargin || 0) * 100).toFixed(1).replace(".", ",")}%
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Summary Cards (Matching Photo 2) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: Investment Needed */}
                <div className="bg-card border-2 border-amber-400/80 dark:border-amber-600/60 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-5">
                  {/* Icon Pill */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-amber-300/80 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/30 text-center min-w-[130px] shrink-0">
                    <div className="p-3 rounded-full bg-amber-500/10 text-amber-600 mb-2">
                      <Wallet className="h-7 w-7" />
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                      {formatCurrency(valuation.seedInv || 10_000_000_000, { compact: true, lang: language })}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-800 dark:border-amber-400 mt-1 leading-tight text-center">
                      {language === "en" ? "Required Investment" : "Investasi yang diperlukan"}
                    </span>
                  </div>

                  {/* Details List */}
                  <div className="flex-1 w-full text-xs space-y-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? "Investment Stage" : "Tahap Investasi"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {language === "en" ? "Seed Round" : "Putaran Seed"}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? "Investment Sought" : "Dana Investasi Dicari"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {formatCurrency(valuation.seedInv || 10_000_000_000, { lang: language })}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? "Investment Instrument" : "Instrumen Investasi"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {language === "en" ? "Preferred Equity (Seed Preferred Shares)" : "Ekuitas Preferen (Saham Preferen Seed)"}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Growth Target (${data2029.year || 2029})` : `Target Pertumbuhan (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {new Intl.NumberFormat(language === "en" ? "en-US" : "id-ID").format(data2029.endingCoops || 1400)} {language === "en" ? "Active Cooperatives" : "Koperasi Aktif"}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Coop Members (${data2029.year || 2029})` : `Anggota Koperasi (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {new Intl.NumberFormat(language === "en" ? "en-US" : "id-ID").format(data2029.totalMembers || 1050000)} {language === "en" ? "Members" : "Anggota"}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Projected ARR (${data2029.year || 2029})` : `Proyeksi ARR (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {formatCurrency(data2029.arr || 15_000_000_000, { compact: true, lang: language })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{language === "en" ? `Projected Revenue (${data2029.year || 2029})` : `Proyeksi Revenue (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {formatCurrency(data2029.totalRevenue || 33_000_000_000, { compact: true, lang: language })}</span>
                    </div>
                  </div>
                </div>

                {/* Right Card: Equity Offered */}
                <div className="bg-card border-2 border-amber-400/80 dark:border-amber-600/60 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-5">
                  {/* Icon Pill */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-amber-300/80 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/30 text-center min-w-[130px] shrink-0">
                    <div className="p-3 rounded-full bg-amber-500/10 text-amber-600 mb-2">
                      <Award className="h-7 w-7" />
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {((valuation.dynamicInvestorEquityFrac || 0.25) * 100).toFixed(0)} %
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-400 mt-1 leading-tight text-center">
                      {language === "en" ? "Equity Offered" : "Saham Ditawarkan"}
                    </span>
                  </div>

                  {/* Details List */}
                  <div className="flex-1 w-full text-xs space-y-1 font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{language === "en" ? "Target Equity Offering" : "Target Penawaran Ekuitas"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {((valuation.dynamicInvestorEquityFrac || 0.25) * 100).toFixed(0)} – {(((valuation.dynamicInvestorEquityFrac || 0.25) + 0.02) * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic pb-1 border-b border-slate-100 dark:border-slate-800">
                      {language === "en" ? "(Final percentage subject to due diligence & final valuation)" : "(Persentase final tergantung due diligence & valuasi akhir)"}
                    </p>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Projected EBITDA Margin (${data2029.year || 2029})` : `Proyeksi EBITDA Margin (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {(data2029.ebitdaMargin > 1 ? data2029.ebitdaMargin : (data2029.ebitdaMargin || 0.627) * 100).toFixed(1).replace(".", ",")}%</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Estimated IRR (${detailedProjectionData.length} years)` : `Estimasi IRR (${detailedProjectionData.length} tahun)`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {((valuation.irrBase || 0.311) * 100).toFixed(1).replace(".", ",")}%</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Estimated Exit Valuation (${data2029.year || 2029})` : `Estimasi Valuasi Exit (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {formatCurrency(valuation.exitValBase || 166_000_000_000, { compact: true, lang: language })}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? "Investor Equity Value" : "Nilai Ekuitas Investor"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {formatCurrency(valuation.invValBase || 38_000_000_000, { compact: true, lang: language })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{language === "en" ? "MOIC Multiple Assumption" : "Asumsi MOIC (Kelipatan)"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {(valuation.moicBase || 3.9).toFixed(1)}x</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Download reports and pitch deck */}
            <section id="downloads" className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-500" /> {language === "en" ? "Download Center & Supporting Documents" : "Pusat Unduh Dokumen Pendukung"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Download financial model audit report, pitch deck slides, and full company assumption sheets." : "Unduh laporan audit model keuangan, slide pitch deck, dan lembar asumsi lengkap perusahaan."}
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors text-left">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{language === "en" ? "Company Pitch Deck" : "Pitch Deck Perusahaan"}</h4>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "PDF format - Business Model Summary & Fundraising Plan." : "PDF format - Rangkuman Model Bisnis & Rencana Fundraising."}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentSlide(0);
                        setShowDeckPreview(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      title={language === "en" ? "Preview Pitch Deck Slides" : "Preview Slide Pitch Deck"}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={handleDownloadDeck}
                      disabled={downloadingDeck}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-all cursor-pointer disabled:opacity-50"
                      title={language === "en" ? "Download Pitch Deck" : "Download Pitch Deck"}
                    >
                      <Download className={`h-4 w-4 ${downloadingDeck ? "animate-pulse" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors text-left">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{language === "en" ? "Comprehensive Financial Report (5-Year)" : "Laporan Finansial Lengkap (5-Tahun)"}</h4>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "PDF format & Excel Model with live formulas." : "Format PDF & Model Excel dengan rumus aktif."}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowExcelPreview(true)}
                      disabled={exportingExcel}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                      title={language === "en" ? "Preview / Export Excel" : "Preview / Export Excel"}
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      <span>Excel</span>
                    </button>
                    <button
                      onClick={handleDownloadReport}
                      disabled={downloadingReport}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                      title={language === "en" ? "Download PDF Report" : "Download PDF Laporan"}
                    >
                      <Download className={`h-3.5 w-3.5 ${downloadingReport ? "animate-pulse" : ""}`} />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>{language === "en" ? "As an Investor Viewer, all presented data is confidential and read-only." : "Sebagai Investor Viewer, semua data yang disajikan bersifat rahasia dan tidak dapat diubah (Read-Only)."}</span>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Modal Pitch Deck Preview */}
      {showDeckPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#005fa4] dark:text-blue-400" />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Pitch Deck Preview</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Slide {currentSlide + 1} of 4</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDeckPreview(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body - Slide View */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#005fa4] dark:text-blue-400 uppercase tracking-widest">
                  {currentSlide === 0 && (language === "en" ? "1. Required Investment & Operational Targets" : "1. Target Pendanaan & Skala Operasional")}
                  {currentSlide === 1 && (language === "en" ? "2. Equity Offering & Investor Returns" : "2. Penawaran Ekuitas & Imbal Hasil Investor")}
                  {currentSlide === 2 && (language === "en" ? "3. SaaS Metrics & Operating Margins" : "3. Metrik SaaS & Margin Operasional")}
                  {currentSlide === 3 && (language === "en" ? "4. Multi-Year Projections Table" : "4. Tabel Proyeksi Keuangan Multi-Tahun")}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {currentSlide === 0 && (language === "en" ? "Seed Investment & Growth Targets" : "Investasi Seed & Target Pertumbuhan")}
                  {currentSlide === 1 && (language === "en" ? "Exit Valuation & Investor ROI" : "Valuasi Exit & ROI Investor")}
                  {currentSlide === 2 && (language === "en" ? "Unit Economics Highlights" : "Ringkasan Unit Economics")}
                  {currentSlide === 3 && (language === "en" ? `Financial Projections (${detailedProjectionData[0]?.year || 2025} - ${data2029.year || 2029})` : `Proyeksi Keuangan (${detailedProjectionData[0]?.year || 2025} - ${data2029.year || 2029})`)}
                </h2>
              </div>

              {/* Slide Content Cards matching Financial Projection tab */}
              {currentSlide === 0 && (
                <div className="bg-card border-2 border-amber-400/80 dark:border-amber-600/60 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-5">
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-amber-300/80 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/30 text-center min-w-[130px] shrink-0">
                    <div className="p-3 rounded-full bg-amber-500/10 text-amber-600 mb-2">
                      <Wallet className="h-7 w-7" />
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {formatCurrency(valuation.seedInv || 10_000_000_000, { compact: true, lang: language })}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-400 mt-1 leading-tight text-center">
                      {language === "en" ? "Required Investment" : "Kebutuhan Investasi"}
                    </span>
                  </div>

                  <div className="flex-1 w-full text-xs space-y-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? "Investment Stage" : "Tahap Investasi"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {language === "en" ? "Seed Round" : "Putaran Seed"}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? "Investment Sought" : "Dana Investasi Dicari"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {formatCurrency(valuation.seedInv || 10_000_000_000, { lang: language })}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? "Investment Instrument" : "Instrumen Investasi"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {language === "en" ? "Preferred Equity (Seed Preferred Shares)" : "Ekuitas Preferen (Saham Preferen Seed)"}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Growth Target (${data2029.year || 2029})` : `Target Pertumbuhan (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {new Intl.NumberFormat(language === "en" ? "en-US" : "id-ID").format(data2029.endingCoops || 1400)} {language === "en" ? "Active Cooperatives" : "Koperasi Aktif"}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Coop Members (${data2029.year || 2029})` : `Anggota Koperasi (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {new Intl.NumberFormat(language === "en" ? "en-US" : "id-ID").format(data2029.totalMembers || 1050000)} {language === "en" ? "Members" : "Anggota"}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Projected ARR (${data2029.year || 2029})` : `Proyeksi ARR (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {formatCurrency(data2029.arr || 15_000_000_000, { compact: true, lang: language })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{language === "en" ? `Projected Revenue (${data2029.year || 2029})` : `Proyeksi Revenue (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {formatCurrency(data2029.totalRevenue || 33_000_000_000, { compact: true, lang: language })}</span>
                    </div>
                  </div>
                </div>
              )}

              {currentSlide === 1 && (
                <div className="bg-card border-2 border-amber-400/80 dark:border-amber-600/60 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-5">
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-amber-300/80 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/30 text-center min-w-[130px] shrink-0">
                    <div className="p-3 rounded-full bg-amber-500/10 text-amber-600 mb-2">
                      <Award className="h-7 w-7" />
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {((valuation.dynamicInvestorEquityFrac || 0.23) * 100).toFixed(0)} %
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-400 mt-1 leading-tight text-center">
                      {language === "en" ? "Equity Offered" : "Saham Ditawarkan"}
                    </span>
                  </div>

                  <div className="flex-1 w-full text-xs space-y-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{language === "en" ? "Target Equity Offering" : "Target Penawaran Ekuitas"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {((valuation.dynamicInvestorEquityFrac || 0.23) * 100).toFixed(0)} – {(((valuation.dynamicInvestorEquityFrac || 0.23) + 0.02) * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic pb-1 border-b border-slate-100 dark:border-slate-800">
                      {language === "en" ? "(Final percentage subject to due diligence & final valuation)" : "(Persentase final tergantung due diligence & valuasi akhir)"}
                    </p>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Projected EBITDA Margin (${data2029.year || 2029})` : `Proyeksi EBITDA Margin (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {(data2029.ebitdaMargin > 1 ? data2029.ebitdaMargin : (data2029.ebitdaMargin || 0.606) * 100).toFixed(1).replace(".", ",")}%</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Estimated IRR (${detailedProjectionData.length} years)` : `Estimasi IRR (${detailedProjectionData.length} tahun)`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {((valuation.irrBase || 0.223) * 100).toFixed(1).replace(".", ",")}%</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? `Estimated Exit Valuation (${data2029.year || 2029})` : `Estimasi Valuasi Exit (${data2029.year || 2029})`}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {formatCurrency(valuation.exitValBase || 117_900_000_000, { compact: true, lang: language })}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{language === "en" ? "Investor Equity Value" : "Nilai Ekuitas Investor"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {formatCurrency(valuation.invValBase || 27_400_000_000, { compact: true, lang: language })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{language === "en" ? "MOIC Multiple Assumption" : "Asumsi MOIC (Kelipatan)"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">: {(valuation.moicBase || 2.7).toFixed(1)}x</span>
                    </div>
                  </div>
                </div>
              )}

              {currentSlide === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{language === "en" ? "MRR (Exit Year)" : "MRR (Tahun Exit)"}</p>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{formatCurrency(data2029.mrr || 0, { lang: language })}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{language === "en" ? "Estimasi LTV" : "Estimasi LTV"}</p>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{formatRupiah(data2029.estimatedLtv || 0)}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{language === "en" ? "LTV / CAC Ratio:" : "Rasio LTV / CAC:"}</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{(data2029.ltvCacRatio || 0).toFixed(1)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{language === "en" ? "Gross Margin:" : "Margin Laba Kotor:"}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{(data2029.grossMargin || 0).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {currentSlide === 3 && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#1d4370] text-white font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 whitespace-nowrap">Metric / Driver</th>
                        {detailedProjectionData.map(d => (
                          <th key={d.year} className="p-2.5 text-right whitespace-nowrap">{d.year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">Active Cooperatives</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap">{new Intl.NumberFormat('id-ID').format(Math.round(d.endingCoops || 0))}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">Members</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap">{new Intl.NumberFormat('id-ID').format(Math.round(d.totalMembers || 0))}</td>
                        ))}
                      </tr>
                      <tr className="bg-[#d9e2ec] dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white">
                        <td colSpan={detailedProjectionData.length + 1} className="p-2.5 uppercase tracking-wider font-black">EBITDA</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">Total Revenue</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap font-extrabold">{formatCurrency(d.totalRevenue || 0, { maximumFractionDigits: 0 })}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Annual Recurring Revenue (ARR)</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap">{formatCurrency(d.arr || 0, { maximumFractionDigits: 0 })}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">COGS</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap">{formatCurrency(d.totalCogs || 0, { maximumFractionDigits: 0 })}</td>
                        ))}
                      </tr>
                      <tr className="bg-[#dce6f2] dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white">
                        <td className="p-2.5 font-extrabold whitespace-nowrap">Gross Profit</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap font-extrabold">{formatCurrency(d.grossProfit || 0, { maximumFractionDigits: 0 })}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">Gross Margin</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap">{(d.grossMargin > 1 ? d.grossMargin : (d.grossMargin || 0) * 100).toFixed(1).replace(".", ",")}%</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">OPEX</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap">{formatCurrency(d.totalOpex || 0, { maximumFractionDigits: 0 })}</td>
                        ))}
                      </tr>
                      <tr className="bg-[#dce6f2] dark:bg-slate-800/80 font-black text-slate-900 dark:text-white">
                        <td className="p-2.5 font-black whitespace-nowrap">EBITDA</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap font-black text-amber-700 dark:text-amber-400">{formatCurrency(d.ebitda || 0, { maximumFractionDigits: 0 })}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">EBITDA Margin</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap">{(d.ebitdaMargin > 1 ? d.ebitdaMargin : (d.ebitdaMargin || 0) * 100).toFixed(1).replace(".", ",")}%</td>
                        ))}
                      </tr>
                      <tr className="bg-[#e8f0fe] dark:bg-slate-800/80 font-extrabold text-slate-900 dark:text-white">
                        <td className="p-2.5 font-extrabold whitespace-nowrap">Net Profit</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap font-extrabold text-emerald-700 dark:text-emerald-400">{formatCurrency(d.netProfit || 0, { maximumFractionDigits: 0 })}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">Net Margin</td>
                        {detailedProjectionData.map(d => (
                          <td key={d.year} className="p-2.5 text-right whitespace-nowrap">{(d.netMargin > 1 ? d.netMargin : (d.netMargin || 0) * 100).toFixed(1).replace(".", ",")}%</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                  disabled={currentSlide === 0}
                  className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white disabled:opacity-30 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide(prev => Math.min(3, prev + 1))}
                  disabled={currentSlide === 3}
                  className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white disabled:opacity-30 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  setShowDeckPreview(false);
                  handleDownloadDeck();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#005fa4] hover:bg-[#004b82] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                <Download className="h-4 w-4 text-[#FFD700]" />
                <span>{language === "en" ? "Download Pitch Deck" : "Unduh Pitch Deck"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Model Interactive Preview Modal for Investors */}
      <ExcelPreviewModal
        show={showExcelPreview}
        onClose={() => setShowExcelPreview(false)}
        onDownload={async () => {
          await handleExportExcel();
        }}
        downloading={exportingExcel}
        assumptionsByYear={assumptionsByYear}
        currency={currency}
        language={language}
        companyName={primaryCompany?.name || "Smartcoop"}
      />
    </div>
  );
}
