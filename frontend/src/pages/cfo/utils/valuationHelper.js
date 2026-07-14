import { useState } from "react";

export function useValuationModel(data) {
  // State for Cap Table inputs (simulations)
  const [foundersPreSeed, setFoundersPreSeed] = useState(100.0);
  const [esopPreSeed, setEsopPreSeed] = useState(0.0);
  const [investorPreSeed, setInvestorPreSeed] = useState(0.0);
  const [esopSeedInv, setEsopSeedInv] = useState(0);
  const [foundersSeedInv, setFoundersSeedInv] = useState(0);

  // Find seed investment parameters from the year where seed investment is active (typically 2026)
  const seedYearData = data?.find(y => y.seedInvestment > 0) || data?.[1] || data?.[0];
  const preMoneyVal = seedYearData?.preMoneyValuation ?? 0;
  const seedInv = seedYearData?.seedInvestment ?? 0;
  
  // Dynamic valuation based on ESOP & Founders seed inputs
  const postMoneyVal = preMoneyVal + seedInv + esopSeedInv + foundersSeedInv;
  
  // Calculate dynamic equity fractions
  const dynamicInvestorEquityFrac = postMoneyVal > 0 ? (((investorPreSeed / 100) * preMoneyVal) + seedInv) / postMoneyVal : 0;
  const dynamicFoundersEquityFrac = postMoneyVal > 0 ? (((foundersPreSeed / 100) * preMoneyVal) + foundersSeedInv) / postMoneyVal : 0;
  const dynamicEsopEquityFrac = postMoneyVal > 0 ? (((esopPreSeed / 100) * preMoneyVal) + esopSeedInv) / postMoneyVal : 0;

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
    foundersPreSeed, setFoundersPreSeed,
    esopPreSeed, setEsopPreSeed,
    investorPreSeed, setInvestorPreSeed,
    esopSeedInv, setEsopSeedInv,
    foundersSeedInv, setFoundersSeedInv,
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
