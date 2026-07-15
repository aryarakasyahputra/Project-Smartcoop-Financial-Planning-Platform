import React, { useState } from "react";
import { 
  TrendingUp, DollarSign, Activity, Calculator, Shield,
  ChevronDown, Save, RotateCcw, Users, Info, ShieldAlert
} from "lucide-react";
import { formatRupiah } from "../utils/financialModel";
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../../components/ui/tooltip";

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
  "pre_money_valuation": "Valuasi perusahaan yang disepakati dengan investor sebelum dana investasi Seed masuk.",
  "exit_revenue_multiple_conservative": "Kelipatan (multiple) valuasi kasus konservatif untuk menghitung Exit Valuation.",
  "exit_revenue_multiple_base": "Kelipatan (multiple) valuasi kasus moderat (base) untuk menghitung Exit Valuation.",
  "exit_revenue_multiple_optimistic": "Kelipatan (multiple) valuasi kasus optimistik untuk menghitung Exit Valuation."
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
function DriverInput({ label, value, onChange, prefix, suffix, step, disabled, definition }) {
  const displayValue = prefix === "Rp" ? formatThousand(value) : value;

  const handleInputChangeInternal = (e) => {
    let rawVal;
    if (prefix === "Rp") {
      rawVal = parseThousand(e.target.value);
    } else {
      rawVal = e.target.value;
    }
    onChange({ target: { value: rawVal } });
  };

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
          {label}
        </label>
        {definition && (
          <UITooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help inline-flex text-muted-foreground hover:text-foreground transition-colors p-0.5" aria-label={`Info ${label}`}>
                <Info className="h-3.5 w-3.5" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[220px] text-xs font-normal leading-relaxed text-slate-100">{definition}</p>
            </TooltipContent>
          </UITooltip>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type={prefix === "Rp" ? "text" : "number"}
          step={prefix === "Rp" ? undefined : step || "any"}
          value={displayValue ?? ""}
          onChange={handleInputChangeInternal}
          disabled={disabled}
          min={0}
          max={suffix === "%" ? 100 : undefined}
          className={`w-full h-11 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-850 focus:outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm ${
            disabled ? "opacity-60 cursor-not-allowed bg-slate-100" : ""
          } ${prefix ? "pl-10" : "pl-4"} ${suffix ? "pr-10" : "pr-4"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold pointer-events-none">
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
  // Compute summary metrics from projection data for current year
  const currentYearData = data?.find(d => d.year === selectedEditYear) || {};

  const summaryMetrics = [
    { 
      label: "Projected ARR", 
      value: currentYearData.arr ? formatRupiah(currentYearData.arr) : "—", 
      color: BRAND_BLUE 
    },
    { 
      label: "Gross Margin", 
      value: currentYearData.grossMargin ? `${currentYearData.grossMargin.toFixed(1)}%` : "—", 
      color: "#10b981" 
    },
    { 
      label: "EBITDA Margin", 
      value: currentYearData.ebitdaMargin !== undefined ? `${currentYearData.ebitdaMargin.toFixed(1)}%` : "—", 
      color: currentYearData.ebitdaMargin >= 0 ? BRAND_ORANGE : "#ef4444"
    },
    { 
      label: "Koperasi Aktif", 
      value: currentYearData.endingCoops ? new Intl.NumberFormat("id-ID").format(currentYearData.endingCoops) : "—", 
      color: "#8b5cf6" 
    },
  ];

  // Section definitions with their fields
  const sections = [
    {
      id: "growth", no: "1", title: "PEMICU PERTUMBUHAN KOPERASI",
      icon: TrendingUp, color: BRAND_BLUE,
      fields: [
        { label: "Koperasi Aktif Awal (Baseline)", key: "beginning_cooperatives", parse: parseInt },
        { label: "Koperasi Baru Diakuisisi (Tahun)", key: "new_coops_acquired", parse: parseInt },
        { label: "Laju Churn Bulanan", key: "monthly_churn_rate", suffix: "%", step: "0.1", parse: parseFloat },
        { label: "Rata-rata Anggota / Koperasi", key: "avg_members_per_coop", parse: parseInt },
        { label: "Fraksi Berlangganan Aktif", key: "subscription_paying_frac", suffix: "%", step: "0.1", parse: parseFloat },
      ],
    },
    {
      id: "revenue", no: "2", title: "ALIRAN PENDAPATAN & HARGA",
      icon: DollarSign, color: BRAND_ORANGE,
      fields: [
        { label: "Biaya Setup Per Koperasi", key: "setup_fee", prefix: "Rp", parse: parseFloat },
        { label: "Jumlah Koperasi Implementasi", key: "paid_implementation_coops", parse: parseInt },
        { label: "SaaS Subscription / Bulan", key: "monthly_subscription_fee", prefix: "Rp", parse: parseFloat },
        { label: "Biaya Tambahan iOS / Bulan", key: "ios_addon_monthly_fee", prefix: "Rp", parse: parseFloat },
        { label: "Adopsi iOS", key: "ios_adoption_frac", suffix: "%", step: "0.1", parse: parseFloat },
        { label: "Proyek White Label", key: "white_label_projects", parse: parseInt },
        { label: "Biaya Per White Label", key: "white_label_fee_per_project", prefix: "Rp", parse: parseFloat },
        { label: "PPOB Active Koperasi", key: "ppob_active_coops_frac", suffix: "%", step: "0.1", parse: parseFloat },
        { label: "PPOB Transaksi / Coop / Bulan", key: "ppob_tx_per_coop_month", parse: parseInt },
        { label: "Rata-rata Fee PPOB / Tx", key: "avg_ppob_fee_per_tx", prefix: "Rp", parse: parseFloat },
        { label: "Partisipan Academy", key: "academy_participants_frac", suffix: "%", step: "0.001", parse: parseFloat },
        { label: "Harga Tiket Academy", key: "academy_avg_price_per_participant", prefix: "Rp", parse: parseFloat },
        { label: "Training Offline / Bulan", key: "offline_trainings_per_month", parse: parseInt },
        { label: "Biaya Training Offline / Coop", key: "offline_training_fee_per_coop", prefix: "Rp", parse: parseFloat },
        { label: "Kontrak Enterprise API (Tahun)", key: "enterprise_api_revenue", prefix: "Rp", parse: parseFloat },
      ],
    },
    {
      id: "cogs", no: "3", title: "BEBAN POKOK & HPP (COGS)",
      icon: Activity, color: "#ef4444",
      fields: [
        { label: "Cloud Hosting / Coop / Bulan", key: "cloud_cost_per_coop_month", prefix: "Rp", parse: parseFloat },
        { label: "Biaya Onboarding / Koperasi Baru", key: "implementation_cost_per_coop", prefix: "Rp", parse: parseFloat },
        { label: "Customer Support / Coop / Bulan", key: "support_cost_per_coop_month", prefix: "Rp", parse: parseFloat },
        { label: "Payment API Cost", key: "payment_api_var_cost_frac", suffix: "%", step: "0.1", parse: parseFloat },
        { label: "Other Cost of Revenue", key: "other_cost_of_revenue_frac", suffix: "%", step: "0.1", parse: parseFloat },
      ],
    },
    {
      id: "hr_planning", no: "4", title: "PERENCANAAN SDM (HR PLANNING)",
      icon: Users, color: "#8b5cf6",
      infoBox: "Total Gaji Tahunan dihitung otomatis: (Total FTE) x (Rata-rata Gaji Bulanan) x 12.",
      fields: [
        { label: "Engineering & Product (FTE)", key: "hr_engineering_fte", parse: parseInt },
        { label: "Sales & Partnership (FTE)", key: "hr_sales_fte", parse: parseInt },
        { label: "Marketing (FTE)", key: "hr_marketing_fte", parse: parseInt },
        { label: "Customer Support & Success (FTE)", key: "hr_support_fte", parse: parseInt },
        { label: "Finance, HR & Admin (FTE)", key: "hr_finance_admin_fte", parse: parseInt },
        { label: "Management & Leadership (FTE)", key: "hr_management_fte", parse: parseInt },
        { label: "Rata-rata Gaji Bulanan", key: "hr_avg_salary_monthly", prefix: "Rp", parse: parseFloat },
      ],
    },
    {
      id: "opex", no: "5", title: "BIAYA OPERASIONAL (OPEX)",
      icon: Calculator, color: BRAND_ORANGE,
      fields: [
        { label: "Total Gaji Tahunan (Dihitung Otomatis)", key: "payroll_cost", prefix: "Rp", parse: parseFloat, disabled: true },
        { label: "Sales & Marketing", key: "sales_marketing_spend", prefix: "Rp", parse: parseFloat },
        { label: "Sewa Kantor & Utilitas", key: "office_utilities_internet", prefix: "Rp", parse: parseFloat },
        { label: "Software & Infrastruktur IT", key: "software_tools_subscriptions", prefix: "Rp", parse: parseFloat },
        { label: "Legal & Akuntansi", key: "legal_accounting_compliance", prefix: "Rp", parse: parseFloat },
        { label: "Perjalanan & Event", key: "travel_events", prefix: "Rp", parse: parseFloat },
        { label: "Rekrutmen & Pelatihan Tim", key: "recruitment_training", prefix: "Rp", parse: parseFloat },
        { label: "Lain-lain G&A", key: "other_ga", prefix: "Rp", parse: parseFloat },
      ],
    },
    {
      id: "funding", no: "6", title: "PENDANAAN & VALUASI",
      icon: Shield, color: "#10b981",
      infoBox: "Hanya digunakan pada simulasi arus kas (2026) dan ROI Investor (2029).",
      fields: [
        { label: "Suntikan Dana Seed Round", key: "seed_investment", prefix: "Rp", parse: parseFloat },
        { label: "Pre-Money Valuation", key: "pre_money_valuation", prefix: "Rp", parse: parseFloat },
        { label: "Revenue Multiple (Konservatif)", key: "exit_revenue_multiple_conservative", suffix: "x", step: "0.1", parse: parseFloat },
        { label: "Revenue Multiple (Base Case)", key: "exit_revenue_multiple_base", suffix: "x", step: "0.1", parse: parseFloat },
        { label: "Revenue Multiple (Optimistik)", key: "exit_revenue_multiple_optimistic", suffix: "x", step: "0.1", parse: parseFloat },
      ],
    },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fadeIn max-w-5xl">
        
        {/* Unsaved Changes Banner */}
        {isDirty && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800">
                  Perubahan Belum Diterapkan!
                </p>
                <p className="text-xs text-amber-700/80 mt-0.5">
                  Anda telah mengubah asumsi. Klik tombol di bagian bawah untuk menyimpan dan memperbarui proyeksi laba rugi.
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
                            disabled={f.disabled || (f.key === "beginning_cooperatives" && selectedEditYear !== 2025)}
                            definition={DRIVER_DEFINITIONS[f.key]}
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
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-sm text-slate-500">
            Perubahan otomatis terhitung ke seluruh laporan.
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleResetData}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Semua Data
            </button>
            <button
              onClick={handleSaveAssumptions}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold shadow-sm hover:opacity-95 transition-all disabled:opacity-50 ${
                isDirty ? "animate-pulse ring-2 ring-blue-500/20" : ""
              }`}
              style={{ background: BRAND_BLUE }}
            >
              {saving ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Menyimpan..." : "Simpan & Terapkan ke Laporan"}
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
