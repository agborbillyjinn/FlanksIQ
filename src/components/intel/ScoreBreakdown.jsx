import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

function Dimension({ dim }) {
  return (
    <div className="py-2 border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-700">{dim.name}</span>
        <span className="text-xs text-slate-500 tabular-nums">{dim.score}/{dim.maximumScore}</span>
      </div>
      {dim.reason && <p className="mt-1 text-xs text-slate-500 leading-relaxed">{dim.reason}</p>}
      <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-400">
        {dim.level && <span className="uppercase tracking-wider">{dim.level}</span>}
        {dim.confidence != null && <span>Confidence {dim.confidence}/100</span>}
      </div>
    </div>
  );
}

function ScoreGroup({ title, group, max }) {
  if (!group) return null;
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-slate-900">{title}</span>
        <span className="text-xs text-slate-500 tabular-nums">{group.raw}/{max} → {group.normalized}</span>
      </div>
      <div>
        {(group.dimensions || []).map((d) => (
          <Dimension key={d.name} dim={d} />
        ))}
      </div>
    </div>
  );
}

export default function ScoreBreakdown({ breakdown }) {
  const [open, setOpen] = useState(false);
  if (!breakdown) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-5 py-3.5">
        <span className="text-sm font-semibold text-slate-900">How scores were calculated</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ScoreGroup title="Flanks Fit (60)" group={breakdown.flanksFit} max={60} />
            <ScoreGroup title="Timing (25)" group={breakdown.timing} max={25} />
            <ScoreGroup title="Access (15)" group={breakdown.access} max={15} />
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">Opportunity Priority</div>
            <p className="text-xs text-slate-500">Priority = 45% Flanks Fit + 30% Timing + 15% Access + 10% Evidence Confidence</p>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600">
              <div>Flanks Fit: {breakdown.priority?.flanksFit}</div>
              <div>Timing: {breakdown.priority?.timing}</div>
              <div>Access: {breakdown.priority?.access}</div>
              <div>Evidence: {breakdown.priority?.evidenceConfidence}</div>
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">Priority Score: {breakdown.priority?.score}</div>
            <div className="mt-2 text-xs text-slate-500">
              Evidence Confidence: {breakdown.evidenceConfidence?.score}/100 — {breakdown.evidenceConfidence?.reason}
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Scores are a sales prioritisation framework, not a scientifically validated model. No evidence = conservative score.</p>
        </div>
      )}
    </div>
  );
}