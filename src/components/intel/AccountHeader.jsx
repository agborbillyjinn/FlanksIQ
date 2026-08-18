import React from "react";
import ScoreCard from "@/components/intel/ScoreCard";
import { ExternalLink, MapPin, RefreshCw, Sparkles, Loader2, Play } from "lucide-react";
import Instructional from "@/components/intel/Instructional";

export default function AccountHeader({ account, onRefresh, onGenerate, onPresent, refreshing, generating, strategy }) {
  const live = account.dataSource === "live";
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-lg font-semibold shrink-0">
          {account.name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{account.name}</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full ring-1 ring-indigo-200 bg-indigo-50 text-indigo-700 uppercase tracking-wider">{account.tier}</span>
            {account.gtmMotion && account.gtmMotion !== "Direct" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200 uppercase tracking-wider">{account.gtmMotion}</span>
            )}
            {live ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 uppercase tracking-wider">Live research</span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 uppercase tracking-wider">Demo data</span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>{account.segment}</span>
            {account.headquarters && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{account.headquarters}</span>}
            {account.website && (
              <a href={account.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700">
                {account.domain || "Website"} <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          {live && (
            <div className="mt-1.5 text-xs text-slate-400">
              Last analysed: {account.researchedAt ? new Date(account.researchedAt).toLocaleString("en-GB") : "—"}
              {account.sourcesCount != null && ` · Sourced findings: ${account.sourcesCount}`}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
        <ScoreCard label="Flanks Fit" score={account.flanksFitScore} instructionalId="score-flanksFit" />
        <ScoreCard label="Timing" score={account.timingScore} instructionalId="score-timing" />
        <ScoreCard label="Access" score={account.accessScore} instructionalId="score-access" />
        <ScoreCard label="Evidence" score={account.evidenceConfidence} instructionalId="score-evidence" />
        <ScoreCard label="Priority" score={account.priorityScore} emphasis instructionalId="score-priority" />
      </div>
      <p className="mt-3 text-xs text-slate-400 max-w-2xl">
        Priority combines structural fit, timing, route-to-account and evidence confidence to help focus AE attention. This is a sales prioritisation framework, not a scientifically validated model.
      </p>
      <div className="mt-5 flex items-center gap-2 flex-wrap">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs hover:border-slate-300 hover:text-slate-900 disabled:opacity-60 transition-colors"
        >
          {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          {refreshing ? "Refreshing…" : "Refresh Research"}
        </button>
        <span className="inline-flex items-center gap-1">
          <button
            onClick={onGenerate}
            disabled={generating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs hover:border-slate-300 hover:text-slate-900 disabled:opacity-60 transition-colors"
          >
            {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {generating ? "Generating…" : strategy ? "Regenerate Strategy" : "Generate Strategy"}
          </button>
          <Instructional id="generate-strategy" />
        </span>
        <button
          onClick={onPresent}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs hover:bg-slate-800 transition-colors ml-auto"
        >
          <Play className="h-3.5 w-3.5" /> Present
        </button>
      </div>
    </div>
  );
}