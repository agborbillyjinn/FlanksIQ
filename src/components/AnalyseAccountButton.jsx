import React, { useState } from "react";
import ResearchModal from "@/components/ResearchModal";
import { Plus } from "lucide-react";

export default function AnalyseAccountButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shrink-0"
      >
        <Plus className="h-4 w-4" /> Analyse New Account
      </button>
      {open && <ResearchModal onClose={() => setOpen(false)} />}
    </>
  );
}