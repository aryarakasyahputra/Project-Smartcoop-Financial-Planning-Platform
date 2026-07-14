import React from "react";
import { TrendingUp, Wallet, Users, Award, ShieldAlert, ChevronRight, ChevronDown, Coins, Activity, Calculator, BarChart3, Layers } from "lucide-react";
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
import { useValuationModel } from "../utils/valuationHelper";

export default function ProjectionModelTab({ data, formatRupiah }) {
  const valuation = useValuationModel(data);

  // UI Interactive States
  const [activeChartMetric, setActiveChartMetric] = React.useState("all");
  const [hoveredYear, setHoveredYear] = React.useState(null);
  const [collapsedSections, setCollapsedSections] = React.useState({
    growth: true,
    revenue: true,
    cogs: true,
    opex: true,
    ebitda: true,
    saas: true
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getColHighlightClass = (year) => {
    return hoveredYear === year ? "bg-primary/5 font-semibold text-primary" : "";
  };

  const chartData = data.map(item => ({
    ...item,
    endingCashM: Math.round(item.endingCash / 1000000)
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chart Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Proyeksi Kinerja 5-Tahun (Jutaan Rupiah)
          </h3>
          <div className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveChartMetric("all")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeChartMetric === "all" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua Metrik
            </button>
            <button
              onClick={() => setActiveChartMetric("revenue")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeChartMetric === "revenue" ? "bg-emerald-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pendapatan
            </button>
            <button
              onClick={() => setActiveChartMetric("ebitda")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeChartMetric === "ebitda" ? "bg-amber-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EBITDA
            </button>
            <button
              onClick={() => setActiveChartMetric("cash")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeChartMetric === "cash" ? "bg-blue-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ending Cash
            </button>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickMargin={10} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `Rp${val}M`} />
              <Tooltip 
                formatter={(value, name) => [`Rp ${new Intl.NumberFormat("id-ID").format(value)} Juta`, name]}
                labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {(activeChartMetric === "all" || activeChartMetric === "revenue") && (
                <Line type="monotone" dataKey="revenue" name="Pendapatan" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              )}
              {activeChartMetric === "all" && (
                <Line type="monotone" dataKey="expenses" name="Beban (COGS+OPEX)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              )}
              {(activeChartMetric === "all" || activeChartMetric === "ebitda") && (
                <Line type="monotone" dataKey="ebitdaM" name="EBITDA" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              )}
              {activeChartMetric === "cash" && (
                <Line type="monotone" dataKey="endingCashM" name="Ending Cash" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 1. Customer Growth Model */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/10 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Users className="h-5 w-5 text-indigo-600" /> Customer Growth Model
          </h3>
          <button 
            onClick={() => toggleSection("growth")}
            className="text-xs text-indigo-600 flex items-center gap-1 font-semibold bg-indigo-50 hover:bg-indigo-100 transition-colors px-2.5 py-1 rounded-full"
          >
            {collapsedSections.growth ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {collapsedSections.growth ? "Lihat Perhitungan Detail" : "Sembunyikan Detail"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Komponen / Tahun</th>
                {data.map((col) => (
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
            <tbody className="divide-y divide-border">
              {!collapsedSections.growth && (
                <>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Beginning Active Cooperatives</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {new Intl.NumberFormat('id-ID').format(c.beginningCoops)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">New Cooperatives Acquired</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {new Intl.NumberFormat('id-ID').format(c.newCoops)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Churned Cooperatives</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {new Intl.NumberFormat('id-ID').format(c.churnedCoops)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Average Members / Cooperative</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {new Intl.NumberFormat('id-ID').format(c.avgMembers)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">YoY Active Coop Growth</td>
                    {data.map((c, i) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {i === 0 ? "-" : `${(c.yoyCoopGrowth * 100).toFixed(1)}%`}
                      </td>
                    ))}
                  </tr>
                </>
              )}
              {/* Output Utama (Always Visible) */}
              <tr className="hover:bg-muted/5 transition-colors font-bold text-indigo-700 bg-indigo-50/20">
                <td className="px-6 py-3 pl-6">Ending Active Cooperatives</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {new Intl.NumberFormat('id-ID').format(c.endingCoops)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors font-bold text-indigo-700 bg-indigo-50/20">
                <td className="px-6 py-3 pl-6">Total Cooperative Members</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {new Intl.NumberFormat('id-ID').format(c.totalMembers)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Laporan Pendapatan (Revenue) */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/10 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Coins className="h-5 w-5 text-emerald-600" /> Laporan Pendapatan (Revenue)
          </h3>
          <button 
            onClick={() => toggleSection("revenue")}
            className="text-xs text-emerald-600 flex items-center gap-1 font-semibold bg-emerald-50 hover:bg-emerald-100 transition-colors px-2.5 py-1 rounded-full"
          >
            {collapsedSections.revenue ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {collapsedSections.revenue ? "Lihat Perhitungan Detail" : "Sembunyikan Detail"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Komponen / Tahun</th>
                {data.map((col) => (
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
            <tbody className="divide-y divide-border">
              {!collapsedSections.revenue && (
                <>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Setup & Implementasi</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.setupImplementationRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">SaaS Subscription</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.saasSubscriptionRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">iOS Add-on</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.iosAddonRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Proyek White Label</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.whiteLabelRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Transaksi PPOB</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.ppobTransactionRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Smartcoop Academy</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.academyRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Pelatihan Offline</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.offlineTrainingRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Kontrak Enterprise API</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.enterpriseAPI_revenue)}
                      </td>
                    ))}
                  </tr>
                </>
              )}
              {/* Output Utama (Always Visible) */}
              <tr className="hover:bg-muted/5 transition-colors text-emerald-600 font-medium bg-emerald-50/10">
                <td className="px-6 py-3 pl-6 text-xs font-semibold">ARR / Recurring SaaS Run-Rate</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono font-semibold transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.arr)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors text-emerald-600 font-medium bg-emerald-50/10">
                <td className="px-6 py-3 pl-6 text-xs font-semibold">ARPU / Active Coop</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono font-semibold transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.arpu)}
                  </td>
                ))}
              </tr>
              <tr className="bg-emerald-500/10 font-bold text-emerald-700">
                <td className="px-6 py-4">Total Pendapatan</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-4 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalRevenue)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Harga Pokok Penjualan (HPP / COGS) */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/10 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Layers className="h-5 w-5 text-red-600" /> Harga Pokok Penjualan (HPP / COGS)
          </h3>
          <button 
            onClick={() => toggleSection("cogs")}
            className="text-xs text-red-600 flex items-center gap-1 font-semibold bg-red-50 hover:bg-red-100 transition-colors px-2.5 py-1 rounded-full"
          >
            {collapsedSections.cogs ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {collapsedSections.cogs ? "Lihat Perhitungan Detail" : "Sembunyikan Detail"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Komponen / Tahun</th>
                {data.map((col) => (
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
            <tbody className="divide-y divide-border">
              {!collapsedSections.cogs && (
                <>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Cloud Infrastructure</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.cloudInfrastructureCost)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Implementation & Onboarding</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.implementationOnboardingCost)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Customer Support</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.customerSupportCost)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Payment API & Integrasi</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.paymentApiVariableCost)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Other Cost of Revenue</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.otherCostOfRevenue)}
                      </td>
                    ))}
                  </tr>
                </>
              )}
              {/* Output Utama (Always Visible) */}
              <tr className="bg-red-500/10 font-bold text-red-700">
                <td className="px-6 py-4">Total Beban Pokok (COGS)</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-4 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalCogs)}
                  </td>
                ))}
              </tr>
              <tr className="bg-emerald-500/10 font-bold text-emerald-700 border-t border-b">
                <td className="px-6 py-4">Laba Kotor (Gross Profit)</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-4 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.grossProfit)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors text-emerald-600 font-medium bg-emerald-50/20">
                <td className="px-6 py-3 pl-6 text-xs">Gross Margin (%)</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.grossMargin.toFixed(1)}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Beban Operasional (OPEX) */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/10 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Activity className="h-5 w-5 text-orange-600" /> Beban Operasional (OPEX)
          </h3>
          <button 
            onClick={() => toggleSection("opex")}
            className="text-xs text-orange-600 flex items-center gap-1 font-semibold bg-orange-50 hover:bg-orange-100 transition-colors px-2.5 py-1 rounded-full"
          >
            {collapsedSections.opex ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {collapsedSections.opex ? "Lihat Perhitungan Detail" : "Sembunyikan Detail"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Komponen / Tahun</th>
                {data.map((col) => (
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
            <tbody className="divide-y divide-border">
              {!collapsedSections.opex && (
                <>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-505 font-medium italic">
                    <td className="px-6 py-3 pl-6 text-xs">Total Headcount (FTE)</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {c.totalFte} Orang
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Beban Pegawai</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.payrollOpex)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Sales & Marketing</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.salesMarketingOpex)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Utilitas & Sewa</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.officeUtilitiesOpex)}
                      </td>
                    ))}
                  </tr>
                </>
              )}
              {/* Output Utama (Always Visible) */}
              <tr className="bg-red-500/10 font-bold text-red-700 border-t border-b">
                <td className="px-6 py-4">Total OPEX</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-4 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalOpex)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Ringkasan EBITDA */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/10 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Calculator className="h-5 w-5 text-amber-600" /> Ringkasan EBITDA (EBITDA Summary)
          </h3>
          <button 
            onClick={() => toggleSection("ebitda")}
            className="text-xs text-amber-600 flex items-center gap-1 font-semibold bg-amber-50 hover:bg-amber-100 transition-colors px-2.5 py-1 rounded-full"
          >
            {collapsedSections.ebitda ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {collapsedSections.ebitda ? "Lihat Perhitungan Detail" : "Sembunyikan Detail"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Komponen / Tahun</th>
                {data.map((col) => (
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
            <tbody className="divide-y divide-border">
              {!collapsedSections.ebitda && (
                <>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Total Pendapatan</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.totalRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Total Beban Pokok (COGS)</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.totalCogs)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors font-semibold text-slate-800 bg-slate-50/40">
                    <td className="px-6 py-3 pl-6">Laba Kotor (Gross Profit)</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.grossProfit)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Gross Margin (%)</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {c.grossMargin.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Beban Operasional (OPEX)</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.totalOpex)}
                      </td>
                    ))}
                  </tr>
                </>
              )}
              {/* Output Utama (Always Visible) */}
              <tr className="bg-[#f28c1f]/10 font-bold text-[#f28c1f] border-t-2 border-[#f28c1f]/30">
                <td className="px-6 py-5 pl-6">EBITDA</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-5 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.ebitda)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#f28c1f]/5 transition-colors text-[#f28c1f] font-medium border-b border-[#f28c1f]/20 bg-[#f28c1f]/5">
                <td className="px-6 py-3 pl-6 text-xs">EBITDA Margin (%)</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.ebitdaMargin.toFixed(1)}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Metrik SaaS */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/10 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <BarChart3 className="h-5 w-5 text-indigo-600" /> Metrik SaaS (SaaS Metrics)
          </h3>
          <button 
            onClick={() => toggleSection("saas")}
            className="text-xs text-indigo-600 flex items-center gap-1 font-semibold bg-indigo-50 hover:bg-indigo-100 transition-colors px-2.5 py-1 rounded-full"
          >
            {collapsedSections.saas ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {collapsedSections.saas ? "Lihat Perhitungan Detail" : "Sembunyikan Detail"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Komponen / Tahun</th>
                {data.map((col) => (
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
            <tbody className="divide-y divide-border">
              {!collapsedSections.saas && (
                <>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">ARPU / Active Coop</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.arpu)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Gross Margin</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {c.grossMargin.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Monthly Churn</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {c.churnRate.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Annual Churn</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {c.annualChurn.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Estimated CAC / New Coop</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.estimatedCac)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">Estimated LTV</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.estimatedLtv)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-6 py-3 pl-6">CAC Payback (Months)</td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {c.cacPaybackMonths.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                </>
              )}
              {/* Output Utama (Always Visible) */}
              <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                <td className="px-6 py-3 pl-6">MRR</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.mrr)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                <td className="px-6 py-3 pl-6">ARR</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.arr)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors text-slate-600 font-bold bg-slate-50/10">
                <td className="px-6 py-3 pl-6">LTV / CAC</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.ltvCacRatio.toFixed(1)}x
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors text-slate-600 border-b-2 border-border font-bold">
                <td className="px-6 py-3 pl-6 text-xs">Rule of 40</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono font-bold transition-colors duration-150 ${getColHighlightClass(c.year)} ${(c.ruleOf40 * 100) >= 40 ? 'text-green-600' : 'text-slate-700'}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {(c.ruleOf40 * 100).toFixed(1)}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Flow & Runway Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/10">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" /> Laporan Arus Kas & Runway (Rp)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Metrik / Tahun</th>
                {data.map((col) => (
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
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-3 font-medium">Opening Cash</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.openingCash)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Seed Investment Inflow</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.seedInflow)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">EBITDA</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)} ${c.ebitda >= 0 ? 'text-green-600' : 'text-red-500'}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.ebitda)}
                  </td>
                ))}
              </tr>
              <tr className="bg-primary/5 font-bold text-primary border-t border-b">
                <td className="px-6 py-4">Ending Cash</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-4 text-right font-mono font-black transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.endingCash)}
                  </td>
                ))}
              </tr>
               <tr className="bg-muted/30 text-muted-foreground">
                <td className="px-6 py-3 font-semibold pl-10 text-xs">Average Monthly Burn / Profit</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono text-xs font-semibold transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.ebitda < 0 ? formatRupiah(Math.abs(c.ebitda / 12)) : "Rp 0"}
                  </td>
                ))}
              </tr>
              <tr className="bg-muted/30 text-muted-foreground border-b-2 border-border">
                <td className="px-6 py-3 font-semibold pl-10 text-xs">Runway (Months)</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right text-xs transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.ebitda >= 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                        Profitable
                      </span>
                    ) : (
                      <span className="font-bold text-slate-700 font-mono">
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
      {/* 11. Simulasi Valuasi Perusahaan (Rp) */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/10">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Simulasi Valuasi Perusahaan (Rp)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Metrik / Tahun</th>
                {data.map((col) => (
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
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-3 font-medium">Revenue (Pendapatan)</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalRevenue)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">ARR</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.arr)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Revenue Multiple - Conservative</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.exitMultipleConservative}x
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Revenue Multiple - Base</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.exitMultipleBase}x
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3 pl-10">Revenue Multiple - Optimistic</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.exitMultipleOptimistic}x
                  </td>
                ))}
              </tr>
              <tr className="bg-primary/5 font-semibold text-slate-700">
                <td className="px-6 py-3 pl-10">Enterprise Value - Conservative</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalRevenue * c.exitMultipleConservative)}
                  </td>
                ))}
              </tr>
              <tr className="bg-primary/5 font-bold text-primary border-t border-b">
                <td className="px-6 py-3 pl-10">Enterprise Value - Base</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalRevenue * c.exitMultipleBase)}
                  </td>
                ))}
              </tr>
              <tr className="bg-primary/5 font-semibold text-slate-700">
                <td className="px-6 py-3 pl-10">Enterprise Value - Optimistic</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalRevenue * c.exitMultipleOptimistic)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3">Seed Pre-Money Valuation</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.preMoneyValuation)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-6 py-3">Seed Post-Money Valuation</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.preMoneyValuation + c.seedInvestment)}
                  </td>
                ))}
              </tr>
              <tr className="bg-muted/30 text-muted-foreground">
                <td className="px-6 py-3 pl-10 text-xs">Implied Seed Equity %</td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-6 py-3 text-right font-mono text-xs transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {(c.preMoneyValuation + c.seedInvestment) > 0 
                      ? ((c.seedInvestment / (c.preMoneyValuation + c.seedInvestment)) * 100).toFixed(1) 
                      : "0.0"}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 12. Cap Table & Potential Investor Return */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Cap Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-border bg-muted/10">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Cap Table Pasca-Pendanaan
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
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={valuation.foundersPreSeed}
                          onChange={(e) => valuation.setFoundersPreSeed(parseFloat(e.target.value) || 0)}
                          className="bg-amber-50 hover:bg-amber-100 focus:bg-white border border-amber-200 rounded px-1.5 py-0.5 text-right w-16 font-mono text-xs text-amber-800"
                        />
                        <span className="font-mono text-xs">%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-[10px] text-slate-400">Rp</span>
                        <input
                          type="number"
                          step="10000000"
                          min="0"
                          value={valuation.foundersSeedInv}
                          onChange={(e) => valuation.setFoundersSeedInv(parseFloat(e.target.value) || 0)}
                          className="bg-amber-50 hover:bg-amber-100 focus:bg-white border border-amber-200 rounded px-1.5 py-0.5 text-right w-28 font-mono text-xs text-amber-800"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-700">
                      {(valuation.dynamicFoundersEquityFrac * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700 font-medium">Employee Option Pool (ESOP)</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={valuation.esopPreSeed}
                          onChange={(e) => valuation.setEsopPreSeed(parseFloat(e.target.value) || 0)}
                          className="bg-amber-50 hover:bg-amber-100 focus:bg-white border border-amber-200 rounded px-1.5 py-0.5 text-right w-16 font-mono text-xs text-amber-800"
                        />
                        <span className="font-mono text-xs">%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-[10px] text-slate-400">Rp</span>
                        <input
                          type="number"
                          step="10000000"
                          min="0"
                          value={valuation.esopSeedInv}
                          onChange={(e) => valuation.setEsopSeedInv(parseFloat(e.target.value) || 0)}
                          className="bg-amber-50 hover:bg-amber-100 focus:bg-white border border-amber-200 rounded px-1.5 py-0.5 text-right w-28 font-mono text-xs text-amber-800"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      {(valuation.dynamicEsopEquityFrac * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="bg-primary/5 text-primary">
                    <td className="px-4 py-3 font-semibold">Seed Investor</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={valuation.investorPreSeed}
                          onChange={(e) => valuation.setInvestorPreSeed(parseFloat(e.target.value) || 0)}
                          className="bg-amber-50 hover:bg-amber-100 focus:bg-white border border-amber-200 rounded px-1.5 py-0.5 text-right w-16 font-mono text-xs text-amber-800"
                        />
                        <span className="font-mono text-xs">%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatRupiah(valuation.seedInv)}</td>
                    <td className="px-4 py-3 text-right font-mono font-black">
                      {(valuation.dynamicInvestorEquityFrac * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="bg-muted/40 font-bold border-t-2 border-border text-slate-800">
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {(valuation.foundersPreSeed + valuation.esopPreSeed + valuation.investorPreSeed).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right">{formatRupiah(valuation.seedInv + valuation.esopSeedInv)}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {((valuation.dynamicFoundersEquityFrac + valuation.dynamicEsopEquityFrac + valuation.dynamicInvestorEquityFrac) * 100).toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 bg-muted/10 border-t border-border flex flex-col gap-2">
            {Math.abs(valuation.foundersPreSeed + valuation.esopPreSeed + valuation.investorPreSeed - 100) > 0.01 && (
              <div className="text-red-600 text-[10px] font-bold flex items-center gap-1.5 bg-red-50 p-2 rounded border border-red-100">
                ⚠️ Total Persentase Pre-Seed harus bernilai 100%! (Saat ini: {(valuation.foundersPreSeed + valuation.esopPreSeed + valuation.investorPreSeed).toFixed(1)}%)
              </div>
            )}
            <div className="flex items-start gap-2.5 text-[10px] text-muted-foreground">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>Porsi kepemilikan dihitung dari persentase suntikan dana investasi Seed terhadap Post-Money Valuation.</span>
            </div>
          </div>
        </div>

        {/* Potential Investor Return */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-border bg-muted/10">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" /> Estimasi Imbal Hasil Investor (Exit ROI)
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
                    <td className="px-4 py-3 text-right font-mono">{formatRupiah(valuation.revCons)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">{formatRupiah(valuation.revBase)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatRupiah(valuation.revOpt)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground">Revenue Multiple</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-700">{valuation.multCons}x</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-primary">{valuation.multBase}x</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-700">{valuation.multOpt}x</td>
                  </tr>
                  <tr className="bg-muted/10">
                    <td className="px-4 py-3 font-semibold text-slate-700">Estimated Exit Valuation</td>
                    <td className="px-4 py-3 text-right font-mono">{formatRupiah(valuation.exitValCons)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">{formatRupiah(valuation.exitValBase)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatRupiah(valuation.exitValOpt)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground">Investor Equity %</td>
                    <td className="px-4 py-3 text-right font-mono">{(valuation.dynamicInvestorEquityFrac * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-mono">{(valuation.dynamicInvestorEquityFrac * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-mono">{(valuation.dynamicInvestorEquityFrac * 100).toFixed(1)}%</td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="px-4 py-3 font-bold text-primary">Investor Equity Value</td>
                    <td className="px-4 py-3 text-right font-mono">{formatRupiah(valuation.invValCons)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-primary">{formatRupiah(valuation.invValBase)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatRupiah(valuation.invValOpt)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground">Initial Investment</td>
                    <td className="px-4 py-3 text-right font-mono">{formatRupiah(valuation.seedInv)}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">{formatRupiah(valuation.seedInv)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatRupiah(valuation.seedInv)}</td>
                  </tr>
                  <tr className="font-bold border-t">
                    <td className="px-4 py-3 text-slate-700">MOIC</td>
                    <td className="px-4 py-3 text-right font-mono text-amber-700">{valuation.moicCons.toFixed(2)}x</td>
                    <td className="px-4 py-3 text-right font-mono text-green-700">{valuation.moicBase.toFixed(2)}x</td>
                    <td className="px-4 py-3 text-right font-mono text-green-900">{valuation.moicOpt.toFixed(2)}x</td>
                  </tr>
                  <tr className="font-bold bg-muted/40">
                    <td className="px-4 py-3 text-slate-800">Estimated IRR (5 Years)</td>
                    <td className="px-4 py-3 text-right font-mono text-amber-700">{(valuation.irrCons * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-mono text-green-700">{(valuation.irrBase * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-mono text-green-900">{(valuation.irrOpt * 100).toFixed(1)}%</td>
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
