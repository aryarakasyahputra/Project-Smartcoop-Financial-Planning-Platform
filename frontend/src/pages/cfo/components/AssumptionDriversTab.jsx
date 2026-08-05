import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  TrendingUp, DollarSign, Activity, Calculator, Shield,
  ChevronDown, Save, RotateCcw, Users, Info, ShieldAlert
} from "lucide-react";
import { formatRupiah } from "../utils/financialModel";
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../../components/ui/tooltip";
import { Plus, X, Trash2 } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

const BRAND_BLUE = "#2b6cb8";
const BRAND_ORANGE = "#f28c1f";

const DRIVER_DEFINITIONS = {
  // Growth
  "beginning_cooperatives": "Jumlah koperasi aktif di awal tahun sebagai basis kalkulasi.",
  "new_coops_acquired": "Target jumlah koperasi baru yang diakuisisi di tahun ini.",
  "monthly_churn_rate": "Persentase rata-rata koperasi yang berhenti berlangganan setiap bulan.",
  "avg_members_per_coop": "Rata-rata jumlah anggota dalam satu koperasi untuk transaksi PPOB & Academy.",
  "subscription_paying_frac": "Persentase koperasi aktif yang membayar biaya langganan SaaS secara rutin.",

  // Revenue
  "setup_fee": "Biaya setup awal (onboarding & training) yang dibebankan per koperasi baru.",
  "paid_implementation_coops": "Jumlah target koperasi baru yang membayar biaya implementasi penuh di tahun ini.",
  "monthly_subscription_fee": "Tarif langganan bulanan platform SaaS per koperasi.",
  "ios_addon_monthly_fee": "Tarif tambahan per bulan untuk koperasi yang mengaktifkan akses aplikasi iOS.",
  "ios_adoption_frac": "Persentase dari total koperasi aktif yang mengadopsi add-on aplikasi iOS.",
  "white_label_projects": "Target jumlah proyek kustomisasi merek (white label) yang diselesaikan tahun ini.",
  "white_label_fee_per_project": "Tarif pengerjaan lisensi per proyek kustomisasi white label.",
  "ppob_active_coops_frac": "Persentase koperasi aktif yang mengaktifkan fitur pembayaran online & tagihan (PPOB).",
  "ppob_tx_per_coop_month": "Rata-rata jumlah transaksi PPOB yang dilakukan oleh anggota per koperasi setiap bulan.",
  "avg_ppob_fee_per_tx": "Komisi bersih rata-rata yang diperoleh platform dari setiap transaksi PPOB.",
  "academy_participants_frac": "Persentase dari total anggota koperasi yang mengikuti program pelatihan Smartcoop Academy.",
  "academy_avg_price_per_participant": "Tarif tiket/sertifikasi rata-rata per peserta Smartcoop Academy.",
  "offline_trainings_per_month": "Target jumlah pelatihan tatap muka (offline) yang diselenggarakan per bulan.",
  "offline_training_fee_per_coop": "Biaya pelatihan offline yang dibebankan kepada koperasi peserta.",
  "enterprise_api_revenue": "Total nilai kontrak integrasi Enterprise API skala besar per tahun.",

  // COGS
  "cloud_cost_per_coop_month": "Rata-rata biaya hosting server cloud per koperasi aktif per bulan.",
  "implementation_cost_per_coop": "Biaya operasional langsung untuk tim onboarding per koperasi baru.",
  "support_cost_per_coop_month": "Biaya layanan dukungan pelanggan (support) per koperasi aktif per bulan.",
  "payment_api_var_cost_frac": "Biaya transaksi gerbang pembayaran (payment gateway) dari pendapatan transaksi.",
  "other_cost_of_revenue_frac": "Estimasi biaya langsung lainnya dihitung sebagai persentase dari total pendapatan.",

  // HR Planning
  "hr_engineering_fte": "Jumlah karyawan penuh waktu (FTE) di tim Engineering & Product.",
  "hr_sales_fte": "Jumlah karyawan penuh waktu (FTE) di tim Sales & Partnership.",
  "hr_marketing_fte": "Jumlah karyawan penuh waktu (FTE) di tim Marketing.",
  "hr_support_fte": "Jumlah karyawan penuh waktu (FTE) di tim Customer Support.",
  "hr_finance_admin_fte": "Jumlah karyawan penuh waktu (FTE) di tim Keuangan, HR, dan Administrasi.",
  "hr_management_fte": "Jumlah karyawan penuh waktu (FTE) di jajaran Manajemen & Direksi.",
  "hr_avg_salary_monthly": "Rata-rata gaji kotor bulanan per karyawan penuh waktu (termasuk tunjangan).",

  // OPEX
  "payroll_cost": "Beban gaji tahunan total yang dihitung otomatis berdasarkan jumlah FTE & rata-rata gaji.",
  "sales_marketing_spend": "Biaya kampanye pemasaran digital, iklan, perjalanan dinas, komisi sales, dan promosi.",
  "office_utilities_internet": "Biaya operasional kantor seperti sewa gedung, listrik, air, dan koneksi internet.",
  "software_tools_subscriptions": "Biaya langganan software/SaaS pihak ketiga untuk produktivitas kerja internal.",
  "legal_accounting_compliance": "Biaya konsultan hukum, audit akuntansi, pajak, dan lisensi kepatuhan regulasi.",
  "travel_events": "Biaya transportasi perjalanan dinas tim dan penyelenggaraan acara internal.",
  "recruitment_training": "Biaya perekrutan karyawan baru serta program pelatihan sertifikasi karyawan.",
  "other_ga": "Beban umum dan administrasi tidak terduga lainnya.",

  // Funding & Valuation
  "seed_investment": "Suntikan dana investasi yang diperoleh pada putaran pendanaan Seed.",
  "initial_opening_cash": "Saldo kas awal perusahaan pada awal tahun 2025 sebelum pendapatan dan investasi.",
  "pre_money_valuation": "Valuasi perusahaan yang disepakati dengan investor sebelum dana investasi Seed masuk.",
  "exit_revenue_multiple_conservative": "Kelipatan (multiple) valuasi kasus konservatif untuk menghitung Exit Valuation.",
  "exit_revenue_multiple_base": "Kelipatan (multiple) valuasi kasus moderat (base) untuk menghitung Exit Valuation.",
  "exit_revenue_multiple_optimistic": "Kelipatan (multiple) valuasi kasus optimistik untuk menghitung Exit Valuation."
};

