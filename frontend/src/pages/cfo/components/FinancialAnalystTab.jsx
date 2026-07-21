import React from "react";
import { Activity, Wallet, TrendingUp, Flag, RefreshCw } from "lucide-react";
import { formatRupiah } from "../utils/financialModel";

export default function FinancialAnalystTab({ insights, data, onRecalculateClick }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Strategic Analysis Card */}
      <section className="bg-white rounded-3xl shadow-sm border border-border p-6 md:p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Activity className="h-8 w-8" />
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Ringkasan Eksekutif</p>
              <h2 className="text-2xl font-bold text-foreground">Analisis Strategis & Rekomendasi</h2>
            </div>
            {/* Status Banner */}
            <div className="bg-slate-50 border border-border/50 rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] ${insights.healthRating?.toLowerCase() === 'sangat sehat' ? 'bg-emerald-500' : insights.healthRating?.toLowerCase() === 'berisiko' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm font-semibold text-foreground">
                  Kondisi Model: <span className={insights.healthRating?.toLowerCase() === 'sangat sehat' ? 'text-emerald-600 font-bold capitalize' : insights.healthRating?.toLowerCase() === 'berisiko' ? 'text-red-600 font-bold capitalize' : 'text-yellow-600 font-bold capitalize'}>{insights.healthRating}</span>
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {insights.healthAdvice}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow group">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">CAGR Pendapatan (5-Tahun)</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-primary">{insights.cagr}%</span>
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="text-xs text-muted-foreground">Laju pertumbuhan tahunan majemuk (2025–2029).</p>
        </div>
        
        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow group">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Milestone EBITDA Positif</p>
          <div className={`flex items-baseline gap-2 mb-2 ${insights.breakEvenYear === 'Belum Tercapai' ? 'text-red-500' : 'text-emerald-500'}`}>
            <span className={`font-extrabold ${insights.breakEvenYear === 'Belum Tercapai' ? 'text-2xl' : 'text-4xl'}`}>{insights.breakEvenYear}</span>
            <Flag className="h-6 w-6" />
          </div>
          <p className="text-xs text-muted-foreground">Tahun pertama EBITDA operasional bernilai positif.</p>
        </div>
        
        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow group">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">LTV / CAC (Rata-rata 2025)</p>
          <div className="flex items-baseline gap-2 mb-2 text-foreground">
            <span className="text-4xl font-extrabold">
                {data[0]?.ltvCacRatio ? data[0].ltvCacRatio.toFixed(1) : "0"}x
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Rasio nilai kontribusi pelanggan dibanding beban akuisisi.</p>
        </div>
      </div>

      {/* Investor Returns Section */}
      <section className="bg-white rounded-3xl shadow-sm border border-border p-6 md:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Proyeksi Pengembalian Investor Seed</h2>
            <p className="text-xs text-muted-foreground mt-1 italic">
              Analisis ROI berdasarkan Pre-Money {formatRupiah(data[4]?.preMoneyValuation || 0)} dan Investasi Seed {formatRupiah(data[4]?.seedInvestment || 0)} (Equity Porsi: {((data[4]?.impliedSeedEquityFrac || 0) * 100).toFixed(2)}%)
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario 1: Conservative */}
          <div 
            className="transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md bg-gradient-to-br from-slate-50 to-slate-100/50 border border-border/50 rounded-2xl p-6 relative overflow-hidden shadow-sm cursor-default"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Konservatif (3x)</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold uppercase">Exit 2029</span>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Exit Valuation</p>
                <p className="text-2xl font-bold text-foreground font-mono">{formatRupiah((data[4]?.totalRevenue * 0.875 * 3) || 0)}</p>
              </div>
              <div className="grid grid-cols-2 border-t border-border/50 pt-4 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">MOIC</p>
                  <p className="text-primary font-bold text-lg">{data[0]?.moicCons ? data[0].moicCons.toFixed(2) : "0.0"}x</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">IRR (5-Thn)</p>
                  <p className="text-primary font-bold text-lg">{data[0]?.irrCons ? data[0].irrCons.toFixed(1) : "0.0"}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario 2: Base Case */}
          <div 
            className="transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:ring-primary/20 bg-gradient-to-br from-primary/5 to-white border-2 border-primary/30 rounded-2xl p-6 relative overflow-hidden ring-4 ring-primary/5 shadow-sm cursor-default"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Base Case (5x)</span>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold uppercase">Exit 2029</span>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-primary/60 uppercase font-bold mb-1">Exit Valuation</p>
                <p className="text-2xl font-bold text-foreground font-mono">{formatRupiah((data[4]?.totalRevenue * 5) || 0)}</p>
              </div>
              <div className="grid grid-cols-2 border-t border-primary/20 pt-4 gap-4">
                <div>
                  <p className="text-[10px] text-primary/60 uppercase font-bold">MOIC</p>
                  <p className="text-primary font-bold text-lg">{data[0]?.moicBase ? data[0].moicBase.toFixed(2) : "0.0"}x</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary/60 uppercase font-bold">IRR (5-Thn)</p>
                  <p className="text-primary font-bold text-lg">{data[0]?.irrBase ? data[0].irrBase.toFixed(1) : "0.0"}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario 3: Optimistic */}
          <div 
            className="transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md hover:border-[#f28c1f]/50 bg-gradient-to-br from-[#f28c1f]/5 to-white border border-[#f28c1f]/30 rounded-2xl p-6 relative overflow-hidden shadow-sm cursor-default"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-[#f28c1f] uppercase tracking-widest">Optimistik (7x)</span>
              <span className="text-[10px] bg-[#f28c1f]/10 text-[#f28c1f] px-2 py-1 rounded font-bold uppercase">Exit 2029</span>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-[#f28c1f]/60 uppercase font-bold mb-1">Exit Valuation</p>
                <p className="text-2xl font-bold text-foreground font-mono">{formatRupiah((data[4]?.totalRevenue * 1.2 * 7) || 0)}</p>
              </div>
              <div className="grid grid-cols-2 border-t border-[#f28c1f]/20 pt-4 gap-4">
                <div>
                  <p className="text-[10px] text-[#f28c1f]/60 uppercase font-bold">MOIC</p>
                  <p className="text-primary font-bold text-lg">{data[0]?.moicOpt ? data[0].moicOpt.toFixed(2) : "0.0"}x</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#f28c1f]/60 uppercase font-bold">IRR (5-Thn)</p>
                  <p className="text-primary font-bold text-lg">{data[0]?.irrOpt ? data[0].irrOpt.toFixed(1) : "0.0"}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Density Table Visualization Sample (Strategic Drivers) */}
      <div className="bg-white rounded-3xl shadow-sm border border-border p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-foreground">Drivers Strategis Utama</h3>
          <button 
            onClick={onRecalculateClick}
            className="px-6 py-2.5 bg-primary text-white rounded-2xl text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Recalculate Model
          </button>
        </div>
        <div className="overflow-x-auto">
          {(() => {
            const getGrowth = (key, inverse = false) => {
              if (!data || !data[0] || !data[4]) return { text: "0%", color: "text-muted-foreground", status: "N/A", statusColor: "bg-gray-100 text-gray-700", barWidth: "50%", barColor: "bg-gray-400" };
              const v1 = data[0][key];
              const v2 = data[4][key]; // Compare 2025 to 2029
              if (v1 === 0) return { text: "N/A", color: "text-muted-foreground", status: "N/A", statusColor: "bg-gray-100 text-gray-700", barWidth: "0%", barColor: "bg-gray-400" };
              
              const growth = ((v2 - v1) / v1) * 100;
              const formatted = growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
              
              // If inverse=true (like Churn/CAC), then negative growth is good.
              let isGood = inverse ? growth <= 0 : growth > 0;
              
              let color = isGood ? "text-emerald-600" : "text-red-600";
              let status = isGood ? "OPTIMAL" : "PERLU PANTAU";
              let statusColor = isGood ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";
              
              let barWidthNum = isGood ? 70 + Math.abs(growth) : Math.max(10, 50 - Math.abs(growth));
              if (barWidthNum > 100) barWidthNum = 100;
              let barColor = isGood ? "bg-primary" : "bg-[#f28c1f]";
            
              return { text: formatted, color, status, statusColor, barWidth: `${barWidthNum}%`, barColor };
            };
            
            const churnStats = getGrowth('churnRate', true);
            const arpuStats = getGrowth('arpu', false);
            const cacStats = getGrowth('estimatedCac', true);

            return (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Nama Driver</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Nilai (FY2025)</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Pertumbuhan (s.d 2029)</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Dampak ROI</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {/* Churn Row */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground whitespace-nowrap">Churn Rate Bulanan</td>
                    <td className="px-6 py-4 text-sm font-mono whitespace-nowrap">{data[0]?.churnRate?.toFixed(1) || 0}%</td>
                    <td className={`px-6 py-4 text-sm font-bold whitespace-nowrap ${churnStats.color}`}>{churnStats.text}</td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${churnStats.barColor}`} style={{ width: churnStats.barWidth }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${churnStats.statusColor}`}>{churnStats.status}</span>
                    </td>
                  </tr>
                  {/* ARPU Row */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground whitespace-nowrap">ARPU (Average Revenue Per User)</td>
                    <td className="px-6 py-4 text-sm font-mono whitespace-nowrap">{formatRupiah(data[0]?.arpu || 0)}</td>
                    <td className={`px-6 py-4 text-sm font-bold whitespace-nowrap ${arpuStats.color}`}>{arpuStats.text}</td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${arpuStats.barColor}`} style={{ width: arpuStats.barWidth }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${arpuStats.statusColor}`}>{arpuStats.status}</span>
                    </td>
                  </tr>
                  {/* CAC Row */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground whitespace-nowrap">Customer Acquisition Cost (CAC)</td>
                    <td className="px-6 py-4 text-sm font-mono whitespace-nowrap">{formatRupiah(data[0]?.estimatedCac || 0)}</td>
                    <td className={`px-6 py-4 text-sm font-bold whitespace-nowrap ${cacStats.color}`}>{cacStats.text}</td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${cacStats.barColor}`} style={{ width: cacStats.barWidth }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${cacStats.statusColor}`}>{cacStats.status}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
