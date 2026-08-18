import React from "react";
import EvidenceBadge from "@/components/intel/EvidenceBadge";
import Instructional from "@/components/intel/Instructional";

const relStyle = {
  COMPLEMENT: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  OVERLAP: "bg-amber-50 text-amber-700 ring-amber-200",
  COMPETITOR: "bg-rose-50 text-rose-700 ring-rose-200",
  UNKNOWN: "bg-slate-100 text-slate-600 ring-slate-200",
};

function Q({ label, value }) {
  return (
    <div>
      <div className="text-[11px] text-slate-400 uppercase tracking-wider">{label}</div>
      <p className="mt-1 text-sm text-slate-700 leading-relaxed">{value || "Not established — to be researched / validated."}</p>
    </div>
  );
}

export default function EcosystemOpportunityCard({ account }) {
  const eco = account.ecosystemOpportunity || {};
  const rel = account.ecosystemRelationshipType || "UNKNOWN";
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5">
          <EvidenceBadge type="HYPOTHESIS" label="ECOSYSTEM OPPORTUNITY" />
          <Instructional id="ecosystem-multiplier" />
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ring-1 uppercase tracking-wider ${relStyle[rel]}`}>{rel}</span>
        <span className="text-xs text-slate-400">Hypothesis — validate in ecosystem discovery.</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Q label="Why this organisation matters to Flanks" value={eco.whyMatter} />
        <Q label="Flanks capability to embed or introduce" value={eco.capability} />
        <Q label="Customer / workflow already owned" value={eco.ownedWorkflow} />
        <Q label="Downstream Flanks ICP reachable" value={eco.downstreamIcp} />
        <Q label="Potential distribution leverage" value={eco.distributionLeverage} />
        <Q label="Evidence supporting this" value={eco.evidence} />
      </div>
      <Q label="What needs validating" value={eco.needsValidating} />
      {eco.aiWealthtechThesis && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">AI / WealthTech thesis (hypothesis)</div>
          <p className="mt-1 text-sm text-slate-700 leading-relaxed">{eco.aiWealthtechThesis}</p>
        </div>
      )}
      {eco.commercialMotion && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider">Possible commercial motion</span>
          <span className="text-xs font-medium text-slate-800">{eco.commercialMotion}</span>
        </div>
      )}
    </div>
  );
}