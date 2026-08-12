import React, { createContext, useContext, useState } from "react";

export const CURRENCY_CONFIG = {
  IDR: {
    code: "IDR",
    symbol: "Rp",
    label: "IDR (Rp)",
    locale: "id-ID",
    rate: 1, // Baseline in DB is IDR
    fractionDigits: 0
  },
  USD: {
    code: "USD",
    symbol: "$",
    label: "USD ($)",
    locale: "en-US",
    rate: 1 / 16000,
    fractionDigits: 0
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    label: "EUR (€)",
    locale: "en-IE",
    rate: 1 / 17500,
    fractionDigits: 0
  }
};

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem("app_currency") || "IDR";
  });

  const setCurrency = (code) => {
    if (CURRENCY_CONFIG[code]) {
      setCurrencyState(code);
      localStorage.setItem("app_currency", code);
    }
  };

  const activeConfig = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.IDR;

  /**
   * Formats a monetary value (baseline in IDR) into the active currency.
   * @param {number} value - Baseline amount in IDR
   * @param {object} options - Optional Intl options or custom overrides
   *   - isConverted: boolean (if true, value is already converted)
   *   - maximumFractionDigits: number
   *   - compact: boolean (if true, format with K/M/B suffix)
   */
  const formatCurrency = (value, options = {}) => {
    if (value === null || value === undefined || isNaN(value)) return "—";
    
    const { isConverted = false, maximumFractionDigits, compact = false } = options;
    const numValue = Number(value);
    
    // Convert from IDR if needed
    const convertedValue = isConverted ? numValue : numValue * activeConfig.rate;

    if (compact) {
      const absVal = Math.abs(convertedValue);
      if (absVal >= 1_000_000_000) {
        const valInB = convertedValue / 1_000_000_000;
        return `${activeConfig.symbol} ${valInB.toFixed(1)}B`;
      }
      if (absVal >= 1_000_000) {
        const valInM = convertedValue / 1_000_000;
        return `${activeConfig.symbol} ${valInM.toFixed(1)}M`;
      }
      if (absVal >= 1_000) {
        const valInK = convertedValue / 1_000;
        return `${activeConfig.symbol} ${valInK.toFixed(0)}K`;
      }
    }

    const fracDigits = maximumFractionDigits !== undefined ? maximumFractionDigits : activeConfig.fractionDigits;

    return new Intl.NumberFormat(activeConfig.locale, {
      style: "currency",
      currency: activeConfig.code,
      maximumFractionDigits: fracDigits
    }).format(convertedValue);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatCurrency,
        currencySymbol: activeConfig.symbol,
        currencyConfig: activeConfig,
        allCurrencies: CURRENCY_CONFIG
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
