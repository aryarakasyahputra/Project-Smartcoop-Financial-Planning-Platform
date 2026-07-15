import React from "react";
import { createPortal } from "react-dom";
import { TrendingUp, TrendingDown, Printer, Wallet, Users, Award, ShieldAlert, ChevronRight, ChevronDown, Coins, Activity, Calculator, BarChart3, Layers, Info } from "lucide-react";
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
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../../components/ui/tooltip";

const METRIC_DEFINITIONS = {
  // Growth
  "Beginning Active Cooperatives": "Jumlah koperasi aktif di awal periode.",
  "New Cooperatives Acquired": "Jumlah koperasi baru yang berhasil diakuisisi selama periode berjalan.",
  "Churned Cooperatives": "Jumlah koperasi aktif yang berhenti berlangganan atau tidak aktif lagi.",
  "Average Members / Cooperative": "Rata-rata jumlah anggota per koperasi.",
  "YoY Active Coop Growth": "Persentase pertumbuhan tahunan jumlah koperasi aktif.",
  "Ending Active Cooperatives": "Jumlah koperasi aktif di akhir periode.",
  "Total Cooperative Members": "Total jumlah anggota koperasi terdaftar yang menggunakan platform.",

  // Revenue
  "Setup & Implementasi": "Pendapatan dari biaya awal konfigurasi dan instalasi platform.",
  "SaaS Subscription": "Pendapatan berulang dari biaya langganan bulanan platform.",
  "iOS Add-on": "Pendapatan tambahan dari fitur add-on aplikasi iOS.",
  "Proyek White Label": "Pendapatan dari proyek kustomisasi merek (white-labeling).",
  "Transaksi PPOB": "Pendapatan dari komisi transaksi pembayaran tagihan online (PPOB).",
  "Smartcoop Academy": "Pendapatan dari program edukasi dan sertifikasi digital.",
  "Pelatihan Offline": "Pendapatan dari pelatihan/workshop tatap muka.",
  "Kontrak Enterprise API": "Pendapatan dari integrasi API skala besar.",
  "ARR / Recurring SaaS Run-Rate": "Annual Run-Rate, proyeksi pendapatan berulang tahunan berdasarkan MRR saat ini.",
  "ARPU / Active Coop": "Average Revenue Per User, rata-rata pendapatan tahunan per koperasi aktif.",

  // COGS
  "Cloud Infrastructure": "Biaya server cloud, hosting, dan penyimpanan database.",
  "Implementation & Onboarding": "Biaya langsung untuk setup awal dan orientasi koperasi baru.",
  "Customer Support": "Biaya operasional layanan dukungan teknis pelanggan.",
  "Payment API & Integrasi": "Biaya biaya gateway pembayaran dan pemakaian API pihak ketiga.",
  "Other Cost of Revenue": "Biaya operasional langsung lainnya terkait penyediaan layanan.",
  "Total Beban Pokok (COGS)": "Total biaya langsung yang dikeluarkan untuk menghasilkan pendapatan.",
  "Laba Kotor (Gross Profit)": "Laba kotor (Pendapatan dikurangi COGS).",
  "Gross Margin (%)": "Persentase Laba Kotor dibandingkan dengan Total Pendapatan.",

  // OPEX
  "Total Headcount (FTE)": "Total jumlah karyawan penuh waktu (Full-Time Equivalent).",
  "Beban Pegawai": "Gaji, tunjangan, dan bonus untuk seluruh karyawan non-langsung.",
  "Sales & Marketing": "Biaya pemasaran, iklan, komisi penjualan, dan kegiatan promosi.",
  "Utilitas & Sewa": "Biaya operasional kantor seperti sewa gedung, listrik, air, dan internet.",
  "Total OPEX": "Total beban operasional usaha.",

  // EBITDA
  "Total Pendapatan": "Akumulasi seluruh lini pendapatan perusahaan.",
  "Gross Margin": "Persentase margin laba kotor dari bisnis SaaS.",
  "Beban Operasional (OPEX)": "Total beban penjualan, umum, dan administrasi.",
  "EBITDA": "Earnings Before Interest, Taxes, Depreciation, and Amortization (indikator profitabilitas operasional inti).",
  "EBITDA Margin (%)": "Rasio EBITDA dibandingkan dengan Total Pendapatan.",

  // SaaS Unit Economics / SaaS Metrics
  "Monthly Churn": "Tingkat kehilangan pelanggan koperasi per bulan.",
  "Annual Churn": "Tingkat kehilangan pelanggan koperasi yang disetahunkan.",
  "Estimated CAC / New Coop": "Customer Acquisition Cost, perkiraan biaya pemasaran dan penjualan untuk mendapatkan satu koperasi baru.",
  "Estimated LTV": "Lifetime Value, perkiraan total pendapatan kotor yang diperoleh dari satu koperasi selama masa berlangganan.",
  "CAC Payback (Months)": "Waktu (dalam bulan) yang dibutuhkan untuk mengembalikan biaya akuisisi koperasi (CAC).",
  "MRR": "Monthly Recurring Revenue, pendapatan berulang bulanan dari langganan SaaS.",
  "ARR": "Annual Recurring Revenue, pendapatan berulang tahunan (MRR x 12).",
  "LTV / CAC": "Rasio efisiensi pemasaran (LTV dibagi CAC, idealnya > 3x).",
  "Rule of 40": "Metrik kesehatan SaaS (Pertumbuhan Pendapatan % + Margin EBITDA %, idealnya >= 40%).",

  // Cash Flow
  "Opening Cash": "Saldo kas awal di awal tahun berjalan.",
  "Seed Investment Inflow": "Arus kas masuk dari pendanaan investasi Seed.",
  "Ending Cash": "Saldo kas akhir tahun setelah memperhitungkan seluruh arus masuk dan keluar.",
  "Average Monthly Burn / Profit": "Rata-rata kas yang dihabiskan (burn) atau dihasilkan (profit) per bulan.",
  "Runway (Months)": "Sisa waktu (bulan) kas perusahaan akan bertahan sebelum habis jika cash burn berlanjut.",

  // Valuation
  "Revenue (Pendapatan)": "Total pendapatan kotor dari seluruh lini usaha sebelum dikurangi beban.",
  "Revenue Multiple - Conservative": "Kelipatan (multiple) valuasi yang diasumsikan untuk kasus konservatif.",
  "Revenue Multiple - Base": "Kelipatan (multiple) valuasi yang diasumsikan untuk kasus moderat (base).",
  "Revenue Multiple - Optimistic": "Kelipatan (multiple) valuasi yang diasumsikan untuk kasus optimistik.",
  "Enterprise Value - Conservative": "Estimasi nilai perusahaan (Enterprise Value) untuk kasus konservatif.",
  "Enterprise Value - Base": "Estimasi nilai perusahaan (Enterprise Value) untuk kasus moderat (base).",
  "Enterprise Value - Optimistic": "Estimasi nilai perusahaan (Enterprise Value) untuk kasus optimistik.",
  "Seed Pre-Money Valuation": "Nilai kesepakatan valuasi perusahaan sebelum dana investasi masuk.",
  "Seed Post-Money Valuation": "Valuasi perusahaan setelah memperhitungkan dana investasi masuk.",
  "Implied Seed Equity %": "Estimasi persentase kepemilikan saham yang didapatkan investor Seed.",
  "Founders / Existing Shareholders": "Pemegang saham pendiri perusahaan dan pemegang saham lama.",
  "Employee Option Pool (ESOP)": "Alokasi opsi saham untuk program kepemilikan saham bagi karyawan.",
  "Seed Investor": "Investor baru yang masuk pada putaran pendanaan Seed.",
  "Total": "Total akumulasi persentase kepemilikan saham (harus 100%).",
  "Projected Revenue (2029)": "Proyeksi total pendapatan tahunan pada tahun ke-5 (tahun exit).",
  "Revenue Multiple": "Kelipatan (multiple) valuasi exit yang diasumsikan.",
  "Estimated Exit Valuation": "Estimasi nilai jual/valuasi perusahaan saat exit di tahun ke-5.",
  "Investor Equity %": "Persentase kepemilikan saham investor Seed saat exit.",
  "Investor Equity Value": "Nilai kepemilikan saham investor Seed saat exit.",
  "Initial Investment": "Dana modal investasi awal yang disetorkan investor.",
  "MOIC": "Multiple on Invested Capital, kelipatan hasil investasi dari modal awal.",
  "Estimated IRR (5 Years)": "Internal Rate of Return, proyeksi tingkat pengembalian internal tahunan investor."
};

