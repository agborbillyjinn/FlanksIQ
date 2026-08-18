import React from "react";
import EvidenceBadge from "@/components/intel/EvidenceBadge";
import { Linkedin } from "lucide-react";

const roleLabels = {
  "Economic Buyer": "Economic Buyer",
  Champion: "Potential Champion",
  "Technical Buyer": "Technical Buyer",
  User: "User",
  Risk: "Risk / Security / Compliance",
  Commercial: "Commercial / Procurement",
  Influencer: "Influencer",
};

export default function CommitteeCard({ member }) {
  const identified = !!member.personName;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">{roleLabels[member.roleType] || member.roleType}</span>
        {identified ? <EvidenceBadge type="INFERENCE" /> : <EvidenceBadge type="HYPOTHESIS" label="PERSONA" />}
      </div>
      <div className="mt-3 flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-semibold shrink-0">
          {identified ? member.personName.slice(0, 2).toUpperCase() : "—"}
        </div>
        <div className="min-w-0">
          {identified ? (
            <>
              <div className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                {member.personName}
                {member.linkedinUrl && <a href={member.linkedinUrl} target="_blank" rel="noreferrer"><Linkedin className="h-3.5 w-3.5 text-sky-500" /></a>}
              </div>
              <div className="text-xs text-slate-500">{member.title}</div>
            </>
          ) : (
            <>
              <div className="text-sm font-medium text-slate-700">{member.title || "Likely persona"}</div>
              <div className="text-xs text-slate-400">Person: Not yet identified</div>
            </>
          )}
        </div>
      </div>
      {member.evidence && identified && (
        <p className="mt-3 text-xs text-slate-500">{member.evidence}</p>
      )}
      {member.influence != null && (
        <div className="mt-3 text-[11px] text-slate-400">Influence {member.influence}/100</div>
      )}
    </div>
  );
}