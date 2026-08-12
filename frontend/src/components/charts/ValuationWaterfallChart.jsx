import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../context/CurrencyContext";

export default function ValuationWaterfallChart({ valuation, activeExitVal }) {
  const { language } = useLanguage();
  const { currencySymbol, formatCurrency, currencyConfig } = useCurrency();

  if (!valuation) return null;

  const preMoney = valuation.seedInvestment > 0 ? (valuation.seedInvestment / valuation.dynamicInvestorEquityFrac) - valuation.seedInvestment : 0;
  const seedInv = valuation.seedInvestment || 0;
  const postMoney = preMoney + seedInv;
  const exitVal = activeExitVal || 0;
  const valueCreation = Math.max(0, exitVal - postMoney);

  const data = [
    {
      name: "Pre-Money",
      start: 0,
      end: preMoney,
      value: preMoney,
      color: "#94a3b8"
    },
    {
      name: language === "en" ? "Seed Inv" : "Investasi Seed",
      start: preMoney,
      end: postMoney,
      value: seedInv,
      color: "#10b981"
    },
    {
      name: "Post-Money",
      start: 0,
      end: postMoney,
      value: postMoney,
      color: "#0f172a",
      isTotal: true
    },
    {
      name: language === "en" ? "Value Creation" : "Penciptaan Nilai",
      start: postMoney,
      end: exitVal,
      value: valueCreation,
      color: "#3b82f6"
    },
    {
      name: language === "en" ? "Exit Val (2029)" : "Valuasi Exit (2029)",
      start: 0,
      end: exitVal,
      value: exitVal,
      color: "#005fa4",
      isTotal: true
    }
  ];

  // Convert to converted currency amounts
  const rate = currencyConfig.rate || 1;
  const chartData = data.map(d => ({
    name: d.name,
    rawStart: d.start,
    rawEnd: d.end,
    rawValue: d.value,
    range: [ (d.start * rate) / 1_000_000_000, (d.end * rate) / 1_000_000_000 ],
    valueConvertedB: (d.value * rate) / 1_000_000_000,
    color: d.color,
    isTotal: d.isTotal
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg">
          <p className="font-bold text-slate-800 text-xs mb-1">{data.name}</p>
          <p className="text-[#005fa4] font-black text-sm">
            {formatCurrency(data.rawValue)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${currencySymbol}${val}B`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Bar dataKey="range" radius={[4, 4, 4, 4]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
