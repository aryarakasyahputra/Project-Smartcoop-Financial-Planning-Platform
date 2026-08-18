import React from "react";
import { createPortal } from "react-dom";
import { TrendingUp, TrendingDown, Printer, Wallet, Users, Award, ShieldAlert, ChevronRight, ChevronDown, Coins, Activity, Calculator, BarChart3, Layers, Info, BarChart2, AreaChart as AreaChartIcon } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useValuationModel } from "../utils/valuationHelper";
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../../components/ui/tooltip";
import { useLanguage } from "../../../context/LanguageContext";
import { useCurrency } from "../../../context/CurrencyContext";

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

const METRIC_DEFINITIONS_EN = {
  "Beginning Active Cooperatives": "Number of active cooperatives at the start of the period.",
  "New Cooperatives Acquired": "Target new cooperatives acquired during the period.",
  "Churned Cooperatives": "Active cooperatives that cancelled or became inactive.",
  "Average Members / Cooperative": "Average number of members per cooperative.",
  "YoY Active Coop Growth": "Year-over-year active cooperative growth percentage.",
  "Ending Active Cooperatives": "Number of active cooperatives at period end.",
  "Total Cooperative Members": "Total registered cooperative members using the platform.",
  "Setup & Implementasi": "Revenue from initial platform onboarding & setup fees.",
  "SaaS Subscription": "Recurring monthly platform subscription fees.",
  "iOS Add-on": "Addon revenue from iOS mobile application access.",
  "Proyek White Label": "Custom brand licensing project revenue.",
  "Transaksi PPOB": "Commission earned from online bill payment transactions.",
  "Smartcoop Academy": "Revenue from digital education and certification courses.",
  "Pelatihan Offline": "Revenue from face-to-face workshops and training.",
  "Kontrak Enterprise API": "Revenue from large-scale enterprise API integrations.",
  "ARR / Recurring SaaS Run-Rate": "Annual Run-Rate based on annualized MRR.",
  "ARPU / Active Coop": "Average Revenue Per User (cooperative) per year.",
  "Cloud Infrastructure": "Cloud server, hosting, and database storage costs.",
  "Implementation & Onboarding": "Direct field cost for initial coop setup.",
  "Customer Support": "Customer support team operating cost per active coop.",
  "Payment API & Integrasi": "Payment gateway processing fees & third-party API costs.",
  "Other Cost of Revenue": "Other direct costs of revenue delivery.",
  "Total Beban Pokok (COGS)": "Total direct cost required to generate revenue.",
  "Laba Kotor (Gross Profit)": "Gross profit (Total Revenue minus COGS).",
  "Gross Margin (%)": "Gross profit as a percentage of total revenue.",
  "Total Headcount (FTE)": "Total Full-Time Equivalent employees.",
  "Beban Pegawai": "Salaries, benefits, and bonuses for non-direct personnel.",
  "Sales & Marketing": "Digital marketing, advertising, sales commission & events.",
  "Utilitas & Sewa": "Office rent, electricity, water, and internet operational costs.",
  "Total OPEX": "Total business operating expenses.",
  "Total Pendapatan": "Accumulated revenue across all business lines.",
  "Gross Margin": "SaaS business gross margin percentage.",
  "Beban Operasional (OPEX)": "Total sales, general & administrative expenses.",
  "EBITDA": "Earnings Before Interest, Taxes, Depreciation & Amortization.",
  "EBITDA Margin (%)": "Ratio of EBITDA to Total Revenue.",
  "Monthly Churn": "Monthly cooperative churn rate percentage.",
  "Annual Churn": "Annualized cooperative churn rate percentage.",
  "Estimated CAC / New Coop": "Estimated Customer Acquisition Cost per new coop.",
  "Estimated LTV": "Estimated Lifetime Value per cooperative.",
  "CAC Payback (Months)": "Months required to recover Customer Acquisition Cost.",
  "MRR": "Monthly Recurring Revenue from SaaS subscriptions.",
  "ARR": "Annual Recurring Revenue (MRR x 12).",
  "LTV / CAC": "Marketing efficiency ratio (LTV divided by CAC, ideally > 3x).",
  "Rule of 40": "SaaS health metric (Revenue Growth % + EBITDA Margin %, ideally >= 40%).",
  "Opening Cash": "Beginning cash balance at start of fiscal year.",
  "Seed Investment Inflow": "Cash inflow from Seed investment round.",
  "Ending Cash": "Year-end cash balance after all cash inflows & outflows.",
  "Average Monthly Burn / Profit": "Average net monthly cash burn or profit.",
  "Runway (Months)": "Estimated months remaining before cash balance is exhausted.",
  "Revenue (Pendapatan)": "Total gross revenue from all business lines before deducting expenses.",
  "Revenue Multiple - Conservative": "Valuation multiple assumed for the conservative case.",
  "Revenue Multiple - Base": "Valuation multiple assumed for the base case.",
  "Revenue Multiple - Optimistic": "Valuation multiple assumed for the optimistic case.",
  "Enterprise Value - Conservative": "Estimated Enterprise Value for the conservative scenario.",
  "Enterprise Value - Base": "Estimated Enterprise Value for the base case scenario.",
  "Enterprise Value - Optimistic": "Estimated Enterprise Value for the optimistic scenario.",
  "Seed Pre-Money Valuation": "Company valuation agreed upon prior to investment entry.",
  "Seed Post-Money Valuation": "Company valuation after accounting for investment capital inflow.",
  "Implied Seed Equity %": "Estimated equity share percentage obtained by Seed investors.",
  "Founders / Existing Shareholders": "Company founders and pre-existing equity shareholders.",
  "Employee Option Pool (ESOP)": "Share option allocation pool reserved for employee equity programs.",
  "Seed Investor": "New investor entering during the Seed funding round.",
  "Total": "Total cumulative equity ownership percentage (must equal 100%).",
  "Projected Revenue (2029)": "Projected total annual revenue in Year 5 (exit year).",
  "Revenue Multiple": "Assumed exit valuation multiple.",
  "Estimated Exit Valuation": "Estimated company sale/exit valuation in Year 5.",
  "Investor Equity %": "Seed investor equity ownership percentage at exit.",
  "Investor Equity Value": "Seed investor exit equity value at Year 5.",
  "Initial Investment": "Initial capital investment injected by the investor.",
  "MOIC": "Multiple on Invested Capital, total return multiple on initial investment.",
  "Estimated IRR (5 Years)": "Internal Rate of Return, projected annualized return rate for investors."
};

