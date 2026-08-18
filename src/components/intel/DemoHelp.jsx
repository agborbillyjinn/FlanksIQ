import React from "react";
import { X } from "lucide-react";

const scores = [
  ["Fit", "Is it structurally attractive?"],
  ["Timing", "Why now?"],
  ["Access", "How do I get in?"],
  ["Evidence", "How confident am I?"],
  ["Priority", "Should I spend time here now?"],
];

const evidence = [
  ["Fact", "supported"],
  ["Grounded", "researched"],
  ["Hypothesis", "validate"],
];

const coreStory = ["Market", "Prioritise", "Research", "Hypothesise", "Map Buyers", "Find Route", "Discover", "Qualify", "Act"];

export default function DemoHelp({ onClose }) {
  return (
    <div className="fixed bottom-6 left-6 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-700 bg-[#0b1220] text-slate-200 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
        <span className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">Demo Help</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="h-3.5 w-3.5" /></button>
      </div>
      <div className="px-4 py-3 space-y-3 text-xs">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Scores</div>
          <ul className="space-y-0.5">
            {scores.map(([k, v]) => (
              <li key={k}><span className="text-slate-200 font-medium">{k}</span> <span className="text-slate-400">= {v}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Evidence</div>
          <ul className="space-y-0.5">
            {evidence.map(([k, v]) => (
              <li key={k}><span className="text-slate-200 font-medium">{k}</span> <span className="text-slate-400">= {v}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Core story</div>
          <p className="text-[11px] text-slate-300 leading-relaxed">{coreStory.join(" → ")}</p>
        </div>
      </div>
    </div>
  );
}