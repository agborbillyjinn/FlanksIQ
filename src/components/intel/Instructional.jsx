import React, { useState } from "react";
import { useDemoMode } from "@/lib/DemoModeContext";
import { instructionals } from "@/lib/demoInstructionals";

function Field({ label, value, tone }) {
  const toneClass =
    tone === "say" ? "text-slate-700"
    : tone === "warn" ? "text-rose-600"
    : tone === "next" ? "text-sky-700"
    : "text-slate-600";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <p className={`mt-0.5 leading-relaxed ${toneClass}`}>{value}</p>
    </div>
  );
}

export default function Instructional({ id, size = "sm" }) {
  const demo = useDemoMode();
  const [open, setOpen] = useState(false);
  if (!demo || !demo.active) return null;
  const content = instructionals[id];
  if (!content) return null;
  return (
    <span className="relative inline-flex align-middle">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); }}
        className={`inline-flex items-center justify-center rounded-full border border-sky-300 bg-white text-sky-600 hover:bg-sky-50 transition-colors ${size === "sm" ? "h-4 w-4 text-[10px] leading-none" : "h-5 w-5 text-xs"}`}
        title={content.title}
        aria-label={`Demo guidance: ${content.title}`}
      >
        ?
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 left-1/2 -translate-x-1/2 top-6 w-72 rounded-xl border border-slate-200 bg-white shadow-xl p-4 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">{content.title}</span>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              {content.what && <Field label="What this is" value={content.what} />}
              {content.why && <Field label="Why it matters" value={content.why} />}
              {content.say && <Field label="What to say" value={content.say} tone="say" />}
              {content.dontSay && <Field label="Do not say" value={content.dontSay} tone="warn" />}
              {content.nextAction && <Field label="Next action" value={content.nextAction} tone="next" />}
            </div>
          </div>
        </>
      )}
    </span>
  );
}