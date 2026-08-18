import React from "react";
import EvidenceBadge from "@/components/intel/EvidenceBadge";

const routeIcons = {
  DIRECT: "Direct",
  SALESFORCE: "Salesforce",
  PARTNER: "Partner",
  TECHNOLOGY: "Technology",
  EVENT: "Event",
  "EXISTING RELATIONSHIP": "Existing Relationship",
};

export default function RouteCard({ route }) {
  const hasEvidence = !!(route.routeDescription || route.organisation || route.person);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">{routeIcons[route.routeType] || route.routeType}</span>
        {route.routeStatus === "verified" ? <EvidenceBadge type="FACT" label="VERIFIED ROUTE" /> : <EvidenceBadge type="DEMO" label="ROUTE TO INVESTIGATE" />}
      </div>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{route.routeDescription || "Route to investigate — no evidence of an existing relationship yet."}</p>
      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
        <div className="flex gap-2"><span className="text-slate-400 w-24 shrink-0">Person / org</span><span className="text-slate-600">{route.organisation || route.person || "Not established"}</span></div>
        <div className="flex gap-2"><span className="text-slate-400 w-24 shrink-0">Confidence</span><span className="text-slate-600">{route.confidence != null ? `${route.confidence}/100` : "Not established"}</span></div>
      </div>
      {route.recommendedAction && (
        <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Recommended action</div>
          <p className="mt-1 text-sm text-slate-700">{route.recommendedAction}</p>
        </div>
      )}
    </div>
  );
}