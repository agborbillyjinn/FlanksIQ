import React from "react";
import { useDemoMode } from "@/lib/DemoModeContext";
import { Presentation, LayoutDashboard, Building2, X } from "lucide-react";

export default function PresentStartModal({ open, onClose, accountId }) {
  const demo = useDemoMode();
  if (!open) return null;

  const choose = (fromDashboard) => {
    demo.start(fromDashboard, accountId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Presentation className="h-4 w-4 text-sky-300" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Present FlanksIQ</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          <p className="text-xs text-slate-500">Private presenter guide for demonstrating FlanksIQ during an interview. The application stays fully visible and interactive.</p>
          <button
            onClick={() => choose(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors"
          >
            <LayoutDashboard className="h-5 w-5 text-slate-500 shrink-0" />
            <div>
              <div className="text-sm font-medium text-slate-900">Start from Dashboard</div>
              <div className="text-xs text-slate-500">Begins at the UK Territory overview.</div>
            </div>
          </button>
          <button
            onClick={() => choose(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors"
          >
            <Building2 className="h-5 w-5 text-slate-500 shrink-0" />
            <div>
              <div className="text-sm font-medium text-slate-900">Start from This Account</div>
              <div className="text-xs text-slate-500">Begins at the account header and scores.</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}