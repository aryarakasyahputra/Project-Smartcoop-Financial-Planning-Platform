import React, { useState, useEffect } from "react";
import { 
  LogOut, Building, ShieldCheck, Sparkles, Database, 
  LayoutDashboard, BarChart3, LineChart, Sliders, DollarSign,
  TrendingUp, Activity, Calculator, Percent, Save, RefreshCw,
  ChevronDown, ChevronUp, Users, Wallet, ArrowUpRight, Shield
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from "recharts";

export default function CfoDashboard({ userData, handleLogout }) {
  const [activeTab, setActiveTab] = useState("drivers");
  const [selectedEditYear, setSelectedEditYear] = useState(2025);
  
  // Accordion state for driver sections
  const [expandedSections, setExpandedSections] = useState({
    growth: true,
    revenue: false,
    cogs: false,
    opex: false,
    funding: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Full 5-Year Assumptions State
  const [assumptionsByYear, setAssumptionsByYear] = useState({
    2025: { new_coops_acquired: 35, monthly_churn_rate: 2.0, avg_members_per_coop: 711, subscription_paying_frac: 100.0, setup_fee: 40000000.0, paid_implementation_coops: 25, monthly_subscription_fee: 500000.0, ios_addon_monthly_fee: 200000.0, ios_adoption_frac: 40.0, white_label_projects: 3, white_label_fee_per_project: 20000000.0, ppob_active_coops_frac: 60.0, ppob_tx_per_coop_month: 20, avg_ppob_fee_per_tx: 1000.0, academy_participants_frac: 0.1, academy_avg_price_per_participant: 200000.0, offline_trainings_per_month: 7, offline_training_fee_per_coop: 2500000.0, enterprise_api_revenue: 672000000.0, cloud_cost_per_coop_month: 80000.0, implementation_cost_per_coop: 6000000.0, support_cost_per_coop_month: 75000.0, payment_api_var_cost_frac: 20.0, other_cost_of_revenue_frac: 8.0, payroll_cost: 2394000000.0, sales_marketing_spend: 400000000.0, office_utilities_internet: 180000000.0, software_tools_subscriptions: 120000000.0, legal_accounting_compliance: 80000000.0, travel_events: 150000000.0, recruitment_training: 70000000.0, other_ga: 100000000.0, seed_investment: 8250000000.0, pre_money_valuation: 46200000000.0, exit_revenue_multiple_conservative: 3.0, exit_revenue_multiple_base: 5.0, exit_revenue_multiple_optimistic: 7.0 },
    2026: { new_coops_acquired: 35, monthly_churn_rate: 2.0, avg_members_per_coop: 700, subscription_paying_frac: 100.0, setup_fee: 40000000.0, paid_implementation_coops: 30, monthly_subscription_fee: 500000.0, ios_addon_monthly_fee: 200000.0, ios_adoption_frac: 40.0, white_label_projects: 4, white_label_fee_per_project: 20000000.0, ppob_active_coops_frac: 60.0, ppob_tx_per_coop_month: 20, avg_ppob_fee_per_tx: 1000.0, academy_participants_frac: 0.1, academy_avg_price_per_participant: 200000.0, offline_trainings_per_month: 8, offline_training_fee_per_coop: 2500000.0, enterprise_api_revenue: 669000000.0, cloud_cost_per_coop_month: 80000.0, implementation_cost_per_coop: 6000000.0, support_cost_per_coop_month: 75000.0, payment_api_var_cost_frac: 20.0, other_cost_of_revenue_frac: 8.0, payroll_cost: 3168000000.0, sales_marketing_spend: 600000000.0, office_utilities_internet: 220000000.0, software_tools_subscriptions: 150000000.0, legal_accounting_compliance: 100000000.0, travel_events: 180000000.0, recruitment_training: 90000000.0, other_ga: 130000000.0, seed_investment: 8250000000.0, pre_money_valuation: 46200000000.0, exit_revenue_multiple_conservative: 3.0, exit_revenue_multiple_base: 5.0, exit_revenue_multiple_optimistic: 7.0 },
    2027: { new_coops_acquired: 250, monthly_churn_rate: 2.0, avg_members_per_coop: 410, subscription_paying_frac: 100.0, setup_fee: 40000000.0, paid_implementation_coops: 130, monthly_subscription_fee: 500000.0, ios_addon_monthly_fee: 200000.0, ios_adoption_frac: 40.0, white_label_projects: 8, white_label_fee_per_project: 20000000.0, ppob_active_coops_frac: 60.0, ppob_tx_per_coop_month: 20, avg_ppob_fee_per_tx: 1000.0, academy_participants_frac: 0.1, academy_avg_price_per_participant: 200000.0, offline_trainings_per_month: 10, offline_training_fee_per_coop: 2500000.0, enterprise_api_revenue: 747000000.0, cloud_cost_per_coop_month: 70000.0, implementation_cost_per_coop: 5500000.0, support_cost_per_coop_month: 70000.0, payment_api_var_cost_frac: 18.0, other_cost_of_revenue_frac: 7.0, payroll_cost: 4830000000.0, sales_marketing_spend: 900000000.0, office_utilities_internet: 300000000.0, software_tools_subscriptions: 220000000.0, legal_accounting_compliance: 150000000.0, travel_events: 300000000.0, recruitment_training: 150000000.0, other_ga: 200000000.0, seed_investment: 8250000000.0, pre_money_valuation: 46200000000.0, exit_revenue_multiple_conservative: 3.0, exit_revenue_multiple_base: 5.0, exit_revenue_multiple_optimistic: 7.0 },
    2028: { new_coops_acquired: 400, monthly_churn_rate: 1.5, avg_members_per_coop: 480, subscription_paying_frac: 100.0, setup_fee: 40000000.0, paid_implementation_coops: 180, monthly_subscription_fee: 500000.0, ios_addon_monthly_fee: 200000.0, ios_adoption_frac: 40.0, white_label_projects: 15, white_label_fee_per_project: 20000000.0, ppob_active_coops_frac: 65.0, ppob_tx_per_coop_month: 20, avg_ppob_fee_per_tx: 1000.0, academy_participants_frac: 0.1, academy_avg_price_per_participant: 200000.0, offline_trainings_per_month: 12, offline_training_fee_per_coop: 2500000.0, enterprise_api_revenue: 3660000000.0, cloud_cost_per_coop_month: 60000.0, implementation_cost_per_coop: 5000000.0, support_cost_per_coop_month: 60000.0, payment_api_var_cost_frac: 16.0, other_cost_of_revenue_frac: 6.0, payroll_cost: 6768000000.0, sales_marketing_spend: 1500000000.0, office_utilities_internet: 400000000.0, software_tools_subscriptions: 350000000.0, legal_accounting_compliance: 200000000.0, travel_events: 500000000.0, recruitment_training: 250000000.0, other_ga: 300000000.0, seed_investment: 8250000000.0, pre_money_valuation: 46200000000.0, exit_revenue_multiple_conservative: 3.0, exit_revenue_multiple_base: 5.0, exit_revenue_multiple_optimistic: 7.0 },
    2029: { new_coops_acquired: 500, monthly_churn_rate: 1.0, avg_members_per_coop: 536, subscription_paying_frac: 100.0, setup_fee: 40000000.0, paid_implementation_coops: 260, monthly_subscription_fee: 500000.0, ios_addon_monthly_fee: 200000.0, ios_adoption_frac: 40.0, white_label_projects: 25, white_label_fee_per_project: 20000000.0, ppob_active_coops_frac: 70.0, ppob_tx_per_coop_month: 20, avg_ppob_fee_per_tx: 1000.0, academy_participants_frac: 0.1, academy_avg_price_per_participant: 200000.0, offline_trainings_per_month: 15, offline_training_fee_per_coop: 2500000.0, enterprise_api_revenue: 10554000000.0, cloud_cost_per_coop_month: 50000.0, implementation_cost_per_coop: 4500000.0, support_cost_per_coop_month: 55000.0, payment_api_var_cost_frac: 15.0, other_cost_of_revenue_frac: 5.0, payroll_cost: 9750000000.0, sales_marketing_spend: 2200000000.0, office_utilities_internet: 550000000.0, software_tools_subscriptions: 500000000.0, legal_accounting_compliance: 300000000.0, travel_events: 800000000.0, recruitment_training: 350000000.0, other_ga: 500000000.0, seed_investment: 8250000000.0, pre_money_valuation: 46200000000.0, exit_revenue_multiple_conservative: 3.0, exit_revenue_multiple_base: 5.0, exit_revenue_multiple_optimistic: 7.0 }
  });

  const [loadingBackend, setLoadingBackend] = useState(false);
  const [saving, setSaving] = useState(false);

  // Retrieve project info from userData
  const project = userData?.company_accesses?.[0]?.company?.projects?.[0];
  const projectId = project?.id;
  const primaryCompany = userData?.company_accesses?.[0]?.company;

  // Fetch backend data
  const fetchBackendAssumptions = async () => {
    if (!projectId) return;
    setLoadingBackend(true);
    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch(`/api/projects/${projectId}/assumptions`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.assumptions && data.assumptions.length > 0) {
          const mapped = {};
          data.assumptions.forEach(item => {
            mapped[item.year] = item;
          });
          setAssumptionsByYear(mapped);
        }
      }
    } catch (err) {
      console.error("Gagal menyinkronkan data dengan database:", err);
    } finally {
      setLoadingBackend(false);
    }
  };

  useEffect(() => {
    fetchBackendAssumptions();
  }, [projectId]);

  // Save assumptions to database
  const handleSaveAssumptions = async () => {
    if (!projectId) {
      alert("Project ID tidak ditemukan!");
      return;
    }

    setSaving(true);
    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch(`/api/projects/${projectId}/assumptions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(assumptionsByYear)
      });

      const data = await res.json();
      if (res.ok) {
        alert("Asumsi berhasil disimpan dan model dihitung ulang di database!");
        fetchBackendAssumptions();
      } else {
        alert(data.message || "Gagal menyimpan asumsi.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan saat menyimpan asumsi.");
    } finally {
      setSaving(false);
    }
  };

  // Helper to handle input change for assumptions
  const handleInputChange = (year, key, val) => {
    setAssumptionsByYear(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [key]: val
      }
    }));
  };

  // Driver-based projection calculations (5-year simulation)
  const simulateProjections = () => {
    const projections = [];
    const years = [2025, 2026, 2027, 2028, 2029];
    const computedYears = {};
    
    for (let idx = 0; idx < years.length; idx++) {
      const year = years[idx];
      const a = assumptionsByYear[year] || {};
      
      const newCoops = a.new_coops_acquired ?? 35;
      const churnRate = a.monthly_churn_rate ?? 2.0;
      const avgMembers = a.avg_members_per_coop ?? 700;
      const subFraction = (a.subscription_paying_frac ?? 100.0) / 100;
      
      const beginningCoops = idx === 0 ? 215 : computedYears[years[idx - 1]].endingCoops;
      const churnedCoops = Math.round(beginningCoops * (churnRate / 100));
      const endingActiveCoops = beginningCoops + newCoops - churnedCoops;
      const totalMembers = endingActiveCoops * avgMembers;
      
      // Revenue Streams
      const setupFee = a.setup_fee ?? 40000000;
      const paidImplementationCoops = a.paid_implementation_coops ?? 30;
      const monthlySubscriptionFee = a.monthly_subscription_fee ?? 500000;
      const iosAddonMonthlyFee = a.ios_addon_monthly_fee ?? 200000;
      const iosAdoptionFrac = (a.ios_adoption_frac ?? 40.0) / 100;
      const whiteLabelProjects = a.white_label_projects ?? 0;
      const whiteLabelFeePerProject = a.white_label_fee_per_project ?? 20000000;
      const ppobActiveCoopsFrac = (a.ppob_active_coops_frac ?? 60.0) / 100;
      const ppobTxPerCoopMonth = a.ppob_tx_per_coop_month ?? 20;
      const avgPpobFeePerTx = a.avg_ppob_fee_per_tx ?? 1000;
      const academyParticipantsFrac = (a.academy_participants_frac ?? 0.1) / 100;
      const academyAvgPricePerParticipant = a.academy_avg_price_per_participant ?? 200000;
      const offlineTrainings_perMonth = a.offline_trainings_per_month ?? 0;
      const offlineTrainingFee_coop = a.offline_training_fee_per_coop ?? 2500000;
      const enterpriseAPI_revenue = a.enterprise_api_revenue ?? 0;
      
      const setupImplementationRevenue = paidImplementationCoops * setupFee;
      const saasSubscriptionRevenue = endingActiveCoops * subFraction * monthlySubscriptionFee * 12;
      const iosAddonRevenue = endingActiveCoops * iosAdoptionFrac * iosAddonMonthlyFee * 12;
      const whiteLabelRevenue = whiteLabelProjects * whiteLabelFeePerProject;
      const ppobTransactionRevenue = endingActiveCoops * ppobActiveCoopsFrac * ppobTxPerCoopMonth * 12 * avgPpobFeePerTx;
      const academyRevenue = totalMembers * academyParticipantsFrac * academyAvgPricePerParticipant;
      const offlineTrainingRevenue = offlineTrainings_perMonth * 12 * offlineTrainingFee_coop;
      
      const totalRevenue = setupImplementationRevenue +
                          saasSubscriptionRevenue +
                          iosAddonRevenue +
                          whiteLabelRevenue +
                          ppobTransactionRevenue +
                          academyRevenue +
                          offlineTrainingRevenue +
                          enterpriseAPI_revenue;
                          
      const arr = saasSubscriptionRevenue + iosAddonRevenue;
      const arpu = endingActiveCoops > 0 ? totalRevenue / endingActiveCoops : 0;
      
      // COGS
      const cloudCostPerCoopMonth = a.cloud_cost_per_coop_month ?? 80000;
      const implementationCostPerCoop = a.implementation_cost_per_coop ?? 6000000;
      const supportCostPerCoopMonth = a.support_cost_per_coop_month ?? 75000;
      const paymentApiVarCostFrac = (a.payment_api_var_cost_frac ?? 20.0) / 100;
      const otherCostOfRevenueFrac = (a.other_cost_of_revenue_frac ?? 8.0) / 100;
      
      const cloudInfrastructureCost = endingActiveCoops * cloudCostPerCoopMonth * 12;
      const implementationOnboardingCost = paidImplementationCoops * implementationCostPerCoop;
      const customerSupportCost = endingActiveCoops * supportCostPerCoopMonth * 12;
      const paymentApiVariableCost = ppobTransactionRevenue * paymentApiVarCostFrac;
      const otherCostOfRevenue = totalRevenue * otherCostOfRevenueFrac;
      
      const totalCogs = cloudInfrastructureCost +
                   implementationOnboardingCost +
                   customerSupportCost +
                   paymentApiVariableCost +
                   otherCostOfRevenue;
                   
      const grossProfit = totalRevenue - totalCogs;
      const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
      
      // OPEX
      const payrollOpex = a.payroll_cost ?? 0;
      const salesMarketingOpex = a.sales_marketing_spend ?? 0;
      const officeUtilitiesOpex = a.office_utilities_internet ?? 0;
      const softwareToolsOpex = a.software_tools_subscriptions ?? 0;
      const legalAccountingOpex = a.legal_accounting_compliance ?? 0;
      const travelEventsOpex = a.travel_events ?? 0;
      const recruitmentTrainingOpex = a.recruitment_training ?? 0;
      const otherGaOpex = a.other_ga ?? 0;
      
      const totalOpex = payrollOpex + salesMarketingOpex + officeUtilitiesOpex + softwareToolsOpex +
                        legalAccountingOpex + travelEventsOpex + recruitmentTrainingOpex + otherGaOpex;
                        
      const ebitda = grossProfit - totalOpex;
      const ebitdaMargin = totalRevenue > 0 ? (ebitda / totalRevenue) * 100 : 0;
      
      // Cash Flow
      const seedInflow = year === 2026 ? (a.seed_investment ?? 8250000000) : 0;
      const openingCash = idx === 0 ? 0 : computedYears[years[idx - 1]].endingCash;
      const endingCash = openingCash + seedInflow + ebitda;
      
      const monthlyBurn = Math.abs(Math.min(ebitda / 12, 0));
      const runwayMonths = monthlyBurn > 0 ? endingCash / monthlyBurn : 999.00;
      
      // SaaS Metrics
      const mrr = arr / 12;
      const estimatedCac = newCoops > 0 ? (salesMarketingOpex + payrollOpex * 0.35) / newCoops : 0;
      const estimatedLtv = (churnRate / 100) > 0 ? (mrr * (grossMargin / 100)) / (churnRate / 100) : 0;
      const ltvCacRatio = estimatedCac > 0 ? estimatedLtv / estimatedCac : 0;
      
      const mrrGross = mrr * (grossMargin / 100);
      const cacPaybackMonths = mrrGross > 0 ? estimatedCac / mrrGross : 0;
      
      let ruleOf40 = 0;
      if (idx === 0) {
        ruleOf40 = ebitdaMargin / 100;
      } else {
        const growthRate = computedYears[years[idx - 1]].totalRevenue > 0 
          ? (totalRevenue / computedYears[years[idx - 1]].totalRevenue) - 1 
          : 0;
        ruleOf40 = growthRate + (ebitdaMargin / 100);
      }
      
      computedYears[year] = {
        year,
        name: `${year}`,
        endingCoops: endingActiveCoops,
        totalMembers,
        totalRevenue,
        arr,
        arpu,
        totalCogs,
        grossProfit,
        grossMargin,
        totalOpex,
        ebitda,
        ebitdaMargin,
        endingCash,
        runwayMonths,
        mrr,
        estimatedCac,
        estimatedLtv,
        ltvCacRatio,
        cacPaybackMonths,
        ruleOf40,
        
        // Breakdowns for projections
        setupImplementationRevenue,
        saasSubscriptionRevenue,
        iosAddonRevenue,
        whiteLabelRevenue,
        ppobTransactionRevenue,
        academyRevenue,
        offlineTrainingRevenue,
        enterpriseAPI_revenue,
        
        cloudInfrastructureCost,
        implementationOnboardingCost,
        customerSupportCost,
        paymentApiVariableCost,
        otherCostOfRevenue,
        
        payrollOpex,
        salesMarketingOpex,
        officeUtilitiesOpex,
        softwareToolsOpex,
        legalAccountingOpex,
        travelEventsOpex,
        recruitmentTrainingOpex,
        otherGaOpex,
      };
    }
    
    // Second pass for Exit valuations & Returns (using 2029 exit target)
    const y2029 = computedYears[2029] || {};
    const rev2029 = y2029.totalRevenue || 0;
    
    const a2029 = assumptionsByYear[2029] || {};
    const multCons = a2029.exit_revenue_multiple_conservative ?? 3.0;
    const multBase = a2029.exit_revenue_multiple_base ?? 5.0;
    const multOpt = a2029.exit_revenue_multiple_optimistic ?? 7.0;
    const seedInvestment = a2029.seed_investment ?? 8250000000;
    const preMoneyVal = a2029.pre_money_valuation ?? 46200000000;
    
    const postMoneyVal = preMoneyVal + seedInvestment;
    const equityFrac = postMoneyVal > 0 ? seedInvestment / postMoneyVal : 0;
    
    const exitValCons = (rev2029 * 0.875) * multCons;
    const exitValBase = rev2029 * multBase;
    const exitValOpt = (rev2029 * 1.1875) * multOpt;
    
    const eqValCons = exitValCons * equityFrac;
    const eqValBase = exitValBase * equityFrac;
    const eqValOpt = exitValOpt * equityFrac;
    
    const moicCons = seedInvestment > 0 ? eqValCons / seedInvestment : 0;
    const moicBase = seedInvestment > 0 ? eqValBase / seedInvestment : 0;
    const moicOpt = seedInvestment > 0 ? eqValOpt / seedInvestment : 0;
    
    const irrCons = moicCons > 0 ? Math.pow(moicCons, 1/5) - 1 : 0;
    const irrBase = moicBase > 0 ? Math.pow(moicBase, 1/5) - 1 : 0;
    const irrOpt = moicOpt > 0 ? Math.pow(moicOpt, 1/5) - 1 : 0;
    
    for (let idx = 0; idx < years.length; idx++) {
      const year = years[idx];
      computedYears[year].moicCons = moicCons;
      computedYears[year].moicBase = moicBase;
      computedYears[year].moicOpt = moicOpt;
      
      computedYears[year].irrCons = irrCons * 100;
      computedYears[year].irrBase = irrBase * 100;
      computedYears[year].irrOpt = irrOpt * 100;
      
      computedYears[year].postMoneyVal = postMoneyVal;
      computedYears[year].impliedSeedEquityFrac = equityFrac;
      
      computedYears[year].users = computedYears[year].endingCoops; // graph compatibility
      computedYears[year].revenue = Math.round(computedYears[year].totalRevenue / 1000000); // Millions Rp
      computedYears[year].expenses = Math.round((computedYears[year].totalCogs + computedYears[year].totalOpex) / 1000000); // Millions Rp
      computedYears[year].ebitda = Math.round(computedYears[year].ebitda / 1000000); // Millions Rp
      
      projections.push(computedYears[year]);
    }
    return projections;
  };

  const data = simulateProjections();

  // Helper to format dynamic insights
  const getAnalystInsights = () => {
    if (!data || data.length === 0) return { cagr: 0, breakEvenYear: "N/A", ltv: 0, totalEbitda5Y: 0, healthRating: "N/A", healthAdvice: "" };
    
    const rev1 = data[0].totalRevenue;
    const rev5 = data[data.length - 1].totalRevenue;
    const cagr = rev1 > 0 ? (((rev5 / rev1) ** (1 / 4)) - 1) * 100 : 0;
    
    const breakEvenYear = data.find(row => row.ebitda > 0)?.year || "Belum Tercapai";
    
    const totalEbitda5Y = data.reduce((sum, row) => sum + row.ebitda, 0);
    const avgChurn = data.reduce((sum, row) => sum + (assumptionsByYear[row.year]?.monthly_churn_rate ?? 2.0), 0) / 5;

    let healthRating = "Sangat Sehat";
    let healthAdvice = "Model finansial menunjukkan pertumbuhan top-line SaaS yang sangat kuat dengan skala ekonomis yang baik pada EBITDA margin di tahun 2029.";
    if (avgChurn > 2.0) {
      healthRating = "Peringatan Retensi";
      healthAdvice = "Rata-rata churn rate tahunan mendekati batas atas. Meningkatkan kualitas onboarding koperasi disarankan untuk menekan churn.";
    } else if (totalEbitda5Y < 0) {
      healthRating = "Defisit EBITDA";
      healthAdvice = "Defisit EBITDA berlanjut hingga tahun 5. Direkomendasikan untuk meningkatkan ARPU atau menurunkan biaya operasional tetap.";
    }

    return {
      cagr: cagr.toFixed(1),
      breakEvenYear,
      healthRating,
      healthAdvice
    };
  };

  const insights = getAnalystInsights();

  // Helper to format currency
  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatRupiahMillions = (value) => {
    return formatRupiah(value * 1000000);
  };

  const activeAssumptions = assumptionsByYear[selectedEditYear] || {};

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* 1. Sidebar */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-bold text-primary">smart<span className="text-[#f28c1f]">coop</span></span>
            <span className="text-[10px] font-medium text-[#f28c1f] tracking-[0.2em] uppercase ml-0.5 mt-1">cfo console</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab("analyst")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === "analyst" 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Financial Analyst
            </button>
            <button 
              onClick={() => setActiveTab("drivers")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === "drivers" 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
              }`}
            >
              <Sliders className="h-4 w-4" /> Assumption Drivers
            </button>
            <button 
              onClick={() => setActiveTab("projections")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === "projections" 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
              }`}
            >
              <LineChart className="h-4 w-4" /> Model Proyeksi
            </button>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="mt-8 pt-6 border-t border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#f28c1f]/20 flex items-center justify-center text-[#f28c1f] font-bold">
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{userData?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">CFO / Finance Lead</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-destructive/20 text-destructive hover:bg-destructive/5 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CFO & Financial Model Console</h1>
            <p className="text-muted-foreground mt-1">Ubah pemicu pertumbuhan, simulasikan proyeksi keuangan, dan pantau rasio profitabilitas.</p>
          </div>
          {primaryCompany && (
            <div className="flex flex-col sm:items-end gap-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl">
                <Building className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{primaryCompany.name}</span>
              </div>
              {projectId && (
                <span className="text-[10px] text-muted-foreground font-mono">Project ID: #{projectId}</span>
              )}
            </div>
          )}
        </header>

        {/* Syncing State Banner */}
        {loadingBackend && (
          <div className="bg-primary/5 border border-primary/20 text-primary rounded-xl p-3 text-xs flex items-center gap-2">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Mensinkronisasikan asumsi dari database...</span>
          </div>
        )}

        {/* TAB 1: Financial Analyst */}
        {activeTab === "analyst" && (
          <div className="space-y-8 animate-fadeIn">
            {/* AI Advisor Assessment */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">AI Financial Analyst</span>
                  <h2 className="text-xl font-bold">Analisis Strategis & Rekomendasi</h2>
                  <div className="p-4 bg-muted/65 border border-border rounded-xl text-sm text-foreground mt-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span>Kondisi Model: <span className="text-primary capitalize">{insights.healthRating}</span></span>
                    </div>
                    <p className="text-muted-foreground">{insights.healthAdvice}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Ratios Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">CAGR Pendapatan (5-Tahun)</span>
                <h3 className="text-3xl font-bold text-primary">{insights.cagr}%</h3>
                <p className="text-xs text-muted-foreground">Laju pertumbuhan tahunan majemuk (2025–2029).</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Milestone EBITDA Positif</span>
                <h3 className="text-3xl font-bold text-[#f28c1f]">{insights.breakEvenYear}</h3>
                <p className="text-xs text-muted-foreground">Tahun pertama EBITDA operasional bernilai positif.</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">LTV / CAC (Rata-rata 2025)</span>
                <h3 className="text-3xl font-bold text-foreground">
                  {data[0]?.ltvCacRatio ? data[0].ltvCacRatio.toFixed(1) : "0"}x
                </h3>
                <p className="text-xs text-muted-foreground">Rasio nilai kontribusi pelanggan dibanding beban akuisisi.</p>
              </div>
            </div>

            {/* Valuation & Investor Exit Projection */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" /> Proyeksi Pengembalian Investor Seed
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Analisis ROI berdasarkan Pre-Money Rp 46,2 Miliar dan Investasi Seed Rp 8,25 Miliar (Equity Porsi: 15.15%)</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Conservative */}
                <div className="border border-border rounded-xl p-4 bg-muted/10 space-y-3">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Konservatif (3x Multiple)</span>
                    <span className="text-[10px] bg-gray-500/10 text-gray-500 font-bold px-2 py-0.5 rounded">Exit 2029</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase">Exit Valuation</p>
                    <p className="text-md font-bold">{formatRupiah((data[4]?.totalRevenue * 0.875 * 3) || 0)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-xs">
                    <div>
                      <p className="text-[10px] text-muted-foreground">MOIC</p>
                      <p className="font-bold text-primary">{data[0]?.moicCons ? data[0].moicCons.toFixed(2) : "0.0"}x</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">IRR (5-Thn)</p>
                      <p className="font-bold text-primary">{data[0]?.irrCons ? data[0].irrCons.toFixed(1) : "0.0"}%</p>
                    </div>
                  </div>
                </div>

                {/* Base Case */}
                <div className="border border-primary/20 rounded-xl p-4 bg-primary/5 space-y-3">
                  <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                    <span className="text-xs font-semibold text-primary uppercase">Base Case (5x Multiple)</span>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">Exit 2029</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase">Exit Valuation</p>
                    <p className="text-md font-bold">{formatRupiah((data[4]?.totalRevenue * 5) || 0)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/10 text-xs">
                    <div>
                      <p className="text-[10px] text-muted-foreground">MOIC</p>
                      <p className="font-bold text-primary">{data[0]?.moicBase ? data[0].moicBase.toFixed(2) : "0.0"}x</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">IRR (5-Thn)</p>
                      <p className="font-bold text-primary">{data[0]?.irrBase ? data[0].irrBase.toFixed(1) : "0.0"}%</p>
                    </div>
                  </div>
                </div>

                {/* Optimistic */}
                <div className="border border-[#f28c1f]/20 rounded-xl p-4 bg-[#f28c1f]/5 space-y-3">
                  <div className="flex justify-between items-center border-b border-[#f28c1f]/10 pb-2">
                    <span className="text-xs font-semibold text-[#f28c1f] uppercase">Optimistik (7x Multiple)</span>
                    <span className="text-[10px] bg-[#f28c1f]/10 text-[#f28c1f] font-bold px-2 py-0.5 rounded">Exit 2029</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase">Exit Valuation</p>
                    <p className="text-md font-bold">{formatRupiah((data[4]?.totalRevenue * 1.1875 * 7) || 0)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f28c1f]/10 text-xs">
                    <div>
                      <p className="text-[10px] text-muted-foreground">MOIC</p>
                      <p className="font-bold text-primary">{data[0]?.moicOpt ? data[0].moicOpt.toFixed(2) : "0.0"}x</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">IRR (5-Thn)</p>
                      <p className="font-bold text-primary">{data[0]?.irrOpt ? data[0].irrOpt.toFixed(1) : "0.0"}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Assumption Drivers */}
        {activeTab === "drivers" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Left: Driver Input Cards */}
            <section className="lg:col-span-1 space-y-4">
              {/* Year Selector Tabs */}
              <div className="bg-card border border-border rounded-xl p-2 flex gap-1 justify-between shadow-sm">
                {[2025, 2026, 2027, 2028, 2029].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedEditYear(yr)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedEditYear === yr 
                        ? "bg-primary text-primary-foreground shadow" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>

              {/* Accordion 1: Growth Drivers */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection("growth")}
                  className="w-full flex items-center justify-between p-4 bg-muted/15 hover:bg-muted/30 transition-colors border-b border-border"
                >
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> 1. Pemicu Pertumbuhan Koperasi
                  </span>
                  {expandedSections.growth ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.growth && (
                  <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Koperasi Baru Diakuisisi (Tahun)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.new_coops_acquired ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "new_coops_acquired", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Laju Churn Bulanan (%)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={activeAssumptions.monthly_churn_rate ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "monthly_churn_rate", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Rata-rata Anggota / Koperasi</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.avg_members_per_coop ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "avg_members_per_coop", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Revenue Streams Pricing */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection("revenue")}
                  className="w-full flex items-center justify-between p-4 bg-muted/15 hover:bg-muted/30 transition-colors border-b border-border"
                >
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" /> 2. Aliran Pendapatan & Harga
                  </span>
                  {expandedSections.revenue ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.revenue && (
                  <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Biaya Setup Per Koperasi (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.setup_fee ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "setup_fee", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Jumlah Koperasi Implementasi</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.paid_implementation_coops ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "paid_implementation_coops", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">SaaS Subscription / Bulan (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.monthly_subscription_fee ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "monthly_subscription_fee", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Adopsi Tambahan iOS (%)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.ios_adoption_frac ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "ios_adoption_frac", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Biaya Tambahan iOS / Bulan (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.ios_addon_monthly_fee ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "ios_addon_monthly_fee", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Proyek White Label</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.white_label_projects ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "white_label_projects", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Biaya per White Label (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.white_label_fee_per_project ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "white_label_fee_per_project", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">PPOB Active Koperasi (%)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.ppob_active_coops_frac ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "ppob_active_coops_frac", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">PPOB Transaksi / Coop / Bulan</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.ppob_tx_per_coop_month ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "ppob_tx_per_coop_month", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">PPOB Rata-rata Fee / Tx (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.avg_ppob_fee_per_tx ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "avg_ppob_fee_per_tx", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Partisipan Academy (% Anggota)</label>
                      <input 
                        type="number" 
                        step="0.001"
                        value={activeAssumptions.academy_participants_frac ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "academy_participants_frac", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Harga Tiket Academy (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.academy_avg_price_per_participant ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "academy_avg_price_per_participant", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Training Offline / Bulan</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.offline_trainings_per_month ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "offline_trainings_per_month", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Biaya Training per Coop (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.offline_training_fee_per_coop ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "offline_training_fee_per_coop", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Enterprise API Tahunan (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.enterprise_api_revenue ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "enterprise_api_revenue", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Cost and Margins */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection("cogs")}
                  className="w-full flex items-center justify-between p-4 bg-muted/15 hover:bg-muted/30 transition-colors border-b border-border"
                >
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-4 w-4 text-red-500" /> 3. Beban Pokok & HPP (COGS)
                  </span>
                  {expandedSections.cogs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.cogs && (
                  <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Beban Cloud / Active Coop / Bulan (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.cloud_cost_per_coop_month ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "cloud_cost_per_coop_month", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Beban Implementasi / Coop Baru (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.implementation_cost_per_coop ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "implementation_cost_per_coop", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Beban CS / Active Coop / Bulan (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.support_cost_per_coop_month ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "support_cost_per_coop_month", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Beban Variabel API PPOB (%)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.payment_api_var_cost_frac ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "payment_api_var_cost_frac", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Beban HPP Pendapatan Lain (%)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.other_cost_of_revenue_frac ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "other_cost_of_revenue_frac", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Operational Expenses */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection("opex")}
                  className="w-full flex items-center justify-between p-4 bg-muted/15 hover:bg-muted/30 transition-colors border-b border-border"
                >
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-[#f28c1f]" /> 4. Biaya Operasional (OPEX)
                  </span>
                  {expandedSections.opex ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.opex && (
                  <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Beban Gaji/Payroll Tahunan (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.payroll_cost ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "payroll_cost", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Beban Marketing Tahunan (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.sales_marketing_spend ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "sales_marketing_spend", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Kantor, Listrik & Internet (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.office_utilities_internet ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "office_utilities_internet", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Software & Berlangganan Alat (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.software_tools_subscriptions ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "software_tools_subscriptions", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Biaya Legal & Kepatuhan (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.legal_accounting_compliance ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "legal_accounting_compliance", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Perjalanan Dinas & Event (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.travel_events ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "travel_events", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Rekrutmen & Pelatihan (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.recruitment_training ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "recruitment_training", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Biaya Administrasi & Umum Lain (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.other_ga ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "other_ga", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 5: Funding & Valuation */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection("funding")}
                  className="w-full flex items-center justify-between p-4 bg-muted/15 hover:bg-muted/30 transition-colors border-b border-border"
                >
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-500" /> 5. Pendanaan & Valuasi
                  </span>
                  {expandedSections.funding ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.funding && (
                  <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Injeksi Modal Seed (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.seed_investment ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "seed_investment", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Pre-Money Valuation (Rp)</label>
                      <input 
                        type="number" 
                        value={activeAssumptions.pre_money_valuation ?? 0}
                        onChange={(e) => handleInputChange(selectedEditYear, "pre_money_valuation", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase font-bold text-muted-foreground">Cons. Mult</label>
                        <input 
                          type="number" 
                          step="0.5"
                          value={activeAssumptions.exit_revenue_multiple_conservative ?? 0}
                          onChange={(e) => handleInputChange(selectedEditYear, "exit_revenue_multiple_conservative", parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 bg-background border border-border rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase font-bold text-muted-foreground">Base Mult</label>
                        <input 
                          type="number" 
                          step="0.5"
                          value={activeAssumptions.exit_revenue_multiple_base ?? 0}
                          onChange={(e) => handleInputChange(selectedEditYear, "exit_revenue_multiple_base", parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 bg-background border border-border rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase font-bold text-muted-foreground">Opt. Mult</label>
                        <input 
                          type="number" 
                          step="0.5"
                          value={activeAssumptions.exit_revenue_multiple_optimistic ?? 0}
                          onChange={(e) => handleInputChange(selectedEditYear, "exit_revenue_multiple_optimistic", parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 bg-background border border-border rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={handleSaveAssumptions}
                  disabled={saving || !projectId}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Simpan Asumsi ke Database
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Right: Live visual chart */}
            <section className="bg-card border border-border rounded-xl p-6 lg:col-span-2 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" /> Visualisasi Proyeksi Pendapatan vs Pengeluaran
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Dampak perubahan parameter driver asumsi otomatis ter-update secara real-time pada grafik di bawah ini.</p>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Interactive Chart
                  </span>
                </div>
              </div>
              
              <div className="h-96 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} label={{ value: 'Juta Rp', angle: -90, position: 'insideLeft', fill: '#888888' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }}
                      labelStyle={{ fontWeight: "bold" }}
                    />
                    <Legend />
                    <Line name="Pendapatan (Juta)" type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line name="Pengeluaran (Juta)" type="monotone" dataKey="expenses" stroke="#f28c1f" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}

        {/* TAB 3: Model Proyeksi */}
        {activeTab === "projections" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Visualisasi Line Chart (Full Width) */}
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" /> Visualisasi Proyeksi Pendapatan vs Pengeluaran
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Pendapatan Tahunan SaaS & Project vs Total Pengeluaran (COGS + OPEX)</p>
                  </div>
                </div>
              </div>
              
              <div className="h-80 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} label={{ value: 'Juta Rp', angle: -90, position: 'insideLeft', fill: '#888888' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }}
                      labelStyle={{ fontWeight: "bold" }}
                    />
                    <Legend />
                    <Line name="Pendapatan (Juta)" type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line name="Pengeluaran (Juta)" type="monotone" dataKey="expenses" stroke="#f28c1f" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Income Statement Table (Full Width) */}
            <section className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" /> Rincian Laporan Proyeksi Keuangan (Income Statement)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Format tabular lengkap sesuai model Excel v2.0</p>
              </div>
              
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase font-semibold">
                      <th className="py-3 px-4">Aliran Pos / Metrik Keuangan</th>
                      {data.map((row) => (
                        <th key={row.name} className="py-3 px-4 text-right">Tahun {row.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    {/* CUSTOMER GROWTH */}
                    <tr className="bg-muted/10 font-semibold text-foreground">
                      <td className="py-2.5 px-4" colSpan={6}>1. PERTUMBUHAN CUSTOMER</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Koperasi Aktif (Ending)</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right font-medium">{row.endingCoops} Koperasi</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Total Anggota Koperasi</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right">{row.totalMembers.toLocaleString("id-ID")} Orang</td>
                      ))}
                    </tr>

                    {/* REVENUE BREAKDOWN */}
                    <tr className="bg-muted/10 font-semibold text-foreground">
                      <td className="py-2.5 px-4" colSpan={6}>2. REVENUE STREAMS (PENDAPATAN)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Setup / Implementation Revenue</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right">{formatRupiah(row.setupImplementationRevenue)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">SaaS Subscription Revenue</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right">{formatRupiah(row.saasSubscriptionRevenue)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">iOS Add-on Revenue</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right">{formatRupiah(row.iosAddonRevenue)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">White Label Revenue</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right">{formatRupiah(row.whiteLabelRevenue)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">PPOB Transaction Revenue</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right">{formatRupiah(row.ppobTransactionRevenue)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Smartcoop Academy Revenue</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right">{formatRupiah(row.academyRevenue)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Offline Training Revenue</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right">{formatRupiah(row.offlineTrainingRevenue)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Enterprise / Banking / API Revenue</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right">{formatRupiah(row.enterpriseAPI_revenue)}</td>
                      ))}
                    </tr>
                    <tr className="font-bold text-green-600 bg-green-50/10">
                      <td className="py-2.5 px-4 pl-6 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Total Revenue</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2.5 px-4 text-right">{formatRupiah(row.totalRevenue)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">ARR (SaaS Run-Rate)</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right font-medium">{formatRupiah(row.arr)}</td>
                      ))}
                    </tr>

                    {/* COGS BREAKDOWN */}
                    <tr className="bg-muted/10 font-semibold text-foreground">
                      <td className="py-2.5 px-4" colSpan={6}>3. HARGA POKOK PENJUALAN (COGS)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Cloud Infrastructure</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.cloudInfrastructureCost)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Implementation / Onboarding</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.implementationOnboardingCost)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Customer Support Cost</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.customerSupportCost)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Payment / API Variable Cost</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.paymentApiVariableCost)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Other Cost of Revenue</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.otherCostOfRevenue)}</td>
                      ))}
                    </tr>
                    <tr className="font-bold text-red-500 bg-red-50/10">
                      <td className="py-2.5 px-4 pl-6">Total COGS</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2.5 px-4 text-right">{formatRupiah(row.totalCogs)}</td>
                      ))}
                    </tr>
                    <tr className="font-bold bg-muted/5">
                      <td className="py-2.5 px-4 pl-6">Gross Profit</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2.5 px-4 text-right">{formatRupiah(row.grossProfit)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Gross Margin %</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right font-medium">{row.grossMargin.toFixed(1)}%</td>
                      ))}
                    </tr>

                    {/* OPEX BREAKDOWN */}
                    <tr className="bg-muted/10 font-semibold text-foreground">
                      <td className="py-2.5 px-4" colSpan={6}>4. BIAYA OPERASIONAL (OPEX)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Payroll (Gaji)</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.payrollOpex)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Sales & Marketing Spend</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.salesMarketingOpex)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Office, Utilities & Internet</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.officeUtilitiesOpex)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Software Tools & Subscriptions</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.softwareToolsOpex)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Legal, Accounting & Compliance</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.legalAccountingOpex)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Travel & Events</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.travelEventsOpex)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Recruitment & Training</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.recruitmentTrainingOpex)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Other G&A</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.otherGaOpex)}</td>
                      ))}
                    </tr>
                    <tr className="font-bold text-red-500 bg-red-50/10">
                      <td className="py-2.5 px-4 pl-6">Total OPEX</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2.5 px-4 text-right">{formatRupiah(row.totalOpex)}</td>
                      ))}
                    </tr>

                    {/* EBITDA & CASHFLOW */}
                    <tr className="bg-muted/10 font-semibold text-foreground">
                      <td className="py-2.5 px-4" colSpan={6}>5. PROFITABILITAS & CASH FLOW</td>
                    </tr>
                    <tr className="font-bold text-primary bg-primary/5">
                      <td className="py-2.5 px-4 pl-6 flex items-center gap-1"><Sparkles className="h-3 w-3" /> EBITDA</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2.5 px-4 text-right">{formatRupiah(row.ebitda * 1000000)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">EBITDA Margin (%)</td>
                      {data.map((row) => (
                        <td key={row.name} className={`py-2 px-4 text-right font-bold ${row.ebitdaMargin > 0 ? "text-green-500" : "text-destructive"}`}>
                          {row.ebitdaMargin.toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Seed Inflow</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-green-500 font-medium">
                          {row.year === 2026 ? formatRupiah(8250000000) : "Rp 0"}
                        </td>
                      ))}
                    </tr>
                    <tr className="font-bold">
                      <td className="py-2.5 px-4 pl-6">Ending Cash Balance</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2.5 px-4 text-right">{formatRupiah(row.endingCash)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Runway (Bulan)</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right font-medium">
                          {row.runwayMonths === 999.00 ? "Profitable" : `${row.runwayMonths.toFixed(1)} Bulan`}
                        </td>
                      ))}
                    </tr>

                    {/* SAAS METRICS */}
                    <tr className="bg-muted/10 font-semibold text-foreground">
                      <td className="py-2.5 px-4" colSpan={6}>6. METRIK SAAS UTAMA</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">MRR</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right font-medium">{formatRupiah(row.mrr)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">CAC per Koperasi Baru</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-red-500/80">{formatRupiah(row.estimatedCac)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">LTV per Koperasi</td>
                      {data.map((row) => (
                        <td key={row.name} className="py-2 px-4 text-right text-green-600 font-medium">{formatRupiah(row.estimatedLtv)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">LTV / CAC Ratio</td>
                      {data.map((row) => (
                        <td key={row.name} className={`py-2 px-4 text-right font-bold ${row.ltvCacRatio > 3 ? "text-green-500" : "text-destructive"}`}>
                          {row.ltvCacRatio.toFixed(1)}x
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-4 pl-8">Rule of 40 (%)</td>
                      {data.map((row) => (
                        <td key={row.name} className={`py-2 px-4 text-right font-bold ${row.ruleOf40 > 0.4 ? "text-green-500" : "text-destructive"}`}>
                          {(row.ruleOf40 * 100).toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
