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

    const prompt = `You are an enterprise sales strategist helping a UK Account Executive sell Flanks (a wealth-data aggregation platform: Flanks Aggregate unifies multi-custodian wealth data; Lume enriches and reconciles it) into wealth management and financial services.

Generate an account strategy for this UK account. Use ONLY the data provided below. Where information is missing, say "Not established" rather than inventing details. Clearly separate what is KNOWN from what is HYPOTHESISED. Never present a hypothesis as a fact.

ACCOUNT DATA:
- Name: ${account.name}
- Segment: ${account.segment}
- Subsegment: ${account.subsegment || "Not established"}
- Headquarters: ${account.headquarters || "Not established"}
- Employees: ${account.employeeCount || "Not established"}
- AUM (£): ${account.aum || "Not established"}
- Clients: ${account.clientCount || "Not established"}
- Advisers: ${account.advisorCount || "Not established"}
- UK locations: ${account.locations || "Not established"}
- Flanks Fit Score: ${account.flanksFitScore}/100
- Timing Score: ${account.timingScore}/100
- Access Score: ${account.accessScore}/100
- Evidence Confidence: ${account.evidenceConfidence}/100
- Priority Score: ${account.priorityScore}/100
- Tier: ${account.tier}
- Primary Trigger: ${account.primaryTrigger || "Not established"}
- Recommended Action: ${account.recommendedAction || "Not established"}
- Salesforce detected: ${account.salesforceDetected}
- AI initiative detected: ${account.aiInitiativeDetected}
- High data complexity: ${account.highDataComplexity}
- Active trigger: ${account.activeTrigger}

Produce:
1. accountThesis — a concise sales hypothesis (max ~100 words) on why this organisation could be a Flanks opportunity.
2. whyNow — the evidence-backed reason to engage now.
3. primaryPain — the single most likely pain to validate.
4. bestEntryPersona — the persona to approach first (role, not a fabricated name).
5. commercialTrigger — the commercial event creating urgency.
6. flanksWedge — the likely initial Flanks wedge to test.
7. expansionPath — the potential expansion beyond the wedge.
8. relationshipRoute — the best route into the account.
9. discoveryQuestions — 5-7 concise, account-specific discovery questions.
10. emailOutreach — a concise, executive-level cold email (refer to hypotheses, not facts).
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