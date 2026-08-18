import React, { useState } from "react";
import ResearchModal from "@/components/ResearchModal";
import Instructional from "@/components/intel/Instructional";
import { useDemoMode } from "@/lib/DemoModeContext";
import { Plus } from "lucide-react";

export default function AnalyseAccountButton() {
  const [open, setOpen] = useState(false);
  const demo = useDemoMode();
  return (
    <div className="inline-flex items-center gap-2 shrink-0">
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
      >
        <Plus className="h-4 w-4" /> Analyse New Account
      </button>
      <Instructional id="analyse-new-account" />
      {demo && demo.active && (
        <span className="text-[10px] text-rose-500 uppercase tracking-wider hidden sm:inline">Not during walkthrough</span>
      )}
      {open && <ResearchModal onClose={() => setOpen(false)} />}
    </div>
  );
}