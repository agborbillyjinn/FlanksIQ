import React from "react";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import ScoreIndicator, { scoreColor } from "@/components/ScoreIndicator";

const tierStyles = {
  "Tier 1": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "Tier 2": "bg-slate-100 text-slate-600 ring-slate-200",
  "Tier 3": "bg-slate-50 text-slate-400 ring-slate-200",
};

export default function PriorityAccountsTable({ accounts, sortBy, onSort }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-left text-[11px] text-slate-500 uppercase tracking-[0.08em]">
              <th className="px-5 py-3 font-medium">Account</th>
              <th className="px-4 py-3 font-medium">Segment</th>
              <th className="px-4 py-3 font-medium">Flanks Fit</th>
              <th className="px-4 py-3 font-medium">Timing</th>
              <th className="px-4 py-3 font-medium">Access</th>
              <th className="px-4 py-3 font-medium">Evidence</th>
              <th className="px-4 py-3 font-medium cursor-pointer select-none" onClick={onSort}>
                <span className="inline-flex items-center gap-1">
                  Priority Score <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="px-4 py-3 font-medium">Primary Trigger</th>
              <th className="px-5 py-3 font-medium">Recommended Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accounts.map((a) => {
              const fit = scoreColor(a.priorityScore);
              return (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-semibold">
                        {a.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 flex items-center gap-1.5">
                          {a.name}
                          {a.website && (
                            <a href={a.website} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3 w-3 text-slate-300 hover:text-slate-500" />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{a.subsegment || a.headquarters}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-xs text-slate-600">{a.segment}</span></td>
                  <td className="px-4 py-3.5"><ScoreIndicator score={a.flanksFitScore} /></td>
                  <td className="px-4 py-3.5"><ScoreIndicator score={a.timingScore} /></td>
                  <td className="px-4 py-3.5"><ScoreIndicator score={a.accessScore} /></td>
                  <td className="px-4 py-3.5"><ScoreIndicator score={a.evidenceConfidence} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center h-9 w-9 rounded-lg ${fit.bg} ${fit.text} ring-1 ${fit.ring} text-sm font-semibold`}>
                        {a.priorityScore}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ring-1 ${tierStyles[a.tier] || tierStyles["Tier 3"]}`}>{a.tier}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-xs text-slate-600">{a.primaryTrigger}</span></td>
                  <td className="px-5 py-3.5"><span className="text-xs text-slate-500">{a.recommendedAction}</span></td>
                </tr>
              );
            })}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-sm text-slate-400">No accounts match the current filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}