import React, { useState, useEffect } from "react";
import { X, SlidersHorizontal, Percent, Landmark, TrendingDown, Layers, HelpCircle, Check, RotateCcw } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { toast } from "sonner";

export default function ItdaConfigModal({
  isOpen,
  onClose,
  assumptionsByYear,
  availableYears,
  onSaveAssumptions,
  currency = "IDR"
}) {
  const { language, t } = useLanguage();
  const lang = language || "id";

  const [selectedScope, setSelectedScope] = useState("all"); // "all" or specific year
  const [taxRate, setTaxRate] = useState(22.0);
  const [interestRate, setInterestRate] = useState(0.0);
  const [depreciationPercent, setDepreciationPercent] = useState(0.0);
  const [amortizationPercent, setAmortizationPercent] = useState(0.0);

  // Sync initial values when modal opens
  useEffect(() => {
    if (isOpen && availableYears.length > 0) {
      const sampleYear = selectedScope === "all" ? availableYears[0] : Number(selectedScope);
      const data = assumptionsByYear[sampleYear] || {};
      
      setTaxRate(data.tax_rate_percent !== undefined ? Number(data.tax_rate_percent) : 22.0);
      setInterestRate(data.interest_rate_percent !== undefined ? Number(data.interest_rate_percent) : 0.0);
      setDepreciationPercent(data.depreciation_percent !== undefined ? Number(data.depreciation_percent) : 0.0);
      setAmortizationPercent(data.amortization_percent !== undefined ? Number(data.amortization_percent) : 0.0);
    }
  }, [isOpen, selectedScope, assumptionsByYear, availableYears]);

  if (!isOpen) return null;

  const handleApply = (e) => {
    e.preventDefault();
    const updated = { ...assumptionsByYear };
    const targetYears = selectedScope === "all" ? availableYears : [Number(selectedScope)];

    targetYears.forEach(year => {
      updated[year] = {
        ...(updated[year] || { year }),
        tax_rate_percent: Number(taxRate) || 0,
        interest_rate_percent: Number(interestRate) || 0,
        depreciation_percent: Number(depreciationPercent) || 0,
        amortization_percent: Number(amortizationPercent) || 0,
      };
    });

    onSaveAssumptions(updated);
    toast.success(
      lang === "en" 
        ? `Tax & ITDA parameters successfully applied to ${selectedScope === "all" ? "all years" : `year ${selectedScope}`}.` 
        : `Parameter Pajak & ITDA berhasil diterapkan ke ${selectedScope === "all" ? "seluruh tahun" : `tahun ${selectedScope}`}.`
    );
    onClose();
  };

  const handleResetDefaults = () => {
    setTaxRate(22.0);
    setInterestRate(0.0);
    setDepreciationPercent(0.0);
    setAmortizationPercent(0.0);
    toast.info(lang === "en" ? "Parameters reset to default (22% Tax, 0% Interest, 0% Depr/Amort)." : "Parameter dikembalikan ke default (PPh 22%, Bunga 0%, Depr/Amort 0%).");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-b border-blue-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shadow-md shadow-amber-400/20 shrink-0">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {lang === "en" ? "Net Profit & ITDA Parameters" : "Konfigurasi Laba Bersih & ITDA"}
              </h3>
              <p className="text-xs text-blue-200/80 mt-0.5">
                {lang === "en" ? "Interest, Tax, Depreciation & Amortization Controls" : "Pengaturan Pajak (Tax), Bunga Pinjaman, Depresiasi & Amortisasi"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleApply} className="p-6 overflow-y-auto space-y-6 flex-1 text-foreground">
          {/* Scope Selector (All years vs specific year) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-muted/50 border border-border rounded-xl">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              {lang === "en" ? "Apply Configuration To:" : "Terapkan Konfigurasi Ke:"}
            </label>
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary"
            >
              <option value="all">{lang === "en" ? "🌐 All Projection Years" : "🌐 Seluruh Tahun Proyeksi"}</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr}>
                  {lang === "en" ? `📅 Year ${yr} Only` : `📅 Tahun ${yr} Saja`}
                </option>
              ))}
            </select>
          </div>

          {/* 1. Corporate Income Tax Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Percent className="h-3.5 w-3.5 text-amber-500" />
                {lang === "en" ? "Corporate Income Tax Rate (PPh %)" : "Tarif Pajak Penghasilan (PPh %)"}
              </label>
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/50">
                {taxRate}%
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="Masukkan tarif PPh (misal: 22, 11, atau 0.5)"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border font-medium focus:ring-2 focus:ring-primary focus:outline-hidden pr-8"
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">%</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {lang === "en" 
                ? "Deducted automatically from positive Earnings Before Tax (EBT)."
                : "Dipotong otomatis dari Laba Sebelum Pajak (EBT) jika bernilai positif."}
            </p>
          </div>

          {/* 2. Interest Expense / Loan Rate */}
          <div className="space-y-2.5 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Landmark className="h-3.5 w-3.5 text-blue-500" />
                {lang === "en" ? "Interest Expense (Beban Bunga Pinjaman %)" : "Beban Bunga Pinjaman / Hutang (Interest %)"}
              </label>
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900/50">
                {interestRate}%
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="0.0"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border font-medium focus:ring-2 focus:ring-primary focus:outline-hidden pr-8"
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">%</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {lang === "en"
                ? "Bunga pinjaman modal/bank. Masukkan 0% jika startup tidak memiliki hutang."
                : "Beban bunga dari pinjaman bank. Isi 0% jika perusahaan tidak memiliki pinjaman hutang."}
            </p>
          </div>

          {/* 3 & 4. Depreciation & Amortization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                {lang === "en" ? "Depreciation (% of Gross Profit)" : "Depresiasi Aset Fisik (% Laba Kotor)"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={depreciationPercent}
                  onChange={(e) => setDepreciationPercent(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border font-medium focus:ring-2 focus:ring-primary focus:outline-hidden pr-8"
                />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Layers className="h-3.5 w-3.5 text-purple-500" />
                {lang === "en" ? "Amortization (% of Gross Profit)" : "Amortisasi IP/Lisensi (% Laba Kotor)"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={amortizationPercent}
                  onChange={(e) => setAmortizationPercent(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border font-medium focus:ring-2 focus:ring-primary focus:outline-hidden pr-8"
                />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">%</span>
              </div>
            </div>
          </div>

          {/* Formula Breakdown Info Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-blue-950 dark:text-blue-100">
              <HelpCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              {lang === "en" ? "Financial Formula Flow:" : "Alur Perhitungan Laba Bersih:"}
            </p>
            <p className="font-mono text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
              EBITDA ➔ (-) Depresiasi/Amortisasi ➔ <strong>EBIT</strong> ➔ (-) Bunga Pinjaman ({interestRate}%) ➔ <strong>EBT</strong> ➔ (-) PPh ({taxRate}%) ➔ <strong className="text-emerald-700 dark:text-emerald-400">Net Profit</strong>
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md"
            >
              <RotateCcw className="h-3 w-3" />
              {lang === "en" ? "Reset Defaults" : "Kembalikan Default"}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                {lang === "en" ? "Cancel" : "Batal"}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                {lang === "en" ? "Save & Apply" : "Simpan & Terapkan"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
