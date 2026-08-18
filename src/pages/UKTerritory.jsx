import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import KpiCard from "@/components/KpiCard";
import FilterBar from "@/components/FilterBar";
import PriorityAccountsTable from "@/components/PriorityAccountsTable";
import PageHeader from "@/components/PageHeader";
import AnalyseAccountButton from "@/components/AnalyseAccountButton";
import MultiplierTalkingPoint from "@/components/MultiplierTalkingPoint";
import DemoCallout from "@/components/intel/DemoCallout";
import Instructional from "@/components/intel/Instructional";
import { useDemoMode } from "@/lib/DemoModeContext";

export default function UKTerritory() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [segment, setSegment] = useState("All Segments");
  const [toggles, setToggles] = useState({});
  const [sortDesc, setSortDesc] = useState(true);
  const [gtmMotion, setGtmMotion] = useState("All");

  useEffect(() => {
    base44.entities.Account.list("-priorityScore", 100)
      .then(setAccounts)
      .finally(() => setLoading(false));
  }, []);

  const toggle = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  const filtered = useMemo(() => {
    let list = [...accounts];
    if (gtmMotion !== "All") {
      list = list.filter((a) => (gtmMotion === "Direct" ? (a.gtmMotion === "Direct" || !a.gtmMotion) : a.gtmMotion === gtmMotion));
    }
    if (segment !== "All Segments") list = list.filter((a) => a.segment === segment);
    if (toggles.flanksFit80) list = list.filter((a) => a.flanksFitScore > 80);
    if (toggles.activeTrigger) list = list.filter((a) => a.activeTrigger);
    if (toggles.aiInitiative) list = list.filter((a) => a.aiInitiativeDetected);
    if (toggles.salesforce) list = list.filter((a) => a.salesforceDetected);
    if (toggles.highDataComplexity) list = list.filter((a) => a.highDataComplexity);
    if (toggles.executiveChange) list = list.filter((a) => /executive|leadership|appoint|ceo|cio/i.test(a.primaryTrigger || ""));
    if (toggles.expansion) list = list.filter((a) => /expansion|launch|hire|hiring|growth/i.test(a.primaryTrigger || ""));
    if (toggles.partnerRoute) list = list.filter((a) => /partner/i.test(a.recommendedAction || ""));
    list.sort((a, b) => (sortDesc ? b.priorityScore - a.priorityScore : a.priorityScore - b.priorityScore));
    return list;
  }, [accounts, segment, toggles, sortDesc, gtmMotion]);

  const demo = useDemoMode();
  const demoAccount = accounts.find((a) => a.isDemoAccount) || null;

  const kpis = useMemo(
    () => ({
      total: accounts.length,
      icp: accounts.length,
      highFit: accounts.filter((a) => a.flanksFitScore > 80).length,
      activeTriggers: accounts.filter((a) => a.activeTrigger).length,
      tier1: accounts.filter((a) => a.tier === "Tier 1").length,
      multiplier: accounts.filter((a) => a.gtmMotion && a.gtmMotion !== "Direct").length,
    }),
    [accounts]
  );

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="UK Territory Intelligence"
          subtitle="Evidence-led account prioritisation for the UK wealth market."
          demo
        />
        <AnalyseAccountButton />
      </div>

      <div id="territory-scores" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 scroll-mt-32">
        <KpiCard label="Total Accounts" value={loading ? "—" : kpis.total} sublabel="UK ICP universe" />
        <KpiCard label="ICP Qualified" value={loading ? "—" : kpis.icp} sublabel="Segment-matched" accent="text-slate-900" />
        <KpiCard label="High Fit" value={loading ? "—" : kpis.highFit} sublabel="Flanks Fit > 80" accent="text-emerald-600" />
        <KpiCard label="Active Triggers" value={loading ? "—" : kpis.activeTriggers} sublabel="Buying signals live" accent="text-amber-600" />
        <KpiCard label="Tier 1 Accounts" value={loading ? "—" : kpis.tier1} sublabel="Top priority" accent="text-indigo-600" />
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="h-9 w-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-semibold shrink-0">M</div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1">Multiplier Opportunities <Instructional id="ecosystem-multiplier" /></div>
          <div className="text-sm font-medium text-slate-700">{loading ? "—" : `${kpis.multiplier} embedded / ecosystem / partner accounts`}</div>
        </div>
        <span className="ml-auto text-xs text-slate-400 hidden sm:block">Distribution value — one platform → many institutions</span>
      </div>

      <MultiplierTalkingPoint />

      <DemoCallout demoAccount={demoAccount} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Priority Accounts This Week</h2>
        <span className="text-xs text-slate-400">{filtered.length} accounts</span>
      </div>

      <div className="mb-4">
        <FilterBar segment={segment} setSegment={setSegment} toggles={toggles} toggle={toggle} gtmMotion={gtmMotion} setGtmMotion={setGtmMotion} />
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center text-sm text-slate-400">Loading accounts…</div>
      ) : (
        <PriorityAccountsTable accounts={filtered} sortBy={sortDesc} onSort={() => setSortDesc((s) => !s)} demoActive={!!demo?.active} onOpenDemo={(a) => demo.openDemoAccount(a.id)} />
      )}
    </div>
  );
}