const METRIC_TRANSLATIONS_EN = {
  "Beginning Active Cooperatives": "Beginning Active Cooperatives",
  "New Cooperatives Acquired": "New Cooperatives Acquired",
  "Churned Cooperatives": "Churned Cooperatives",
  "Average Members / Cooperative": "Average Members per Coop",
  "YoY Active Coop Growth": "YoY Active Coop Growth (%)",
  "Ending Active Cooperatives": "Ending Active Cooperatives",
  "Total Cooperative Members": "Total Cooperative Members",
  "Setup & Implementasi": "Setup & Implementation",
  "SaaS Subscription": "SaaS Subscription",
  "iOS Add-on": "iOS Add-on",
  "Proyek White Label": "White-Label Projects",
  "Transaksi PPOB": "PPOB Transactions",
  "Smartcoop Academy": "Smartcoop Academy",
  "Pelatihan Offline": "Offline Training Workshops",
  "Kontrak Enterprise API": "Enterprise API Contracts",
  "ARR / Recurring SaaS Run-Rate": "ARR / Recurring SaaS Run-Rate",
  "ARPU / Active Coop": "ARPU / Active Coop",
  "Total Pendapatan": "Total Revenue",
  "Cloud Infrastructure": "Cloud Infrastructure",
  "Implementation & Onboarding": "Implementation & Onboarding",
  "Customer Support": "Customer Support Operations",
  "Payment API & Integrasi": "Payment Gateway & API Integration",
  "Other Cost of Revenue": "Other Cost of Revenue",
  "Total Beban Pokok (COGS)": "Total Cost of Goods Sold (COGS)",
  "Laba Kotor (Gross Profit)": "Gross Profit",
  "Gross Margin (%)": "Gross Margin (%)",
  "Gross Margin": "Gross Margin",
  "Total Headcount (FTE)": "Total Headcount (FTE)",
  "Beban Pegawai": "Payroll & Benefits",
  "Sales & Marketing": "Sales & Marketing",
  "Utilitas & Sewa": "Office Rent & Utilities",
  "Software & Tools IT": "Software & Tools Subscriptions",
  "Legal & Akuntansi": "Legal & Accounting Services",
  "Perjalanan Dinas & Event": "Travel & Events",
  "Rekrutmen & Pelatihan": "Recruitment & Training",
  "Umum & Admin Lainnya": "Other General & Admin (G&A)",
  "Total OPEX": "Total Operating Expenses (OPEX)",
  "Beban Operasional (OPEX)": "Operating Expenses (OPEX)",
  "EBITDA": "EBITDA",
  "EBITDA Margin (%)": "EBITDA Margin (%)",
  "EBITDA Margin": "EBITDA Margin",
  "Monthly Churn": "Monthly Churn Rate (%)",
  "Annual Churn": "Annual Churn Rate (%)",
  "Estimated CAC / New Coop": "Estimated CAC / New Coop",
  "Estimated LTV": "Estimated LTV / Coop",
  "CAC Payback (Months)": "CAC Payback (Months)",
  "MRR": "Monthly Recurring Revenue (MRR)",
  "ARR": "Annual Recurring Revenue (ARR)",
  "LTV / CAC": "LTV / CAC Ratio",
  "Rule of 40": "Rule of 40 (%)",
  "Opening Cash": "Beginning Cash Balance",
  "Seed Investment Inflow": "Seed Investment Inflow",
  "Ending Cash": "Ending Cash Balance",
  "Average Monthly Burn / Profit": "Avg Monthly Burn / Profit",
  "Runway (Months)": "Cash Runway (Months)",
  "Revenue (Pendapatan)": "Annual Revenue",
  "Revenue Multiple - Conservative": "Exit Multiple - Conservative",
  "Revenue Multiple - Base": "Exit Multiple - Base Case",
  "Revenue Multiple - Optimistic": "Exit Multiple - Optimistic",
  "Enterprise Value - Conservative": "Exit Valuation - Conservative",
  "Enterprise Value - Base": "Exit Valuation - Base Case",
  "Enterprise Value - Optimistic": "Exit Valuation - Optimistic",
  "Seed Pre-Money Valuation": "Seed Pre-Money Valuation",
  "Seed Post-Money Valuation": "Seed Post-Money Valuation",
  "Implied Seed Equity %": "Implied Seed Equity Share (%)",
  "Founders / Existing Shareholders": "Founders & Existing Shareholders",
  "Employee Option Pool (ESOP)": "Employee Option Pool (ESOP)",
  "Seed Investor": "Seed Investor Share",
  "Total": "Total Equity Share",
  "Projected Revenue (2029)": "Projected Year 5 Revenue (2029)",
  "Revenue Multiple": "Exit Multiple (x)",
  "Estimated Exit Valuation": "Estimated Exit Valuation (2029)",
  "Investor Equity %": "Investor Equity Ownership (%)",
  "Investor Equity Value": "Investor Exit Value",
  "Initial Investment": "Seed Capital Investment",
  "MOIC": "Projected MOIC (x)",
  "Estimated IRR (5 Years)": "Projected 5-Year IRR (%)"
};

const METRIC_TRANSLATIONS_ID = {
  "Beginning Active Cooperatives": "Jumlah Koperasi Aktif (Awal)",
  "New Cooperatives Acquired": "Target Akuisisi Koperasi Baru",
  "Churned Cooperatives": "Koperasi Churn (Berhenti)",
  "Average Members / Cooperative": "Rata-rata Anggota / Koperasi",
  "YoY Active Coop Growth": "Pertumbuhan Koperasi YoY (%)",
  "Ending Active Cooperatives": "Jumlah Koperasi Aktif (Akhir)",
  "Total Cooperative Members": "Total Anggota Koperasi",
  "Setup & Implementasi": "Setup & Implementasi",
  "SaaS Subscription": "Langganan SaaS",
  "iOS Add-on": "Add-on iOS",
  "Proyek White Label": "Proyek White Label",
  "Transaksi PPOB": "Transaksi PPOB",
  "Smartcoop Academy": "Smartcoop Academy",
  "Pelatihan Offline": "Pelatihan Offline",
  "Kontrak Enterprise API": "Kontrak Enterprise API",
  "ARR / Recurring SaaS Run-Rate": "ARR / Running-Rate SaaS Berulang",
  "ARPU / Active Coop": "ARPU / Koperasi Aktif",
  "Total Pendapatan": "Total Pendapatan",
  "Cloud Infrastructure": "Infrastruktur Server Cloud",
  "Implementation & Onboarding": "Implementasi & Onboarding",
  "Customer Support": "Layanan Dukungan Pelanggan",
  "Payment API & Integrasi": "API & Gateway Pembayaran",
  "Other Cost of Revenue": "Beban Pokok Lainnya (Other COGS)",
  "Total Beban Pokok (COGS)": "Total Beban Pokok (COGS)",
  "Laba Kotor (Gross Profit)": "Laba Kotor (Gross Profit)",
  "Gross Margin (%)": "Margin Laba Kotor (%)",
  "Gross Margin": "Margin Laba Kotor",
  "Total Headcount (FTE)": "Total Karyawan (FTE)",
  "Beban Pegawai": "Beban Gaji & Tunjangan Pegawai",
  "Sales & Marketing": "Penjualan & Pemasaran",
  "Utilitas & Sewa": "Sewa Kantor & Utilitas",
  "Software & Tools IT": "Langganan Software IT",
  "Legal & Akuntansi": "Biaya Legal & Jasa Akuntansi",
  "Perjalanan Dinas & Event": "Perjalanan Dinas & Event",
  "Rekrutmen & Pelatihan": "Rekrutmen & Pelatihan Karyawan",
  "Umum & Admin Lainnya": "Biaya Umum & Admin Lainnya",
  "Total OPEX": "Total Beban Operasional (OPEX)",
  "Beban Operasional (OPEX)": "Beban Operasional (OPEX)",
  "EBITDA": "EBITDA",
  "EBITDA Margin (%)": "Margin EBITDA (%)",
  "EBITDA Margin": "Margin EBITDA",
  "Monthly Churn": "Tingkat Churn Bulanan (%)",
  "Annual Churn": "Tingkat Churn Tahunan (%)",
  "Estimated CAC / New Coop": "Estimasi CAC / Koperasi Baru",
  "Estimated LTV": "Estimasi LTV / Koperasi",
  "CAC Payback (Months)": "Pengembalian CAC (Bulan)",
  "MRR": "MRR (Pendapatan Berulang Bulanan)",
  "ARR": "ARR (Pendapatan Berulang Tahunan)",
  "LTV / CAC": "Rasio LTV / CAC",
  "Rule of 40": "Rule of 40 (%)",
  "Opening Cash": "Saldo Kas Awal",
  "Seed Investment Inflow": "Arus Kas Investasi Seed",
  "Ending Cash": "Saldo Kas Akhir",
  "Average Monthly Burn / Profit": "Rata-rata Burn / Profit Bulanan",
  "Runway (Months)": "Runway Kas (Bulan)",
  "Revenue (Pendapatan)": "Total Pendapatan",
  "Revenue Multiple - Conservative": "Multiple Pendapatan - Konservatif",
  "Revenue Multiple - Base": "Multiple Pendapatan - Base Case",
  "Revenue Multiple - Optimistic": "Multiple Pendapatan - Optimistik",
  "Enterprise Value - Conservative": "Valuasi Perusahaan - Konservatif",
  "Enterprise Value - Base": "Valuasi Perusahaan - Base Case",
  "Enterprise Value - Optimistic": "Valuasi Perusahaan - Optimistik",
  "Seed Pre-Money Valuation": "Valuasi Pre-Money",
  "Seed Post-Money Valuation": "Valuasi Post-Money",
  "Implied Seed Equity %": "Porsi Saham Seed (%)",
  "Founders / Existing Shareholders": "Founders & Pemegang Saham Lama",
  "Employee Option Pool (ESOP)": "Opsi Saham Karyawan (ESOP)",
  "Seed Investor": "Investor Seed",
  "Total": "Total Kepemilikan",
  "Projected Revenue (2029)": "Proyeksi Pendapatan (2029)",
  "Revenue Multiple": "Multiple Pendapatan",
  "Estimated Exit Valuation": "Estimasi Valuasi Exit",
  "Investor Equity %": "Persentase Saham Investor",
  "Investor Equity Value": "Nilai Saham Investor",
  "Initial Investment": "Investasi Modal Awal",
  "MOIC": "MOIC (Kelipatan Modal)",
  "Estimated IRR (5 Years)": "Estimasi IRR (5 Tahun)"
};

