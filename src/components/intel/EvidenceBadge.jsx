import React from "react";

const styles = {
  VERIFIED_FACT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FACT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  GROUNDED_FINDING: "bg-sky-50 text-sky-700 border-sky-200",
  INFERENCE: "bg-sky-50 text-sky-700 border-sky-200",
  HYPOTHESIS: "bg-amber-50 text-amber-700 border-amber-200",
  DEMO: "bg-slate-50 text-slate-500 border-dashed border-slate-300",
};

const labels = {
  VERIFIED_FACT: "VERIFIED FACT",
  FACT: "VERIFIED FACT",
  GROUNDED_FINDING: "GROUNDED FINDING",
  INFERENCE: "GROUNDED FINDING",
  HYPOTHESIS: "HYPOTHESIS — VALIDATE",
  DEMO: "DEMO DATA",
};

export default function EvidenceBadge({ type, label }) {
  const text = label || labels[type] || "DEMO DATA";
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-[0.1em] ${styles[type] || styles.DEMO}`}>
      {text}
    </span>
  );
}