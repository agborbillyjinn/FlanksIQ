import React from "react";

export function scoreColor(score) {
  if (score >= 80) return { text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200" };
  if (score >= 60) return { text: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200" };
  return { text: "text-rose-700", bg: "bg-rose-50", ring: "ring-rose-200" };
}

export default function ScoreIndicator({ score, size = "sm" }) {
  if (score == null) return <span className="text-xs text-slate-300">—</span>;
  const c = scoreColor(score);
  const dims = size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";
  return (
    <div className={`inline-flex items-center justify-center rounded-lg ${c.bg} ${c.text} ring-1 ${c.ring} font-semibold ${dims}`}>
      {score}
    </div>
  );
}