import React from "react";
import { 
  Sparkles, Coins, Activity, Calculator, Users, ShieldAlert, TrendingUp, Award, Wallet,
  ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, Layers
} from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { formatRupiah } from "../../cfo/utils/financialModel";
import { useLanguage } from "../../../context/LanguageContext";

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

        {/* Executive KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: 2029 Revenue */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs hover:shadow-md hover:border-[#005fa4]/40 transition-all duration-300 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                {language === "en" ? "Projected Revenue (2029)" : "Proyeksi Revenue (2029)"}
              </span>
              <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
                <Coins className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {formatRupiah(data2029.totalRevenue || 0)}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {language === "en" ? "Year 5 target revenue" : "Target pendapatan di akhir tahun ke-5"}
              </p>
            </div>
          </div>

          {/* Card 2: 2029 ARR */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs hover:shadow-md hover:border-[#005fa4]/40 transition-all duration-300 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                {language === "en" ? "Projected ARR (2029)" : "Proyeksi ARR (2029)"}
              </span>
              <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center shrink-0">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {formatRupiah(data2029.arr || 0)}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {language === "en" ? "Annual Recurring Revenue in Year 5" : "Annual Recurring Revenue tahun ke-5"}
              </p>
            </div>
          </div>

          {/* Card 3: 2029 EBITDA */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs hover:shadow-md hover:border-[#005fa4]/40 transition-all duration-300 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                {language === "en" ? "Projected EBITDA (2029)" : "EBITDA Proyeksi (2029)"}
              </span>
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border ${
                (data2029.ebitda || 0) >= 0 
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200/60' 
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-200/60'
              }`}>
                <Calculator className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${(data2029.ebitda || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {formatRupiah(data2029.ebitda || 0)}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {(data2029.ebitda || 0) >= 0 
                  ? (language === "en" ? "Profitable operations" : "Operasional profitabel") 
                  : (language === "en" ? "Requires acceleration" : "Operasional butuh akselerasi")}
              </p>
            </div>
          </div>

          {/* Card 4: 2029 Active Coops */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs hover:shadow-md hover:border-[#005fa4]/40 transition-all duration-300 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                {language === "en" ? "Active Cooperatives (2029)" : "Koperasi Aktif (2029)"}
              </span>
              <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#005fa4] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {new Intl.NumberFormat(language === "en" ? "en-US" : "id-ID").format(data2029.endingCoops || 0)} <span className="text-sm font-bold text-slate-500">{language === "en" ? "Units" : "Unit"}</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {language === "en" ? "Target active cooperatives served" : "Target jumlah koperasi terlayani"}
              </p>
            </div>
          </div>

          {/* Card 5: Seed Equity % */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs hover:shadow-md hover:border-[#005fa4]/40 transition-all duration-300 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                {language === "en" ? "Investor Ownership %" : "Kepemilikan Investor"}
              </span>
              <div className="h-8 w-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {(valuation.dynamicInvestorEquityFrac * 100).toFixed(1)}%
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {language === "en" ? "Post-Seed investor equity share" : "Porsi saham investor pasca-Seed"}
              </p>
            </div>
          </div>

          {/* Card 6: Exit Valuation */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs hover:shadow-md hover:border-[#005fa4]/40 transition-all duration-300 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                {language === "en" ? "Exit Valuation (2029)" : "Valuasi Exit (2029)"}
              </span>
              <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#005fa4] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center shrink-0">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#005fa4] dark:text-blue-400 font-mono tracking-tight">
                {formatRupiah(activeExitVal)}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {language === "en" ? "Estimated company exit value (2029)" : "Valuasi keluar perusahaan (2029)"}
              </p>
            </div>
          </div>

          {/* Card 7: MOIC */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs hover:shadow-md hover:border-[#005fa4]/40 transition-all duration-300 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                {language === "en" ? "Projected Investor MOIC" : "Proyeksi MOIC Investor"}
              </span>
              <div className="h-8 w-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center shrink-0">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {activeMOIC > 0 ? `${activeMOIC.toFixed(2)}x` : (language === "en" ? "Base 5.0x" : "Moderat 5.0x")}
                </h3>
                {activeMOIC === 0 && (
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-50 text-[#005fa4] rounded-md border border-blue-200">
                    Proforma Target
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Multiple on Invested Capital</p>
            </div>
          </div>

          {/* Card 8: IRR */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs hover:shadow-md hover:border-[#005fa4]/40 transition-all duration-300 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                {language === "en" ? "Projected Investor IRR" : "Proyeksi IRR Investor"}
              </span>
              <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {activeIRR > 0 ? `${(activeIRR * 100).toFixed(1)}%` : "38.0% Target"}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {language === "en" ? "Internal Rate of Return (5-Year)" : "Internal Rate of Return (5-Tahun)"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Trend Chart Card */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2 text-slate-900 dark:text-white">
              <TrendingUp className="h-5 w-5 text-[#005fa4]" /> {language === "en" ? "Financial Trend Projection Chart" : "Grafik Tren Proyeksi Finansial"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {language === "en" 
                ? "Visualization of key financial indicator growth based on selected scenario."
                : "Visualisasi pertumbuhan indikator finansial utama berdasarkan skenario terpilih."
              }
            </p>
          </div>
          
          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setChartMetric("revenue")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${chartMetric === "revenue" ? "bg-[#005fa4] text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`}
            >
              Revenue & ARR
            </button>
            <button
              onClick={() => setChartMetric("ebitda")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${chartMetric === "ebitda" ? "bg-[#005fa4] text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`}
            >
              EBITDA
            </button>
            <button
              onClick={() => setChartMetric("cash")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${chartMetric === "cash" ? "bg-[#005fa4] text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`}
            >
              Ending Cash
            </button>
            <button
              onClick={() => setChartMetric("coops")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${chartMetric === "coops" ? "bg-[#005fa4] text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`}
            >
              {language === "en" ? "Active Coops" : "Koperasi Aktif"}
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#005fa4" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#005fa4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorARR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEBITDA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCoops" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" opacity={0.5} />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => chartMetric === "coops" ? `${value} Unit` : `Rp ${value}B`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                formatter={(value, name) => {
                  if (name === "Koperasi Aktif" || name === "Active Coops") return [`${value} Unit`, name];
                  return [language === "en" ? `Rp ${value} Billion` : `Rp ${value} Miliar`, name];
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              {chartMetric === "revenue" && (
                <>
                  <Area type="monotone" dataKey="revenueB" name="Total Revenue" stroke="#005fa4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="arrB" name="ARR" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorARR)" />
                </>
              )}
              {chartMetric === "ebitda" && (
                <Area type="monotone" dataKey="ebitdaB" name="EBITDA" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEBITDA)" />
              )}
              {chartMetric === "cash" && (
                <Area type="monotone" dataKey="endingCashB" name="Ending Cash" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCash)" />
              )}
              {chartMetric === "coops" && (
                <Area type="monotone" dataKey="endingCoops" name={language === "en" ? "Active Coops" : "Koperasi Aktif"} stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCoops)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
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
