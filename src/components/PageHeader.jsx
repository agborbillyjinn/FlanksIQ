import React from "react";

export default function PageHeader({ title, subtitle, demo }) {
  return (
    <div className="mb-7">
      {demo && (
        <span className="inline-block mb-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 uppercase tracking-[0.12em]">
          Demo data
        </span>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500 max-w-2xl">{subtitle}</p>}
    </div>
  );
}