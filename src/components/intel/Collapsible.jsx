import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Collapsible({ title, defaultOpen = false, children, hint }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-6 py-3.5">
        <span className="text-sm font-semibold text-slate-900">{title}</span>
        <span className="flex items-center gap-2 text-xs text-slate-400">
          {hint && <span>{hint}</span>}
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}