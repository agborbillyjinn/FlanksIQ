import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const meddpiccCell = {
  type: "object",
  properties: {
    known: { type: "string" },
    hypothesised: { type: "string" },
    unknown: { type: "string" }
  },
  required: ["known", "hypothesised", "unknown"]
};

const responseSchema = {
  type: "object",
  properties: {
    accountThesis: { type: "string" },
    whyNow: { type: "string" },
    primaryPain: { type: "string" },
    bestEntryPersona: { type: "string" },
    commercialTrigger: { type: "string" },
    flanksWedge: { type: "string" },
    expansionPath: { type: "string" },
    relationshipRoute: { type: "string" },
    discoveryQuestions: { type: "array", items: { type: "string" } },
    emailOutreach: { type: "string" },
    linkedinOutreach: { type: "string" },
    callOpener: { type: "string" },
    meddpicc: {
      type: "object",
      properties: {
        metrics: meddpiccCell,
        economicBuyer: meddpiccCell,
        decisionCriteria: meddpiccCell,
        decisionProcess: meddpiccCell,
        paperProcess: meddpiccCell,
        identifyPain: meddpiccCell,
        champion: meddpiccCell,
        competition: meddpiccCell
      },
      required: ["metrics", "economicBuyer", "decisionCriteria", "decisionProcess", "paperProcess", "identifyPain", "champion", "competition"]
    },
    nextAction: { type: "string" }
  },
  required: ["accountThesis", "whyNow", "primaryPain", "bestEntryPersona", "commercialTrigger", "flanksWedge", "expansionPath", "relationshipRoute", "discoveryQuestions", "emailOutreach", "linkedinOutreach", "callOpener", "meddpicc", "nextAction"]
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const accountId = body && body.accountId;
    if (!accountId) return Response.json({ error: 'accountId required' }, { status: 400 });

    const account = await base44.entities.Account.get(accountId);
    if (!account) return Response.json({ error: 'Account not found' }, { status: 404 });

    const name = account.name;
    const [evidence, signals, pains, committee, routes] = await Promise.all([
      base44.entities.Evidence.filter({ account: name }, "-retrievedAt", 40),
      base44.entities.AccountSignal.filter({ account: name }, "-signalDate", 30),
      base44.entities.PainHypothesis.filter({ account: name }, "-created_date", 20),
      base44.entities.BuyingCommitteeMember.filter({ account: name }, "-influence", 20),
      base44.entities.RelationshipRoute.filter({ account: name }, "-confidence", 20)
    ]);

    const evidenceBlock = evidence.map((e, i) =>
      `E${i + 1} | ${e.searchTheme || "general"} | ${e.sourceTitle || ""} | ${e.publishedDate || "no date"} | ${e.sourceUrl}\n${(e.claim || "").slice(0, 500)}`
    ).join("\n\n");

    const signalsBlock = signals.map((s) =>
      `- [${s.evidenceType || "INFERENCE"}] ${s.signalType}: ${s.headline}${s.signalDate ? ` (${s.signalDate})` : ""}${s.sourceUrl ? ` — source: ${s.sourceUrl}` : ""}`
    ).join("\n");

    const painsBlock = pains.map((p) => `- ${p.hypothesis}${p.discoveryQuestion ? ` (ask: ${p.discoveryQuestion})` : ""}`).join("\n");

    const committeeBlock = committee.map((c) =>
      `- ${c.roleType}: ${c.personName ? `${c.personName} (${c.title})` : `${c.title} — person not yet identified`}`
    ).join("\n");

    const routesBlock = routes.map((r) =>
      `- ${r.routeType} [${r.routeStatus === "verified" ? "VERIFIED" : "ROUTE TO INVESTIGATE"}]: ${r.routeDescription || ""}${r.recommendedAction ? ` → ${r.recommendedAction}` : ""}`
    ).join("\n");

    const breakdown = account.scoreBreakdown;
    const breakdownText = breakdown
      ? `Flanks Fit ${breakdown.flanksFit?.normalized}/100 (raw ${breakdown.flanksFit?.raw}/60), Timing ${breakdown.timing?.normalized}/100 (raw ${breakdown.timing?.raw}/25), Access ${breakdown.access?.normalized}/100 (raw ${breakdown.access?.raw}/15), Evidence Confidence ${breakdown.evidenceConfidence?.score}/100, Priority ${breakdown.priority?.score}/100.`
      : `Flanks Fit ${account.flanksFitScore}, Timing ${account.timingScore}, Access ${account.accessScore}, Evidence ${account.evidenceConfidence}, Priority ${account.priorityScore}.`;

    const prompt = `You are an enterprise sales strategist helping a UK Account Executive sell Flanks (wealth-data aggregation: Flanks Aggregate unifies multi-custodian wealth data; Lume enriches and reconciles it) into wealth management and financial services.

Generate an account strategy using ONLY the researched evidence, signals, pain hypotheses, buying committee, relationship routes and score breakdown supplied below. Do not use unsupported prior knowledge. Clearly separate what is KNOWN (from evidence) from what is HYPOTHESISED. Never present a hypothesis as a fact. Where information is missing, say "Not established" rather than inventing details.

ACCOUNT:
- Name: ${account.name}
- Segment: ${account.segment || "Not established"}
- Subsegment: ${account.subsegment || "Not established"}
- Headquarters: ${account.headquarters || "Not established"}
- Employees: ${account.employeeCount || "Not established"}
- AUM: ${account.aum || "Not established"}
- Clients: ${account.clientCount || "Not established"}
- Advisers: ${account.advisorCount || "Not established"}
- Primary trigger: ${account.primaryTrigger || "Not established"}
- Tier: ${account.tier}
- Data source: ${account.dataSource || "demo"}
- Score breakdown: ${breakdownText}

EVIDENCE (researched sources):
${evidenceBlock || "No evidence stored."}

SIGNALS:
${signalsBlock || "No signals stored."}

PAIN HYPOTHESES:
${painsBlock || "No pain hypotheses stored."}

BUYING COMMITTEE:
${committeeBlock || "No committee mapped."}

RELATIONSHIP ROUTES:
${routesBlock || "No routes mapped."}

Produce:
1. accountThesis — concise sales hypothesis (max ~100 words) on why this organisation could be a Flanks opportunity, grounded in the evidence.
2. whyNow — the evidence-backed reason to engage now.
3. primaryPain — the single most likely pain to validate (from the pain hypotheses).
4. bestEntryPersona — the persona to approach first (role, not a fabricated name; use a named person only if one appears in the committee).
5. commercialTrigger — the commercial event creating urgency.
6. flanksWedge — the likely initial Flanks wedge to test.
7. expansionPath — the potential expansion beyond the wedge.
8. relationshipRoute — the best route into the account (from the routes).
9. discoveryQuestions — 5-7 concise, account-specific discovery questions.
10. emailOutreach — a concise, executive-level cold email (reference hypotheses, not facts).
11. linkedinOutreach — a concise LinkedIn connection note.
12. callOpener — a 2-sentence call opener.
13. meddpicc — for each of the 8 categories, provide known / hypothesised / unknown (use "Not established" where unknown; do not fabricate).
14. nextAction — one specific AE action (not generic).

Return strictly as JSON matching the schema.`;

    const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: responseSchema,
      model: "claude_sonnet_4_6"
    });

    const strategy = await base44.entities.AccountStrategy.create({
      account: account.name,
      accountThesis: llm.accountThesis,
      whyNow: llm.whyNow,
      primaryPain: llm.primaryPain,
      bestEntryPersona: llm.bestEntryPersona,
      commercialTrigger: llm.commercialTrigger,
      flanksWedge: llm.flanksWedge,
      expansionPath: llm.expansionPath,
      relationshipRoute: llm.relationshipRoute,
      discoveryQuestions: llm.discoveryQuestions,
      emailOutreach: llm.emailOutreach,
      linkedinOutreach: llm.linkedinOutreach,
      callOpener: llm.callOpener,
      meddpicc: llm.meddpicc,
      nextAction: llm.nextAction,
      generatedAt: new Date().toISOString()
    });

    return Response.json(strategy);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}