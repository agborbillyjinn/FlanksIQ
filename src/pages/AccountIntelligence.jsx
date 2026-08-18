import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AccountHeader from "@/components/intel/AccountHeader";
import SectionTitle from "@/components/intel/SectionTitle";
import SectionNav from "@/components/intel/SectionNav";
import SignalCard from "@/components/intel/SignalCard";
import PainHypothesisCard from "@/components/intel/PainHypothesisCard";
import RouteCard from "@/components/intel/RouteCard";
import CommitteeCard from "@/components/intel/CommitteeCard";
import SolutionJourney from "@/components/intel/SolutionJourney";
import AccountStrategyPanel from "@/components/intel/AccountStrategyPanel";
import MeddpiccPanel from "@/components/intel/MeddpiccPanel";
import PresentStartModal from "@/components/intel/PresentStartModal";
import ScoreBreakdown from "@/components/intel/ScoreBreakdown";
import EvidenceBadge from "@/components/intel/EvidenceBadge";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

function OverviewField({ label, value }) {
  return (
    <div>
      <div className="text-[11px] text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="mt-0.5 text-sm text-slate-700">{value || "Not established"}</div>
    </div>
  );
}

function fmtAum(v) {
  if (!v && v !== 0) return "Not established";
  if (v >= 1e12) return `£${(v / 1e12).toFixed(1)}tn`;
  if (v >= 1e9) return `£${(v / 1e9).toFixed(1)}bn`;
  if (v >= 1e6) return `£${(v / 1e6).toFixed(0)}m`;
  return `£${v}`;
}

function buildThesis(account) {
  const parts = [
    `${account.name} is a ${account.segment} in the UK wealth market${account.subsegment ? ` (${account.subsegment})` : ""}.`,
    account.primaryTrigger ? `An active "${account.primaryTrigger}" signal suggests the organisation may be reassessing its wealth-data and technology foundation.` : "",
    `With ${account.highDataComplexity ? "high" : "moderate"} multi-custodian data complexity, Flanks could unify held-away and custodian data to enable a 360-degree client view and an AI-ready data foundation.`,
    "This is a hypothesis to validate in discovery.",
  ].filter(Boolean);
  return parts.join(" ");
}

