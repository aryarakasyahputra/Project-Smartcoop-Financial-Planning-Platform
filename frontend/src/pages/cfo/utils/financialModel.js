export const simulateProjections = (assumptionsByYear) => {
  const projections = [];
  const years = [2025, 2026, 2027, 2028, 2029];
  const computedYears = {};
  
  for (let idx = 0; idx < years.length; idx++) {
    const year = years[idx];
    const a = assumptionsByYear[year] || {};
    
    // Process Custom Assumptions
    let customNewCoops = 0;
    let customRevenue = 0;
    let customCogs = 0;
    let customOpex = 0;
    
    const customAssumptionsMap = {};
    const customList = a.custom_assumptions || [];
    customList.forEach(custom => {
      let calculatedValue = 0;
      if (custom.type === 'fixed_value') {
        calculatedValue = Number(custom.value) || 0;
      } else if (custom.type === 'percentage_of') {
        const refKey = custom.reference_variable;
        const refValue = a[refKey] || 0;
        calculatedValue = ((Number(custom.value) || 0) / 100) * refValue;
      }
      
      customAssumptionsMap[custom.name] = {
         value: calculatedValue,
         category: custom.impact_category
      };
      
      switch (custom.impact_category) {
        case 'add_to_new_coops':
          customNewCoops += calculatedValue;
          break;
        case 'add_to_revenue':
          customRevenue += calculatedValue;
          break;
        case 'add_to_cogs':
          customCogs += calculatedValue;
          break;
        case 'add_to_opex':
          customOpex += calculatedValue;
          break;
      }
    });
    
    const newCoops = (a.new_coops_acquired ?? 0) + customNewCoops;
    const churnRate = a.monthly_churn_rate ?? 0;
    const avgMembers = a.avg_members_per_coop ?? 0;
    const subFraction = (a.subscription_paying_frac ?? 0) / 100;
    
    const beginningCoops = idx === 0 ? (a.beginning_cooperatives ?? 215) : computedYears[years[idx - 1]].endingCoops;
    const churnedCoops = Math.round(beginningCoops * (churnRate / 100));
    const endingActiveCoops = beginningCoops + newCoops - churnedCoops;
    const totalMembers = endingActiveCoops * avgMembers;
    
    // Revenue Streams
    const setupFee = a.setup_fee ?? 0;
    const paidImplementationCoops = a.paid_implementation_coops ?? 0;
    const monthlySubscriptionFee = a.monthly_subscription_fee ?? 0;
    const iosAddonMonthlyFee = a.ios_addon_monthly_fee ?? 0;
    const iosAdoptionFrac = (a.ios_adoption_frac ?? 0) / 100;
    const whiteLabelProjects = a.white_label_projects ?? 0;
    const whiteLabelFeePerProject = a.white_label_fee_per_project ?? 0;
    const ppobActiveCoopsFrac = (a.ppob_active_coops_frac ?? 0) / 100;
    const ppobTxPerCoopMonth = a.ppob_tx_per_coop_month ?? 0;
    const avgPpobFeePerTx = a.avg_ppob_fee_per_tx ?? 0;
    const academyParticipantsFrac = (a.academy_participants_frac ?? 0) / 100;
    const academyAvgPricePerParticipant = a.academy_avg_price_per_participant ?? 0;
    const offlineTrainings_perMonth = a.offline_trainings_per_month ?? 0;
    const offlineTrainingFee_coop = a.offline_training_fee_per_coop ?? 0;
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
                        enterpriseAPI_revenue +
                        customRevenue;
                        
    const arr = saasSubscriptionRevenue + iosAddonRevenue;
    const arpu = endingActiveCoops > 0 ? totalRevenue / endingActiveCoops : 0;
    
    // COGS
    const cloudCostPerCoopMonth = a.cloud_cost_per_coop_month ?? 0;
    const implementationCostPerCoop = a.implementation_cost_per_coop ?? 0;
    const supportCostPerCoopMonth = a.support_cost_per_coop_month ?? 0;
    const paymentApiVarCostFrac = (a.payment_api_var_cost_frac ?? 0) / 100;
    const otherCostOfRevenueFrac = (a.other_cost_of_revenue_frac ?? 0) / 100;
    
    const cloudInfrastructureCost = endingActiveCoops * cloudCostPerCoopMonth * 12;
    const implementationOnboardingCost = paidImplementationCoops * implementationCostPerCoop;
    const customerSupportCost = endingActiveCoops * supportCostPerCoopMonth * 12;
    const paymentApiVariableCost = ppobTransactionRevenue * paymentApiVarCostFrac;
    const otherCostOfRevenue = totalRevenue * otherCostOfRevenueFrac;
    
    const totalCogs = cloudInfrastructureCost +
                 implementationOnboardingCost +
                 customerSupportCost +
                 paymentApiVariableCost +
                 otherCostOfRevenue +
                 customCogs;
                 
    const grossProfit = totalRevenue - totalCogs;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    
    // OPEX
    const engFte = a.hr_engineering_fte;
    const salesFte = a.hr_sales_fte;
    const mktFte = a.hr_marketing_fte;
    const suppFte = a.hr_support_fte;
    const finFte = a.hr_finance_admin_fte;
    const mgmtFte = a.hr_management_fte;
    const avgSalary = a.hr_avg_salary_monthly;

    const e = engFte ?? 0;
    const s = salesFte ?? 0;
    const mk = mktFte ?? 0;
    const sp = suppFte ?? 0;
    const f = finFte ?? 0;
    const m = mgmtFte ?? 0;
    const sal = avgSalary ?? 0;
    let payrollOpex = a.payroll_cost ?? 0;
    if (engFte !== undefined || salesFte !== undefined || mktFte !== undefined || suppFte !== undefined || finFte !== undefined || mgmtFte !== undefined || avgSalary !== undefined) {
      payrollOpex = (e + s + mk + sp + f + m) * sal * 12;
    }
    const totalFte = e + s + mk + sp + f + m;
    const salesMarketingOpex = a.sales_marketing_spend ?? 0;
    const officeUtilitiesOpex = a.office_utilities_internet ?? 0;
    const softwareToolsOpex = a.software_tools_subscriptions ?? 0;
    const legalAccountingOpex = a.legal_accounting_compliance ?? 0;
    const travelEventsOpex = a.travel_events ?? 0;
    const recruitmentTrainingOpex = a.recruitment_training ?? 0;
    const otherGaOpex = a.other_ga ?? 0;
    
    const totalOpex = payrollOpex + salesMarketingOpex + officeUtilitiesOpex + softwareToolsOpex +
                      legalAccountingOpex + travelEventsOpex + recruitmentTrainingOpex + otherGaOpex + customOpex;
                      
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
    const annualChurn = (1 - Math.pow(1 - churnRate / 100, 12)) * 100;
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
      openingCash,
      seedInflow,
      endingCash,
      runwayMonths,
      mrr,
      annualChurn,
      estimatedCac,
      estimatedLtv,
      ltvCacRatio,
      cacPaybackMonths,
      ruleOf40,
      preMoneyValuation: a.pre_money_valuation ?? 0,
      seedInvestment: a.seed_investment ?? 0,
      exitMultipleConservative: a.exit_revenue_multiple_conservative ?? 0,
      exitMultipleBase: a.exit_revenue_multiple_base ?? 0,
      exitMultipleOptimistic: a.exit_revenue_multiple_optimistic ?? 0,
      foundersPreSeed: a.founders_pre_seed_pct ?? 100.0,
      esopPreSeed: a.esop_pre_seed_pct ?? 0.0,
      investorPreSeed: a.investor_pre_seed_pct ?? 0.0,
      foundersSeedInv: a.founders_seed_investment ?? 0,
      esopSeedInv: a.esop_seed_investment ?? 0,
      beginning_cooperatives: a.beginning_cooperatives ?? 215,
      beginningCoops,
      newCoops,
      churnedCoops,
      avgMembers,
      churnRate,
      totalFte,
      yoyCoopGrowth: idx === 0 ? 0 : (computedYears[years[idx - 1]].endingCoops > 0 ? (endingActiveCoops / computedYears[years[idx - 1]].endingCoops - 1) : 0),
      
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
      customAssumptionsMap,
    };
  }
  
  // Second pass for Exit valuations & Returns (using 2029 exit target)
  const y2029 = computedYears[2029] || {};
  const rev2029 = y2029.totalRevenue || 0;
  
  const a2029 = assumptionsByYear[2029] || {};
  const multCons = a2029.exit_revenue_multiple_conservative ?? 0;
  const multBase = a2029.exit_revenue_multiple_base ?? 0;
  const multOpt = a2029.exit_revenue_multiple_optimistic ?? 0;
  const seedInvestment = a2029.seed_investment ?? 0;
  const preMoneyVal = a2029.pre_money_valuation ?? 0;
  
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
    // Chart-scaled versions in Millions Rp (DO NOT overwrite raw values)
    computedYears[year].revenue = Math.round(computedYears[year].totalRevenue / 1000000);
    computedYears[year].expenses = Math.round((computedYears[year].totalCogs + computedYears[year].totalOpex) / 1000000);
    // Note: 'ebitda' key is NOT overwritten here — raw Rp value is kept for the P&L table
    computedYears[year].ebitdaM = Math.round(computedYears[year].ebitda / 1000000); // only for chart
    
    projections.push(computedYears[year]);
  }
  return projections;
};