function MetricLabel({ label }) {
  const definition = METRIC_DEFINITIONS[label];
  if (!definition) return <span>{label}</span>;
  return (
    <div className="flex items-center gap-1.5">
      <span>{label}</span>
      <UITooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help inline-flex text-muted-foreground hover:text-foreground transition-colors p-0.5 print:hidden" aria-label={`Info ${label}`}>
            <Info className="h-3.5 w-3.5" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-[200px] text-xs font-normal leading-relaxed text-slate-100">{definition}</p>
        </TooltipContent>
      </UITooltip>
    </div>
  );
}

export default function ProjectionModelTab({ data, formatRupiah }) {
  const valuation = useValuationModel(data);

  // UI Interactive States
  const [activeChartMetric, setActiveChartMetric] = React.useState("all");
  const [hoveredYear, setHoveredYear] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState("section-chart");
  const [portalTarget, setPortalTarget] = React.useState(null);
  const [collapsedSections, setCollapsedSections] = React.useState({
    growth: true,
    revenue: true,
    cogs: true,
    opex: true,
    ebitda: true,
    saas: true
  });

  React.useEffect(() => {
    const target = document.getElementById("header-portal-target");
    if (target) setPortalTarget(target);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });

    const sections = document.querySelectorAll("div[id^='section-']");
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

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

  const renderTrend = (currentVal, prevVal, isNegativeGood = false) => {
    if (prevVal === undefined || prevVal === 0 || prevVal === null) return null;
    const change = (currentVal - prevVal) / Math.abs(prevVal);
    if (Math.abs(change) < 0.001) return null; // Avoid showing 0.0% if it's very small
    const isPositive = change > 0;
    const isGood = isNegativeGood ? !isPositive : isPositive;
    const color = isGood ? "text-emerald-500" : "text-rose-500";
    const Icon = isPositive ? TrendingUp : TrendingDown;
    return (
      <span className={`text-[10px] ml-1.5 flex items-center gap-0.5 font-bold ${color}`}>
        <Icon className="h-3 w-3" /> {Math.abs(change * 100).toFixed(1)}%
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const getNavClass = (sectionId) => {
    const isActive = activeSection === sectionId;
    return `text-xs px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap border ${
      isActive 
        ? "bg-primary text-primary-foreground border-primary shadow-sm" 
        : "text-slate-600 bg-muted/50 border-transparent hover:text-primary hover:bg-primary/10 hover:border-primary/20"
    }`;
  };

  const navContent = (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide w-full max-w-full px-2" style={{ maskImage: "linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent)" }}>
      <a href="#section-chart" className={getNavClass("section-chart")}>Chart</a>
      <a href="#section-growth" className={getNavClass("section-growth")}>Growth</a>
      <a href="#section-revenue" className={getNavClass("section-revenue")}>Revenue</a>
      <a href="#section-cogs" className={getNavClass("section-cogs")}>COGS</a>
      <a href="#section-opex" className={getNavClass("section-opex")}>OPEX</a>
      <a href="#section-ebitda" className={getNavClass("section-ebitda")}>EBITDA</a>
      <a href="#section-saas" className={getNavClass("section-saas")}>SaaS Metrics</a>
      <a href="#section-cashflow" className={getNavClass("section-cashflow")}>Arus Kas</a>
      <a href="#section-valuation" className={getNavClass("section-valuation")}>Valuasi</a>
      <a href="#section-captable" className={getNavClass("section-captable")}>Cap Table</a>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="space-y-2">
      {/* Top Nav Rendered in Portal */}
      {portalTarget && createPortal(navContent, portalTarget)}

      <div className="flex justify-end mb-4 print:hidden">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors shadow-sm"
          title="Print Laporan"
        >
          <Printer className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>
      
      {/* Main Content */}
      <div className="space-y-8 print:m-0 print:p-0">
        {/* Chart Section */}
        <div id="section-chart" className="bg-card border border-border rounded-xl p-6 shadow-sm scroll-mt-24 print:break-inside-avoid">
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
      <div id="section-growth" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid">
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
                <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">Komponen / Tahun</th>
                {data.map((col) => (
                  <th 
                    key={col.year} 
                    className={`px-4 py-4 font-bold text-right w-[12%] min-w-[80px] md:min-w-[95px] transition-colors duration-150 ${getColHighlightClass(col.year)}`}
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
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Beginning Active Cooperatives" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {new Intl.NumberFormat('id-ID').format(c.beginningCoops)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="New Cooperatives Acquired" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {new Intl.NumberFormat('id-ID').format(c.newCoops)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Churned Cooperatives" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {new Intl.NumberFormat('id-ID').format(c.churnedCoops)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Average Members / Cooperative" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {new Intl.NumberFormat('id-ID').format(c.avgMembers)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="YoY Active Coop Growth" /></td>
                    {data.map((c, i) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
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
                <td className="px-4 py-3 pl-6"><MetricLabel label="Ending Active Cooperatives" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {new Intl.NumberFormat('id-ID').format(c.endingCoops)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors font-bold text-indigo-700 bg-indigo-50/20">
                <td className="px-4 py-3 pl-6"><MetricLabel label="Total Cooperative Members" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
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
      <div id="section-revenue" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid">
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
                <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">Komponen / Tahun</th>
                {data.map((col) => (
                  <th 
                    key={col.year} 
                    className={`px-4 py-4 font-bold text-right w-[12%] min-w-[80px] md:min-w-[95px] transition-colors duration-150 ${getColHighlightClass(col.year)}`}
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
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Setup & Implementasi" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.setupImplementationRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="SaaS Subscription" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.saasSubscriptionRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="iOS Add-on" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.iosAddonRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Proyek White Label" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.whiteLabelRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Transaksi PPOB" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.ppobTransactionRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Smartcoop Academy" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.academyRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Pelatihan Offline" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.offlineTrainingRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Kontrak Enterprise API" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
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
                <td className="px-4 py-3 pl-6 text-xs font-semibold"><MetricLabel label="ARR / Recurring SaaS Run-Rate" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono font-semibold transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.arr)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors text-emerald-600 font-medium bg-emerald-50/10">
                <td className="px-4 py-3 pl-6 text-xs font-semibold"><MetricLabel label="ARPU / Active Coop" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono font-semibold transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.arpu)}
                  </td>
                ))}
              </tr>
              <tr className="bg-emerald-500/10 font-bold text-emerald-700">
                <td className="px-4 py-4"><MetricLabel label="Total Pendapatan" /></td>
                {data.map((c, i) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-4 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    <div className="flex justify-end items-center">
                      {formatRupiah(c.totalRevenue)}
                      {i > 0 && renderTrend(c.totalRevenue, data[i-1].totalRevenue)}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Harga Pokok Penjualan (HPP / COGS) */}
      <div id="section-cogs" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid">
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
                <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">Komponen / Tahun</th>
                {data.map((col) => (
                  <th 
                    key={col.year} 
                    className={`px-4 py-4 font-bold text-right w-[12%] min-w-[80px] md:min-w-[95px] transition-colors duration-150 ${getColHighlightClass(col.year)}`}
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
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Cloud Infrastructure" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.cloudInfrastructureCost)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Implementation & Onboarding" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.implementationOnboardingCost)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Customer Support" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.customerSupportCost)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Payment API & Integrasi" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.paymentApiVariableCost)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Other Cost of Revenue" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
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
                <td className="px-4 py-4"><MetricLabel label="Total Beban Pokok (COGS)" /></td>
                {data.map((c, i) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-4 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    <div className="flex justify-end items-center">
                      {formatRupiah(c.totalCogs)}
                      {i > 0 && renderTrend(c.totalCogs, data[i-1].totalCogs, true)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="bg-emerald-500/10 font-bold text-emerald-700 border-t border-b">
                <td className="px-4 py-4"><MetricLabel label="Laba Kotor (Gross Profit)" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-4 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.grossProfit)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors text-emerald-600 font-medium bg-emerald-50/20">
                <td className="px-4 py-3 pl-6 text-xs"><MetricLabel label="Gross Margin (%)" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
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
      <div id="section-opex" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid">
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
                <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">Komponen / Tahun</th>
                {data.map((col) => (
                  <th 
                    key={col.year} 
                    className={`px-4 py-4 font-bold text-right w-[12%] min-w-[80px] md:min-w-[95px] transition-colors duration-150 ${getColHighlightClass(col.year)}`}
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
                    <td className="px-4 py-3 pl-6 text-xs"><MetricLabel label="Total Headcount (FTE)" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {c.totalFte} Orang
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Beban Pegawai" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.payrollOpex)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Sales & Marketing" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.salesMarketingOpex)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Utilitas & Sewa" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
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
                <td className="px-4 py-4"><MetricLabel label="Total OPEX" /></td>
                {data.map((c, i) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-4 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    <div className="flex justify-end items-center">
                      {formatRupiah(c.totalOpex)}
                      {i > 0 && renderTrend(c.totalOpex, data[i-1].totalOpex, true)}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Ringkasan EBITDA */}
      <div id="section-ebitda" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid">
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
                <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">Komponen / Tahun</th>
                {data.map((col) => (
                  <th 
                    key={col.year} 
                    className={`px-4 py-4 font-bold text-right w-[12%] min-w-[80px] md:min-w-[95px] transition-colors duration-150 ${getColHighlightClass(col.year)}`}
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
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Total Pendapatan" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.totalRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Total Beban Pokok (COGS)" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.totalCogs)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors font-semibold text-slate-800 bg-slate-50/40">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Laba Kotor (Gross Profit)" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.grossProfit)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Gross Margin (%)" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {c.grossMargin.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Beban Operasional (OPEX)" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
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
                <td className="px-4 py-5 pl-6"><MetricLabel label="EBITDA" /></td>
                {data.map((c, i) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-5 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    <div className="flex justify-end items-center">
                      {formatRupiah(c.ebitda)}
                      {i > 0 && renderTrend(c.ebitda, data[i-1].ebitda)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#f28c1f]/5 transition-colors text-[#f28c1f] font-medium border-b border-[#f28c1f]/20 bg-[#f28c1f]/5">
                <td className="px-4 py-3 pl-6 text-xs"><MetricLabel label="EBITDA Margin (%)" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
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
      <div id="section-saas" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid">
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
                <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">Komponen / Tahun</th>
                {data.map((col) => (
                  <th 
                    key={col.year} 
                    className={`px-4 py-4 font-bold text-right w-[12%] min-w-[80px] md:min-w-[95px] transition-colors duration-150 ${getColHighlightClass(col.year)}`}
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
                    <td className="px-4 py-3 pl-6"><MetricLabel label="ARPU / Active Coop" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.arpu)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Gross Margin" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {c.grossMargin.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Monthly Churn" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {c.churnRate.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Annual Churn" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {c.annualChurn.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Estimated CAC / New Coop" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.estimatedCac)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="Estimated LTV" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                        onMouseEnter={() => setHoveredYear(c.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {formatRupiah(c.estimatedLtv)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                    <td className="px-4 py-3 pl-6"><MetricLabel label="CAC Payback (Months)" /></td>
                    {data.map((c) => (
                      <td 
                        key={c.year} 
                        className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
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
                <td className="px-4 py-3 pl-6"><MetricLabel label="MRR" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.mrr)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                <td className="px-4 py-3 pl-6"><MetricLabel label="ARR" /></td>
                {data.map((c, i) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    <div className="flex justify-end items-center">
                      {formatRupiah(c.arr)}
                      {i > 0 && renderTrend(c.arr, data[i-1].arr)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors text-slate-600 font-bold bg-slate-50/10">
                <td className="px-4 py-3 pl-6"><MetricLabel label="LTV / CAC" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.ltvCacRatio.toFixed(1)}x
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/5 transition-colors text-slate-600 border-b-2 border-border font-bold">
                <td className="px-4 py-3 pl-6 text-xs"><MetricLabel label="Rule of 40" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono font-bold transition-colors duration-150 ${getColHighlightClass(c.year)} ${(c.ruleOf40 * 100) >= 40 ? 'text-green-600' : 'text-slate-700'}`}
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
      <div id="section-cashflow" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid">
        <div className="p-4 border-b border-border bg-muted/10">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" /> Laporan Arus Kas & Runway (Rp)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">Metrik / Tahun</th>
                {data.map((col) => (
                  <th 
                    key={col.year} 
                    className={`px-4 py-4 font-bold text-right w-[12%] min-w-[80px] md:min-w-[95px] transition-colors duration-150 ${getColHighlightClass(col.year)}`}
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
                <td className="px-4 py-3 font-medium"><MetricLabel label="Opening Cash" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.openingCash)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-4 py-3"><MetricLabel label="Seed Investment Inflow" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.seedInflow)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-4 py-3"><MetricLabel label="EBITDA" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)} ${c.ebitda >= 0 ? 'text-green-600' : 'text-red-500'}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.ebitda)}
                  </td>
                ))}
              </tr>
              <tr className="bg-primary/5 font-bold text-primary border-t border-b">
                <td className="px-4 py-4"><MetricLabel label="Ending Cash" /></td>
                {data.map((c, i) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-4 whitespace-nowrap text-right font-mono font-black transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    <div className="flex justify-end items-center">
                      {formatRupiah(c.endingCash)}
                      {i > 0 && renderTrend(c.endingCash, data[i-1].endingCash)}
                    </div>
                  </td>
                ))}
              </tr>
               <tr className="bg-muted/30 text-muted-foreground">
                <td className="px-4 py-3 font-semibold text-xs"><MetricLabel label="Average Monthly Burn / Profit" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono text-xs font-semibold transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.ebitda < 0 ? formatRupiah(Math.abs(c.ebitda / 12)) : "Rp 0"}
                  </td>
                ))}
              </tr>
              <tr className="bg-muted/30 text-muted-foreground border-b-2 border-border">
                <td className="px-4 py-3 font-semibold text-xs"><MetricLabel label="Runway (Months)" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right text-xs transition-colors duration-150 ${getColHighlightClass(c.year)}`}
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
      <div id="section-valuation" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid">
        <div className="p-4 border-b border-border bg-muted/10">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Simulasi Valuasi Perusahaan (Rp)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">Metrik / Tahun</th>
                {data.map((col) => (
                  <th 
                    key={col.year} 
                    className={`px-4 py-4 font-bold text-right w-[12%] min-w-[80px] md:min-w-[95px] transition-colors duration-150 ${getColHighlightClass(col.year)}`}
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
                <td className="px-4 py-3 font-medium"><MetricLabel label="Revenue (Pendapatan)" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalRevenue)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-4 py-3 pl-10"><MetricLabel label="ARR" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.arr)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-4 py-3 pl-10"><MetricLabel label="Revenue Multiple - Conservative" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.exitMultipleConservative}x
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-4 py-3 pl-10"><MetricLabel label="Revenue Multiple - Base" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.exitMultipleBase}x
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-4 py-3 pl-10"><MetricLabel label="Revenue Multiple - Optimistic" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {c.exitMultipleOptimistic}x
                  </td>
                ))}
              </tr>
              <tr className="bg-primary/5 font-semibold text-slate-700">
                <td className="px-4 py-3 pl-10"><MetricLabel label="Enterprise Value - Conservative" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalRevenue * c.exitMultipleConservative)}
                  </td>
                ))}
              </tr>
              <tr className="bg-primary/5 font-bold text-primary border-t border-b">
                <td className="px-4 py-3 pl-10"><MetricLabel label="Enterprise Value - Base" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalRevenue * c.exitMultipleBase)}
                  </td>
                ))}
              </tr>
              <tr className="bg-primary/5 font-semibold text-slate-700">
                <td className="px-4 py-3 pl-10"><MetricLabel label="Enterprise Value - Optimistic" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.totalRevenue * c.exitMultipleOptimistic)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-4 py-3"><MetricLabel label="Seed Pre-Money Valuation" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.preMoneyValuation)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                <td className="px-4 py-3"><MetricLabel label="Seed Post-Money Valuation" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                    onMouseEnter={() => setHoveredYear(c.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {formatRupiah(c.preMoneyValuation + c.seedInvestment)}
                  </td>
                ))}
              </tr>
              <tr className="bg-muted/30 text-muted-foreground">
                <td className="px-4 py-3 pl-10 text-xs"><MetricLabel label="Implied Seed Equity %" /></td>
                {data.map((c) => (
                  <td 
                    key={c.year} 
                    className={`px-4 py-3 whitespace-nowrap text-right font-mono text-xs transition-colors duration-150 ${getColHighlightClass(c.year)}`}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Cap Table */}
        <div id="section-captable" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between scroll-mt-24 print:break-inside-avoid">
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
                    <td className="px-4 py-3 font-semibold text-slate-700"><MetricLabel label="Founders / Existing Shareholders" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
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
                    <td className="px-4 py-3 whitespace-nowrap text-right">
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
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-slate-700">
                      {(valuation.dynamicFoundersEquityFrac * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700 font-medium"><MetricLabel label="Employee Option Pool (ESOP)" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
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
                    <td className="px-4 py-3 whitespace-nowrap text-right">
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
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-slate-700">
                      {(valuation.dynamicEsopEquityFrac * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="bg-primary/5 text-primary">
                    <td className="px-4 py-3 font-semibold"><MetricLabel label="Seed Investor" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
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
                    <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">{formatRupiah(valuation.seedInv)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-black">
                      {(valuation.dynamicInvestorEquityFrac * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="bg-muted/40 font-bold border-t-2 border-border text-slate-800">
                    <td className="px-4 py-3"><MetricLabel label="Total" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">
                      {(valuation.foundersPreSeed + valuation.esopPreSeed + valuation.investorPreSeed).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">{formatRupiah(valuation.seedInv + valuation.esopSeedInv)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">
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
        <div id="section-roi" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between scroll-mt-24 print:break-inside-avoid">
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
                    <td className="px-4 py-3 font-semibold text-slate-700"><MetricLabel label="Projected Revenue (2029)" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{formatRupiah(valuation.revCons)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-slate-800">{formatRupiah(valuation.revBase)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{formatRupiah(valuation.revOpt)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground"><MetricLabel label="Revenue Multiple" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-semibold text-slate-700">{valuation.multCons}x</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-primary">{valuation.multBase}x</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-semibold text-slate-700">{valuation.multOpt}x</td>
                  </tr>
                  <tr className="bg-muted/10">
                    <td className="px-4 py-3 font-semibold text-slate-700"><MetricLabel label="Estimated Exit Valuation" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{formatRupiah(valuation.exitValCons)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-slate-800">{formatRupiah(valuation.exitValBase)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{formatRupiah(valuation.exitValOpt)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground"><MetricLabel label="Investor Equity %" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{(valuation.dynamicInvestorEquityFrac * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{(valuation.dynamicInvestorEquityFrac * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{(valuation.dynamicInvestorEquityFrac * 100).toFixed(1)}%</td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="px-4 py-3 font-bold text-primary"><MetricLabel label="Investor Equity Value" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{formatRupiah(valuation.invValCons)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-primary">{formatRupiah(valuation.invValBase)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{formatRupiah(valuation.invValOpt)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground"><MetricLabel label="Initial Investment" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{formatRupiah(valuation.seedInv)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-slate-700">{formatRupiah(valuation.seedInv)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{formatRupiah(valuation.seedInv)}</td>
                  </tr>
                  <tr className="font-bold border-t">
                    <td className="px-4 py-3 text-slate-700"><MetricLabel label="MOIC" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-amber-700">{valuation.moicCons.toFixed(2)}x</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-green-700">{valuation.moicBase.toFixed(2)}x</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-green-900">{valuation.moicOpt.toFixed(2)}x</td>
                  </tr>
                  <tr className="font-bold bg-muted/40">
                    <td className="px-4 py-3 text-slate-800"><MetricLabel label="Estimated IRR (5 Years)" /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-amber-700">{(valuation.irrCons * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-green-700">{(valuation.irrBase * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-green-900">{(valuation.irrOpt * 100).toFixed(1)}%</td>
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
      </div>
    </TooltipProvider>
  );
}
