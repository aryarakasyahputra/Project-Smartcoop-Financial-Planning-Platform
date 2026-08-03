import React from "react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { useLanguage } from "../../context/LanguageContext";

export function StandardAreaChart({ data, metricKey, color, nameEn, nameId, formatValue }) {
  const { language } = useLanguage();
  const name = language === "en" ? nameEn : nameId;

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={`color-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" opacity={0.5} />
          <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={formatValue}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
            formatter={(value) => [formatValue(value, true), name]}
          />
          <Area type="monotone" dataKey={metricKey} name={name} stroke={color} strokeWidth={2.5} fillOpacity={1} fill={`url(#color-${metricKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueChart({ data }) {
  return <StandardAreaChart 
    data={data} 
    metricKey="revenueB" 
    color="#005fa4" 
    nameEn="Total Revenue" 
    nameId="Total Pendapatan" 
    formatValue={(val, full) => full ? `Rp ${val} Miliar` : `Rp${val}M`} 
  />;
}

export function ARRChart({ data }) {
  return <StandardAreaChart 
    data={data} 
    metricKey="arrB" 
    color="#6366f1" 
    nameEn="ARR" 
    nameId="ARR" 
    formatValue={(val, full) => full ? `Rp ${val} Miliar` : `Rp${val}M`} 
  />;
}

export function EBITDAChart({ data }) {
  return <StandardAreaChart 
    data={data} 
    metricKey="ebitdaB" 
    color="#f59e0b" 
    nameEn="EBITDA" 
    nameId="EBITDA" 
    formatValue={(val, full) => full ? `Rp ${val} Miliar` : `Rp${val}M`} 
  />;
}

export function CoopsChart({ data }) {
  return <StandardAreaChart 
    data={data} 
    metricKey="endingCoops" 
    color="#10b981" 
    nameEn="Active Coops" 
    nameId="Koperasi Aktif" 
    formatValue={(val) => `${val} Unit`} 
  />;
}
