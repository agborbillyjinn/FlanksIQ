import React from "react";
import EvidenceBadge from "@/components/intel/EvidenceBadge";
import Instructional from "@/components/intel/Instructional";

export default function PainHypothesisCard({ hypothesis }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5">
          <EvidenceBadge type="HYPOTHESIS" label="HYPOTHESIS — VALIDATE" />
          <Instructional id="pain-hypothesis" />
        </span>
        {hypothesis.confidence != null && <span className="text-xs text-slate-400">Confidence {hypothesis.confidence}/100</span>}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{hypothesis.hypothesis}</h3>
      {hypothesis.reason && (
        <div className="mt-3">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Why we think this</div>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{hypothesis.reason}</p>
        </div>
      )}
      <div className="mt-3">
        <div className="text-[11px] text-slate-400 uppercase tracking-wider">Supporting evidence</div>
        <p className="mt-1 text-sm text-slate-600">{hypothesis.evidence || "No supporting evidence yet — to be sourced."}</p>
      </div>
      {hypothesis.discoveryQuestion && (
        <div className="mt-3 p-3 rounded-lg bg-amber-50/60 border border-amber-100">
          <div className="text-[11px] text-amber-700 uppercase tracking-wider">Discovery question</div>
          <p className="mt-1 text-sm text-slate-700 italic">"{hypothesis.discoveryQuestion}"</p>
        </div>
      )}
    </div>
  );
}