const DRIVER_DEFINITIONS_EN = {
  // Growth
  "beginning_cooperatives": "Number of active cooperatives at start of year as calculation baseline.",
  "new_coops_acquired": "Target number of new cooperatives acquired during this year.",
  "monthly_churn_rate": "Average monthly percentage of cooperatives cancelling subscription.",
  "avg_members_per_coop": "Average member count per cooperative for PPOB & Academy transactions.",
  "subscription_paying_frac": "Percentage of active cooperatives regularly paying monthly SaaS fees.",

  // Revenue
  "setup_fee": "One-time initial onboarding & setup fee charged per new cooperative.",
  "paid_implementation_coops": "Target number of new cooperatives paying full implementation fee this year.",
  "monthly_subscription_fee": "Monthly SaaS platform subscription fee per cooperative.",
  "ios_addon_monthly_fee": "Additional monthly fee for cooperatives activating iOS app access.",
  "ios_adoption_frac": "Percentage of total active cooperatives adopting the iOS add-on.",
  "white_label_projects": "Target number of custom brand licensing (white-label) projects completed this year.",
  "white_label_fee_per_project": "Licensing fee charged per white-label customization project.",
  "ppob_active_coops_frac": "Percentage of active cooperatives activating online bill payment (PPOB).",
  "ppob_tx_per_coop_month": "Average monthly PPOB transaction volume performed by members per coop.",
  "avg_ppob_fee_per_tx": "Average net commission earned by the platform per PPOB transaction.",
  "academy_participants_frac": "Percentage of total coop members enrolling in Smartcoop Academy courses.",
  "academy_avg_price_per_participant": "Average ticket/certification fee per Smartcoop Academy participant.",
  "offline_trainings_per_month": "Target number of monthly face-to-face (offline) workshops held.",
  "offline_training_fee_per_coop": "Offline training fee charged per participating cooperative.",
  "enterprise_api_revenue": "Total annual contract value from large enterprise API integrations.",

  // COGS
  "cloud_cost_per_coop_month": "Average cloud server & hosting cost per active cooperative per month.",
  "implementation_cost_per_coop": "Direct onboarding team cost incurred per new cooperative.",
  "support_cost_per_coop_month": "Customer support service cost per active cooperative per month.",
  "payment_api_var_cost_frac": "Payment gateway processing fee as percentage of transaction revenue.",
  "other_cost_of_revenue_frac": "Estimated other direct cost of revenue as percentage of total revenue.",

  // HR Planning
  "hr_engineering_fte": "Full-Time Equivalent (FTE) headcount in Engineering & Product team.",
  "hr_sales_fte": "Full-Time Equivalent (FTE) headcount in Sales & Partnership team.",
  "hr_marketing_fte": "Full-Time Equivalent (FTE) headcount in Marketing team.",
  "hr_support_fte": "Full-Time Equivalent (FTE) headcount in Customer Support team.",
  "hr_finance_admin_fte": "Full-Time Equivalent (FTE) headcount in Finance, HR & Admin team.",
  "hr_management_fte": "Full-Time Equivalent (FTE) headcount in Executive Management.",
  "hr_avg_salary_monthly": "Average monthly gross salary per FTE employee (including benefits).",

  // OPEX
  "payroll_cost": "Total annual payroll expense automatically calculated: FTE x Avg Monthly Salary x 12.",
  "sales_marketing_spend": "Digital marketing campaigns, ads, sales commission & promotional events.",
  "office_utilities_internet": "Office operational expenses: building rent, electricity, water & internet.",
  "software_tools_subscriptions": "Third-party software & IT tool subscriptions for internal productivity.",
  "legal_accounting_compliance": "Legal counsel, accounting audits, tax services & regulatory compliance.",
  "travel_events": "Business travel expenses and internal corporate event hosting.",
  "recruitment_training": "Recruitment agency fees and employee certification training programs.",
  "other_ga": "Unforeseen general & administrative expenses.",

  // Funding & Valuation
  "seed_investment": "Equity investment capital injected during the Seed funding round.",
  "initial_opening_cash": "Beginning company cash balance at start of year 2025 before revenue & investment.",
  "pre_money_valuation": "Agreed pre-money company valuation before Seed investment injection.",
  "exit_revenue_multiple_conservative": "Conservative case revenue multiple used to calculate Exit Valuation.",
  "exit_revenue_multiple_base": "Base case revenue multiple used to calculate Exit Valuation.",
  "exit_revenue_multiple_optimistic": "Optimistic case revenue multiple used to calculate Exit Valuation."
};