export const getAnalystInsights = (data, assumptionsByYear, language = "id") => {
  if (!data || data.length === 0) return { cagr: 0, breakEvenYear: "N/A", ltv: 0, totalEbitda5Y: 0, healthRating: "N/A", healthAdvice: "" };
  
  const rev1 = data[0].totalRevenue;
  const rev5 = data[data.length - 1].totalRevenue;
  const cagr = rev1 > 0 ? (((rev5 / rev1) ** (1 / 4)) - 1) * 100 : 0;
  
  const rawBreakEven = data.find(row => row.ebitda > 0)?.year;
  const breakEvenYear = rawBreakEven ? rawBreakEven : (language === "en" ? "Not Reached" : "Belum Tercapai");
  
  const totalEbitda5Y = data.reduce((sum, row) => sum + row.ebitda, 0);
  const avgChurn = data.reduce((sum, row) => sum + (assumptionsByYear[row.year]?.monthly_churn_rate ?? 2.0), 0) / 5;

  let healthRating = language === "en" ? "Very Healthy" : "Sangat Sehat";
  let healthAdvice = language === "en" 
    ? "The financial model demonstrates very strong top-line SaaS growth with good economies of scale on EBITDA margin by 2029."
    : "Model finansial menunjukkan pertumbuhan top-line SaaS yang sangat kuat dengan skala ekonomis yang baik pada EBITDA margin di tahun 2029.";
  
  if (avgChurn > 2.0) {
    healthRating = language === "en" ? "Retention Warning" : "Peringatan Retensi";
    healthAdvice = language === "en"
      ? "Average annual churn rate is near upper limit. Improving cooperative onboarding quality is recommended to lower churn."
      : "Rata-rata churn rate tahunan mendekati batas atas. Meningkatkan kualitas onboarding koperasi disarankan untuk menekan churn.";
  } else if (totalEbitda5Y < 0) {
    healthRating = language === "en" ? "EBITDA Deficit" : "Defisit EBITDA";
    healthAdvice = language === "en"
      ? "EBITDA deficit continues into Year 5. Recommended to increase ARPU or reduce fixed operating expenses."
      : "Defisit EBITDA berlanjut hingga tahun 5. Direkomendasikan untuk meningkatkan ARPU atau menurunkan biaya operasional tetap.";
  }

  return {
    cagr: cagr.toFixed(1),
    breakEvenYear,
    healthRating,
    healthAdvice
  };
};

export const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
};
