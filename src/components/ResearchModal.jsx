import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { X, Loader2, CheckCircle2, Sparkles } from "lucide-react";

const steps = [
  "Researching public sources…",
  "Identifying company profile…",
  "Finding strategic initiatives…",
  "Finding technology and transformation signals…",
  "Identifying relevant executives…",
  "Evaluating Flanks fit…",
  "Generating sales hypotheses…",
  "Building account intelligence…",
];

export default function ResearchModal({ onClose }) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [focusIdx, setFocusIdx] = useState(0);
  const navigate = useNavigate();

  const submit = async () => {
    if (!name.trim() || !domain.trim()) return;
    setStatus("researching");
    setError(null);
    setFocusIdx(0);
    const interval = setInterval(() => setFocusIdx((i) => Math.min(i + 1, steps.length - 1)), 2600);
    try {
      const res = await base44.functions.invoke("researchAccount", {
        name: name.trim(),
        domain: domain.trim(),
      });
      clearInterval(interval);
      const accountId = res.data?.accountId || res.data?.account?.id;
      if (!accountId) {
        setStatus("error");
        setError(res.data?.error || "No account returned.");
        return;
      }
      setStatus("done");
      setFocusIdx(steps.length - 1);
      setTimeout(() => {
        onClose();
        navigate(`/accounts/${accountId}`);
      }, 800);
    } catch (e) {
      clearInterval(interval);
      setStatus("error");
      setError("Research temporarily unavailable. Please retry.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-sky-300" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Analyse New Account</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {status === "idle" && (
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500">Company name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. RBC Brewin Dolphin"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Company website / domain *</label>
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. brewin.co.uk"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <button
              onClick={submit}
              disabled={!name.trim() || !domain.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <Sparkles className="h-4 w-4" /> Research Account
            </button>
            <p className="text-[11px] text-slate-400 text-center">Live internet-grounded research · AI proposes. Evidence proves. Sales validates.</p>
          </div>
        )}

        {(status === "researching" || status === "done") && (
          <div className="px-6 py-6">
            <div className="mb-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className={`h-full bg-slate-900 ${status === "done" ? "w-full" : "w-1/3 animate-pulse"}`} />
            </div>
            <div className="space-y-2.5">
              {steps.map((s, i) => {
                const done = status === "done";
                const current = status === "researching" && i === focusIdx;
                return (
                  <div key={i} className="flex items-center gap-3">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : current ? (
                      <Loader2 className="h-4 w-4 text-slate-700 animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-200 shrink-0" />
                    )}
                    <span className={`text-sm ${done ? "text-slate-700" : current ? "text-slate-900 font-medium" : "text-slate-400"}`}>{s}</span>
                  </div>
                );
              })}
            </div>
            {status === "done" && (
              <p className="mt-4 text-xs text-emerald-600 font-medium">Account intelligence ready — opening…</p>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="px-6 py-6 text-center">
            <p className="text-sm font-medium text-rose-700">{error}</p>
            <button onClick={() => setStatus("idle")} className="mt-4 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:border-slate-300">
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}