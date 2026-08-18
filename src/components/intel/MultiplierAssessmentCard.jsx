import React from "react";

export default function MultiplierAssessmentCard({ account }) {
  const ma = account.multiplierAssessment;
  if (!ma) return null;
  const dims = ma.dimensions || [];
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Multiplier Potential</h3>
          <p className="text-xs text-slate-400">Distribution value — not a replacement for Flanks Fit.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-slate-900">{ma.normalized}<span className="text-sm text-slate-400">/100</span></div>
        </div>
      </div>
      <div className="space-y-2.5">
        {dims.map((d) => (
          <div key={d.name} className="flex items-center gap-3">
            <div className="w-44 text-xs text-slate-600 shrink-0">{d.name}</div>
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(d.score / 10) * 100}%` }} />
            </div>
            <div className="w-10 text-right text-xs text-slate-500 tabular-nums">{d.score}/10</div>
          </div>
        ))}
      </div>
    </div>
  );
}