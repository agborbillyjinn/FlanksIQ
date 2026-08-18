import React from "react";
import PageHeader from "@/components/PageHeader";

const tiers = [
  {
    label: "FACT",
    color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    desc: "Established from public evidence with a source URL and confidence rating. Verifiable and citable.",
  },
  {
    label: "INFERENCE",
    color: "bg-sky-50 text-sky-700 ring-sky-200",
    desc: "A reasoned conclusion drawn from one or more facts. Plausible but not yet confirmed by the account.",
  },
  {
    label: "HYPOTHESIS",
    color: "bg-amber-50 text-amber-700 ring-amber-200",
    desc: "An AI-generated proposition to be validated through sales discovery. Explicitly marked as unproven.",
  },
];

export default function DataEvidence() {
  return (
    <div className="px-8 py-8 max-w-[1100px] mx-auto">
      <PageHeader title="Data & Evidence" subtitle="The evidence model behind FlanksIQ. AI generates hypotheses — public evidence establishes facts — sales discovery validates." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {tiers.map((t) => (
          <div key={t.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ${t.color} uppercase tracking-[0.12em]`}>{t.label}</span>
            <p className="mt-3 text-sm text-slate-600">{t.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-900">Core principle</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          FlanksIQ separates what is known from what is assumed. Every claim is tagged as a fact, inference or hypothesis so that outreach is grounded in evidence and discovery questions target the assumptions that still need validating. Scores are sales prioritisation frameworks, not scientifically proven metrics.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 uppercase tracking-[0.12em]">Demo data</span>
          <span className="text-xs text-slate-400">Current account data is illustrative placeholder content and will be replaced with researched evidence.</span>
        </div>
      </div>
    </div>
  );
}