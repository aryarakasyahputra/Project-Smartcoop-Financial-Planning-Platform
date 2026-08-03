import { useState } from "react";

export function useValuationModel(data) {
  // Find seed year data or any year with customized Cap Table parameters
  const activeCapTableYear = data?.find(y => 
    (y.foundersPreSeed !== undefined && y.foundersPreSeed !== 100.0) || 
    (y.esopPreSeed !== undefined && y.esopPreSeed > 0) || 
    (y.investorPreSeed !== undefined && y.investorPreSeed > 0) || 
    (y.foundersSeedInv !== undefined && y.foundersSeedInv > 0) || 
    (y.esopSeedInv !== undefined && y.esopSeedInv > 0)
  ) || data?.find(y => y.seedInvestment > 0) || data?.[0];

  const preMoneyVal = activeCapTableYear?.preMoneyValuation ?? 0;
  const seedInv = activeCapTableYear?.seedInvestment ?? 0;

  // Cap Table parameters loaded from assumptions
  const foundersPreSeed = activeCapTableYear?.foundersPreSeed ?? 100.0;
  const esopPreSeed = activeCapTableYear?.esopPreSeed ?? 0.0;
  const investorPreSeed = activeCapTableYear?.investorPreSeed ?? 0.0;
  const esopSeedInv = activeCapTableYear?.esopSeedInv ?? 0;
  const foundersSeedInv = activeCapTableYear?.foundersSeedInv ?? 0;
  
  // Dynamic valuation based on ESOP & Founders seed inputs
  const postMoneyVal = preMoneyVal + seedInv + esopSeedInv + foundersSeedInv;
  
  // Calculate dynamic equity fractions matching Excel formulas (D4: =B4*(1-D6), D5: =B5, D6: =Seed Investment / Post-Money)
  const dynamicInvestorEquityFrac = postMoneyVal > 0 ? (((investorPreSeed / 100) * preMoneyVal) + seedInv) / postMoneyVal : 0;
  const dynamicEsopEquityFrac = (esopPreSeed / 100) + (postMoneyVal > 0 ? esopSeedInv / postMoneyVal : 0);
  const dynamicFoundersEquityFrac = ((foundersPreSeed / 100) * (1 - dynamicInvestorEquityFrac)) + (postMoneyVal > 0 ? foundersSeedInv / postMoneyVal : 0);

  // Year 2029 projected data for exit ROI
  const data2029 = data?.find(y => y.year === 2029) || data?.[data.length - 1];
  const rev2029 = data2029?.totalRevenue ?? 0;
  
  // Scenario-based revenues
  const revCons = rev2029 * 0.875;
  const revBase = rev2029;
  const revOpt = rev2029 * 1.1875;

  const multCons = data2029?.exitMultipleConservative ?? 0;
  const multBase = data2029?.exitMultipleBase ?? 0;
  const multOpt = data2029?.exitMultipleOptimistic ?? 0;

  // Exit Valuation Calculations
  const exitValCons = revCons * multCons;
  const exitValBase = revBase * multBase;
  const exitValOpt = revOpt * multOpt;

  // Investor Equity Value
  const invValCons = exitValCons * dynamicInvestorEquityFrac;
  const invValBase = exitValBase * dynamicInvestorEquityFrac;
  const invValOpt = exitValOpt * dynamicInvestorEquityFrac;

  // MOIC Calculations
  const moicCons = seedInv > 0 ? invValCons / seedInv : 0;
  const moicBase = seedInv > 0 ? invValBase / seedInv : 0;
  const moicOpt = seedInv > 0 ? invValOpt / seedInv : 0;

  // IRR Calculations (5 Years)
  const irrCons = moicCons > 0 ? Math.pow(moicCons, 1 / 5) - 1 : 0;
  const irrBase = moicBase > 0 ? Math.pow(moicBase, 1 / 5) - 1 : 0;
  const irrOpt = moicOpt > 0 ? Math.pow(moicOpt, 1 / 5) - 1 : 0;

  return {
    foundersPreSeed, setFoundersPreSeed: () => {},
    esopPreSeed, setEsopPreSeed: () => {},
    investorPreSeed, setInvestorPreSeed: () => {},
    esopSeedInv, setEsopSeedInv: () => {},
    foundersSeedInv, setFoundersSeedInv: () => {},
    preMoneyVal,
    seedInv,
    postMoneyVal,
    dynamicInvestorEquityFrac,
    dynamicFoundersEquityFrac,
    dynamicEsopEquityFrac,
    rev2029,
    revCons,
    revBase,
    revOpt,
    multCons,
    multBase,
    multOpt,
    exitValCons,
    exitValBase,
    exitValOpt,
    invValCons,
    invValBase,
    invValOpt,
    moicCons,
    moicBase,
    moicOpt,
    irrCons,
    irrBase,
    irrOpt
  };
}
