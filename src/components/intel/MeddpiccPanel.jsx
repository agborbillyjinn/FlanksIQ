import React from "react";
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

export default function MeddpiccPanel({ strategy }) {
  const med = strategy?.meddpicc || {};
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <EvidenceBadge type="HYPOTHESIS" label="AI-GENERATED" />
        <h3 className="text-sm font-semibold text-slate-900">MEDDPICC</h3>
        <span className="text-xs text-slate-400">Known · Hypothesised · Unknown</span>
      </div>
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
  );
}