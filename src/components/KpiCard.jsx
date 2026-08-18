import React from "react";

export default function KpiCard({ label, value, sublabel, accent }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.1em]">{label}</div>
      <div className={`mt-2 text-3xl font-semibold tracking-tight ${accent || "text-slate-900"}`}>{value}</div>
      {sublabel && <div className="mt-1 text-xs text-slate-400">{sublabel}</div>}
    </div>
  );
}