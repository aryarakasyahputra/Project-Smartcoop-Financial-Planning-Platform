import React from "react";
import { 
  Sparkles, Coins, Activity, Calculator, Users, ShieldAlert, TrendingUp, Award, Wallet,
  ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, Layers, Info
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
  data2029,
  valuation,
  activeExitVal,
  activeMOIC,
  activeIRR,
  chartMetric,
  setChartMetric,
  chartData,
  projectionData,
  hoveredYear,
  setHoveredYear,
  getColHighlightClass
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

      {/* Comprehensive Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-extrabold flex items-center gap-2 text-slate-900 dark:text-white mb-2">
            <TrendingUp className="h-5 w-5 text-[#005fa4]" /> {language === "en" ? "Revenue Trajectory (5 Years)" : "Lintasan Pendapatan (5 Tahun)"}
          </h3>
          <RevenueChart data={chartData} />
        </div>
        
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-extrabold flex items-center gap-2 text-slate-900 dark:text-white mb-2">
            <Activity className="h-5 w-5 text-indigo-600" /> {language === "en" ? "ARR Growth" : "Pertumbuhan ARR"}
          </h3>
          <ARRChart data={chartData} />
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-extrabold flex items-center gap-2 text-slate-900 dark:text-white mb-2">
            <Calculator className="h-5 w-5 text-amber-500" /> {language === "en" ? "EBITDA Projection" : "Proyeksi EBITDA"}
          </h3>
          <EBITDAChart data={chartData} />
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-extrabold flex items-center gap-2 text-slate-900 dark:text-white mb-2">
            <Users className="h-5 w-5 text-emerald-600" /> {language === "en" ? "Cooperative Growth" : "Pertumbuhan Koperasi"}
          </h3>
          <CoopsChart data={chartData} />
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <h3 className="text-base font-extrabold flex items-center gap-2 text-slate-900 dark:text-white mb-2">
            <Layers className="h-5 w-5 text-[#005fa4]" /> {language === "en" ? "Valuation Waterfall (Exit Year 5)" : "Waterfall Valuasi (Exit Tahun 5)"}
          </h3>
          <ValuationWaterfallChart valuation={valuation} activeExitVal={activeExitVal} />
        </div>
      </div>

      {/* Metric / Driver Table */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="text-base font-extrabold flex items-center gap-2 text-slate-900 dark:text-white">
            <Wallet className="h-5 w-5 text-[#005fa4]" /> {language === "en" ? "Projection Summary & Financial Drivers (Rp)" : "Ringkasan Proyeksi & Driver Finansial (Rp)"}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] uppercase bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold">{language === "en" ? "Metric / Driver" : "Metrik / Driver"}</th>
                {projectionData.map((col) => (
                  <th 
                    key={col.year} 
                    className={`px-6 py-4 font-bold text-right transition-colors duration-150 ${getColHighlightClass(col.year)}`}
                    onMouseEnter={() => setHoveredYear(col.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {col.year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Active Cooperatives */}
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                  {language === "en" ? "Active Cooperatives" : "Jumlah Koperasi Aktif"}
                </td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {new Intl.NumberFormat(language === "en" ? "en-US" : "id-ID").format(c.endingCoops)}
                  </td>
                ))}
              </tr>
              
              {/* Members */}
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">
                  {language === "en" ? "Cooperative Members" : "Total Anggota Koperasi"}
                </td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {new Intl.NumberFormat(language === "en" ? "en-US" : "id-ID").format(c.totalMembers)}
                  </td>
                ))}
              </tr>

              {/* Revenue */}
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">
                  {language === "en" ? "Total Revenue" : "Total Pendapatan"}
                </td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalRevenue)}
                  </td>
                ))}
              </tr>

              {/* ARR */}
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors text-slate-600 dark:text-slate-400">
                <td className="px-6 py-3.5">ARR</td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.arr)}
                  </td>
                ))}
              </tr>

              {/* Gross Margin */}
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors text-slate-600 dark:text-slate-400">
                <td className="px-6 py-3.5">
                  {language === "en" ? "Gross Margin %" : "Margin Laba Kotor (%)"}
                </td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.grossMargin.toFixed(1)}%
                  </td>
                ))}
              </tr>

              {/* EBITDA */}
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">EBITDA</td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3.5 text-right font-mono font-bold transition-colors duration-150 ${getColHighlightClass(c.year)} ${c.ebitda >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.ebitda)}
                  </td>
                ))}
              </tr>

              {/* EBITDA Margin */}
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors text-slate-600 dark:text-slate-400">
                <td className="px-6 py-3.5">
                  {language === "en" ? "EBITDA Margin %" : "Margin EBITDA (%)"}
                </td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.ebitdaMargin.toFixed(1)}%
                  </td>
                ))}
              </tr>

              {/* Net Profit */}
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">
                  {language === "en" ? "Net Profit" : "Laba Bersih"}
                </td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3.5 text-right font-mono font-bold transition-colors duration-150 ${getColHighlightClass(c.year)} ${c.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.netProfit || 0)}
                  </td>
                ))}
              </tr>

              {/* Net Margin */}
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <td className="px-6 py-3.5">
                  {language === "en" ? "Net Margin %" : "Margin Laba Bersih (%)"}
                </td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {(c.netMargin || 0).toFixed(1)}%
                  </td>
                ))}
              </tr>

              {/* Ending Cash */}
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors font-medium">
                <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">
                  {language === "en" ? "Ending Cash Balance" : "Saldo Kas Akhir"}
                </td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.endingCash)}
                  </td>
                ))}
              </tr>

              {/* Cash Runway */}
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors text-slate-600 dark:text-slate-400">
                <td className="px-6 py-3.5 font-semibold">
                  {language === "en" ? "Cash Runway (Months)" : "Runway Kas (Bulan)"}
                </td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3.5 text-right transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.ebitda >= 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                        {language === "en" ? "Profitable" : "Profitable"}
                      </span>
                    ) : (
                      <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                        {c.runwayMonths ? (c.runwayMonths % 1 === 0 ? c.runwayMonths.toFixed(0) : c.runwayMonths.toFixed(1)) : '0'} {language === "en" ? "Months" : "Bulan"}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
