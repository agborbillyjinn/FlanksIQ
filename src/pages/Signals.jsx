import React from "react";
import PageHeader from "@/components/PageHeader";
import { Radar } from "lucide-react";

export default function Signals() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <PageHeader title="Signals" subtitle="Transformation, AI, hiring, executive change and expansion signals captured against each account." demo />
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
          <Radar className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-700">Signal capture coming next</h3>
        <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
          Account signals will be populated as researched evidence is added to each account. Signal types include AI, Data Transformation, Salesforce, Hiring, Executive Change, M&A and Expansion.
        </p>
      </div>
    </div>
  );
}