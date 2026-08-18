import React from "react";
import PageHeader from "@/components/PageHeader";
import { Target } from "lucide-react";

export default function AccountStrategy() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <PageHeader title="Account Strategy" subtitle="AI-generated account theses, pain hypotheses, entry personas and MEDDPICC for each priority account." demo />
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
          <Target className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-700">Account strategy generation coming next</h3>
        <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
          Each priority account will receive a generated thesis, why-now rationale, recommended entry persona, Flanks wedge, expansion path and discovery questions.
        </p>
      </div>
    </div>
  );
}