export default function AccountIntelligence() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [signals, setSignals] = useState([]);
  const [pains, setPains] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [presentOpen, setPresentOpen] = useState(false);
  const [error, setError] = useState(null);

  const loadAll = async (accId) => {
    const acc = await base44.entities.Account.get(accId);
    setAccount(acc);
    const name = acc.name;
    const [s, p, c, r, st] = await Promise.all([
      base44.entities.AccountSignal.filter({ account: name }, "-signalDate", 50),
      base44.entities.PainHypothesis.filter({ account: name }, "-created_date", 50),
      base44.entities.BuyingCommitteeMember.filter({ account: name }, "-influence", 50),
      base44.entities.RelationshipRoute.filter({ account: name }, "-confidence", 50),
      base44.entities.AccountStrategy.filter({ account: name }, "-generatedAt", 1),
    ]);
    setSignals(s); setPains(p); setCommittee(c); setRoutes(r);
    if (st.length) setStrategy(st[0]); else setStrategy(null);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        await loadAll(id);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("generateAccountStrategy", { accountId: id });
      setStrategy(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleRefresh = async () => {
    if (!account) return;
    setRefreshing(true);
    setError(null);
    try {
      await base44.functions.invoke("researchAccount", {
        name: account.name,
        domain: account.domain,
      });
      await loadAll(id);
    } catch (e) {
      setError("Research temporarily unavailable. Please retry.");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="px-8 py-20 text-center text-sm text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Loading account intelligence…
      </div>
    );
  }
  if (!account) {
    return (
      <div className="px-8 py-20 text-center">
        <p className="text-sm text-slate-500">Account not found.</p>
        <Link to="/accounts" className="mt-2 inline-block text-sm text-sky-600 hover:text-sky-700">Back to Accounts</Link>
      </div>
    );
  }

  const live = account.dataSource === "live";
  const thesis = strategy?.accountThesis || buildThesis(account);

  return (
    <div className="px-8 py-8 max-w-[1200px] mx-auto pb-24">
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-3.5 w-3.5" /> UK Territory
        </Link>
      </div>

      <div id="account-header" className="scroll-mt-32">
        <AccountHeader
          account={account}
          strategy={strategy}
          onRefresh={handleRefresh}
          onGenerate={handleGenerate}
          onPresent={() => setPresentOpen(true)}
          refreshing={refreshing}
          generating={generating}
        />
      </div>

      {live && account.scoreBreakdown && (
        <div className="mt-4">
          <ScoreBreakdown breakdown={account.scoreBreakdown} />
        </div>
      )}

      <div className="mt-4">
        <SectionNav />
      </div>

      {/* 01 — Account Overview */}
      <section id="overview" className="mt-8 scroll-mt-32">
        <SectionTitle index="01" title="Account Overview" />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            {live ? <EvidenceBadge type="VERIFIED_FACT" label="LIVE RESEARCH" /> : <EvidenceBadge type="DEMO" />}
            <span className="text-xs text-slate-400">
              {live ? "Live internet-grounded research — verify specifics in discovery." : "Organisation data is illustrative — to be replaced with verified research."}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <OverviewField label="Organisation" value={account.name} />
            <OverviewField label="Segment" value={account.segment} />
            <OverviewField label="Subsegment" value={account.subsegment} />
            <OverviewField label="AUM" value={fmtAum(account.aum)} />
            <OverviewField label="Clients" value={account.clientCount ? account.clientCount.toLocaleString() : "Not established"} />
            <OverviewField label="Advisers" value={account.advisorCount ? account.advisorCount.toLocaleString() : "Not established"} />
            <OverviewField label="UK locations" value={account.locations} />
            <OverviewField label="Employees" value={account.employeeCount ? account.employeeCount.toLocaleString() : "Not established"} />
            <OverviewField label="Relevant technology" value={account.salesforceDetected ? "Salesforce ecosystem (detected)" : "Not established"} />
            <OverviewField label="Strategic initiatives" value={account.primaryTrigger || "Not established"} />
          </div>
        </div>
      </section>

      {/* 02 — Why Now */}
      <section id="why-now" className="mt-8 scroll-mt-32">
        <SectionTitle index="02" title="Why Now" subtitle="Evidence-backed signals that may create a reason to engage." />
        {signals.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signals.map((s) => <SignalCard key={s.id} signal={s} />)}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
            <p className="text-sm text-slate-500">No signals captured yet.</p>
            <p className="mt-1 text-xs text-slate-400">Run "Refresh Research" to research this account, or add signals manually.</p>
          </div>
        )}
      </section>

      {/* 03/04 — Hypotheses (Thesis + Pain Hypotheses) */}
      <section id="hypotheses" className="mt-8 scroll-mt-32">
        <SectionTitle index="03" title="Opportunity Thesis" />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2">
            <EvidenceBadge type="HYPOTHESIS" />
            <span className="text-xs text-slate-400">Concise sales hypothesis — validate in discovery.</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{thesis}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2"><EvidenceBadge type="VERIFIED_FACT" /><span className="text-xs font-medium text-slate-600">What We Know</span></div>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li>• {account.segment} based in {account.headquarters || "the UK"}.</li>
                <li>• {account.employeeCount ? `${account.employeeCount.toLocaleString()} employees` : "Employee count not established"}.</li>
                <li>• {fmtAum(account.aum)} AUM{live ? "" : " (demo / unsourced)"}.</li>
                <li>• Primary trigger: {account.primaryTrigger || "not established"}.</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2"><EvidenceBadge type="HYPOTHESIS" /><span className="text-xs font-medium text-slate-600">What We Need To Validate</span></div>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li>• Multi-custodian data fragmentation and held-away asset visibility.</li>
                <li>• Current wealth-data architecture and reconciliation approach.</li>
                <li>• Strategic intent behind the active trigger.</li>
                <li>• Budget, decision process and economic buyer.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SectionTitle index="04" title="Pain Hypotheses" subtitle="Likely pains to explore — every item is a hypothesis requiring validation." />
          {pains.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pains.map((p) => <PainHypothesisCard key={p.id} hypothesis={p} />)}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
              <p className="text-sm text-slate-500">No pain hypotheses recorded yet.</p>
              <p className="mt-1 text-xs text-slate-400">Generate an account strategy to surface likely pains to validate.</p>
            </div>
          )}
        </div>
      </section>

      {/* 05 — Flanks Solution Mapping */}
      <section id="solution" className="mt-8 scroll-mt-32">
        <SectionTitle index="05" title="Flanks Solution Mapping" subtitle="The likely Flanks proposition to test through discovery." />
        <SolutionJourney
          wedge={strategy?.flanksWedge}
          whyRelevant={account.highDataComplexity ? "Hypothesised fit with the account's wealth-data complexity." : null}
          expansion={strategy?.expansionPath}
        />
      </section>

      {/* 06 — Buying Committee */}
      <section id="buyers" className="mt-8 scroll-mt-32">
        <SectionTitle index="06" title="Buying Committee" subtitle="Where a person is not yet identified, the likely persona is shown." />
        {committee.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {committee.map((m) => <CommitteeCard key={m.id} member={m} />)}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
            <p className="text-sm text-slate-500">No buying committee mapped yet.</p>
            <p className="mt-1 text-xs text-slate-400">Personas will be added as the account is researched.</p>
          </div>
        )}
      </section>

      {/* 07 — Routes Into Account */}
      <section id="routes" className="mt-8 scroll-mt-32">
        <SectionTitle index="07" title="Routes Into Account" />
        {routes.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((r) => <RouteCard key={r.id} route={r} />)}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
            <p className="text-sm text-slate-500">No routes mapped yet.</p>
            <p className="mt-1 text-xs text-slate-400">Direct, partner, Salesforce, technology, event and existing-relationship routes will be added as evidence is gathered.</p>
          </div>
        )}
      </section>

      {/* 08 — Account Strategy */}
      <section id="strategy" className="mt-8 scroll-mt-32">
        <SectionTitle index="08" title="Account Strategy" subtitle="AI-generated thesis, discovery questions and outreach — built from the account's researched evidence." />
        {!strategy && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-sky-300" />
            </div>
            <h3 className="text-sm font-medium text-slate-700">Generate an account strategy</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto mb-5">
              Produces an account thesis, why-now, entry persona, Flanks wedge, discovery questions, outreach and MEDDPICC from this account's evidence, signals and score breakdown.
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? "Generating…" : "Generate Account Strategy"}
            </button>
            {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}
          </div>
        )}
        {strategy && <AccountStrategyPanel strategy={strategy} />}
      </section>

      {/* 09 — MEDDPICC */}
      {strategy && (
        <section id="meddpicc" className="mt-8 scroll-mt-32">
          <SectionTitle index="09" title="MEDDPICC" subtitle="Initial MEDDPICC view — Known, Hypothesised and Unknown." />
          <MeddpiccPanel strategy={strategy} />
        </section>
      )}

      <PresentStartModal open={presentOpen} onClose={() => setPresentOpen(false)} accountId={id} />

      {/* Persistent evidence principle */}
      <div className="fixed bottom-4 left-72 z-30 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-full bg-slate-900/90 text-slate-200 text-[11px] tracking-wide shadow-lg">
          AI proposes. Evidence proves. Sales validates.
        </div>
      </div>
    </div>
  );
}