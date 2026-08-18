import React, { useEffect, useState } from "react";

export default function SectionNav({ showEcosystem = false }) {
  const items = [
    { id: "overview", label: "Overview" },
    ...(showEcosystem ? [{ id: "ecosystem", label: "Ecosystem" }] : []),
    { id: "why-now", label: "Why Now" },
    { id: "hypotheses", label: "Hypotheses" },
    { id: "solution", label: "Solution" },
    { id: "buyers", label: "Buyers" },
    { id: "routes", label: "Routes" },
    { id: "strategy", label: "Strategy" },
    { id: "meddpicc", label: "MEDDPICC" },
  ];
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-120px 0px -60% 0px" }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-0 z-30 py-2.5">
      <nav className="flex items-center gap-1 overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm p-1.5">
        {items.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => go(id)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${active === id ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}