import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileSpreadsheet, Download, CheckCircle2, Table, Layers, ArrowRight } from "lucide-react";
import { CURRENCY_CONFIG } from "../../../context/CurrencyContext";

export default function ExcelPreviewModal({
  show,
  onClose,
  onDownload,
  downloading,
  assumptionsByYear = {},
  currency = "IDR",
  language = "en",
  companyName = "Smartcoop"
}) {
  const [activeSheet, setActiveSheet] = useState("08_EBITDA");

  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.IDR;
  const rate = config.rate || 1;
  const symbol = config.symbol || "Rp";

  const sortedYears = useMemo(() => {
    const yrs = Object.keys(assumptionsByYear).map(y => Number(y)).filter(y => !isNaN(y));
    return yrs.length > 0 ? yrs.sort((a, b) => a - b) : [2025, 2026, 2027, 2028, 2029];
  }, [assumptionsByYear]);

  const fmtVal = (val, isMoney = true, isPct = false) => {
    if (val === null || val === undefined || isNaN(val)) return "—";
    if (isPct) return `${(Number(val) * 100).toFixed(1)}%`;
    if (isMoney) {
      const converted = Number(val) * rate;
      return `${symbol} ${Math.round(converted).toLocaleString("id-ID")}`;
    }
    return Math.round(Number(val)).toLocaleString("id-ID");
  };

  // Generate Preview Table Rows per sheet
  const sheetData = useMemo(() => {
    const data = {};

    // 08_EBITDA
    data["08_EBITDA"] = {
      title: language === "en" ? "08. EBITDA Summary" : "08. Ringkasan EBITDA",
      rows: [
        { label: language === "en" ? "Total Revenue" : "Total Pendapatan", isMoney: true, calc: (yrData, prevData) => yrData.totalRevenue || 0, formula: "=SUM(Setup, SaaS, Addon, WL, PPOB...)" },
        { label: "Cost of Revenue (COGS)", isMoney: true, calc: (yrData) => yrData.totalCogs || 0, formula: "=SUM(Cloud, Onboarding, Support, API...)" },
        { label: language === "en" ? "Gross Profit" : "Laba Kotor", isMoney: true, isBold: true, calc: (yrData) => (yrData.totalRevenue || 0) - (yrData.totalCogs || 0), formula: "=Total Revenue - COGS" },
        { label: "Operating Expenses (OPEX)", isMoney: true, calc: (yrData) => yrData.totalOpex || 0, formula: "=SUM(Payroll, Marketing, Office, Subscriptions...)" },
        { label: "EBITDA", isMoney: true, isHighlight: true, calc: (yrData) => (yrData.totalRevenue || 0) - (yrData.totalCogs || 0) - (yrData.totalOpex || 0), formula: "=Gross Profit - OPEX" },
        { label: "EBITDA Margin", isMoney: false, isPct: true, calc: (yrData) => (yrData.totalRevenue ? ((yrData.totalRevenue - yrData.totalCogs - yrData.totalOpex) / yrData.totalRevenue) : 0), formula: "=EBITDA / Total Revenue" },
      ]
    };

    // 02_Assumptions
    data["02_Assumptions"] = {
      title: language === "en" ? "02. Financial Assumptions" : "02. Asumsi Keuangan",
      rows: [
        { label: language === "en" ? "Beginning Active Coops" : "Koperasi Aktif Awal", isMoney: false, key: "beginning_cooperatives" },
        { label: language === "en" ? "New Coops Acquired" : "Koperasi Baru Diakuisisi", isMoney: false, key: "new_coops_acquired" },
        { label: language === "en" ? "Monthly Churn Rate" : "Tingkat Churn Bulanan", isMoney: false, isPct: true, key: "monthly_churn_rate", rawPct: true },
        { label: language === "en" ? "Average Members / Coop" : "Rata-rata Anggota / Koperasi", isMoney: false, key: "avg_members_per_coop" },
        { label: language === "en" ? "Setup Fee / Coop" : "Biaya Setup / Koperasi", isMoney: true, key: "setup_fee" },
        { label: language === "en" ? "Monthly Subscription Fee" : "Biaya Langganan Bulanan", isMoney: true, key: "monthly_subscription_fee" },
        { label: language === "en" ? "Payroll Cost" : "Beban Gaji / Payroll", isMoney: true, key: "payroll_cost" },
        { label: language === "en" ? "Sales & Marketing Spend" : "Biaya Pemasaran & Sales", isMoney: true, key: "sales_marketing_spend" },
      ]
    };

    // 03_Customer_Growth
    data["03_Customer_Growth"] = {
      title: language === "en" ? "03. Customer Growth Model" : "03. Pertumbuhan Koperasi",
      rows: [
        { label: language === "en" ? "Beginning Active Cooperatives" : "Koperasi Aktif Awal", isMoney: false, key: "beginning_cooperatives" },
        { label: language === "en" ? "New Cooperatives Acquired" : "Koperasi Baru Diakuisisi", isMoney: false, key: "new_coops_acquired" },
        { label: language === "en" ? "Churned Cooperatives" : "Koperasi Churn", isMoney: false, calc: (a) => Math.round((a.beginning_cooperatives || 200) * ((a.monthly_churn_rate || 1) / 100)), formula: "=ROUND(BegCoops * ChurnRate, 0)" },
        { label: language === "en" ? "Ending Active Cooperatives" : "Koperasi Aktif Akhir", isMoney: false, isBold: true, calc: (a) => (a.beginning_cooperatives || 200) + (a.new_coops_acquired || 30) - Math.round((a.beginning_cooperatives || 200) * ((a.monthly_churn_rate || 1) / 100)), formula: "=BegCoops + NewCoops - Churned" },
        { label: language === "en" ? "Total Members" : "Total Anggota Koperasi", isMoney: false, calc: (a) => ((a.beginning_cooperatives || 200) + (a.new_coops_acquired || 30)) * (a.avg_members_per_coop || 500), formula: "=EndingCoops * AvgMembers" },
      ]
    };

    // 04_Revenue_Engine
    data["04_Revenue_Engine"] = {
      title: language === "en" ? "04. Revenue Engine" : "04. Mesin Pendapatan",
      rows: [
        { label: language === "en" ? "Setup & Onboarding Revenue" : "Pendapatan Setup / Onboarding", isMoney: true, calc: (a) => (a.paid_implementation_coops || a.new_coops_acquired || 30) * (a.setup_fee || 40000000), formula: "=PaidImplement * SetupFee" },
        { label: language === "en" ? "SaaS Subscription Revenue" : "Pendapatan Langganan SaaS", isMoney: true, calc: (a) => (a.beginning_cooperatives || 200) * ((a.subscription_paying_frac || 80) / 100) * (a.monthly_subscription_fee || 300000) * 12, formula: "=ActiveCoops * SubFrac * SubFee * 12" },
        { label: language === "en" ? "White Label Revenue" : "Pendapatan White Label", isMoney: true, calc: (a) => (a.white_label_projects || 5) * (a.white_label_fee_per_project || 20000000), formula: "=WLProjects * WLFee" },
        { label: language === "en" ? "Enterprise API Revenue" : "Pendapatan Enterprise API", isMoney: true, calc: (a) => a.enterprise_api_revenue || 30000000, formula: "='02_Assumptions'!EnterpriseAPI" },
      ]
    };

    // 07_OPEX
    data["07_OPEX"] = {
      title: language === "en" ? "07. Operating Expenses" : "07. Beban Operasional (OPEX)",
      rows: [
        { label: language === "en" ? "Payroll Cost" : "Beban Gaji (Payroll)", isMoney: true, key: "payroll_cost" },
        { label: language === "en" ? "Sales & Marketing Spend" : "Pemasaran & Penjualan", isMoney: true, key: "sales_marketing_spend" },
        { label: language === "en" ? "Office, Utilities & Internet" : "Kantor, Listrik & Internet", isMoney: true, key: "office_utilities_internet" },
        { label: language === "en" ? "Software Tools & Subscriptions" : "Software & Langganan Tools", isMoney: true, key: "software_tools_subscriptions" },
        { label: language === "en" ? "Legal, Accounting & Compliance" : "Hukum, Akuntansi & Legal", isMoney: true, key: "legal_accounting_compliance" },
      ]
    };

    return data;
  }, [language, rate]);

  if (!show) return null;

  const currentSheet = sheetData[activeSheet] || sheetData["08_EBITDA"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{language === "en" ? "Excel Model Preview" : "Preview Model Keuangan Excel"}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    .xlsx ({currency})
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {companyName} • {sortedYears[0]} – {sortedYears[sortedYears.length - 1]} ({sortedYears.length} {language === "en" ? "Years" : "Tahun"})
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sheet Selector Tabs (Excel Style) */}
          <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/40 overflow-x-auto">
            {Object.keys(sheetData).map((sheetKey) => {
              const isActive = activeSheet === sheetKey;
              return (
                <button
                  key={sheetKey}
                  onClick={() => setActiveSheet(sheetKey)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/80 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Table className={`h-3.5 w-3.5 ${isActive ? "text-emerald-500" : "opacity-60"}`} />
                  <span>{sheetKey}</span>
                </button>
              );
            })}
          </div>

          {/* Main Excel Preview Body */}
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30 dark:bg-slate-900/30">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {currentSheet.title}
              </h4>
              <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                ✓ {language === "en" ? "Live Excel Formulas Preserved" : "Rumus Aktif Excel Terjaga 100%"}
              </div>
            </div>

            {/* Table Representation */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                      <th className="py-2.5 px-4 font-semibold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 w-12 text-center bg-slate-200/50 dark:bg-slate-800/50">
                        Row
                      </th>
                      <th className="py-2.5 px-4 font-bold text-slate-700 dark:text-slate-200 min-w-[220px]">
                        Metric / Driver (Column A)
                      </th>
                      {sortedYears.map((yr, idx) => (
                        <th key={yr} className="py-2.5 px-4 font-bold text-slate-700 dark:text-slate-200 text-right min-w-[130px]">
                          {String.fromCharCode(66 + idx)} ({yr})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {currentSheet.rows.map((rowItem, rIdx) => (
                      <tr 
                        key={rIdx}
                        className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                          rowItem.isHighlight 
                            ? "bg-emerald-50/60 dark:bg-emerald-950/20 font-bold" 
                            : rowItem.isBold 
                            ? "bg-slate-50/50 dark:bg-slate-800/30 font-semibold" 
                            : ""
                        }`}
                      >
                        <td className="py-2.5 px-4 text-[11px] font-mono text-slate-400 text-center border-r border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 select-none">
                          {rIdx + 5}
                        </td>
                        <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-medium">
                          <div className="flex items-center gap-2">
                            <span>{rowItem.label}</span>
                            {rowItem.formula && (
                              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                {rowItem.formula}
                              </span>
                            )}
                          </div>
                        </td>
                        {sortedYears.map((yr) => {
                          const yrData = assumptionsByYear[yr] || {};
                          let val = "—";
                          if (rowItem.calc) {
                            val = rowItem.calc(yrData);
                          } else if (rowItem.key) {
                            val = yrData[rowItem.key];
                            if (rowItem.rawPct && val !== undefined) val = Number(val) / 100;
                          }
                          return (
                            <td key={yr} className="py-2.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                              {fmtVal(val, rowItem.isMoney !== false, rowItem.isPct)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>{language === "en" ? "Ready to export 14 sheets workbook" : "Siap mengunduh file 14 sheet lengkap"}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {language === "en" ? "Cancel" : "Batal"}
              </button>
              <button
                onClick={onDownload}
                disabled={downloading}
                className="flex items-center gap-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>
                  {downloading 
                    ? (language === "en" ? "Generating..." : "Mengunduh...") 
                    : (language === "en" ? "Download Excel (.xlsx)" : "Unduh File Excel (.xlsx)")}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
