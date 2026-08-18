import React from "react";
import { ArrowDown, Database, Layers, Sparkles, LineChart } from "lucide-react";

const stages = [
  { icon: Database, title: "Custodians / Portfolio Sources", desc: "Financial institutions, held-away assets, custodian feeds and portfolio data" },
  { icon: Layers, title: "FLANKS AGGREGATE", desc: "Unified wealth-data aggregation across multi-custodian relationships", accent: true },
  { icon: Sparkles, title: "LUME", desc: "Data enrichment, reconciliation and quality foundation", accent: true },
  { icon: LineChart, title: "Downstream", desc: "CRM, reporting, advisory, analytics and AI" },
];

export default function SolutionJourney({ wedge, whyRelevant, expansion }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-col items-center gap-2">
        {stages.map((s, i) => (
          <React.Fragment key={s.title}>
            <div className={`w-full max-w-md rounded-xl border p-4 text-center ${s.accent ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
              <div className="flex items-center justify-center gap-2">
                <s.icon className={`h-4 w-4 ${s.accent ? "text-sky-300" : "text-slate-400"}`} />
                <span className="text-sm font-semibold tracking-tight">{s.title}</span>
              </div>
              <p className={`mt-1 text-xs ${s.accent ? "text-slate-300" : "text-slate-500"}`}>{s.desc}</p>
            </div>
            {i < stages.length - 1 && <ArrowDown className="h-4 w-4 text-slate-300" />}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Initial Wedge</div>
          <p className="mt-1 text-sm text-slate-700">{wedge || "To be confirmed via discovery — likely multi-custodian data aggregation."}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Why Relevant</div>
          <p className="mt-1 text-sm text-slate-700">{whyRelevant || "Hypothesised fit with the account's wealth-data complexity — to validate."}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Potential Expansion</div>
          <p className="mt-1 text-sm text-slate-700">{expansion || "Reconciliation, reporting and AI-ready data foundation — to validate."}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400">This is the likely Flanks proposition to test through discovery — not a confirmed customer requirement.</p>
    </div>
  );
}