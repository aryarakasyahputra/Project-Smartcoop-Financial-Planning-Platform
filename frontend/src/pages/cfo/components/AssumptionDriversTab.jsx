import React, { useState } from "react";
import { 
  TrendingUp, DollarSign, Activity, Calculator, Shield,
  ChevronDown, Save, RotateCcw, Users
} from "lucide-react";
import { formatRupiah } from "../utils/financialModel";

const BRAND_BLUE = "#2b6cb8";
const BRAND_ORANGE = "#f28c1f";

// Reusable input field with prefix/suffix
function DriverInput({ label, value, onChange, prefix, suffix, step }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          step={step || "any"}
          value={value ?? 0}
          onChange={onChange}
          className={`w-full h-11 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors ${
            prefix ? "pl-10" : "pl-4"
          } ${suffix ? "pr-10" : "pr-4"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
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
  saving,
  data
}) {
  // Compute summary metrics from projection data for current year
  const currentYearData = data?.find(d => d.year === selectedEditYear) || {};

  const summaryMetrics = [
    { 
      label: "Projected ARR", 
      value: currentYearData.arr ? formatRupiah(currentYearData.arr) : "\u2014", 
      color: BRAND_BLUE 
    },
    { 
      label: "Gross Margin", 
      value: currentYearData.grossMargin ? `${currentYearData.grossMargin.toFixed(1)}%` : "\u2014", 
      color: "#10b981" 
    },
    { 
      label: "EBITDA Margin", 
      value: currentYearData.ebitdaMargin !== undefined ? `${currentYearData.ebitdaMargin.toFixed(1)}%` : "\u2014", 
      color: currentYearData.ebitdaMargin >= 0 ? BRAND_ORANGE : "#ef4444"
    },
    { 
      label: "Koperasi Aktif", 
      value: currentYearData.endingCoops ? new Intl.NumberFormat("id-ID").format(currentYearData.endingCoops) : "\u2014", 
      color: "#8b5cf6" 
    },
  ];

  // Section definitions with their fields
  const sections = [
    {
      id: "growth", no: "1", title: "PEMICU PERTUMBUHAN KOPERASI",
      icon: TrendingUp, color: BRAND_BLUE,
      fields: [
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
      id: "opex", no: "4", title: "BIAYA OPERASIONAL (OPEX)",
      icon: Calculator, color: BRAND_ORANGE,
      fields: [
        { label: "Gaji Tahunan (Semua Divisi)", key: "payroll_cost", prefix: "Rp", parse: parseFloat },
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
      id: "funding", no: "5", title: "PENDANAAN & VALUASI",
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
    <div className="space-y-6 animate-fadeIn max-w-5xl">
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
                    {s.fields.map((f) => (
                      <DriverInput
                        key={f.key}
                        label={f.label}
                        value={activeAssumptions[f.key] ?? 0}
                        prefix={f.prefix}
                        suffix={f.suffix}
                        step={f.step}
                        onChange={(e) =>
                          handleInputChange(
                            selectedEditYear,
                            f.key,
                            f.parse(e.target.value) || 0
                          )
                        }
                      />
                    ))}
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
            onClick={handleSaveAssumptions}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold shadow-sm hover:opacity-95 transition-all disabled:opacity-50"
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
  );
}
