import React from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

const toggleFilters = [
  { key: "flanksFit80", label: "Flanks Fit > 80" },
  { key: "activeTrigger", label: "Active Trigger" },
  { key: "aiInitiative", label: "AI Initiative" },
  { key: "salesforce", label: "Salesforce" },
  { key: "highDataComplexity", label: "High Data Complexity" },
  { key: "executiveChange", label: "Executive Change" },
  { key: "expansion", label: "Expansion" },
  { key: "partnerRoute", label: "Partner Route" },
];

const segments = [
  "All Segments",
  "Wealth Manager",
  "Private Bank",
  "Multi-Family Office",
  "Asset Manager",
  "Pension / Financial Platform",
  "WealthTech",
  "Embedded Wealth / FinTech",
  "AI-Native Financial Services",
];

export default function FilterBar({ segment, setSegment, toggles, toggle, gtmMotion, setGtmMotion }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 mr-1">
        <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
      </div>
      <div className="relative">
        <select
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          className="appearance-none text-xs bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          {segments.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
      <div className="relative">
        <select
          value={gtmMotion}
          onChange={(e) => setGtmMotion(e.target.value)}
          className="appearance-none text-xs bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          {["All", "Direct", "Embedded", "Ecosystem", "Partner"].map((g) => (
            <option key={g} value={g}>{g === "All" ? "All Motions" : g}</option>
          ))}
        </select>
        <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
      {toggleFilters.map((f) => {
        const active = !!toggles[f.key];
        return (
          <button
            key={f.key}
            onClick={() => toggle(f.key)}
            className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
              active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}