const formatThousand = (val) => {
  if (val === undefined || val === null || val === "") return "";
  const parts = val.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
};

const parseThousand = (val) => {
  const clean = val.replace(/\./g, "").replace(/[^0-9.]/g, "");
  const num = parseFloat(clean);
  return isNaN(num) ? "" : num;
};

// Reusable input field with prefix/suffix and tooltip descriptions
function DriverInput({ label, value, onChange, prefix, suffix, step, disabled, definition, onDelete }) {
  // Format as thousand if it's Rp OR if it's an integer (no suffix and no step)
  const isFormatted = prefix === "Rp" || (!suffix && !step);
  const displayValue = isFormatted ? formatThousand(value) : value;

  const handleInputChangeInternal = (e) => {
    let rawVal;
    if (isFormatted) {
      rawVal = parseThousand(e.target.value);
    } else {
      rawVal = e.target.value;
    }
    onChange({ target: { value: rawVal } });
  };

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className={`text-xs font-bold uppercase tracking-wider ${disabled ? "text-slate-400" : "text-slate-600"}`}>
          {label}
        </label>
        {definition && (
          <UITooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button type="button" className="text-slate-400 hover:text-blue-500 focus:outline-none transition-colors">
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              {definition}
            </TooltipContent>
          </UITooltip>
        )}
        {onDelete && (
          <button 
            type="button" 
            onClick={onDelete} 
            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors ml-auto focus:outline-none"
            title="Hapus Asumsi"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
        {disabled && !onDelete && <Shield className="h-3.5 w-3.5 text-slate-400 ml-auto" />}
      </div>
      <div className="relative flex items-center">
        {prefix && (
          <span className={`absolute left-3 text-sm font-bold pointer-events-none ${disabled ? "text-slate-400" : "text-slate-500"}`}>
            {prefix}
          </span>
        )}
        <input
          type={isFormatted ? "text" : "number"}
          step={isFormatted ? undefined : step || "any"}
          value={displayValue ?? ""}
          onChange={handleInputChangeInternal}
          disabled={disabled}
          min={0}
          max={suffix === "%" ? 100 : undefined}
          className={`w-full h-11 rounded-lg text-sm font-semibold focus:outline-none transition-all shadow-sm ${
            disabled 
              ? "bg-slate-200/70 border-slate-300 text-slate-500 cursor-not-allowed" 
              : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          } ${prefix ? "pl-10" : "pl-4"} ${suffix ? "pr-10" : "pr-4"}`}
        />
        {suffix && (
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none ${disabled ? "text-slate-400" : "text-slate-500"}`}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AssumptionDriversTab({
  selectedEditYear,
  setSelectedEditYear,
  activeAssumptions,
  handleInputChange,
  expandedSections,
  toggleSection,
  handleSaveAssumptions,
  handleResetData,
  saving,
  data,
  isDirty
}) {
  const { language, t } = useLanguage();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customModalSection, setCustomModalSection] = useState(null);

  const getDriverDef = (key, fallback) => {
    return t(`finance.drivers.fields.${key}`, fallback);
  };
  
  // Custom form states
  const [customName, setCustomName] = useState("");
  const [customType, setCustomType] = useState("fixed_value");
  const [customValue, setCustomValue] = useState("");
  const [customRefVar, setCustomRefVar] = useState("");

  const sectionToImpactCategory = {
    "growth": "add_to_new_coops",
    "revenue": "add_to_revenue",
    "cogs": "add_to_cogs",
    "opex": "add_to_opex"
  };

  const handleOpenCustomModal = (sectionId) => {
    setCustomModalSection(sectionId);
    setCustomName("");
    setCustomType("fixed_value");
    setCustomValue("");
    setCustomRefVar("");
    setShowCustomModal(true);
  };

  const handleAddCustomAssumption = () => {
    if (!customName || !customValue) return;

    const newCustom = {
      name: customName,
      type: customType,
      value: parseFloat(customValue),
      reference_variable: customType === "percentage_of" ? customRefVar : null,
      impact_category: sectionToImpactCategory[customModalSection]
    };

    const existingCustoms = activeAssumptions.custom_assumptions || [];
    handleInputChange(selectedEditYear, "custom_assumptions", [...existingCustoms, newCustom]);
    setShowCustomModal(false);
  };

  const handleDeleteCustomAssumption = (indexToDelete) => {
    const existingCustoms = activeAssumptions.custom_assumptions || [];
    const updated = existingCustoms.filter((_, idx) => idx !== indexToDelete);
    handleInputChange(selectedEditYear, "custom_assumptions", updated);
  };
  // Compute summary metrics from projection data for current year
  const currentYearData = data?.find(d => d.year === selectedEditYear) || {};

  const summaryMetrics = [
    { 
      label: language === "en" ? "ARR Target" : "Target ARR", 
      value: currentYearData.arr ? formatRupiah(currentYearData.arr) : "—", 
      color: BRAND_BLUE 
    },
    { 
      label: language === "en" ? "Gross Margin" : "Margin Laba Kotor", 
      value: currentYearData.grossMargin ? `${currentYearData.grossMargin.toFixed(1)}%` : "—", 
      color: "#10b981" 
    },
    { 
      label: language === "en" ? "EBITDA Margin" : "Margin EBITDA", 
      value: currentYearData.ebitdaMargin !== undefined ? `${currentYearData.ebitdaMargin.toFixed(1)}%` : "—", 
      color: currentYearData.ebitdaMargin >= 0 ? BRAND_ORANGE : "#ef4444"
    },
    { 
      label: language === "en" ? "Active Coops" : "Koperasi Aktif", 
      value: currentYearData.endingCoops ? new Intl.NumberFormat("id-ID").format(currentYearData.endingCoops) : "—", 
      color: "#8b5cf6" 
    },
  ];

  // Section definitions with their fields
  const sections = [
    {
      id: "growth", no: "1", title: language === "en" ? "COOPERATIVE GROWTH ASSUMPTIONS" : "ASUMSI PERTUMBUHAN KOPERASI",
      icon: TrendingUp, color: BRAND_BLUE,
      fields: [
        { label: language === "en" ? "Beginning Active Cooperatives" : "Jumlah Koperasi Aktif (Awal Tahun)", key: "beginning_cooperatives", parse: parseInt },
        { label: language === "en" ? "Target New Coops Acquired" : "Target Akuisisi Koperasi Baru", key: "new_coops_acquired", parse: parseInt },
        { label: language === "en" ? "Monthly Churn Rate" : "Tingkat Churn (Berhenti Berlangganan)", key: "monthly_churn_rate", suffix: "%", step: "0.1", parse: parseFloat },
        { label: language === "en" ? "Avg Members per Coop" : "Rata-rata Anggota per Koperasi", key: "avg_members_per_coop", parse: parseInt },
        { label: language === "en" ? "Paying Active Coops Percentage" : "Persentase Pelanggan Aktif Membayar", key: "subscription_paying_frac", suffix: "%", step: "0.1", parse: parseFloat },
      ],
    },
    {
      id: "revenue", no: "2", title: language === "en" ? "REVENUE STREAMS & PRICING STRUCTURE" : "SUMBER PENDAPATAN & STRUKTUR HARGA",
      icon: DollarSign, color: BRAND_ORANGE,
      fields: [
        { label: language === "en" ? "Setup Fee per Coop" : "Biaya Setup Per Koperasi", key: "setup_fee", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Target Implementation Coops" : "Target Koperasi Implementasi", key: "paid_implementation_coops", parse: parseInt },
        { label: language === "en" ? "Monthly SaaS Subscription Fee" : "Biaya Langganan SaaS Bulanan", key: "monthly_subscription_fee", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Monthly iOS Add-on Fee" : "Biaya Add-on iOS Bulanan", key: "ios_addon_monthly_fee", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "iOS Add-on Adoption Rate" : "Tingkat Adopsi Add-on iOS", key: "ios_adoption_frac", suffix: "%", step: "0.1", parse: parseFloat },
        { label: language === "en" ? "Target White-Label Projects" : "Target Proyek White-Label", key: "white_label_projects", parse: parseInt },
        { label: language === "en" ? "White-Label Price per Project" : "Harga Jasa White-Label", key: "white_label_fee_per_project", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "PPOB Feature Adoption Rate" : "Tingkat Adopsi Fitur PPOB", key: "ppob_active_coops_frac", suffix: "%", step: "0.1", parse: parseFloat },
        { label: language === "en" ? "Est. PPOB Tx / Coop / Month" : "Estimasi Transaksi PPOB / Bulan", key: "ppob_tx_per_coop_month", parse: parseInt },
        { label: language === "en" ? "Net Margin PPOB Fee / Tx" : "Keuntungan Bersih (Margin) PPOB / Tx", key: "avg_ppob_fee_per_tx", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Academy Participant Rate" : "Persentase Partisipan Academy", key: "academy_participants_frac", suffix: "%", step: "0.001", parse: parseFloat },
        { label: language === "en" ? "Avg Academy Ticket Price" : "Harga Rata-rata Tiket Academy", key: "academy_avg_price_per_participant", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Offline Trainings / Month" : "Frekuensi Training Offline / Bulan", key: "offline_trainings_per_month", parse: parseInt },
        { label: language === "en" ? "Offline Training Fee / Coop" : "Biaya Training Offline / Koperasi", key: "offline_training_fee_per_coop", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Enterprise API Contract Target" : "Target Nilai Kontrak API Enterprise", key: "enterprise_api_revenue", prefix: "Rp", parse: parseFloat },
      ],
    },
    {
      id: "cogs", no: "3", title: language === "en" ? "COST OF GOODS SOLD (COGS)" : "BEBAN POKOK PENDAPATAN (COGS)",
      icon: Activity, color: "#ef4444",
      fields: [
        { label: language === "en" ? "Cloud Hosting Cost / Coop / Month" : "Biaya Server (Cloud) / Koperasi / Bulan", key: "cloud_cost_per_coop_month", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Onboarding Cost / New Coop" : "Biaya Onboarding / Koperasi Baru", key: "implementation_cost_per_coop", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Support Cost / Active Coop" : "Biaya Layanan Dukungan / Koperasi", key: "support_cost_per_coop_month", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Payment Gateway Transaction Fee" : "Biaya Transaksi Payment Gateway", key: "payment_api_var_cost_frac", suffix: "%", step: "0.1", parse: parseFloat },
        { label: language === "en" ? "Other Direct Costs (% Revenue)" : "Beban Pokok Lainnya (Other COGS)", key: "other_cost_of_revenue_frac", suffix: "%", step: "0.1", parse: parseFloat },
      ],
    },
    {
      id: "hr_planning", no: "4", title: language === "en" ? "HR PLANNING (HEADCOUNT)" : "PERENCANAAN SDM (HR PLANNING)",
      icon: Users, color: "#8b5cf6",
      infoBox: language === "en"
        ? "Total Annual Payroll is automatically calculated: (Total FTE) x (Avg Monthly Salary) x 12. FTE = Full-Time Equivalent."
        : "Total Beban Gaji Tahunan dihitung otomatis: (Total FTE) x (Rata-rata Gaji Bulanan) x 12. FTE = Full-Time Equivalent (Karyawan Penuh Waktu).",
      fields: [
        { label: language === "en" ? "Engineering & Product Team (FTE)" : "Tim Engineering & Product (FTE)", key: "hr_engineering_fte", parse: parseInt },
        { label: language === "en" ? "Sales & Partnership Team (FTE)" : "Tim Sales & Partnership (FTE)", key: "hr_sales_fte", parse: parseInt },
        { label: language === "en" ? "Marketing Team (FTE)" : "Tim Marketing (FTE)", key: "hr_marketing_fte", parse: parseInt },
        { label: language === "en" ? "Customer Support Team (FTE)" : "Tim Customer Support (FTE)", key: "hr_support_fte", parse: parseInt },
        { label: language === "en" ? "Finance, HR & Admin Team (FTE)" : "Tim Keuangan, HR & Admin (FTE)", key: "hr_finance_admin_fte", parse: parseInt },
        { label: language === "en" ? "Management & Leadership (FTE)" : "Tim Management & Leadership (FTE)", key: "hr_management_fte", parse: parseInt },
        { label: language === "en" ? "Avg Monthly Gross Salary" : "Rata-rata Gaji Bulanan", key: "hr_avg_salary_monthly", prefix: "Rp", parse: parseFloat },
      ],
    },
    {
      id: "opex", no: "5", title: language === "en" ? "OPERATING EXPENSES (OPEX)" : "BIAYA OPERASIONAL (OPEX)",
      icon: Calculator, color: BRAND_ORANGE,
      fields: [
        { label: language === "en" ? "Total Annual Payroll (Auto)" : "Total Beban Gaji Tahunan (Otomatis)", key: "payroll_cost", prefix: "Rp", parse: parseFloat, disabled: true },
        { label: language === "en" ? "Sales & Marketing Budget" : "Anggaran Pemasaran & Penjualan", key: "sales_marketing_spend", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Office Rent & Utilities" : "Biaya Sewa Kantor & Utilitas", key: "office_utilities_internet", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Software Tools & Subscriptions" : "Biaya Berlangganan Software IT", key: "software_tools_subscriptions", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Legal & Accounting Services" : "Biaya Legal & Jasa Akuntansi", key: "legal_accounting_compliance", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Travel & Events" : "Biaya Perjalanan Dinas & Event", key: "travel_events", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Recruitment & Employee Training" : "Biaya Rekrutmen & Pelatihan Karyawan", key: "recruitment_training", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Other General & Admin (G&A)" : "Biaya Umum & Administrasi Lainnya", key: "other_ga", prefix: "Rp", parse: parseFloat },
      ],
    },
    {
      id: "funding", no: "6", title: language === "en" ? "FUNDING & VALUATION" : "PENDANAAN & VALUASI",
      icon: Shield, color: "#10b981",
      infoBox: language === "en" ? "These assumptions simulate cash flows for subsequent years and Investor ROI at exit." : "Asumsi ini digunakan khusus untuk mensimulasikan arus kas pada tahun berikutnya (2026) dan ROI Investor di akhir tahun proyeksi (2029).",
      fields: [
        { label: language === "en" ? "Initial Opening Cash (2025)" : "Kas Awal Perusahaan (2025)", key: "initial_opening_cash", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Seed Funding Target" : "Target Pendanaan (Suntikan Dana)", key: "seed_investment", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Pre-Money Valuation" : "Valuasi Pre-Money", key: "pre_money_valuation", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Founders Pre-Seed Share (%)" : "Porsi Saham Pre-Seed Founders (%)", key: "founders_pre_seed_pct", suffix: "%", step: "0.1", parse: parseFloat },
        { label: language === "en" ? "ESOP Pre-Seed Share (%)" : "Porsi Saham Pre-Seed ESOP (%)", key: "esop_pre_seed_pct", suffix: "%", step: "0.1", parse: parseFloat },
        { label: language === "en" ? "Investor Pre-Seed Share (%)" : "Porsi Saham Pre-Seed Investor (%)", key: "investor_pre_seed_pct", suffix: "%", step: "0.1", parse: parseFloat },
        { label: language === "en" ? "Founders Additional Investment" : "Investasi Masuk Founders", key: "founders_seed_investment", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "ESOP Additional Investment" : "Investasi Masuk ESOP", key: "esop_seed_investment", prefix: "Rp", parse: parseFloat },
        { label: language === "en" ? "Exit Multiple (Conservative)" : "Kelipatan Pendapatan (Konservatif)", key: "exit_revenue_multiple_conservative", suffix: "x", step: "0.1", parse: parseFloat },
        { label: language === "en" ? "Exit Multiple (Base Case)" : "Kelipatan Pendapatan (Base Case)", key: "exit_revenue_multiple_base", suffix: "x", step: "0.1", parse: parseFloat },
        { label: language === "en" ? "Exit Multiple (Optimistic)" : "Kelipatan Pendapatan (Optimistik)", key: "exit_revenue_multiple_optimistic", suffix: "x", step: "0.1", parse: parseFloat },
      ],
    },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fadeIn">
        
        {/* Unsaved Changes Banner */}
        {isDirty && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800">
                  {t("finance.drivers.unsavedChanges", "Perubahan Belum Diterapkan!")}
                </p>
                <p className="text-xs text-amber-700/80 mt-0.5">
                  {language === "en" ? "You have modified assumptions. Save to update projections." : "Anda telah mengubah asumsi. Klik tombol di bagian bawah untuk menyimpan dan memperbarui proyeksi laba rugi."}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black text-amber-700 bg-amber-200/50 border border-amber-300/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Draft
            </span>
          </div>
        )}

        {/* Year Selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex gap-1 shadow-sm">
          {[2025, 2026, 2027, 2028, 2029].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedEditYear(yr)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                selectedEditYear === yr
                  ? "text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
              style={selectedEditYear === yr ? { background: BRAND_BLUE } : {}}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryMetrics.map((m) => (
            <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{m.label}</div>
              <div className="text-xl font-extrabold mt-1 truncate" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {sections.map((s) => {
            const isOpen = expandedSections[s.id];
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm">
                <button
                  onClick={() => toggleSection(s.id)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${s.color}15`, color: s.color }}
                  >
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 text-sm">
                      {s.no}. {s.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                    {s.infoBox && (
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-600 mb-4 font-medium">
                        {s.infoBox}
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                      {s.fields.map((f) => {
                        let val = activeAssumptions[f.key] ?? 0;
                        if (f.key === "beginning_cooperatives" && selectedEditYear !== 2025) {
                          const prevYearData = data?.find(d => d.year === selectedEditYear - 1);
                          val = prevYearData?.endingCoops ?? 0;
                        } else if (f.key === "payroll_cost") {
                          const eng = activeAssumptions.hr_engineering_fte ?? 0;
                          const sls = activeAssumptions.hr_sales_fte ?? 0;
                          const mkt = activeAssumptions.hr_marketing_fte ?? 0;
                          const spt = activeAssumptions.hr_support_fte ?? 0;
                          const fin = activeAssumptions.hr_finance_admin_fte ?? 0;
                          const mgt = activeAssumptions.hr_management_fte ?? 0;
                          const sal = activeAssumptions.hr_avg_salary_monthly ?? 0;
                          val = (eng + sls + mkt + spt + fin + mgt) * sal * 12;
                        }
                        return (
                          <DriverInput
                            key={f.key}
                            label={f.label}
                            value={val}
                            prefix={f.prefix}
                            suffix={f.suffix}
                            step={f.step}
                            disabled={f.disabled || (["beginning_cooperatives", "initial_opening_cash"].includes(f.key) && selectedEditYear !== 2025)}
                            definition={language === "en" ? DRIVER_DEFINITIONS_EN[f.key] : DRIVER_DEFINITIONS[f.key]}
                            onChange={(e) =>
                              handleInputChange(
                                selectedEditYear,
                                f.key,
                                e.target.value === "" ? "" : (f.parse(e.target.value) || 0)
                              )
                            }
                          />
                        );
                      })}
                      
                      {/* Custom Assumptions Fields injected directly into the grid */}
                      {(activeAssumptions.custom_assumptions || [])
                        .map((c, idx) => ({ ...c, originalIndex: idx }))
                        .filter(c => c.impact_category === sectionToImpactCategory[s.id])
                        .map(c => {
                          const isPercentage = c.type === 'percentage_of';
                          let labelText = c.name;
                          if (isPercentage) {
                            const refLabel = sections.flatMap(sec => sec.fields).find(f => f.key === c.reference_variable)?.label || c.reference_variable;
                            labelText += ` (% dari ${refLabel})`;
                          }
                          return (
                            <DriverInput
                              key={`custom-${c.originalIndex}`}
                              label={labelText}
                              value={c.value}
                              onChange={(e) => {
                                const val = e.target.value === "" ? "" : (parseFloat(e.target.value) || 0);
                                const existingCustoms = [...(activeAssumptions.custom_assumptions || [])];
                                existingCustoms[c.originalIndex] = { ...existingCustoms[c.originalIndex], value: val };
                                handleInputChange(selectedEditYear, "custom_assumptions", existingCustoms);
                              }}
                              prefix={isPercentage ? null : "Rp"}
                              suffix={isPercentage ? "%" : null}
                              step={isPercentage ? "0.1" : undefined}
                              onDelete={() => handleDeleteCustomAssumption(c.originalIndex)}
                            />
                          );
                        })
                      }
                    </div>
                    
                    {/* Add Custom Assumption Button */}
                    {["growth", "revenue", "cogs", "opex"].includes(s.id) && (
                      <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => handleOpenCustomModal(s.id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors border border-blue-100"
                        >
                          <Plus className="h-3.5 w-3.5" /> {language === "en" ? "ADD NEW CUSTOM ASSUMPTION" : "TAMBAH ASUMSI BARU"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-4 z-50 flex flex-col md:flex-row md:items-center justify-between bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-5 shadow-xl mt-8">
          <div className="text-sm text-slate-500 mb-4 md:mb-0">
            {language === "en" ? "Changes are automatically recalculated across all reports after saving." : "Perubahan otomatis terhitung ke seluruh laporan setelah disimpan."}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleResetData}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-all flex-1 md:flex-none"
            >
              <RotateCcw className="h-4 w-4" />
              {language === "en" ? "Reset All" : "Reset Semua"}
            </button>
            <button
              onClick={handleSaveAssumptions}
              disabled={saving}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex-1 md:flex-none ${
                isDirty ? "animate-pulse ring-2 ring-blue-500/50" : ""
              }`}
              style={{ background: BRAND_BLUE }}
            >
              {saving ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving 
                ? (language === "en" ? "Saving..." : "Menyimpan...") 
                : (language === "en" ? "Save & Apply" : "Simpan & Terapkan")
              }
            </button>
          </div>
        </div>

        {/* Custom Assumption Modal */}
        {showCustomModal && createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCustomModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg mx-4 p-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900">
                  {language === "en" ? "Add Custom Assumption" : "Tambah Asumsi Custom"}
                </h3>
                <button onClick={() => setShowCustomModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    {language === "en" ? "Assumption Name" : "Nama Asumsi"}
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={language === "en" ? "E.g., Ad Revenue, Extra Server Cost..." : "Contoh: Pendapatan Iklan, Biaya Server Tambahan..."}
                    className="w-full h-11 px-4 rounded-lg text-sm font-semibold bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    {language === "en" ? "Calculation Type" : "Tipe Perhitungan"}
                  </label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg text-sm font-semibold bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 appearance-none"
                  >
                    <option value="fixed_value">{language === "en" ? "Fixed Value (Nominal)" : "Nominal Tetap (Fixed Value)"}</option>
                    <option value="percentage_of">{language === "en" ? "Percentage of Other Variable" : "Persentase dari Variabel Lain"}</option>
                  </select>
                </div>

                {customType === "percentage_of" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      {language === "en" ? "Reference Variable" : "Referensi Variabel"}
                    </label>
                    <select
                      value={customRefVar}
                      onChange={(e) => setCustomRefVar(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg text-sm font-semibold bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 appearance-none"
                    >
                      <option value="">{language === "en" ? "-- Select Built-in Variable --" : "-- Pilih Variabel Bawaan --"}</option>
                      {sections.flatMap(s => s.fields).map(f => (
                        <option key={f.key} value={f.key}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    {customType === "percentage_of" 
                      ? (language === "en" ? "Percentage Amount (%)" : "Besaran Persentase (%)")
                      : (language === "en" ? "Numeric Value" : "Nilai Angka")
                    }
                  </label>
                  <input
                    type="number"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder={customType === "percentage_of" ? "Contoh: 10" : "Contoh: 5000000"}
                    className="w-full h-11 px-4 rounded-lg text-sm font-semibold bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
                >
                  {language === "en" ? "Cancel" : "Batal"}
                </button>
                <button
                  onClick={handleAddCustomAssumption}
                  disabled={!customName || !customValue || (customType === 'percentage_of' && !customRefVar)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                >
                  {language === "en" ? "Add Assumption" : "Tambah Asumsi"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </TooltipProvider>
  );
}
