import React from "react";
import { Link } from "react-router-dom";
import ScoreIndicator from "@/components/ScoreIndicator";

export default function AccountCard({ account }) {
  const a = account;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-semibold">
            {a.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <Link to={`/accounts/${a.id}`} className="font-semibold text-slate-900 hover:text-sky-700">{a.name}</Link>
            <div className="text-xs text-slate-400">{a.segment}</div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full ring-1 ring-slate-200 text-slate-500">{a.tier}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <div className="text-[11px] text-slate-400 mb-1">Flanks Fit</div>
          <ScoreIndicator score={a.flanksFitScore} />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 mb-1">Priority</div>
          <ScoreIndicator score={a.priorityScore} />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 mb-1">Timing</div>
          <ScoreIndicator score={a.timingScore} />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 mb-1">Access</div>
          <ScoreIndicator score={a.accessScore} />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="text-[11px] text-slate-400">Primary Trigger</div>
        <div className="text-sm text-slate-700 mt-0.5">{a.primaryTrigger}</div>
      </div>
    </div>
  );
}