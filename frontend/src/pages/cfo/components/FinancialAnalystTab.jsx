import React from "react";
import { Activity, Wallet, TrendingUp, Flag, RefreshCw, Award, ShieldCheck } from "lucide-react";
import { formatRupiah } from "../utils/financialModel";
import { useLanguage } from "../../../context/LanguageContext";

export default function FinancialAnalystTab({ insights, data, onRecalculateClick }) {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Strategic Analysis Card */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8 overflow-hidden relative">
        {/* Brand Accent Bar */}
        <div className="absolute top-0 left-0 w-2 h-full bg-[#005fa4]"></div>
        
        <div className="pl-2 space-y-5">
          <div>
            <p className="text-[11px] font-extrabold text-[#005fa4] uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" /> {t("finance.analyst.executiveSummaryTitle", "Ringkasan Eksekutif")}
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {language === "en" ? "Strategic Analysis & Recommendations" : "Analisis Strategis & Rekomendasi"}
            </h2>
          </div>
            
            {/* Status Banner */}
            <div className="bg-gradient-to-r from-slate-50/90 to-blue-50/30 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${
                  insights.healthRating?.toLowerCase() === 'sangat sehat' || insights.healthRating?.toLowerCase() === 'very healthy'
                    ? 'bg-emerald-500 ring-4 ring-emerald-500/20' 
                    : insights.healthRating?.toLowerCase() === 'berisiko' || insights.healthRating?.toLowerCase() === 'at risk'
                      ? 'bg-red-500 ring-4 ring-red-500/20' 
                      : 'bg-[#FFD700] ring-4 ring-[#FFD700]/30'
                }`} />
                <span className="text-sm font-bold text-slate-800">
                  {language === "en" ? "Model Condition: " : "Kondisi Model: "} <span className={
                    insights.healthRating?.toLowerCase() === 'sangat sehat' || insights.healthRating?.toLowerCase() === 'very healthy'
                      ? 'text-emerald-600 font-extrabold capitalize' 
                      : insights.healthRating?.toLowerCase() === 'berisiko' || insights.healthRating?.toLowerCase() === 'at risk'
                        ? 'text-red-600 font-extrabold capitalize' 
                        : 'text-amber-700 font-extrabold capitalize'
                  }>{language === "en" && insights.healthRating === "Sangat Sehat" ? "Very Healthy" : language === "en" && insights.healthRating === "Berisiko" ? "At Risk" : insights.healthRating}</span>
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {insights.healthAdvice}
              </p>
            </div>
          </div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#005fa4]/30 transition-all duration-300 group">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            <span>{language === "en" ? "Revenue CAGR (5-Year)" : "CAGR Pendapatan (5-Tahun)"}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#005fa4]" />
          </p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-black text-[#005fa4]">{insights.cagr}%</span>
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {language === "en" ? "Compound annual growth rate (2025–2029)." : "Laju pertumbuhan tahunan majemuk (2025–2029)."}
          </p>
        </div>
        
        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#005fa4]/30 transition-all duration-300 group">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            <span>{language === "en" ? "Positive EBITDA Milestone" : "Milestone EBITDA Positif"}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" />
          </p>
          <div className={`flex items-baseline gap-2 mb-2 ${insights.breakEvenYear === 'Belum Tercapai' || insights.breakEvenYear === 'Not Reached' ? 'text-red-500' : 'text-emerald-600'}`}>
            <span className={`font-black ${insights.breakEvenYear === 'Belum Tercapai' || insights.breakEvenYear === 'Not Reached' ? 'text-2xl text-red-500' : 'text-4xl text-emerald-600'}`}>
              {language === "en" && insights.breakEvenYear === "Belum Tercapai" ? "Not Reached" : insights.breakEvenYear}
            </span>
            <Flag className="h-6 w-6" />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {language === "en" ? "First year operating EBITDA reaches positive value." : "Tahun pertama EBITDA operasional bernilai positif."}
          </p>
        </div>
        
        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#005fa4]/30 transition-all duration-300 group">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            <span>{language === "en" ? "LTV / CAC (Avg 2025)" : "LTV / CAC (Rata-rata 2025)"}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#005fa4]" />
          </p>
          <div className="flex items-baseline gap-2 mb-2 text-slate-900">
            <span className="text-4xl font-black text-slate-900">
              {data[0]?.ltvCacRatio ? data[0].ltvCacRatio.toFixed(1) : "0"}x
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {language === "en" ? "Customer lifetime value to acquisition cost ratio." : "Rasio nilai kontribusi pelanggan dibanding beban akuisisi."}
          </p>
        </div>
      </div>

      {/* Investor Returns Section */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#005fa4]/10 flex items-center justify-center text-[#005fa4] shrink-0">
            <Wallet className="h-6 w-6 text-[#005fa4]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {language === "en" ? "Seed Investor Returns Projections" : "Proyeksi Pengembalian Investor Seed"}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {language === "en"
                ? `ROI analysis based on Pre-Money ${formatRupiah(data[4]?.preMoneyValuation || 0)} and Seed Investment ${formatRupiah(data[4]?.seedInvestment || 0)} (Equity Share: ${((data[4]?.impliedSeedEquityFrac || 0) * 100).toFixed(2)}%)`
                : `Analisis ROI berdasarkan Pre-Money ${formatRupiah(data[4]?.preMoneyValuation || 0)} dan Investasi Seed ${formatRupiah(data[4]?.seedInvestment || 0)} (Equity Porsi: ${((data[4]?.impliedSeedEquityFrac || 0) * 100).toFixed(2)}%)`
              }
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario 1: Conservative */}
          <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-2xs cursor-default">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-extrabold text-slate-600 uppercase tracking-widest">
                {language === "en" ? "Conservative (3x)" : "Konservatif (3x)"}
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-extrabold uppercase">Exit 2029</span>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                  {language === "en" ? "Exit Valuation" : "Valuasi Exit"}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 font-mono">{formatRupiah((data[4]?.totalRevenue * 0.875 * 3) || 0)}</p>
              </div>
              <div className="grid grid-cols-2 border-t border-slate-200 pt-4 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">MOIC</p>
                  <p className="text-[#005fa4] font-extrabold text-lg">{data[0]?.moicCons ? data[0].moicCons.toFixed(2) : "0.0"}x</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{language === "en" ? "IRR (5-Yr)" : "IRR (5-Thn)"}</p>
                  <p className="text-[#005fa4] font-extrabold text-lg">{data[0]?.irrCons ? data[0].irrCons.toFixed(1) : "0.0"}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario 2: Base Case (Smartcoop Blue Theme) */}
          <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-[#005fa4]/5 via-white to-blue-50/30 border-2 border-[#005fa4]/40 rounded-2xl p-6 relative overflow-hidden ring-4 ring-[#005fa4]/5 shadow-md cursor-default">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black text-[#005fa4] uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#005fa4]" /> {language === "en" ? "Base Case (5x)" : "Moderat (5x)"}
              </span>
              <span className="text-[10px] bg-[#005fa4] text-white px-2.5 py-1 rounded-md font-extrabold uppercase shadow-2xs">
                {language === "en" ? "Primary Target" : "Target Utama"}
              </span>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-[#005fa4] uppercase font-bold mb-1">
                  {language === "en" ? "Exit Valuation" : "Valuasi Exit"}
                </p>
                <p className="text-2xl font-black text-slate-900 font-mono">{formatRupiah((data[4]?.totalRevenue * 5) || 0)}</p>
              </div>
              <div className="grid grid-cols-2 border-t border-[#005fa4]/20 pt-4 gap-4">
                <div>
                  <p className="text-[10px] text-[#005fa4] uppercase font-bold">MOIC</p>
                  <p className="text-[#005fa4] font-black text-xl">{data[0]?.moicBase ? data[0].moicBase.toFixed(2) : "0.0"}x</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#005fa4] uppercase font-bold">{language === "en" ? "IRR (5-Yr)" : "IRR (5-Thn)"}</p>
                  <p className="text-[#005fa4] font-black text-xl">{data[0]?.irrBase ? data[0].irrBase.toFixed(1) : "0.0"}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario 3: Optimistic (Gold Accent Theme) */}
          <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-gradient-to-br from-[#FFD700]/10 via-white to-amber-50/20 border border-amber-300 rounded-2xl p-6 relative overflow-hidden shadow-2xs cursor-default">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-600" /> {language === "en" ? "Optimistic (7x)" : "Optimistik (7x)"}
              </span>
              <span className="text-[10px] bg-amber-500 text-white px-2 py-1 rounded-md font-extrabold uppercase">Exit 2029</span>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-amber-700 uppercase font-bold mb-1">
                  {language === "en" ? "Exit Valuation" : "Valuasi Exit"}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 font-mono">{formatRupiah((data[4]?.totalRevenue * 1.2 * 7) || 0)}</p>
              </div>
              <div className="grid grid-cols-2 border-t border-amber-200 pt-4 gap-4">
                <div>
                  <p className="text-[10px] text-amber-700 uppercase font-bold">MOIC</p>
                  <p className="text-amber-800 font-extrabold text-lg">{data[0]?.moicOpt ? data[0].moicOpt.toFixed(2) : "0.0"}x</p>
                </div>
                <div>
                  <p className="text-[10px] text-amber-700 uppercase font-bold">{language === "en" ? "IRR (5-Yr)" : "IRR (5-Thn)"}</p>
                  <p className="text-amber-800 font-extrabold text-lg">{data[0]?.irrOpt ? data[0].irrOpt.toFixed(1) : "0.0"}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drivers Strategis Utama Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {language === "en" ? "Key Strategic Drivers" : "Drivers Strategis Utama"}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {language === "en" ? "Core operational growth metrics and their projected impact on ROI." : "Metrik pertumbuhan operasional inti dan proyeksi dampaknya pada ROI."}
            </p>
          </div>
          <button 
            onClick={onRecalculateClick}
            className="px-5 py-2.5 bg-[#005fa4] hover:bg-[#004b82] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#005fa4]/20 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#FFD700]" />
            {language === "en" ? "Recalculate Model" : "Hitung Ulang Model"}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {(() => {
            const getGrowth = (key, inverse = false) => {
              if (!data || !data[0] || !data[4]) return { text: "0%", color: "text-slate-400", status: "N/A", statusColor: "bg-gray-100 text-gray-700", barWidth: "50%", barColor: "bg-gray-400" };
              const v1 = data[0][key];
              const v2 = data[4][key];
              if (v1 === 0) return { text: "N/A", color: "text-slate-400", status: "N/A", statusColor: "bg-gray-100 text-gray-700", barWidth: "0%", barColor: "bg-gray-400" };
              
              const growth = ((v2 - v1) / v1) * 100;
              const formatted = growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
              let isGood = inverse ? growth <= 0 : growth > 0;
              
              let color = isGood ? "text-emerald-600" : "text-red-600";
              let status = isGood ? (language === "en" ? "OPTIMAL" : "OPTIMAL") : (language === "en" ? "MONITOR" : "PERLU PANTAU");
              let statusColor = isGood ? "bg-emerald-100 text-emerald-700 font-bold" : "bg-red-100 text-red-700 font-bold";
              
              let barWidthNum = isGood ? 70 + Math.abs(growth) : Math.max(10, 50 - Math.abs(growth));
              if (barWidthNum > 100) barWidthNum = 100;
              let barColor = isGood ? "bg-[#005fa4]" : "bg-amber-500";
            
              return { text: formatted, color, status, statusColor, barWidth: `${barWidthNum}%`, barColor };
            };
            
            const churnStats = getGrowth('churnRate', true);
            const arpuStats = getGrowth('arpu', false);
            const cacStats = getGrowth('estimatedCac', true);

            return (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {language === "en" ? "Driver Name" : "Nama Driver"}
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {language === "en" ? "Value (FY2025)" : "Nilai (FY2025)"}
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {language === "en" ? "Growth (thru 2029)" : "Pertumbuhan (s.d 2029)"}
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {language === "en" ? "ROI Impact" : "Dampak ROI"}
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">
                      {language === "en" ? "Status" : "Status"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Churn Row */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                      {language === "en" ? "Monthly Churn Rate" : "Churn Rate Bulanan"}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono whitespace-nowrap">{data[0]?.churnRate?.toFixed(1) || 0}%</td>
                    <td className={`px-6 py-4 text-sm font-extrabold whitespace-nowrap ${churnStats.color}`}>{churnStats.text}</td>
                    <td className="px-6 py-4">
                      <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${churnStats.barColor}`} style={{ width: churnStats.barWidth }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase ${churnStats.statusColor}`}>{churnStats.status}</span>
                    </td>
                  </tr>
                  {/* ARPU Row */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                      {language === "en" ? "ARPU (Average Revenue Per User)" : "ARPU (Average Revenue Per User)"}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono whitespace-nowrap">{formatRupiah(data[0]?.arpu || 0)}</td>
                    <td className={`px-6 py-4 text-sm font-extrabold whitespace-nowrap ${arpuStats.color}`}>{arpuStats.text}</td>
                    <td className="px-6 py-4">
                      <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${arpuStats.barColor}`} style={{ width: arpuStats.barWidth }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase ${arpuStats.statusColor}`}>{arpuStats.status}</span>
                    </td>
                  </tr>
                  {/* CAC Row */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                      {language === "en" ? "Customer Acquisition Cost (CAC)" : "Customer Acquisition Cost (CAC)"}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono whitespace-nowrap">{formatRupiah(data[0]?.estimatedCac || 0)}</td>
                    <td className={`px-6 py-4 text-sm font-extrabold whitespace-nowrap ${cacStats.color}`}>{cacStats.text}</td>
                    <td className="px-6 py-4">
                      <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${cacStats.barColor}`} style={{ width: cacStats.barWidth }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase ${cacStats.statusColor}`}>{cacStats.status}</span>
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
