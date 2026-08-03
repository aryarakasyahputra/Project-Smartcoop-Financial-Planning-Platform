import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { formatRupiah } from "../../pages/cfo/utils/financialModel";
import { useLanguage } from "../../context/LanguageContext";

export default function ValuationWaterfallChart({ valuation, activeExitVal }) {
  const { language } = useLanguage();

  if (!valuation) return null;

  const preMoney = valuation.seedInvestment > 0 ? (valuation.seedInvestment / valuation.dynamicInvestorEquityFrac) - valuation.seedInvestment : 0;
  const seedInv = valuation.seedInvestment || 0;
  const postMoney = preMoney + seedInv;
  const exitVal = activeExitVal || 0;
  const valueCreation = Math.max(0, exitVal - postMoney);

  const data = [
    {
      name: language === "en" ? "Pre-Money" : "Pre-Money",
      start: 0,
      end: preMoney,
      value: preMoney,
      color: "#94a3b8" // Slate
    },
    {
      name: language === "en" ? "Seed Inv" : "Investasi Seed",
      start: preMoney,
      end: postMoney,
      value: seedInv,
      color: "#10b981" // Emerald
    },
    {
      name: language === "en" ? "Post-Money" : "Post-Money",
      start: 0,
      end: postMoney,
      value: postMoney,
      color: "#0f172a", // Dark Slate
      isTotal: true
    },
    {
      name: language === "en" ? "Value Creation" : "Penciptaan Nilai",
      start: postMoney,
      end: exitVal,
      value: valueCreation,
      color: "#3b82f6" // Blue
    },
    {
      name: language === "en" ? "Exit Val (2029)" : "Valuasi Exit (2029)",
      start: 0,
      end: exitVal,
      value: exitVal,
      color: "#005fa4", // Smartcoop Blue
      isTotal: true
    }
  ];

  // Convert to Billions for display
  const chartData = data.map(d => ({
    name: d.name,
    range: [d.start / 1_000_000_000, d.end / 1_000_000_000],
    valueB: d.value / 1_000_000_000,
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
            {language === "en" ? "Rp" : "Rp"} {data.valueB.toFixed(2)} {language === "en" ? "Billion" : "Miliar"}
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
            tickFormatter={(val) => `Rp${val}M`}
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
