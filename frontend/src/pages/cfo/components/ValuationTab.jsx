import React from "react";
import { TrendingUp, Users, Award, ShieldAlert } from "lucide-react";

export default function ValuationTab({ data, formatRupiah }) {
  // Find seed investment parameters from the year where seed investment is active (typically 2026)
  const seedYearData = data.find(y => y.seedInvestment > 0) || data[1] || data[0];
  const preMoneyVal = seedYearData?.preMoneyValuation ?? 0;
  const seedInv = seedYearData?.seedInvestment ?? 0;
  const postMoneyVal = preMoneyVal + seedInv;
  const impliedEquityFrac = postMoneyVal > 0 ? seedInv / postMoneyVal : 0;

  // Year 2029 projected data for exit ROI
  const data2029 = data.find(y => y.year === 2029) || data[data.length - 1];
  const rev2029 = data2029?.totalRevenue ?? 0;
  const multCons = data2029?.exitMultipleConservative ?? 0;
  const multBase = data2029?.exitMultipleBase ?? 0;
  const multOpt = data2029?.exitMultipleOptimistic ?? 0;

  // Exit Valuation Calculations
  const exitValCons = rev2029 * multCons;
  const exitValBase = rev2029 * multBase;
  const exitValOpt = rev2029 * multOpt;

  // Investor Equity Value
  const invValCons = exitValCons * impliedEquityFrac;
  const invValBase = exitValBase * impliedEquityFrac;
  const invValOpt = exitValOpt * impliedEquityFrac;

  // MOIC Calculations
  const moicCons = seedInv > 0 ? invValCons / seedInv : 0;
  const moicBase = seedInv > 0 ? invValBase / seedInv : 0;
  const moicOpt = seedInv > 0 ? invValOpt / seedInv : 0;

  // IRR Calculations (5 Years)
  const irrCons = moicCons > 0 ? Math.pow(moicCons, 1 / 5) - 1 : 0;
  const irrBase = moicBase > 0 ? Math.pow(moicBase, 1 / 5) - 1 : 0;
  const irrOpt = moicOpt > 0 ? Math.pow(moicOpt, 1 / 5) - 1 : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Valuation Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/10">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> 11. Simulasi Valuasi Perusahaan (Rp)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Metrik / Tahun</th>
                {data.map((col) => (
                  <th key={col.year} className="px-6 py-4 font-bold text-right">{col.year}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-3 font-medium">Revenue (Pendapatan)</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.totalRevenue)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">ARR</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.arr)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Revenue Multiple - Conservative</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right font-mono">{c.exitMultipleConservative}x</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Revenue Multiple - Base</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right font-mono">{c.exitMultipleBase}x</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Revenue Multiple - Optimistic</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right font-mono">{c.exitMultipleOptimistic}x</td>)}
              </tr>
              <tr className="bg-primary/5 font-semibold text-slate-700">
                <td className="px-6 py-3 pl-10">Enterprise Value - Conservative</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.totalRevenue * c.exitMultipleConservative)}</td>)}
              </tr>
              <tr className="bg-primary/5 font-bold text-primary border-t border-b">
                <td className="px-6 py-3 pl-10">Enterprise Value - Base</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.totalRevenue * c.exitMultipleBase)}</td>)}
              </tr>
              <tr className="bg-primary/5 font-semibold text-slate-700">
                <td className="px-6 py-3 pl-10">Enterprise Value - Optimistic</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.totalRevenue * c.exitMultipleOptimistic)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3">Seed Pre-Money Valuation</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.preMoneyValuation)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3">Seed Post-Money Valuation</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.preMoneyValuation + c.seedInvestment)}</td>)}
              </tr>
              <tr className="bg-muted/30 text-muted-foreground">
                <td className="px-6 py-3 pl-10 text-xs">Implied Seed Equity %</td>
                {data.map((c) => (
                  <td key={c.year} className="px-6 py-3 text-right font-mono text-xs">
                    {(c.preMoneyValuation + c.seedInvestment) > 0 
                      ? ((c.seedInvestment / (c.preMoneyValuation + c.seedInvestment)) * 100).toFixed(2) 
                      : "0.00"}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Cap Table & Potential Investor Return */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Cap Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-border bg-muted/10">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> 12. Cap Table Pasca-Pendanaan
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase bg-muted/30 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-bold">Pemegang Saham</th>
                    <th className="px-4 py-3 font-bold text-right">Pre-Seed</th>
                    <th className="px-4 py-3 font-bold text-right">Investasi Masuk</th>
                    <th className="px-4 py-3 font-bold text-right">Kepemilikan Post-Seed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Founders / Existing Shareholders</td>
                    <td className="px-4 py-3 text-right font-mono">100.00%</td>
                    <td className="px-4 py-3 text-right">{formatRupiah(0)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">
                      {((1 - impliedEquityFrac) * 100).toFixed(2)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground">Employee Option Pool (ESOP)</td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">0.00%</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{formatRupiah(0)}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">0.00%</td>
                  </tr>
                  <tr className="bg-primary/5 text-primary">
                    <td className="px-4 py-3 font-semibold">Seed Investor</td>
                    <td className="px-4 py-3 text-right font-mono">0.00%</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatRupiah(seedInv)}</td>
                    <td className="px-4 py-3 text-right font-mono font-black">
                      {(impliedEquityFrac * 100).toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="bg-muted/40 font-bold border-t-2 border-border text-slate-800">
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-right font-mono">100.00%</td>
                    <td className="px-4 py-3 text-right">{formatRupiah(seedInv)}</td>
                    <td className="px-4 py-3 text-right font-mono">100.00%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 bg-muted/10 border-t border-border flex items-start gap-2.5 text-[10px] text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Porsi kepemilikan dihitung dari persentase suntikan dana investasi Seed terhadap Post-Money Valuation.</span>
          </div>
        </div>

        {/* Potential Investor Return */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-border bg-muted/10">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" /> 13. Estimasi Imbal Hasil Investor (Exit ROI)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase bg-muted/30 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-bold">Indikator</th>
                    <th className="px-4 py-3 font-bold text-right">Konservatif</th>
                    <th className="px-4 py-3 font-bold text-right">Base Case</th>
                    <th className="px-4 py-3 font-bold text-right">Optimistik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Projected Revenue (2029)</td>
                    <td className="px-4 py-3 text-right" colSpan={3}>{formatRupiah(rev2029)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground">Revenue Multiple</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-700">{multCons}x</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-primary">{multBase}x</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-700">{multOpt}x</td>
                  </tr>
                  <tr className="bg-muted/10">
                    <td className="px-4 py-3 font-semibold text-slate-700">Estimated Exit Valuation</td>
                    <td className="px-4 py-3 text-right">{formatRupiah(exitValCons)}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">{formatRupiah(exitValBase)}</td>
                    <td className="px-4 py-3 text-right">{formatRupiah(exitValOpt)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground">Investor Equity %</td>
                    <td className="px-4 py-3 text-right font-mono" colSpan={3}>{(impliedEquityFrac * 100).toFixed(2)}%</td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="px-4 py-3 font-bold text-primary">Investor Equity Value</td>
                    <td className="px-4 py-3 text-right">{formatRupiah(invValCons)}</td>
                    <td className="px-4 py-3 text-right font-bold text-primary">{formatRupiah(invValBase)}</td>
                    <td className="px-4 py-3 text-right">{formatRupiah(invValOpt)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground">Initial Investment</td>
                    <td className="px-4 py-3 text-right" colSpan={3}>{formatRupiah(seedInv)}</td>
                  </tr>
                  <tr className="font-bold border-t">
                    <td className="px-4 py-3 text-slate-700">MOIC</td>
                    <td className="px-4 py-3 text-right font-mono text-amber-700">{moicCons.toFixed(2)}x</td>
                    <td className="px-4 py-3 text-right font-mono text-green-700">{moicBase.toFixed(2)}x</td>
                    <td className="px-4 py-3 text-right font-mono text-green-900">{moicOpt.toFixed(2)}x</td>
                  </tr>
                  <tr className="font-bold bg-muted/40">
                    <td className="px-4 py-3 text-slate-800">Estimated IRR (5 Years)</td>
                    <td className="px-4 py-3 text-right font-mono text-amber-700">{(irrCons * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-mono text-green-700">{(irrBase * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-mono text-green-900">{(irrOpt * 100).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 bg-muted/10 border-t border-border flex items-start gap-2.5 text-[10px] text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>MOIC (Multiple on Invested Capital) & IRR (Internal Rate of Return) disimulasikan berdasarkan asumsi exit tahun ke-5 (2029).</span>
          </div>
        </div>

      </div>
    </div>
  );
}
