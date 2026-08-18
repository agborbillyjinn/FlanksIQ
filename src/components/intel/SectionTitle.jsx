import React from "react";

export default function SectionTitle({ index, title, subtitle }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        {index && <span className="text-[11px] font-semibold text-slate-400 tabular-nums">{index}</span>}
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
      </div>
      {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}