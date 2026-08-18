import React from "react";
import { useDemoMode } from "@/lib/DemoModeContext";
import { ArrowRight, Star } from "lucide-react";

export default function DemoCallout({ demoAccount }) {
  const demo = useDemoMode();
  if (!demo || !demo.active || demo.step !== 0 || !demoAccount) return null;
  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3">
      <div className="h-9 w-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
        <Star className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-sky-700 font-semibold">Next step</div>
        <div className="text-sm font-medium text-slate-800">Open {demoAccount.name}</div>
        <p className="text-xs text-slate-500">This is the prepared live-research account and contains the complete evidence → hypothesis → strategy workflow.</p>
      </div>
      <button
        onClick={() => demo.openDemoAccount(demoAccount.id)}
        className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs hover:bg-slate-800 shrink-0"
      >
        Open <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}