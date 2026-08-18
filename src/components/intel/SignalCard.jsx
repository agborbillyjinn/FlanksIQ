import React from "react";
import EvidenceBadge from "@/components/intel/EvidenceBadge";
import { ExternalLink } from "lucide-react";

const typeColors = {
  AI: "bg-violet-50 text-violet-700 border-violet-200",
  "Data Transformation": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Digital Transformation": "bg-blue-50 text-blue-700 border-blue-200",
  Salesforce: "bg-sky-50 text-sky-700 border-sky-200",
  Hiring: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Executive Change": "bg-amber-50 text-amber-700 border-amber-200",
  "M&A": "bg-rose-50 text-rose-700 border-rose-200",
  Expansion: "bg-teal-50 text-teal-700 border-teal-200",
  "New Product": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  Regulatory: "bg-orange-50 text-orange-700 border-orange-200",
  "Wealth Expansion": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Technology Modernisation": "bg-purple-50 text-purple-700 border-purple-200",
  Partnership: "bg-lime-50 text-lime-700 border-lime-200",
};

export default function SignalCard({ signal }) {
  const evType = signal.sourceUrl ? signal.evidenceType || "INFERENCE" : "DEMO";
  const typeClass = typeColors[signal.signalType] || "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${typeClass}`}>{signal.signalType}</span>
        <EvidenceBadge type={evType} />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900 leading-snug">{signal.headline}</h3>
      {signal.signalDate && <div className="mt-1 text-xs text-slate-400">{signal.signalDate}</div>}
      {signal.description && <p className="mt-2 text-sm text-slate-600 leading-relaxed">{signal.description}</p>}
      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
        {signal.commercialRelevance && (
          <div className="flex gap-2"><span className="text-slate-400 w-28 shrink-0">Commercial relevance</span><span className="text-slate-600">{signal.commercialRelevance}</span></div>
        )}
        <div className="flex gap-2"><span className="text-slate-400 w-28 shrink-0">Confidence</span><span className="text-slate-600">{signal.confidence != null ? `${signal.confidence}/100` : "Not established"}</span></div>
        <div className="flex gap-2 items-center"><span className="text-slate-400 w-28 shrink-0">Source</span>
          {signal.sourceUrl ? (
            <a href={signal.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700">{signal.sourceName || "View source"} <ExternalLink className="h-3 w-3" /></a>
          ) : (
            <span className="text-slate-400">No source — demo</span>
          )}
        </div>
      </div>
    </div>
  );
}