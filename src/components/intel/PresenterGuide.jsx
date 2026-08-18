import React, { useState, useEffect } from "react";
import { useDemoMode } from "@/lib/DemoModeContext";
import { presentSteps } from "@/components/intel/presentSteps";
import { ChevronDown, ChevronLeft, ChevronRight, X, Minus } from "lucide-react";

export default function PresenterGuide() {
  const demo = useDemoMode();
  const [sayOpen, setSayOpen] = useState(true);
  const [minimised, setMinimised] = useState(false);

  useEffect(() => { setSayOpen(true); }, [demo?.step]);

  if (!demo || !demo.active) return null;

  const total = presentSteps.length;
  const step = presentSteps[demo.step];
  const atFirst = demo.step === 0;
  const atLast = demo.step === total - 1;

  if (minimised) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMinimised(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 text-white text-xs shadow-lg hover:bg-slate-800"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
          Demo Guide · Step {demo.step + 1}/{total}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[320px] max-w-[calc(100vw-2rem)]">
      <div className="rounded-2xl border border-slate-700 bg-[#0b1220] text-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">Demo Guide</span>
            <span className="text-[11px] text-slate-400">Step {demo.step + 1} of {total}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setMinimised(true)} className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"><Minus className="h-3.5 w-3.5" /></button>
            <button onClick={demo.exit} className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"><X className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        <div className="px-4 py-3">
          <h3 className="text-sm font-semibold text-white">{step.title}</h3>

          <div className="mt-2">
            <button onClick={() => setSayOpen((o) => !o)} className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-sky-300 hover:text-sky-200">
              Say this <ChevronDown className={`h-3 w-3 transition-transform ${sayOpen ? "rotate-180" : ""}`} />
            </button>
            {sayOpen && (
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed whitespace-pre-line">{step.say}</p>
            )}
          </div>

          <div className="mt-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Presenter note</div>
            <p className="mt-1 text-[11px] text-slate-300 leading-relaxed">{step.note}</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/10 bg-white/5">
          <button onClick={demo.prev} disabled={atFirst} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent">
            <ChevronLeft className="h-3.5 w-3.5" /> Previous
          </button>
          <span className="text-[11px] text-slate-500">{atLast ? "End" : `${demo.step + 1} / ${total}`}</span>
          <button onClick={demo.next} disabled={atLast} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-sky-500 text-white hover:bg-sky-400 disabled:opacity-40">
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}