import React from "react";
import { scoreColor } from "@/components/ScoreIndicator";
import Instructional from "@/components/intel/Instructional";

export default function ScoreCard({ label, score, emphasis, instructionalId }) {
  const c = scoreColor(score);
  if (emphasis) {
    return (
      <div className="rounded-xl border border-slate-900 bg-slate-900 p-4">
        <div className="text-[11px] uppercase tracking-[0.1em] text-slate-300 flex items-center gap-1">{label} {instructionalId && <Instructional id={instructionalId} />}</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight text-white">{score}</div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[11px] uppercase tracking-[0.1em] text-slate-500 flex items-center gap-1">{label} {instructionalId && <Instructional id={instructionalId} />}</div>
      <div className={`mt-1 text-2xl font-semibold tracking-tight ${c.text}`}>{score}</div>
    </div>
  );
}