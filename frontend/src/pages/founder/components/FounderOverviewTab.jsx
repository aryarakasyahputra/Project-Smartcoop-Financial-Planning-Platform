import React from "react";
import { 
  Sparkles, Coins, Activity, Calculator, Users, ShieldAlert, TrendingUp, Award, Wallet,
  ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, Layers, Info, FileText, Download, Eye, FileSpreadsheet, BarChart3
} from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { formatRupiah as origFormatRupiah } from "../../cfo/utils/financialModel";
import { useLanguage } from "../../../context/LanguageContext";
import { useCurrency } from "../../../context/CurrencyContext";
import ValuationWaterfallChart from "../../../components/charts/ValuationWaterfallChart";
import { RevenueChart, ARRChart, EBITDAChart, CoopsChart } from "../../../components/charts/FinancialMetricCharts";

const MetricTooltip = ({ label, textEn, textId, language, align = "left" }) => (
  <div className="relative group flex items-center gap-1 w-fit">
    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
    <Info className="w-3 h-3 text-slate-400 cursor-pointer" />
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

export default function FounderOverviewTab({
  activeScenario,
  setActiveScenario,
  data2029 = {},
  valuation = {},
  activeExitVal,
  activeMOIC,
  activeIRR,
  chartMetric,
  setChartMetric,
  chartData,
  projectionData = [],
  hoveredYear,
  setHoveredYear,
  getColHighlightClass,
  handleDownloadDeck,
  handleDownloadReport,
  setShowExcelPreview,
  exportingExcel,
  setShowDeckPreview,
  setCurrentSlide,
  downloadingDeck,
  downloadingReport
}) {
  const { language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const formatRupiah = formatCurrency;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Scenario Selector Banner - High End Executive Control */}
      <section id="scenarios" className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden">
        {/* Top Accent Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#005fa4] via-blue-500 to-[#FFD700]" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-[#005fa4]/10 text-[#005fa4] flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-[#005fa4]" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {language === "en" ? "Business Scenario Simulation" : "Simulasi Skenario Bisnis"}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pl-10">
              {language === "en" 
                ? "Select an active scenario to trigger instant recalculation across KPIs and projections."
                : "Pilih skenario aktif untuk memicu re-kalkulasi instan pada KPI dan proyeksi finansial."
              }
            </p>
          </div>

          {/* Premium Segmented Controller */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 self-start lg:self-auto">
            <button 
              onClick={() => setActiveScenario("base")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                activeScenario === "base" 
                  ? "bg-[#005fa4] text-white shadow-md shadow-[#005fa4]/25 ring-2 ring-[#005fa4]/20" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60"
              }`}
            >
              <ShieldCheck className={`h-3.5 w-3.5 ${activeScenario === "base" ? "text-[#FFD700]" : "text-slate-400"}`} />
              <span>{language === "en" ? "Base Case" : "Moderat"}</span>
            </button>

            <button 
              onClick={() => setActiveScenario("optimistic")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                activeScenario === "optimistic" 
                  ? "bg-[#005fa4] text-white shadow-md shadow-[#005fa4]/25 ring-2 ring-[#005fa4]/20" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60"
              }`}
            >
              <TrendingUp className={`h-3.5 w-3.5 ${activeScenario === "optimistic" ? "text-[#FFD700]" : "text-slate-400"}`} />
              <span>{language === "en" ? "Optimistic Case" : "Optimis"}</span>
            </button>

            <button 
              onClick={() => setActiveScenario("pessimistic")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                activeScenario === "pessimistic" 
                  ? "bg-[#005fa4] text-white shadow-md shadow-[#005fa4]/25 ring-2 ring-[#005fa4]/20" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60"
              }`}
            >
              <AlertTriangle className={`h-3.5 w-3.5 ${activeScenario === "pessimistic" ? "text-[#FFD700]" : "text-slate-400"}`} />
              <span>{language === "en" ? "Pessimistic Case" : "Pesimis"}</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="space-y-6">
          {/* Unit Economics */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2"><Wallet className="w-5 h-5 text-[#005fa4]" /> Unit Economics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="CAC" language={language} textEn="(Sales & Marketing Opex + 35% Payroll) / New Coops. If 0, check marketing assumptions & new customer targets." textId="(Opex Sales & Marketing + 35% Payroll) / Koperasi Baru. Jika Rp 0, pastikan asumsi biaya marketing & target pelanggan baru sudah diisi." />
                <h3 className="text-xl font-black mt-1 text-slate-800 dark:text-white">{formatRupiah(data2029.estimatedCac || 0)}</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="LTV" language={language} textEn="(MRR * Gross Margin) / Churn Rate. If 0, check churn rate and revenue assumptions." textId="(MRR * Gross Margin) / Churn Rate. Jika Rp 0, periksa asumsi tingkat churn dan pendapatan." />
                <h3 className="text-xl font-black mt-1 text-slate-800 dark:text-white">{formatRupiah(data2029.estimatedLtv || 0)}</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="LTV/CAC Ratio" language={language} textEn="LTV divided by CAC. >3x is considered healthy." textId="LTV dibagi dengan CAC. Rasio >3x dianggap sangat sehat." />
                <h3 className="text-xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{(data2029.ltvCacRatio || 0).toFixed(1)}x</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="Payback Period" language={language} textEn="Months to recover CAC. CAC / (MRR * Gross Margin). <12 months is ideal." textId="Bulan yang dibutuhkan untuk balik modal CAC. CAC / (MRR * Gross Margin). Kurang dari 12 bulan sangat ideal." />
                <h3 className="text-xl font-black mt-1 text-slate-800 dark:text-white">{(data2029.cacPaybackMonths || 0).toFixed(1)} {language === "en" ? "Mos" : "Bulan"}</h3>
              </div>
            </div>
          </div>

          {/* SaaS Metrics */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-600" /> SaaS Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="MRR" language={language} textEn="Monthly Recurring Revenue = ARR / 12." textId="Pendapatan Berulang Bulanan (ARR dibagi 12)." />
                <h3 className="text-xl font-black mt-1 text-slate-800 dark:text-white">{formatRupiah(data2029.mrr || 0)}</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="Churn Rate" language={language} textEn="Annual percentage of customers who cancel their subscription." textId="Persentase tahunan koperasi yang membatalkan langganan." />
                <h3 className="text-xl font-black mt-1 text-rose-500">{(data2029.annualChurn || 0).toFixed(1)}%</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="NRR" language={language} textEn="Net Revenue Retention. Revenue retained from existing customers including upsells." textId="Net Revenue Retention. Retensi pendapatan dari pelanggan lama termasuk upsell." />
                <h3 className="text-xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{(data2029.nrr || 0).toFixed(1)}%</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="Gross Margin" language={language} textEn="(Total Revenue - COGS) / Total Revenue. >80% is typical for SaaS." textId="(Total Revenue - HPP) / Total Revenue. Margin >80% sangat khas untuk bisnis SaaS." />
                <h3 className="text-xl font-black mt-1 text-slate-800 dark:text-white">{(data2029.grossMargin || 0).toFixed(1)}%</h3>
              </div>
            </div>
          </div>

          {/* Growth Metrics */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-600" /> Growth Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="Revenue Growth YoY" language={language} textEn="Percentage growth of Total Revenue compared to the previous year." textId="Persentase pertumbuhan Total Pendapatan dibandingkan tahun sebelumnya." />
                <h3 className="text-xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{((data2029.revYoyGrowth || 0) * 100).toFixed(1)}%</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="Customer Growth YoY" language={language} textEn="Percentage growth of Active Cooperatives compared to the previous year." textId="Persentase pertumbuhan jumlah Koperasi Aktif dibandingkan tahun sebelumnya." />
                <h3 className="text-xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{((data2029.yoyCoopGrowth || 0) * 100).toFixed(1)}%</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="ARR Growth YoY" language={language} textEn="Percentage growth of Annual Recurring Revenue compared to the previous year." textId="Persentase pertumbuhan Pendapatan Berulang Tahunan (ARR) dibandingkan tahun sebelumnya." />
                <h3 className="text-xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{((data2029.arrYoyGrowth || 0) * 100).toFixed(1)}%</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="EBITDA Margin" language={language} textEn="EBITDA divided by Total Revenue. Measures operational profitability." textId="EBITDA dibagi Total Pendapatan. Mengukur tingkat keuntungan operasional." />
                <h3 className={`text-xl font-black mt-1 ${(data2029.ebitdaMargin || 0) >= 0 ? "text-slate-800 dark:text-white" : "text-rose-500"}`}>{(data2029.ebitdaMargin || 0).toFixed(1)}%</h3>
              </div>
            </div>
          </div>

          {/* Investor Metrics */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Investor Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="Burn Rate / Mo" language={language} textEn="Average monthly cash deficit. Only applies if EBITDA is negative." textId="Rata-rata defisit kas per bulan. Berlaku saat perusahaan membukukan EBITDA negatif (bakar uang)." />
                <h3 className="text-xl font-black mt-1 text-rose-500">{formatRupiah(data2029.monthlyBurn || 0)}</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="Runway" language={language} textEn="Ending Cash / Monthly Burn Rate. Shows how many months before cash runs out." textId="Saldo Kas / Burn Rate Bulanan. Menunjukkan berapa bulan kas bertahan sebelum habis." />
                <h3 className="text-xl font-black mt-1 text-slate-800 dark:text-white">{(data2029.runwayMonths || 0) >= 999 ? "Unlimited" : `${(data2029.runwayMonths || 0).toFixed(1)} ${language === "en" ? "Mos" : "Bln"}`}</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="Cash Balance" language={language} textEn="Ending cash balance for the year after all inflows (funding) and outflows." textId="Saldo akhir kas di penghujung tahun setelah dikurangi seluruh pengeluaran operasional dan investasi." />
                <h3 className="text-xl font-black mt-1 text-slate-800 dark:text-white">{formatRupiah(data2029.endingCash || 0)}</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <MetricTooltip label="Break-even Year" language={language} textEn="The first year where EBITDA becomes positive." textId="Tahun pertama dimana EBITDA (keuntungan operasional) berubah menjadi positif." />
                <h3 className="text-xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
                  {projectionData.find(row => row.ebitda > 0)?.year || (language === "en" ? "Not Reached" : "Belum")}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Projection Table Card (Matching Photo 1) */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#005fa4] dark:text-blue-400 shrink-0">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === "en" ? "Financial Projection" : "Proyeksi Keuangan"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === "en" 
                ? "Proforma P&L statement, unit economics, and operational growth forecasts." 
                : "Laporan Laba Rugi Proforma, unit economics, dan proyeksi pertumbuhan operasional."}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#1d4370] text-white">
              <tr>
                <th className="px-4 py-3 font-extrabold text-white text-xs md:text-sm bg-[#1d4370] border-r border-blue-900/30">
                  {language === "en" ? "Metric / Driver" : "Metrik / Asumsi"}
                </th>
                {projectionData.map((col) => (
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
                {projectionData.map((c) => (
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
                {projectionData.map((c) => (
                  <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono font-medium">
                    {new Intl.NumberFormat(language === "en" ? "en-US" : "id-ID").format(Math.round(c.totalMembers || 0))}
                  </td>
                ))}
              </tr>

              {/* Section Header Bar: EBITDA */}
              <tr className="bg-[#d9e2ec] dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold">
                <td colSpan={projectionData.length + 1} className="px-4 py-2.5 text-xs md:text-sm uppercase tracking-wider font-black">
                  EBITDA
                </td>
              </tr>

              {/* Total Revenue */}
              <tr className="hover:bg-muted/5 transition-colors text-slate-900 dark:text-white font-extrabold">
                <td className="px-4 py-3 font-extrabold border-r border-slate-200 dark:border-slate-800">
                  {language === "en" ? "Total Revenue" : "Total Pendapatan"}
                </td>
                {projectionData.map((c) => (
                  <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono font-extrabold">
                    {formatRupiah(c.totalRevenue || 0, { maximumFractionDigits: 0 })}
                  </td>
                ))}
              </tr>

              {/* ARR */}
              <tr className="hover:bg-muted/5 transition-colors text-slate-700 dark:text-slate-300">
                <td className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-800">
                  {language === "en" ? "Annual Recurring Revenue (ARR)" : "Pendapatan Berulang Tahunan (ARR)"}
                </td>
                {projectionData.map((c) => (
                  <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono">
                    {formatRupiah(c.arr || 0, { maximumFractionDigits: 0 })}
                  </td>
                ))}
              </tr>

              {/* COGS */}
              <tr className="hover:bg-muted/5 transition-colors text-slate-700 dark:text-slate-300">
                <td className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-800">
                  {language === "en" ? "COGS" : "HPP / COGS"}
                </td>
                {projectionData.map((c) => (
                  <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono">
                    {formatRupiah(c.totalCogs || 0, { maximumFractionDigits: 0 })}
                  </td>
                ))}
              </tr>

              {/* Gross Profit (Highlighted row) */}
              <tr className="bg-[#dce6f2] dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white">
                <td className="px-4 py-3 font-extrabold border-r border-slate-300 dark:border-slate-700">
                  {language === "en" ? "Gross Profit" : "Laba Kotor"}
                </td>
                {projectionData.map((c) => (
                  <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono font-extrabold">
                    {formatRupiah(c.grossProfit || 0, { maximumFractionDigits: 0 })}
                  </td>
                ))}
              </tr>

              {/* Gross Margin */}
              <tr className="hover:bg-muted/5 transition-colors text-slate-600 dark:text-slate-400">
                <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                  {language === "en" ? "Gross Margin" : "Margin Laba Kotor"}
                </td>
                {projectionData.map((c) => (
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
                {projectionData.map((c) => (
                  <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono">
                    {formatRupiah(c.totalOpex || 0, { maximumFractionDigits: 0 })}
                  </td>
                ))}
              </tr>

              {/* EBITDA (Highlighted row) */}
              <tr className="bg-[#dce6f2] dark:bg-slate-800/80 font-black text-slate-900 dark:text-white">
                <td className="px-4 py-3 font-black border-r border-slate-300 dark:border-slate-700">EBITDA</td>
                {projectionData.map((c) => (
                  <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono font-black">
                    {formatRupiah(c.ebitda || 0, { maximumFractionDigits: 0 })}
                  </td>
                ))}
              </tr>

              {/* EBITDA Margin */}
              <tr className="hover:bg-muted/5 transition-colors text-slate-600 dark:text-slate-400">
                <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                  {language === "en" ? "EBITDA Margin" : "Margin EBITDA"}
                </td>
                {projectionData.map((c) => (
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
                {projectionData.map((c) => (
                  <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold">
                    {formatRupiah(c.netProfit || 0, { maximumFractionDigits: 0 })}
                  </td>
                ))}
              </tr>

              {/* Net Margin */}
              <tr className="hover:bg-muted/5 transition-colors text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                  {language === "en" ? "Net Margin" : "Margin Laba Bersih"}
                </td>
                {projectionData.map((c) => (
                  <td key={c.year} className="px-4 py-3 whitespace-nowrap text-right font-mono">
                    {(c.netMargin > 1 ? c.netMargin : (c.netMargin || 0) * 100).toFixed(1).replace(".", ",")}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Investment Return Summary Cards (Matching Photo 2) */}
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
            <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-400 mt-1 leading-tight text-center">
              {language === "en" ? "Required Investment" : "Kebutuhan Investasi"}
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
              <span className="text-slate-500">{language === "en" ? `Estimated IRR (${projectionData.length || 5} years)` : `Estimasi IRR (${projectionData.length || 5} tahun)`}</span>
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
  );
}