function MetricLabel({ label }) {
  const { language } = useLanguage();
  const displayLabel = language === "en"
    ? (METRIC_TRANSLATIONS_EN[label] || label)
    : (METRIC_TRANSLATIONS_ID[label] || label);
  const definition = language === "en"
    ? (METRIC_DEFINITIONS_EN[label] || METRIC_DEFINITIONS[label])
    : METRIC_DEFINITIONS[label];
  if (!definition) return <span>{displayLabel}</span>;
  return (
    <div className="flex items-center gap-1.5">
      <span>{displayLabel}</span>
      <UITooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help inline-flex text-muted-foreground hover:text-foreground transition-colors p-0.5 print:hidden" aria-label={`Info ${displayLabel}`}>
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


const ColoredNumber = ({ value, format, prefix = '', suffix = '' }) => {
  const { formatCurrency } = useCurrency();
  const num = Number(value);
  if (isNaN(num)) return <span>{value}</span>;

  let colorClass = "text-slate-900 dark:text-white";
  if (num > 0) colorClass = "text-emerald-600 font-medium";
  else if (num < 0) colorClass = "text-red-600 font-medium";

  let formatted = "";
  if (format === 'rupiah' || format === 'currency') {
    formatted = formatCurrency(num);
  } else if (format === 'number') {
    formatted = new Intl.NumberFormat("id-ID").format(num);
  } else if (format === 'percent') {
    formatted = `${num.toFixed(1)}%`;
  } else {
    formatted = num;
  }

  return <span className={colorClass}>{prefix}{formatted}{suffix}</span>;
};

export default function ProjectionModelTab({ data, formatRupiah: propFormatRupiah, valuation, onAssumptionChange }) {
  const { language, t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const formatRupiah = propFormatRupiah || formatCurrency;

  // UI Interactive States
  const [activeChartMetric, setActiveChartMetric] = React.useState("all");
  const [chartViewMode, setChartViewMode] = React.useState("area");
  const [hoveredYear, setHoveredYear] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState("section-chart");
  const [portalTarget, setPortalTarget] = React.useState(null);
  const [collapsedSections, setCollapsedSections] = React.useState({
    growth: false,
    revenue: false,
    cogs: false,
    opex: false,
    ebitda: false,
    saas: false,
    cashflow: false,
    valuation: false,
    captable: false
  });

  // Get unique custom assumptions by category
  const customAssumptionsByCategory = React.useMemo(() => {
    const categories = {
      add_to_new_coops: [],
      add_to_revenue: [],
      add_to_cogs: [],
      add_to_opex: []
    };
    if (!data || data.length === 0) return categories;

    const seenNames = new Set();
    data.forEach(yearData => {
      if (yearData.customAssumptionsMap) {
        Object.entries(yearData.customAssumptionsMap).forEach(([name, details]) => {
          if (!seenNames.has(name)) {
            seenNames.add(name);
            if (categories[details.category]) {
              categories[details.category].push(name);
            }
          }
        });
      }
    });
    return categories;
  }, [data]);

  React.useEffect(() => {
    let savedSections = null;

    const handleBeforePrint = () => {
      setCollapsedSections(prev => {
        savedSections = prev;
        return {
          growth: false,
          revenue: false,
          cogs: false,
          opex: false,
          ebitda: false,
          saas: false,
          cashflow: false,
          valuation: false,
          captable: false
        };
      });
    };

    const handleAfterPrint = () => {
      if (savedSections) {
        setCollapsedSections(savedSections);
      }
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

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
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
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
    return "";
  };

  // Chart Data Preparation
  const chartData = (data || []).map(item => ({
    year: item.year,
    name: String(item.year),
    Revenue: Math.round(item.totalRevenue / 1000000),
    ARR: Math.round(item.arr / 1000000),
    EBITDA: Math.round(item.ebitda / 1000000),
    COGS: Math.round(item.totalCogs / 1000000),
    OPEX: Math.round(item.totalOpex / 1000000),
    ...item,
    endingCashM: Math.round(item.endingCash / 1000000)
  }));

  const renderTrend = (currentVal, prevVal, isNegativeGood = false) => {
    return null;
  };

  const handlePrint = () => {
    // Force expand all sections for the PDF export
    setCollapsedSections({
      growth: false,
      revenue: false,
      cogs: false,
      opex: false,
      ebitda: false,
      saas: false,
      cashflow: false,
      valuation: false,
      captable: false
    });

    // Wait for DOM to update with expanded sections before triggering print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const getNavClass = (sectionId) => {
    const isActive = activeSection === sectionId;
    return `text-xs px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap border ${isActive
        ? "bg-primary text-primary-foreground border-primary shadow-sm"
        : "text-slate-600 bg-muted/50 border-transparent hover:text-primary hover:bg-primary/10 hover:border-primary/20"
      }`;
  };

  const navContent = (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide max-w-full py-0.5 px-1">
      <a href="#section-chart" className={getNavClass("section-chart")}>{language === "en" ? "Chart" : "Grafik"}</a>
      <a href="#section-growth" className={getNavClass("section-growth")}>{language === "en" ? "Growth" : "Pertumbuhan"}</a>
      <a href="#section-revenue" className={getNavClass("section-revenue")}>{language === "en" ? "Revenue" : "Pendapatan"}</a>
      <a href="#section-cogs" className={getNavClass("section-cogs")}>COGS</a>
      <a href="#section-opex" className={getNavClass("section-opex")}>OPEX</a>
      <a href="#section-ebitda" className={getNavClass("section-ebitda")}>EBITDA</a>
      <a href="#section-cashflow" className={getNavClass("section-cashflow")}>{language === "en" ? "Cash Flow" : "Arus Kas"}</a>
      <a href="#section-saas" className={getNavClass("section-saas")}>{language === "en" ? "SaaS Metrics" : "Metrik SaaS"}</a>
      <a href="#section-valuation" className={getNavClass("section-valuation")}>{language === "en" ? "Valuation" : "Valuasi"}</a>
      <a href="#section-captable" className={getNavClass("section-captable")}>Cap Table</a>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {/* Top Nav Rendered in Portal */}
        {portalTarget && createPortal(navContent, portalTarget)}

        {/* Main Content */}
        <div className="space-y-8 print:m-0 print:p-0 print:space-y-6">
          {/* Chart Section */}
          <div id="section-chart" className="bg-card border border-border rounded-2xl p-6 shadow-sm scroll-mt-24 print:break-inside-avoid print:shadow-none print:border-none print:p-0 pdf-section-page">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 print:text-xl print:text-black text-slate-800 dark:text-slate-100">
                  <TrendingUp className="h-5 w-5 text-[#005fa4] print:text-black" />
                  {language === "en" ? `${data.length}-Year Financial Performance Projections` : `Proyeksi Kinerja Keuangan ${data.length}-Tahun`}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {language === "en" ? "Interactive visualization of Revenue, Expenses, EBITDA & Cash Balance" : "Visualisasi interaktif Pendapatan, Beban, EBITDA & Saldo Kas"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 print:hidden">
                {/* Style Mode Switcher */}
                <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border">
                  <button
                    onClick={() => setChartViewMode("area")}
                    title={language === "en" ? "Gradient Area View" : "Tampilan Grafik Area Gradient"}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                      chartViewMode === "area"
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/80 dark:border-slate-700"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <AreaChartIcon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Area</span>
                  </button>
                  <button
                    onClick={() => setChartViewMode("bar")}
                    title={language === "en" ? "Bar Chart View" : "Tampilan Grafik Batang (Bar)"}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                      chartViewMode === "bar"
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/80 dark:border-slate-700"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BarChart2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Bar</span>
                  </button>
                  <button
                    onClick={() => setChartViewMode("line")}
                    title={language === "en" ? "Line View" : "Tampilan Grafik Garis"}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                      chartViewMode === "line"
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/80 dark:border-slate-700"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Activity className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Line</span>
                  </button>
                </div>

                {/* Metric Filters */}
                <div className="flex flex-wrap gap-1 bg-muted/60 p-1 rounded-xl border border-border">
                  <button
                    onClick={() => setActiveChartMetric("all")}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeChartMetric === "all" ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {language === "en" ? "All" : "Semua Metrik"}
                  </button>
                  <button
                    onClick={() => setActiveChartMetric("revenue")}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeChartMetric === "revenue" ? "bg-emerald-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {language === "en" ? "Revenue" : "Pendapatan"}
                  </button>
                  <button
                    onClick={() => setActiveChartMetric("ebitda")}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeChartMetric === "ebitda" ? "bg-amber-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    EBITDA
                  </button>
                  <button
                    onClick={() => setActiveChartMetric("expenses")}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeChartMetric === "expenses" ? "bg-rose-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {language === "en" ? "Expenses" : "Beban"}
                  </button>
                  <button
                    onClick={() => setActiveChartMetric("cash")}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeChartMetric === "cash" ? "bg-blue-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Ending Cash
                  </button>
                </div>
              </div>
            </div>

            <div className="h-[420px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {(() => {
                  const formatYAxisVal = (val) => {
                    if (val === 0) return "Rp 0";
                    if (Math.abs(val) >= 1000) {
                      const billions = val / 1000;
                      return `Rp ${billions % 1 === 0 ? billions : billions.toFixed(1)} M`;
                    }
                    return `Rp ${val} Jt`;
                  };

                  const tooltipFormatter = (value, name) => [
                    `Rp ${new Intl.NumberFormat("id-ID").format(value * 1000000)}`,
                    name
                  ];

                  const commonGradients = (
                    <defs>
                      <linearGradient id="colorRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorExpGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorEbitdaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorCashGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                  );

                  if (chartViewMode === "bar") {
                    return (
                      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 15, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={formatYAxisVal} />
                        <Tooltip
                          formatter={tooltipFormatter}
                          contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "15px" }} />
                        {(activeChartMetric === "all" || activeChartMetric === "revenue") && (
                          <Bar dataKey="revenue" name={language === "en" ? "Revenue" : "Pendapatan"} fill="#10b981" radius={[6, 6, 0, 0]} />
                        )}
                        {(activeChartMetric === "all" || activeChartMetric === "expenses") && (
                          <Bar dataKey="expenses" name={language === "en" ? "Expenses (COGS+OPEX)" : "Beban (COGS+OPEX)"} fill="#f43f5e" radius={[6, 6, 0, 0]} />
                        )}
                        {(activeChartMetric === "all" || activeChartMetric === "ebitda") && (
                          <Bar dataKey="ebitdaM" name="EBITDA" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                        )}
                        {activeChartMetric === "cash" && (
                          <Bar dataKey="endingCashM" name="Ending Cash" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        )}
                      </BarChart>
                    );
                  }

                  if (chartViewMode === "line") {
                    return (
                      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 15, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={formatYAxisVal} />
                        <Tooltip
                          formatter={tooltipFormatter}
                          contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "15px" }} />
                        {(activeChartMetric === "all" || activeChartMetric === "revenue") && (
                          <Line type="monotone" dataKey="revenue" name={language === "en" ? "Revenue" : "Pendapatan"} stroke="#10b981" strokeWidth={3.5} isAnimationActive={false} dot={{ r: 5, strokeWidth: 2, fill: "#10b981" }} activeDot={{ r: 7 }} />
                        )}
                        {(activeChartMetric === "all" || activeChartMetric === "expenses") && (
                          <Line type="monotone" dataKey="expenses" name={language === "en" ? "Expenses (COGS+OPEX)" : "Beban (COGS+OPEX)"} stroke="#f43f5e" strokeWidth={3.5} isAnimationActive={false} dot={{ r: 5, strokeWidth: 2, fill: "#f43f5e" }} activeDot={{ r: 7 }} />
                        )}
                        {(activeChartMetric === "all" || activeChartMetric === "ebitda") && (
                          <Line type="monotone" dataKey="ebitdaM" name="EBITDA" stroke="#f59e0b" strokeWidth={3.5} isAnimationActive={false} dot={{ r: 5, strokeWidth: 2, fill: "#f59e0b" }} activeDot={{ r: 7 }} />
                        )}
                        {activeChartMetric === "cash" && (
                          <Line type="monotone" dataKey="endingCashM" name="Ending Cash" stroke="#3b82f6" strokeWidth={3.5} isAnimationActive={false} dot={{ r: 5, strokeWidth: 2, fill: "#3b82f6" }} activeDot={{ r: 7 }} />
                        )}
                      </LineChart>
                    );
                  }

                  // Default View Mode: "area" (Filled Area Chart)
                  return (
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.8} />
                      <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={11} tickLine={false} tickFormatter={formatYAxisVal} />
                      <Tooltip
                        formatter={tooltipFormatter}
                        contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "15px" }} />
                      {(activeChartMetric === "all" || activeChartMetric === "revenue") && (
                        <Area type="monotone" dataKey="revenue" name={language === "en" ? "Revenue" : "Pendapatan"} stroke="#10b981" strokeWidth={3.5} fillOpacity={0.15} fill="#10b981" isAnimationActive={false} dot={{ r: 4, strokeWidth: 2, fill: "#10b981" }} activeDot={{ r: 7 }} />
                      )}
                      {(activeChartMetric === "all" || activeChartMetric === "expenses") && (
                        <Area type="monotone" dataKey="expenses" name={language === "en" ? "Expenses (COGS+OPEX)" : "Beban (COGS+OPEX)"} stroke="#f43f5e" strokeWidth={3.5} fillOpacity={0.15} fill="#f43f5e" isAnimationActive={false} dot={{ r: 4, strokeWidth: 2, fill: "#f43f5e" }} activeDot={{ r: 7 }} />
                      )}
                      {(activeChartMetric === "all" || activeChartMetric === "ebitda") && (
                        <Area type="monotone" dataKey="ebitdaM" name="EBITDA" stroke="#f59e0b" strokeWidth={3.5} fillOpacity={0.15} fill="#f59e0b" isAnimationActive={false} dot={{ r: 4, strokeWidth: 2, fill: "#f59e0b" }} activeDot={{ r: 7 }} />
                      )}
                      {activeChartMetric === "cash" && (
                        <Area type="monotone" dataKey="endingCashM" name="Ending Cash" stroke="#3b82f6" strokeWidth={3.5} fillOpacity={0.15} fill="#3b82f6" isAnimationActive={false} dot={{ r: 4, strokeWidth: 2, fill: "#3b82f6" }} activeDot={{ r: 7 }} />
                      )}
                    </AreaChart>
                  );
                })()}
              </ResponsiveContainer>
            </div>
          </div>

          {/* 1. Customer Growth Model */}
          <div id="section-growth" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid pdf-section-page">
            <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Users className="h-5 w-5 text-slate-400" /> {language === "en" ? "1. Customer Growth Model" : "1. Model Pertumbuhan Koperasi"}
              </h3>
              <button
                onClick={() => toggleSection("growth")}
                className="text-xs font-bold text-[#005fa4] dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-1.5 transition-colors px-3 py-1 rounded-full cursor-pointer"
              >
                {collapsedSections.growth ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {collapsedSections.growth ? (language === "en" ? "View Details" : "Lihat Perhitungan Detail") : (language === "en" ? "Hide Details" : "Sembunyikan Detail")}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">{language === "en" ? "Component / Year" : "Komponen / Tahun"}</th>
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
                            <ColoredNumber value={c.beginningCoops} format="number" />
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
                            <ColoredNumber value={c.newCoops} format="number" />
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
                            <ColoredNumber value={c.churnedCoops} format="number" />
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
                            <ColoredNumber value={c.avgMembers} format="number" />
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
                            {i === 0 ? "-" : <ColoredNumber value={c.yoyCoopGrowth * 100} format="percent" />}
                          </td>
                        ))}
                      </tr>
                            {customAssumptionsByCategory.add_to_new_coops.map((name, idx) => (
                              <tr key={`custom-growth-${idx}`} className="hover:bg-muted/5 transition-colors text-slate-600 bg-amber-50/10">
                                <td className="px-4 py-3 pl-6 italic"><MetricLabel label={`${name} *`} /></td>
                                {data.map((c) => {
                                  const val = c.customAssumptionsMap?.[name]?.value || 0;
                                  return (
                                    <td
                                      key={c.year}
                                      className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                                      onMouseEnter={() => setHoveredYear(c.year)}
                                      onMouseLeave={() => setHoveredYear(null)}
                                    >
                                      <ColoredNumber value={val} format="number" />
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </>
                        )}
                        {/* Output Utama (Always Visible) */}
                        <tr className="hover:bg-muted/5 transition-colors font-bold text-slate-800 bg-muted/10 border-t">
                          <td className="px-4 py-3 pl-6"><MetricLabel label="Ending Active Cooperatives" /></td>
                          {data.map((c) => (
                            <td
                              key={c.year}
                              className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                              onMouseEnter={() => setHoveredYear(c.year)}
                              onMouseLeave={() => setHoveredYear(null)}
                            >
                              <ColoredNumber value={c.endingCoops} format="number" />
                            </td>
                          ))}
                        </tr>
                        <tr className="hover:bg-muted/5 transition-colors font-bold text-slate-800 bg-muted/10 border-b">
                          <td className="px-4 py-3 pl-6"><MetricLabel label="Total Cooperative Members" /></td>
                          {data.map((c) => (
                            <td
                              key={c.year}
                              className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                              onMouseEnter={() => setHoveredYear(c.year)}
                              onMouseLeave={() => setHoveredYear(null)}
                            >
                              <ColoredNumber value={c.totalMembers} format="number" />
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                </div>
            </div>

            {/* 2. Laporan Pendapatan (Revenue) */}
            <div id="section-revenue" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid pdf-section-page">
              <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <Coins className="h-5 w-5 text-emerald-600" /> {language === "en" ? "2. SaaS Revenue Statement (Proforma P&L)" : "2. Laporan Pendapatan (Revenue)"}
                </h3>
                <button
                  onClick={() => toggleSection("revenue")}
                  className="text-xs font-bold text-[#005fa4] dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-1.5 transition-colors px-3 py-1 rounded-full cursor-pointer"
                >
                  {collapsedSections.revenue ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {collapsedSections.revenue ? (language === "en" ? "View Details" : "Lihat Perhitungan Detail") : (language === "en" ? "Hide Details" : "Sembunyikan Detail")}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b">
                    <tr>
                      <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">{language === "en" ? "Component / Year" : "Komponen / Tahun"}</th>
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
                              <ColoredNumber value={c.setupImplementationRevenue} format="rupiah" />
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
                              <ColoredNumber value={c.saasSubscriptionRevenue} format="rupiah" />
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
                              <ColoredNumber value={c.iosAddonRevenue} format="rupiah" />
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
                              <ColoredNumber value={c.whiteLabelRevenue} format="rupiah" />
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
                              <ColoredNumber value={c.ppobTransactionRevenue} format="rupiah" />
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
                              <ColoredNumber value={c.academyRevenue} format="rupiah" />
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
                              <ColoredNumber value={c.offlineTrainingRevenue} format="rupiah" />
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
                              <ColoredNumber value={c.enterpriseAPI_revenue} format="rupiah" />
                            </td>
                          ))}
                        </tr>
                        {customAssumptionsByCategory.add_to_revenue.map((name, idx) => (
                          <tr key={`custom-rev-${idx}`} className="hover:bg-muted/5 transition-colors text-slate-600 bg-amber-50/10">
                            <td className="px-4 py-3 pl-6 italic"><MetricLabel label={`${name} *`} /></td>
                            {data.map((c) => {
                              const val = c.customAssumptionsMap?.[name]?.value || 0;
                              return (
                                <td
                                  key={c.year}
                                  className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                                  onMouseEnter={() => setHoveredYear(c.year)}
                                  onMouseLeave={() => setHoveredYear(null)}
                                >
                                  <ColoredNumber value={val} format="rupiah" />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </>
                    )}
                    {/* Output Utama (Always Visible) */}
                    <tr className="hover:bg-muted/5 transition-colors font-medium text-slate-800 border-t">
                      <td className="px-4 py-3 pl-6 text-xs font-semibold"><MetricLabel label="ARR / Recurring SaaS Run-Rate" /></td>
                      {data.map((c) => (
                        <td
                          key={c.year}
                          className={`px-4 py-3 whitespace-nowrap text-right font-mono font-semibold transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <ColoredNumber value={c.arr} format="rupiah" />
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/5 transition-colors font-medium text-slate-800 border-b">
                      <td className="px-4 py-3 pl-6 text-xs font-semibold"><MetricLabel label="ARPU / Active Coop" /></td>
                      {data.map((c) => (
                        <td
                          key={c.year}
                          className={`px-4 py-3 whitespace-nowrap text-right font-mono font-semibold transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <ColoredNumber value={c.arpu} format="rupiah" />
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/5 transition-colors font-bold text-slate-800 border-t border-b">
                      <td className="px-4 py-4"><MetricLabel label="Total Pendapatan" /></td>
                      {data.map((c, i) => (
                        <td
                          key={c.year}
                          className={`px-4 py-4 text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <div className="flex justify-end items-center">
                            <ColoredNumber value={c.totalRevenue} format="rupiah" />
                            {i > 0 && renderTrend(c.totalRevenue, data[i - 1].totalRevenue)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Harga Pokok Penjualan (HPP / COGS) */}
            <div id="section-cogs" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid pdf-section-page">
              <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <Layers className="h-5 w-5 text-red-600" /> {language === "en" ? "3. Cost of Goods Sold (COGS)" : "3. Harga Pokok Penjualan (HPP / COGS)"}
                </h3>
                <button
                  onClick={() => toggleSection("cogs")}
                  className="text-xs font-bold text-[#005fa4] dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-1.5 transition-colors px-3 py-1 rounded-full cursor-pointer"
                >
                  {collapsedSections.cogs ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {collapsedSections.cogs ? (language === "en" ? "View Details" : "Lihat Perhitungan Detail") : (language === "en" ? "Hide Details" : "Sembunyikan Detail")}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b">
                    <tr>
                      <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">{language === "en" ? "Component / Year" : "Komponen / Tahun"}</th>
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
                              <ColoredNumber value={c.cloudInfrastructureCost} format="rupiah" />
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
                              <ColoredNumber value={c.implementationOnboardingCost} format="rupiah" />
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
                              <ColoredNumber value={c.customerSupportCost} format="rupiah" />
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
                              <ColoredNumber value={c.paymentApiVariableCost} format="rupiah" />
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
                              <ColoredNumber value={c.otherCostOfRevenue} format="rupiah" />
                            </td>
                          ))}
                        </tr>
                        {customAssumptionsByCategory.add_to_cogs.map((name, idx) => (
                          <tr key={`custom-cogs-${idx}`} className="hover:bg-muted/5 transition-colors text-slate-600 bg-amber-50/10">
                            <td className="px-4 py-3 pl-6 italic"><MetricLabel label={`${name} *`} /></td>
                            {data.map((c) => {
                              const val = c.customAssumptionsMap?.[name]?.value || 0;
                              return (
                                <td
                                  key={c.year}
                                  className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                                  onMouseEnter={() => setHoveredYear(c.year)}
                                  onMouseLeave={() => setHoveredYear(null)}
                                >
                                  <ColoredNumber value={val} format="rupiah" />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </>
                    )}
                    {/* Output Utama (Always Visible) */}
                    <tr className="hover:bg-muted/5 transition-colors font-bold text-slate-800 border-t border-b">
                      <td className="px-4 py-4"><MetricLabel label="Total Beban Pokok (COGS)" /></td>
                      {data.map((c, i) => (
                        <td
                          key={c.year}
                          className={`px-4 py-4 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <div className="flex justify-end items-center">
                            <ColoredNumber value={c.totalCogs} format="rupiah" />
                            {i > 0 && renderTrend(c.totalCogs, data[i - 1].totalCogs, true)}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/5 transition-colors font-bold text-slate-800 border-t border-b">
                      <td className="px-4 py-4"><MetricLabel label="Laba Kotor (Gross Profit)" /></td>
                      {data.map((c) => (
                        <td
                          key={c.year}
                          className={`px-4 py-4 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <ColoredNumber value={c.grossProfit} format="rupiah" />
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/5 transition-colors font-medium text-slate-800 border-b">
                      <td className="px-4 py-3 pl-6 text-xs"><MetricLabel label="Gross Margin (%)" /></td>
                      {data.map((c) => (
                        <td
                          key={c.year}
                          className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <ColoredNumber value={c.grossMargin} format="percent" />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Beban Operasional (OPEX) */}
            <div id="section-opex" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid pdf-section-page">
              <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <Activity className="h-5 w-5 text-orange-600" /> {language === "en" ? "4. Operating Expenses (OPEX)" : "4. Beban Operasional (OPEX)"}
                </h3>
                <button
                  onClick={() => toggleSection("opex")}
                  className="text-xs font-bold text-[#005fa4] dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-1.5 transition-colors px-3 py-1 rounded-full cursor-pointer"
                >
                  {collapsedSections.opex ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {collapsedSections.opex ? (language === "en" ? "View Details" : "Lihat Perhitungan Detail") : (language === "en" ? "Hide Details" : "Sembunyikan Detail")}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b">
                    <tr>
                      <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">{language === "en" ? "Component / Year" : "Komponen / Tahun"}</th>
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
                        <tr className="hover:bg-muted/5 transition-colors text-slate-600">
                          <td className="px-4 py-3 pl-6"><MetricLabel label="Total Headcount (FTE)" /></td>
                          {data.map((c) => (
                            <td
                              key={c.year}
                              className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                              onMouseEnter={() => setHoveredYear(c.year)}
                              onMouseLeave={() => setHoveredYear(null)}
                            >
                              {c.totalFte} {language === "en" ? "Staff" : "Orang"}
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
                              <ColoredNumber value={c.payrollOpex} format="rupiah" />
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
                              <ColoredNumber value={c.salesMarketingOpex} format="rupiah" />
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
                              <ColoredNumber value={c.officeUtilitiesOpex} format="rupiah" />
                            </td>
                          ))}
                        </tr>
                        {customAssumptionsByCategory.add_to_opex.map((name, idx) => (
                          <tr key={`custom-opex-${idx}`} className="hover:bg-muted/5 transition-colors text-slate-600 bg-amber-50/10">
                            <td className="px-4 py-3 pl-6 italic"><MetricLabel label={`${name} *`} /></td>
                            {data.map((c) => {
                              const val = c.customAssumptionsMap?.[name]?.value || 0;
                              return (
                                <td
                                  key={c.year}
                                  className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                                  onMouseEnter={() => setHoveredYear(c.year)}
                                  onMouseLeave={() => setHoveredYear(null)}
                                >
                                  <ColoredNumber value={val} format="rupiah" />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </>
                    )}
                    {/* Output Utama (Always Visible) */}
                    <tr className="hover:bg-muted/5 transition-colors font-bold text-slate-800 border-t border-b">
                      <td className="px-4 py-4"><MetricLabel label="Total OPEX" /></td>
                      {data.map((c, i) => (
                        <td
                          key={c.year}
                          className={`px-4 py-4 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <div className="flex justify-end items-center">
                            <ColoredNumber value={c.totalOpex} format="rupiah" />
                            {i > 0 && renderTrend(c.totalOpex, data[i - 1].totalOpex, true)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Ringkasan EBITDA */}
            <div id="section-ebitda" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid pdf-section-page">
              <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <Calculator className="h-5 w-5 text-amber-600" /> {language === "en" ? "5. EBITDA & Profitability Summary" : "5. Ringkasan EBITDA (EBITDA Summary)"}
                </h3>
                <button
                  onClick={() => toggleSection("ebitda")}
                  className="text-xs font-bold text-[#005fa4] dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-1.5 transition-colors px-3 py-1 rounded-full cursor-pointer"
                >
                  {collapsedSections.ebitda ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {collapsedSections.ebitda ? (language === "en" ? "View Details" : "Lihat Perhitungan Detail") : (language === "en" ? "Hide Details" : "Sembunyikan Detail")}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b">
                    <tr>
                      <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">{language === "en" ? "Component / Year" : "Komponen / Tahun"}</th>
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
                              <ColoredNumber value={c.totalRevenue} format="rupiah" />
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
                              <ColoredNumber value={c.totalCogs} format="rupiah" />
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
                              <ColoredNumber value={c.grossProfit} format="rupiah" />
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
                              <ColoredNumber value={c.grossMargin} format="percent" />
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
                              <ColoredNumber value={c.totalOpex} format="rupiah" />
                            </td>
                          ))}
                        </tr>
                      </>
                    )}
                    {/* Output Utama (Always Visible) */}
                    <tr className="hover:bg-muted/5 transition-colors font-bold text-slate-800 border-t-2 border-slate-200">
                      <td className="px-4 py-5 pl-6"><MetricLabel label="EBITDA" /></td>
                      {data.map((c, i) => (
                        <td
                          key={c.year}
                          className={`px-4 py-5 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <div className="flex justify-end items-center">
                            <ColoredNumber value={c.ebitda} format="rupiah" />
                            {i > 0 && renderTrend(c.ebitda, data[i - 1].ebitda)}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/5 transition-colors font-medium text-slate-800 border-b">
                      <td className="px-4 py-3 pl-6 text-xs"><MetricLabel label="EBITDA Margin (%)" /></td>
                      {data.map((c) => (
                        <td
                          key={c.year}
                          className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <ColoredNumber value={c.ebitdaMargin} format="percent" />
                        </td>
                      ))}
                    </tr>
                    {/* Net Profit */}
                    <tr className="hover:bg-muted/5 transition-colors font-bold text-slate-800 border-t-2 border-slate-200">
                      <td className="px-4 py-5 pl-6"><MetricLabel label="Net Profit (Laba Bersih)" /></td>
                      {data.map((c, i) => (
                        <td
                          key={c.year}
                          className={`px-4 py-5 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <div className="flex justify-end items-center">
                            <ColoredNumber value={c.netProfit || 0} format="rupiah" />
                            {i > 0 && renderTrend(c.netProfit || 0, data[i - 1].netProfit || 0)}
                          </div>
                        </td>
                      ))}
                    </tr>
                    {/* Net Margin */}
                    <tr className="hover:bg-muted/5 transition-colors font-medium text-slate-800 border-b">
                      <td className="px-4 py-3 pl-6 text-xs"><MetricLabel label="Net Margin (%)" /></td>
                      {data.map((c) => (
                        <td
                          key={c.year}
                          className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <ColoredNumber value={c.netMargin || 0} format="percent" />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. Cash Flow & Runway Table */}
            <div id="section-cashflow" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid pdf-section-page">
              <div className="p-4 border-b bg-muted/10">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" /> {language === "en" ? "6. 5-Year Cash Flow Statement & Runway (Rp)" : "6. Laporan Arus Kas & Runway (Rp)"}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b">
                    <tr>
                      <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">{language === "en" ? "Metric / Year" : "Metrik / Tahun"}</th>
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
                          <ColoredNumber value={c.openingCash} format="rupiah" />
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
                          <ColoredNumber value={c.seedInflow} format="rupiah" />
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
                          <ColoredNumber value={c.ebitda} format="rupiah" />
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/5 transition-colors font-bold text-slate-800 border-t border-b">
                      <td className="px-4 py-4"><MetricLabel label="Ending Cash" /></td>
                      {data.map((c, i) => (
                        <td
                          key={c.year}
                          className={`px-4 py-4 whitespace-nowrap text-right font-mono font-black transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <div className="flex justify-end items-center">
                            <ColoredNumber value={c.endingCash} format="rupiah" />
                            {i > 0 && renderTrend(c.endingCash, data[i - 1].endingCash)}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/5 transition-colors text-muted-foreground">
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
                    <tr className="hover:bg-muted/5 transition-colors text-muted-foreground border-b-2">
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
                              {language === "en" ? "Profitable" : "Profitable"}
                            </span>
                          ) : (
                            <span className="font-bold text-slate-700 font-mono">
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

            {/* 7. Metrik SaaS */}
            <div id="section-saas" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid pdf-section-page">
              <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <BarChart3 className="h-5 w-5 text-indigo-600" /> {language === "en" ? "7. SaaS Unit Economics & Efficiency Metrics" : "7. Metrik SaaS (SaaS Metrics)"}
                </h3>
                <button
                  onClick={() => toggleSection("saas")}
                  className="text-xs font-bold text-[#005fa4] dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-1.5 transition-colors px-3 py-1 rounded-full cursor-pointer"
                >
                  {collapsedSections.saas ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {collapsedSections.saas ? (language === "en" ? "View Details" : "Lihat Perhitungan Detail") : (language === "en" ? "Hide Details" : "Sembunyikan Detail")}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b">
                    <tr>
                      <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">{language === "en" ? "Component / Year" : "Komponen / Tahun"}</th>
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
                              <ColoredNumber value={c.arpu} format="rupiah" />
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
                              <ColoredNumber value={c.grossMargin} format="percent" />
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
                              <ColoredNumber value={c.churnRate} format="percent" />
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
                              <ColoredNumber value={c.annualChurn} format="percent" />
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
                              <ColoredNumber value={c.estimatedCac} format="rupiah" />
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
                              <ColoredNumber value={c.estimatedLtv} format="rupiah" />
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
                          <ColoredNumber value={c.mrr} format="rupiah" />
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
                            <ColoredNumber value={c.arr} format="rupiah" />
                            {i > 0 && renderTrend(c.arr, data[i - 1].arr)}
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
                    <tr className="hover:bg-muted/5 transition-colors text-slate-600 border-b-2 font-bold">
                      <td className="px-4 py-3 pl-6 text-xs"><MetricLabel label="Rule of 40" /></td>
                      {data.map((c) => (
                        <td
                          key={c.year}
                          className={`px-4 py-3 whitespace-nowrap text-right font-mono font-bold transition-colors duration-150 ${getColHighlightClass(c.year)} ${(c.ruleOf40 * 100) >= 40 ? 'text-green-600' : 'text-slate-700'}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <ColoredNumber value={(c.ruleOf40 * 100)} format="percent" />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 11. Simulasi Valuasi Perusahaan (Rp) */}
            <div id="section-valuation" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm scroll-mt-24 print:break-inside-avoid pdf-section-page">
              <div className="p-4 border-b bg-muted/10">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> {language === "en" ? "8. Company Valuation Simulation (Rp)" : "8. Simulasi Valuasi Perusahaan (Rp)"}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b">
                    <tr>
                      <th className="px-4 py-4 font-bold min-w-[160px] md:min-w-[200px]">{language === "en" ? "Metric / Year" : "Metrik / Tahun"}</th>
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
                          <ColoredNumber value={c.totalRevenue} format="rupiah" />
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                      <td className="px-4 py-3"><MetricLabel label="ARR" /></td>
                      {data.map((c) => (
                        <td
                          key={c.year}
                          className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <ColoredNumber value={c.arr} format="rupiah" />
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/10 transition-colors text-muted-foreground">
                      <td className="px-4 py-3"><MetricLabel label="Revenue Multiple - Conservative" /></td>
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
                      <td className="px-4 py-3"><MetricLabel label="Revenue Multiple - Base" /></td>
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
                      <td className="px-4 py-3"><MetricLabel label="Revenue Multiple - Optimistic" /></td>
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
                    <tr className="hover:bg-muted/5 transition-colors font-semibold text-slate-700">
                      <td className="px-4 py-3"><MetricLabel label="Enterprise Value - Conservative" /></td>
                      {data.map((c) => (
                        <td
                          key={c.year}
                          className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <ColoredNumber value={c.totalRevenue * c.exitMultipleConservative} format="rupiah" />
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/5 transition-colors font-bold text-slate-800 border-t border-b">
                      <td className="px-4 py-3"><MetricLabel label="Enterprise Value - Base" /></td>
                      {data.map((c) => (
                        <td
                          key={c.year}
                          className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <ColoredNumber value={c.totalRevenue * c.exitMultipleBase} format="rupiah" />
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/5 transition-colors font-semibold text-slate-700">
                      <td className="px-4 py-3"><MetricLabel label="Enterprise Value - Optimistic" /></td>
                      {data.map((c) => (
                        <td
                          key={c.year}
                          className={`px-4 py-3 whitespace-nowrap text-right font-mono transition-colors duration-150 ${getColHighlightClass(c.year)}`}
                          onMouseEnter={() => setHoveredYear(c.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <ColoredNumber value={c.totalRevenue * c.exitMultipleOptimistic} format="rupiah" />
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
                          <ColoredNumber value={c.preMoneyValuation} format="rupiah" />
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
                          <ColoredNumber value={c.preMoneyValuation + c.seedInvestment} format="rupiah" />
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/5 transition-colors text-muted-foreground">
                      <td className="px-4 py-3 text-xs"><MetricLabel label="Implied Seed Equity %" /></td>
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
            <div className="grid grid-cols-1 gap-8 mt-8 print:mt-0 print:gap-8">

              {/* Cap Table */}
              <div id="section-captable" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between scroll-mt-24 print:break-inside-avoid pdf-section-page">
                <div>
                  <div className="p-4 border-b bg-muted/10">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" /> {language === "en" ? "9. Post-Funding Cap Table" : "9. Cap Table Pasca-Pendanaan"}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="text-[10px] uppercase bg-muted/30 text-muted-foreground border-b">
                        <tr>
                          <th className="px-4 py-3 font-bold">{language === "en" ? "Shareholder" : "Pemegang Saham"}</th>
                          <th className="px-4 py-3 font-bold text-right">Pre-Seed</th>
                          <th className="px-4 py-3 font-bold text-right">{language === "en" ? "Investment Inflow" : "Investasi Masuk"}</th>
                          <th className="px-4 py-3 font-bold text-right">{language === "en" ? "Post-Seed Equity" : "Kepemilikan Post-Seed"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-3 font-semibold text-slate-700"><MetricLabel label="Founders / Existing Shareholders" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-semibold text-slate-700">
                            <ColoredNumber value={valuation.foundersPreSeed} format="percent" />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-semibold text-slate-700">
                            <ColoredNumber value={valuation.foundersSeedInv} format="rupiah" />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-slate-700">
                            <ColoredNumber value={(valuation.dynamicFoundersEquityFrac * 100)} format="percent" />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-slate-700 font-medium"><MetricLabel label="Employee Option Pool (ESOP)" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-medium text-slate-700">
                            <ColoredNumber value={valuation.esopPreSeed} format="percent" />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-medium text-slate-700">
                            <ColoredNumber value={valuation.esopSeedInv} format="rupiah" />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-slate-700">
                            <ColoredNumber value={(valuation.dynamicEsopEquityFrac * 100)} format="percent" />
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/5 transition-colors text-slate-800 font-semibold">
                          <td className="px-4 py-3 font-semibold"><MetricLabel label="Seed Investor" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-semibold text-slate-700">
                            <ColoredNumber value={valuation.investorPreSeed} format="percent" />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-semibold"><ColoredNumber value={valuation.seedInv} format="rupiah" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-black">
                            <ColoredNumber value={(valuation.dynamicInvestorEquityFrac * 100)} format="percent" />
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/5 transition-colors font-bold border-t-2 text-slate-800">
                          <td className="px-4 py-3"><MetricLabel label="Total" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono">
                            <ColoredNumber value={(valuation.foundersPreSeed + valuation.esopPreSeed + valuation.investorPreSeed)} format="percent" />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right"><ColoredNumber value={valuation.seedInv + valuation.esopSeedInv} format="rupiah" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono">
                            <ColoredNumber value={((valuation.dynamicFoundersEquityFrac + valuation.dynamicEsopEquityFrac + valuation.dynamicInvestorEquityFrac) * 100)} format="percent" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="p-4 bg-muted/10 border-t border-border flex flex-col gap-2">
                  {Math.abs(valuation.foundersPreSeed + valuation.esopPreSeed + valuation.investorPreSeed - 100) > 0.01 && (
                    <div className="text-red-600 text-[10px] font-bold flex items-center gap-1.5 bg-red-50 p-2 rounded border border-red-100">
                      {language === "en"
                        ? `⚠️ Pre-Seed percentage total must equal 100%! (Current: ${(valuation.foundersPreSeed + valuation.esopPreSeed + valuation.investorPreSeed).toFixed(1)}%)`
                        : `⚠️ Total Persentase Pre-Seed harus bernilai 100%! (Saat ini: ${(valuation.foundersPreSeed + valuation.esopPreSeed + valuation.investorPreSeed).toFixed(1)}%)`
                      }
                    </div>
                  )}
            <div className="flex items-start gap-2.5 text-[10px] text-muted-foreground">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      {language === "en"
                        ? "Equity share calculated from Seed investment vs Post-Money Valuation."
                        : "Porsi kepemilikan dihitung dari persentase suntikan dana investasi Seed terhadap Post-Money Valuation."
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Potential Investor Return */}
              <div id="section-roi" className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between scroll-mt-24 print:break-inside-avoid pdf-section-page">
                <div>
                  <div className="p-4 border-b bg-muted/10">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" /> {language === "en" ? "10. Estimated Investor Exit ROI" : "10. Estimasi Imbal Hasil Investor (Exit ROI)"}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="text-[10px] uppercase bg-muted/30 text-muted-foreground border-b">
                        <tr>
                          <th className="px-4 py-3 font-bold">{language === "en" ? "Indicator" : "Indikator"}</th>
                          <th className="px-4 py-3 font-bold text-right">{language === "en" ? "Conservative" : "Konservatif"}</th>
                          <th className="px-4 py-3 font-bold text-right">Base Case</th>
                          <th className="px-4 py-3 font-bold text-right">{language === "en" ? "Optimistic" : "Optimistik"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-3 font-semibold text-slate-700"><MetricLabel label={language === "en" ? `Projected Revenue (${data[data.length - 1]?.year || 2029})` : `Proyeksi Pendapatan (${data[data.length - 1]?.year || 2029})`} /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono"><ColoredNumber value={valuation.revCons} format="rupiah" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-slate-800"><ColoredNumber value={valuation.revBase} format="rupiah" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono"><ColoredNumber value={valuation.revOpt} format="rupiah" /></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground"><MetricLabel label="Revenue Multiple" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-semibold text-slate-700">{valuation.multCons}x</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-slate-800">{valuation.multBase}x</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-semibold text-slate-700">{valuation.multOpt}x</td>
                        </tr>
                        <tr className="hover:bg-muted/5 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-700"><MetricLabel label="Estimated Exit Valuation" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono"><ColoredNumber value={valuation.exitValCons} format="rupiah" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-slate-800"><ColoredNumber value={valuation.exitValBase} format="rupiah" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono"><ColoredNumber value={valuation.exitValOpt} format="rupiah" /></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground"><MetricLabel label="Investor Equity %" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono"><ColoredNumber value={(valuation.dynamicInvestorEquityFrac * 100)} format="percent" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono"><ColoredNumber value={(valuation.dynamicInvestorEquityFrac * 100)} format="percent" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono"><ColoredNumber value={(valuation.dynamicInvestorEquityFrac * 100)} format="percent" /></td>
                        </tr>
                        <tr className="hover:bg-muted/5 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-800"><MetricLabel label="Investor Equity Value" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono"><ColoredNumber value={valuation.invValCons} format="rupiah" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-slate-800"><ColoredNumber value={valuation.invValBase} format="rupiah" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono"><ColoredNumber value={valuation.invValOpt} format="rupiah" /></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground"><MetricLabel label="Initial Investment" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono"><ColoredNumber value={valuation.seedInv} format="rupiah" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-slate-700"><ColoredNumber value={valuation.seedInv} format="rupiah" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono"><ColoredNumber value={valuation.seedInv} format="rupiah" /></td>
                        </tr>
                        <tr className="font-bold border-t">
                          <td className="px-4 py-3 text-slate-700"><MetricLabel label="MOIC" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-amber-700">{valuation.moicCons.toFixed(2)}x</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-green-700">{valuation.moicBase.toFixed(2)}x</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-green-900">{valuation.moicOpt.toFixed(2)}x</td>
                        </tr>
                        <tr className="font-bold hover:bg-muted/5 transition-colors text-slate-800">
                          <td className="px-4 py-3 text-slate-800"><MetricLabel label={language === "en" ? `Estimated IRR (${data.length} Years)` : `Estimasi IRR (${data.length} Tahun)`} /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-amber-700"><ColoredNumber value={(valuation.irrCons * 100)} format="percent" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-green-700"><ColoredNumber value={(valuation.irrBase * 100)} format="percent" /></td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-green-900"><ColoredNumber value={(valuation.irrOpt * 100)} format="percent" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="p-4 bg-muted/10 border-t border-border flex items-start gap-2.5 text-[10px] text-muted-foreground">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    {language === "en"
                      ? `MOIC (Multiple on Invested Capital) & IRR (Internal Rate of Return) simulated based on Year ${data.length} (${data[data.length - 1]?.year || 2029}) exit assumptions.`
                      : `MOIC (Multiple on Invested Capital) & IRR (Internal Rate of Return) disimulasikan berdasarkan asumsi exit tahun ke-${data.length} (${data[data.length - 1]?.year || 2029}).`
                    }
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
    </TooltipProvider>
  );
}
