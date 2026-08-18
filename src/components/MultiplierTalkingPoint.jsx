import React, { useState } from "react";
import { Lightbulb, ChevronDown } from "lucide-react";

export default function MultiplierTalkingPoint() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6 rounded-xl border border-dashed border-slate-300 bg-white/60">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
          Presenter talking point · Multiplier thesis (optional, not part of the standard demo)
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-slate-700 leading-relaxed">"Beyond direct ICP, I've also started testing multiplier accounts — organisations that already own the technology workflow or customer relationship. The question is whether one Flanks integration could create access to multiple downstream wealth institutions."</p>
          <div className="rounded-lg bg-amber-50/60 border border-amber-100 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-amber-700">Presenter note</div>
            <p className="mt-1 text-xs text-slate-600">Use Salesforce as the easiest conceptual example.</p>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">Then ask: "Is that already part of how you're thinking about UK GTM, or is the focus currently much more direct?"</p>
          <p className="text-[11px] text-slate-400">Do not imply this is a strategy Flanks has not already considered.</p>
        </div>
      )}
    </div>
  );
}