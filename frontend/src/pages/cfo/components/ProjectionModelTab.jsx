import React from "react";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function ProjectionModelTab({ data, formatRupiah }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chart Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" /> Proyeksi Kinerja 5-Tahun (Jutaan Rupiah)
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickMargin={10} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `Rp${val}M`} />
              <Tooltip 
                formatter={(value, name) => [`Rp ${new Intl.NumberFormat("id-ID").format(value)} Juta`, name]}
                labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="revenue" name="Pendapatan" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="expenses" name="Beban (COGS+OPEX)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="ebitdaM" name="EBITDA" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income Statement Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/10">
          <h3 className="text-lg font-bold">Laporan Laba Rugi Proforma (Rp)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Komponen / Tahun</th>
                {data.map((col) => (
                  <th key={col.year} className="px-6 py-4 font-bold text-right">{col.year}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* --- Koperasi & Anggota --- */}
              <tr className="bg-muted/5 font-semibold text-muted-foreground"><td colSpan={6} className="px-6 py-2">Metrik Pengguna</td></tr>
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-3 font-medium">Koperasi Aktif</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{c.endingCoops}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-3 font-medium">Total Anggota Koperasi</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{new Intl.NumberFormat('id-ID').format(c.totalMembers)}</td>)}
              </tr>

              {/* --- PENDAPATAN --- */}
              <tr className="bg-muted/5 font-semibold text-muted-foreground"><td colSpan={6} className="px-6 py-2">Pendapatan</td></tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Setup & Implementasi</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.setupImplementationRevenue)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">SaaS Subscription</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.saasSubscriptionRevenue)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">iOS Add-on</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.iosAddonRevenue)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Proyek White Label</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.whiteLabelRevenue)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Transaksi PPOB</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.ppobTransactionRevenue)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Smartcoop Academy</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.academyRevenue)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Pelatihan Offline</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.offlineTrainingRevenue)}</td>)}
              </tr>
              <tr className="bg-green-500/10 font-bold text-green-700">
                <td className="px-6 py-4">Total Pendapatan</td>
                {data.map((c) => <td key={c.year} className="px-6 py-4 text-right">{formatRupiah(c.totalRevenue)}</td>)}
              </tr>

              {/* --- HPP (COGS) --- */}
              <tr className="bg-muted/5 font-semibold text-muted-foreground"><td colSpan={6} className="px-6 py-2">Harga Pokok Penjualan (HPP)</td></tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Cloud Infrastructure</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.cloudInfrastructureCost)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Implementation & Onboarding</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.implementationOnboardingCost)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Customer Support</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.customerSupportCost)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Payment API & Integrasi</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.paymentApiVariableCost)}</td>)}
              </tr>
              <tr className="bg-red-500/10 font-bold text-red-700">
                <td className="px-6 py-4">Total Beban Pokok (COGS)</td>
                {data.map((c) => <td key={c.year} className="px-6 py-4 text-right">{formatRupiah(c.totalCogs)}</td>)}
              </tr>

              {/* --- Laba Kotor --- */}
              <tr className="bg-primary/10 font-bold text-primary">
                <td className="px-6 py-4">Laba Kotor (Gross Profit)</td>
                {data.map((c) => <td key={c.year} className="px-6 py-4 text-right">{formatRupiah(c.grossProfit)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-primary font-medium">
                <td className="px-6 py-3 pl-10 text-xs">Gross Margin (%)</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{c.grossMargin.toFixed(1)}%</td>)}
              </tr>

              {/* --- OPEX --- */}
              <tr className="bg-muted/5 font-semibold text-muted-foreground"><td colSpan={6} className="px-6 py-2">Beban Operasional (OPEX)</td></tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Beban Pegawai</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.payrollOpex)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Sales & Marketing</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.salesMarketingOpex)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Utilitas & Sewa</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.officeUtilitiesOpex)}</td>)}
              </tr>
              <tr className="bg-red-500/10 font-bold text-red-700">
                <td className="px-6 py-4">Total OPEX</td>
                {data.map((c) => <td key={c.year} className="px-6 py-4 text-right">{formatRupiah(c.totalOpex)}</td>)}
              </tr>

              {/* --- EBITDA --- */}
              <tr className="bg-[#f28c1f]/10 font-bold text-[#f28c1f] border-t-2 border-[#f28c1f]/30">
                <td className="px-6 py-5">EBITDA</td>
                {data.map((c) => <td key={c.year} className="px-6 py-5 text-right">{formatRupiah(c.ebitda)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-[#f28c1f] font-medium border-b border-[#f28c1f]/20">
                <td className="px-6 py-3 pl-10 text-xs">EBITDA Margin (%)</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{c.ebitdaMargin.toFixed(1)}%</td>)}
              </tr>

              {/* --- SaaS & Unit Economics Metrics --- */}
              <tr className="bg-muted/5 font-semibold text-muted-foreground"><td colSpan={6} className="px-6 py-2">SaaS Unit Economics</td></tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Rule of 40 (%)</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right font-medium {(c.ruleOf40 * 100) >= 40 ? 'text-green-600' : ''}">{(c.ruleOf40 * 100).toFixed(1)}%</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">ARPU / Bulan</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{formatRupiah(c.arpu / 12)}</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">LTV / CAC Ratio</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right font-medium {(c.ltvCacRatio >= 3) ? 'text-green-600' : ''}">{c.ltvCacRatio.toFixed(1)}x</td>)}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground border-b-2 border-border">
                <td className="px-6 py-3 pl-10">CAC Payback (Bulan)</td>
                {data.map((c) => <td key={c.year} className="px-6 py-3 text-right">{c.cacPaybackMonths.toFixed(1)}</td>)}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
