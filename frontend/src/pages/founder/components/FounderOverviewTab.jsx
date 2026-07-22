import React from "react";
import { 
  Sparkles, Coins, Activity, Calculator, Users, ShieldAlert, TrendingUp, Award, Wallet
} from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { formatRupiah } from "../../cfo/utils/financialModel";

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
  return (
    <>
      {/* Scenario Selector Banner */}
      <section id="scenarios" className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
              <Sparkles className="h-5 w-5 text-[#f28c1f]" /> Simulasi Skenario Bisnis
            </h2>
            <p className="text-xs text-muted-foreground">Pilih skenario aktif untuk memicu re-kalkulasi instan pada KPI dan proyeksi finansial.</p>
          </div>
          <div className="flex gap-2 bg-background p-1 border border-border rounded-xl">
            <button 
              onClick={() => setActiveScenario("base")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeScenario === "base" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              Base Case
            </button>
            <button 
              onClick={() => setActiveScenario("optimistic")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeScenario === "optimistic" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              Optimistic Case
            </button>
            <button 
              onClick={() => setActiveScenario("pessimistic")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeScenario === "pessimistic" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              Pessimistic Case
            </button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: 2029 Revenue */}
          <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-emerald-600" /> Proyeksi Revenue (2029)
            </span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{formatRupiah(data2029.totalRevenue || 0)}</h3>
            <p className="text-[10px] text-muted-foreground">Target pendapatan di akhir tahun ke-5</p>
          </div>

          {/* Card 2: 2029 ARR */}
          <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-indigo-600" /> Proyeksi ARR (2029)
            </span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{formatRupiah(data2029.arr || 0)}</h3>
            <p className="text-[10px] text-muted-foreground">Annual Recurring Revenue tahun ke-5</p>
          </div>

          {/* Card 3: 2029 EBITDA */}
          <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-amber-600" /> EBITDA Proyeksi (2029)
            </span>
            <h3 className={`text-xl font-extrabold ${(data2029.ebitda || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatRupiah(data2029.ebitda || 0)}
            </h3>
            <p className="text-[10px] text-muted-foreground">Operasional profitabilitas tahun ke-5</p>
          </div>

          {/* Card 4: 2029 Active Coops */}
          <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" /> Koperasi Aktif (2029)
            </span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
              {new Intl.NumberFormat('id-ID').format(data2029.endingCoops || 0)} Unit
            </h3>
            <p className="text-[10px] text-muted-foreground">Target jumlah koperasi terlayani</p>
          </div>

          {/* Card 5: Seed Equity % */}
          <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-indigo-500" /> Porsi Kepemilikan Investor
            </span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
              {(valuation.dynamicInvestorEquityFrac * 100).toFixed(1)}%
            </h3>
            <p className="text-[10px] text-muted-foreground">Porsi saham investor pasca-funding Seed</p>
          </div>

          {/* Card 6: Exit Valuation */}
          <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" /> Estimasi Exit Valuation
            </span>
            <h3 className="text-xl font-extrabold text-primary">
              {formatRupiah(activeExitVal)}
            </h3>
            <p className="text-[10px] text-muted-foreground">Valuasi keluar perusahaan (2029)</p>
          </div>

          {/* Card 7: MOIC */}
          <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-500" /> Proyeksi MOIC Investor
            </span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
              {activeMOIC.toFixed(2)}x
            </h3>
            <p className="text-[10px] text-muted-foreground">Multiple on Invested Capital</p>
          </div>

          {/* Card 8: IRR */}
          <div className="bg-background p-5 rounded-xl border border-border space-y-1.5 shadow-sm hover:shadow-md transition-all">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-500" /> Proyeksi IRR Investor
            </span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
              {(activeIRR * 100).toFixed(1)}%
            </h3>
            <p className="text-[10px] text-muted-foreground">Internal Rate of Return (5 Tahun)</p>
          </div>
        </div>
      </section>

      {/* Interactive Trend Chart Card */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-white">
              <TrendingUp className="h-5 w-5 text-primary" /> Grafik Tren Proyeksi Finansial
            </h3>
            <p className="text-xs text-muted-foreground">Visualisasi pertumbuhan indikator finansial utama berdasarkan skenario terpilih.</p>
          </div>
          
          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap gap-2 bg-background p-1 border border-border rounded-xl">
            <button
              onClick={() => setChartMetric("revenue")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${chartMetric === "revenue" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              Revenue & ARR
            </button>
            <button
              onClick={() => setChartMetric("ebitda")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${chartMetric === "ebitda" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              EBITDA
            </button>
            <button
              onClick={() => setChartMetric("cash")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${chartMetric === "cash" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              Ending Cash
            </button>
            <button
              onClick={() => setChartMetric("coops")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${chartMetric === "coops" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              Koperasi Aktif
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorARR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEBITDA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCoops" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => chartMetric === "coops" ? `${value} Unit` : `Rp ${value}B`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                formatter={(value, name) => {
                  if (name === "Koperasi Aktif") return [`${value} Unit`, name];
                  return [`Rp ${value} Miliar`, name];
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              {chartMetric === "revenue" && (
                <>
                  <Area type="monotone" dataKey="revenueB" name="Total Revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="arrB" name="ARR" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorARR)" />
                </>
              )}
              {chartMetric === "ebitda" && (
                <Area type="monotone" dataKey="ebitdaB" name="EBITDA" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEBITDA)" />
              )}
              {chartMetric === "cash" && (
                <Area type="monotone" dataKey="endingCashB" name="Ending Cash" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCash)" />
              )}
              {chartMetric === "coops" && (
                <Area type="monotone" dataKey="endingCoops" name="Koperasi Aktif" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCoops)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric / Driver Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/10">
          <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-white">
            <Wallet className="h-5 w-5 text-primary" /> Ringkasan Proyeksi & Driver Finansial (Rp)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-5 py-3.5 font-bold">Metric / Driver</th>
                {projectionData.map((col) => (
                  <th 
                    key={col.year} 
                    className={`px-5 py-3.5 font-bold text-right transition-colors duration-150 ${getColHighlightClass(col.year)}`}
                    onMouseEnter={() => setHoveredYear(col.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {col.year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Active Cooperatives */}
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="px-5 py-2.5 font-medium text-slate-700 dark:text-slate-200">Active Cooperatives</td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-5 py-2.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {new Intl.NumberFormat('id-ID').format(c.endingCoops)}
                  </td>
                ))}
              </tr>
              
              {/* Members */}
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="px-5 py-2.5 text-muted-foreground pl-8">Cooperative Members</td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-5 py-2.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {new Intl.NumberFormat('id-ID').format(c.totalMembers)}
                  </td>
                ))}
              </tr>

              {/* Revenue */}
              <tr className="hover:bg-muted/10 transition-colors bg-emerald-50/10">
                <td className="px-5 py-2.5 font-semibold text-emerald-700 dark:text-emerald-400">Revenue</td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-5 py-2.5 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400 transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalRevenue)}
                  </td>
                ))}
              </tr>

              {/* ARR */}
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-5 py-2.5 pl-8">ARR</td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-5 py-2.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.arr)}
                  </td>
                ))}
              </tr>

              {/* Gross Margin */}
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-5 py-2.5 pl-8">Gross Margin %</td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-5 py-2.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.grossMargin.toFixed(1)}%
                  </td>
                ))}
              </tr>

              {/* EBITDA */}
              <tr className="hover:bg-muted/10 transition-colors bg-amber-50/10">
                <td className="px-5 py-2.5 font-semibold text-amber-700 dark:text-amber-400">EBITDA</td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-5 py-2.5 text-right font-mono font-semibold transition-colors duration-150 ${getColHighlightClass(c.year)} ${c.ebitda >= 0 ? 'text-green-600' : 'text-red-500'}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.ebitda)}
                  </td>
                ))}
              </tr>

              {/* EBITDA Margin */}
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-5 py-2.5 pl-8">EBITDA Margin %</td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-5 py-2.5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.ebitdaMargin.toFixed(1)}%
                  </td>
                ))}
              </tr>

              {/* Ending Cash */}
              <tr className="hover:bg-muted/10 transition-colors font-medium bg-blue-50/5">
                <td className="px-5 py-2.5 font-semibold text-blue-700 dark:text-blue-400">Ending Cash</td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-5 py-2.5 text-right font-mono font-semibold text-blue-700 dark:text-blue-400 transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.endingCash)}
                  </td>
                ))}
              </tr>

              {/* Cash Runway */}
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-5 py-2.5 pl-8 font-semibold">Runway (Months)</td>
                {projectionData.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-5 py-2.5 text-right transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.ebitda >= 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                        Profitable
                      </span>
                    ) : (
                      <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                        {c.runwayMonths ? (c.runwayMonths % 1 === 0 ? c.runwayMonths.toFixed(0) : c.runwayMonths.toFixed(1)) : '0'} Bulan
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
