import React from "react";
import { Activity, Wallet } from "lucide-react";
import { formatRupiah } from "../utils/financialModel";

export default function FinancialAnalystTab({ insights, data }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* System Advisor Assessment */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Sistem Analisis Model</span>
            <h2 className="text-xl font-bold">Analisis Strategis & Rekomendasi</h2>
            <div className="p-4 bg-muted/65 border border-border rounded-xl text-sm text-foreground mt-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Kondisi Model: <span className="text-primary capitalize">{insights.healthRating}</span></span>
              </div>
              <p className="text-muted-foreground">{insights.healthAdvice}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Ratios Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">CAGR Pendapatan (5-Tahun)</span>
          <h3 className="text-3xl font-bold text-primary">{insights.cagr}%</h3>
          <p className="text-xs text-muted-foreground">Laju pertumbuhan tahunan majemuk (2025–2029).</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Milestone EBITDA Positif</span>
          <h3 className="text-3xl font-bold text-[#f28c1f]">{insights.breakEvenYear}</h3>
          <p className="text-xs text-muted-foreground">Tahun pertama EBITDA operasional bernilai positif.</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">LTV / CAC (Rata-rata 2025)</span>
          <h3 className="text-3xl font-bold text-foreground">
            {data[0]?.ltvCacRatio ? data[0].ltvCacRatio.toFixed(1) : "0"}x
          </h3>
          <p className="text-xs text-muted-foreground">Rasio nilai kontribusi pelanggan dibanding beban akuisisi.</p>
        </div>
      </div>

      {/* Valuation & Investor Exit Projection */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" /> Proyeksi Pengembalian Investor Seed
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Analisis ROI berdasarkan Pre-Money {formatRupiah(data[4]?.preMoneyValuation || 0)} dan Investasi Seed {formatRupiah(data[4]?.seedInvestment || 0)} (Equity Porsi: {((data[4]?.impliedSeedEquityFrac || 0) * 100).toFixed(2)}%)
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Conservative */}
          <div className="border border-border rounded-xl p-4 bg-muted/10 space-y-3">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Konservatif (3x Multiple)</span>
              <span className="text-[10px] bg-gray-500/10 text-gray-500 font-bold px-2 py-0.5 rounded">Exit 2029</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase">Exit Valuation</p>
              <p className="text-md font-bold">{formatRupiah((data[4]?.totalRevenue * 0.875 * 3) || 0)}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground">MOIC</p>
                <p className="font-bold text-primary">{data[0]?.moicCons ? data[0].moicCons.toFixed(2) : "0.0"}x</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">IRR (5-Thn)</p>
                <p className="font-bold text-primary">{data[0]?.irrCons ? data[0].irrCons.toFixed(1) : "0.0"}%</p>
              </div>
            </div>
          </div>

          {/* Base Case */}
          <div className="border border-primary/20 rounded-xl p-4 bg-primary/5 space-y-3">
            <div className="flex justify-between items-center border-b border-primary/10 pb-2">
              <span className="text-xs font-semibold text-primary uppercase">Base Case (5x Multiple)</span>
              <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">Exit 2029</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase">Exit Valuation</p>
              <p className="text-md font-bold">{formatRupiah((data[4]?.totalRevenue * 5) || 0)}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/10 text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground">MOIC</p>
                <p className="font-bold text-primary">{data[0]?.moicBase ? data[0].moicBase.toFixed(2) : "0.0"}x</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">IRR (5-Thn)</p>
                <p className="font-bold text-primary">{data[0]?.irrBase ? data[0].irrBase.toFixed(1) : "0.0"}%</p>
              </div>
            </div>
          </div>

          {/* Optimistic */}
          <div className="border border-[#f28c1f]/20 rounded-xl p-4 bg-[#f28c1f]/5 space-y-3">
            <div className="flex justify-between items-center border-b border-[#f28c1f]/10 pb-2">
              <span className="text-xs font-semibold text-[#f28c1f] uppercase">Optimistik (7x Multiple)</span>
              <span className="text-[10px] bg-[#f28c1f]/10 text-[#f28c1f] font-bold px-2 py-0.5 rounded">Exit 2029</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase">Exit Valuation</p>
              <p className="text-md font-bold">{formatRupiah((data[4]?.totalRevenue * 1.1875 * 7) || 0)}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f28c1f]/10 text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground">MOIC</p>
                <p className="font-bold text-primary">{data[0]?.moicOpt ? data[0].moicOpt.toFixed(2) : "0.0"}x</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">IRR (5-Thn)</p>
                <p className="font-bold text-primary">{data[0]?.irrOpt ? data[0].irrOpt.toFixed(1) : "0.0"}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
