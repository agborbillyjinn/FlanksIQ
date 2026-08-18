import React, { useState } from "react";
import EvidenceBadge from "@/components/intel/EvidenceBadge";

const meddpiccRows = [
  { key: "metrics", label: "Metrics" },
  { key: "economicBuyer", label: "Economic Buyer" },
  { key: "decisionCriteria", label: "Decision Criteria" },
  { key: "decisionProcess", label: "Decision Process" },
  { key: "paperProcess", label: "Paper Process" },
  { key: "identifyPain", label: "Identify Pain" },
  { key: "champion", label: "Champion" },
  { key: "competition", label: "Competition" },
];

function Field({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="text-[11px] text-slate-400 uppercase tracking-wider">{label}</div>
      <p className="mt-1 text-sm text-slate-700 leading-relaxed">{value || "Not established"}</p>
    </div>
  );
}

export default function AccountStrategyPanel({ strategy }) {
  const [tab, setTab] = useState("email");
  const s = strategy;
  const med = s.meddpicc || {};

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <EvidenceBadge type="HYPOTHESIS" label="AI-GENERATED HYPOTHESIS" />
          <span className="text-xs text-slate-400">Generated {s.generatedAt ? new Date(s.generatedAt).toLocaleDateString("en-GB") : ""}</span>
        </div>
        <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Account Thesis</div>
          <p className="mt-1 text-sm text-slate-800 leading-relaxed">{s.accountThesis}</p>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Why Now" value={s.whyNow} />
          <Field label="Primary Pain To Validate" value={s.primaryPain} />
          <Field label="Best Entry Persona" value={s.bestEntryPersona} />
          <Field label="Commercial Trigger" value={s.commercialTrigger} />
          <Field label="Flanks Wedge" value={s.flanksWedge} />
          <Field label="Expansion Path" value={s.expansionPath} />
          <Field label="Best Relationship Route" value={s.relationshipRoute} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Discovery Questions</h3>
        <ol className="space-y-2">
          {(s.discoveryQuestions || []).map((q, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-700">
              <span className="text-slate-400 tabular-nums shrink-0">{i + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Outreach</h3>
        <div className="flex gap-1 mb-4 border-b border-slate-200">
          {[{ k: "email", l: "Email" }, { k: "linkedin", l: "LinkedIn" }, { k: "call", l: "Call Opener" }].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`px-3 py-2 text-sm border-b-2 -mb-px transition-colors ${tab === t.k ? "border-slate-900 text-slate-900 font-medium" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              {t.l}
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          {tab === "email" && <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{s.emailOutreach}</p>}
          {tab === "linkedin" && <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{s.linkedinOutreach}</p>}
          {tab === "call" && <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{s.callOpener}</p>}
        </div>
        <p className="mt-2 text-xs text-slate-400">Outreach references hypotheses, not established facts — confirm details in discovery.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">MEDDPICC</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-2 pr-4 font-medium">Category</th>
                <th className="py-2 pr-4 font-medium">Known</th>
                <th className="py-2 pr-4 font-medium">Hypothesised</th>
                <th className="py-2 font-medium">Unknown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {meddpiccRows.map((r) => {
                const cell = med[r.key] || {};
                return (
                  <tr key={r.key}>
                    <td className="py-3 pr-4 font-medium text-slate-700 align-top">{r.label}</td>
                    <td className="py-3 pr-4 text-slate-600 align-top">{cell.known || "—"}</td>
                    <td className="py-3 pr-4 text-slate-600 align-top">{cell.hypothesised || "—"}</td>
                    <td className="py-3 text-slate-500 align-top">{cell.unknown || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-900 bg-slate-900 p-5">
        <div className="text-[11px] text-slate-300 uppercase tracking-wider">Recommended Next Action</div>
        <p className="mt-1 text-sm text-white font-medium leading-relaxed">{s.nextAction}</p>
      </div>
    </div>
  );
}