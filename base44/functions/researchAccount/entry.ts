import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

const SEARCH_THEMES = [
  { id: "profile", q: (n) => `${n} wealth management AUM clients advisers UK` },
  { id: "data_transformation", q: (n) => `${n} data transformation digital transformation technology modernisation` },
  { id: "ai", q: (n) => `${n} AI artificial intelligence wealth management` },
  { id: "technology", q: (n) => `${n} Salesforce Financial Services Cloud API cloud data platform technology` },
  { id: "strategic_change", q: (n) => `${n} acquisition expansion new product partnership wealth management` },
  { id: "leadership", q: (n) => `${n} CIO CTO CDO COO Head of Digital Head of Data Head of Wealth Operations` },
  { id: "hiring", q: (n) => `${n} hiring data technology wealth operations Salesforce AI` },
  { id: "wealth_data", q: (n) => `${n} custodians portfolio reporting external assets held away assets investment platform` },
];

const levelDim = {
  type: "object",
  properties: {
    level: { type: "string" },
    reason: { type: "string" },
    supportingEvidenceIds: { type: "array", items: { type: "string" } }
  },
  required: ["level", "reason", "supportingEvidenceIds"]
};

const responseSchema = {
  type: "object",
  properties: {
    companyProfile: {
      type: "object",
      properties: {
        description: { type: "string" },
        segment: { type: "string" },
        subsegment: { type: "string" },
        headquarters: { type: "string" },
        ukPresence: { type: "string" },
        employeeCount: { type: "number" },
        aum: { type: "number" },
        clientCount: { type: "number" },
        advisorCount: { type: "number" },
        locations: { type: "string" },
        website: { type: "string" },
        linkedin: { type: "string" }
      }
    },
    segmentClassification: {
      type: "object",
      properties: { segment: { type: "string" }, confidence: { type: "number" }, supportingEvidenceIds: { type: "array", items: { type: "string" } } },
      required: ["segment", "supportingEvidenceIds"]
    },
    signals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          signalType: { type: "string" },
          headline: { type: "string" },
          description: { type: "string" },
          signalDate: { type: "string" },
          evidenceType: { type: "string" },
          confidence: { type: "number" },
          commercialRelevance: { type: "string" },
          supportingEvidenceIds: { type: "array", items: { type: "string" } }
        },
        required: ["signalType", "headline", "evidenceType", "supportingEvidenceIds"]
      }
    },
    relevantExecutives: {
      type: "array",
      items: {
        type: "object",
        properties: {
          personName: { type: "string" },
          title: { type: "string" },
          roleType: { type: "string" },
          linkedinUrl: { type: "string" },
          confidence: { type: "number" },
          supportingEvidenceIds: { type: "array", items: { type: "string" } }
        },
        required: ["title", "roleType", "supportingEvidenceIds"]
      }
    },
    painHypotheses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          hypothesis: { type: "string" },
          reason: { type: "string" },
          evidence: { type: "string" },
          confidence: { type: "number" },
          discoveryQuestion: { type: "string" },
          supportingEvidenceIds: { type: "array", items: { type: "string" } }
        },
        required: ["hypothesis", "reason", "supportingEvidenceIds"]
      }
    },
    possibleRelationshipRoutes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          routeType: { type: "string" },
          routeDescription: { type: "string" },
          organisation: { type: "string" },
          person: { type: "string" },
          confidence: { type: "number" },
          recommendedAction: { type: "string" },
          routeStatus: { type: "string" },
          supportingEvidenceIds: { type: "array", items: { type: "string" } }
        },
        required: ["routeType", "routeStatus", "supportingEvidenceIds"]
      }
    },
    scoringInputs: {
      type: "object",
      properties: {
        icpAlignment: levelDim,
        wealthDataComplexity: levelDim,
        commercialScale: levelDim,
        multiCustodianComplexity: levelDim,
        technologyCompatibility: levelDim,
        strategicRelevance: levelDim,
        transformationInitiative: levelDim,
        aiDataInitiative: levelDim,
        technologyModernisation: levelDim,
        executiveChange: levelDim,
        expansionMA: levelDim,
        hiringTrigger: levelDim,
        salesforceRoute: levelDim,
        entryAngle: levelDim
      },
      required: ["icpAlignment", "wealthDataComplexity", "commercialScale", "multiCustodianComplexity", "technologyCompatibility", "strategicRelevance", "transformationInitiative", "aiDataInitiative", "technologyModernisation", "executiveChange", "expansionMA", "hiringTrigger", "salesforceRoute", "entryAngle"]
    }
  },
  required: ["companyProfile", "segmentClassification", "signals", "relevantExecutives", "painHypotheses", "possibleRelationshipRoutes", "scoringInputs"]
};

async function tavilySearch(apiKey, query) {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      max_results: 5,
      include_answer: false
    })
  });
  if (!res.ok) throw new Error(`Tavily ${res.status}`);
  const data = await res.json();
  return (data.results || []).map((r) => ({
    title: r.title || "",
    url: r.url || "",
    content: (r.content || "").slice(0, 800),
    score: r.score || 0,
    published_date: r.published_date || null
  }));
}

function levelConfidence(level) {
  if (["confirmed", "high", "large", "strong"].includes(level)) return 80;
  if (["likely", "medium", "some", "inferred"].includes(level)) return 60;
  if (["low", "small"].includes(level)) return 45;
  return 30;
}

function dim(name, score, maximumScore, level, reason, ids) {
  return { name, score, maximumScore, reason: reason || "", supportingEvidenceIds: ids || [], confidence: levelConfidence(level) };
}

function points(level, mapping) {
  return mapping[level] != null ? mapping[level] : 0;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const name = body && body.name && body.name.trim();
    const domain = body && body.domain && body.domain.trim();
    const suggestedSegment = body && body.segment;
    if (!name || !domain) return Response.json({ error: 'name and domain are required' }, { status: 400 });

    const apiKey = secrets.get("TAVILY_API_KEY");
    if (!apiKey) return Response.json({ error: 'Research temporarily unavailable. Please retry.' }, { status: 503 });

    // Run targeted searches
    const searchResults = await Promise.allSettled(
      SEARCH_THEMES.map((t) => tavilySearch(apiKey, t.q(name)).then((r) => ({ theme: t.id, results: r })))
    );
    const fulfilled = searchResults.filter((s) => s.status === "fulfilled").map((s) => s.value);
    const allSearchesOk = fulfilled.length === SEARCH_THEMES.length;

    // Deduplicate by URL, preserve theme
    const seen = new Set();
    const evidenceRaw = [];
    for (const group of fulfilled) {
      for (const r of group.results) {
        if (!r.url || seen.has(r.url)) continue;
        seen.add(r.url);
        evidenceRaw.push({
          theme: group.theme,
          title: r.title,
          url: r.url,
          content: r.content,
          score: r.score,
          published_date: r.published_date
        });
      }
    }

    if (evidenceRaw.length === 0) {
      return Response.json({ error: 'Research temporarily unavailable. Please retry.' }, { status: 503 });
    }

    // Find existing account (refresh) and clear old related records up front
    let existing = null;
    const byDomain = await base44.entities.Account.filter({ domain }, "-created_date", 1);
    if (byDomain.length) existing = byDomain[0];
    if (!existing) {
      const byName = await base44.entities.Account.filter({ name }, "-created_date", 1);
      if (byName.length) existing = byName[0];
    }
    if (existing) {
      await Promise.all([
        base44.entities.Evidence.deleteMany({ account: existing.name }),
        base44.entities.AccountSignal.deleteMany({ account: existing.name }),
        base44.entities.PainHypothesis.deleteMany({ account: existing.name }),
        base44.entities.BuyingCommitteeMember.deleteMany({ account: existing.name }),
        base44.entities.RelationshipRoute.deleteMany({ account: existing.name })
      ]);
    }

    // Persist raw evidence first (facts at the source level)
    const evidenceToCreate = evidenceRaw.map((e) => ({
      account: name,
      claim: `${e.title}. ${e.content}`.slice(0, 1000),
      sourceUrl: e.url,
      sourceTitle: e.title,
      publishedDate: e.published_date || null,
      evidenceType: "FACT",
      confidence: Math.round((e.score || 0.5) * 100),
      retrievedAt: new Date().toISOString(),
      searchTheme: e.theme
    }));
    const evidenceRecords = await base44.entities.Evidence.bulkCreate(evidenceToCreate);
    const idMap = {};
    evidenceRecords.forEach((rec, i) => { idMap[`E${i + 1}`] = rec.id; });

    // Build LLM prompt with evidence only
    const evidenceBlock = evidenceRaw.map((e, i) =>
      `E${i + 1} | theme: ${e.theme} | title: ${e.title} | date: ${e.published_date || "unknown"} | url: ${e.url}\n${e.content}`
    ).join("\n\n");

    const prompt = `You are an enterprise sales research analyst supporting an Account Executive selling wealth-data infrastructure (Flanks: Aggregate unifies multi-custodian wealth data; Lume enriches and reconciles it).

Analyse ONLY the evidence supplied below. Do not use unsupported prior knowledge to create company facts. Every factual company claim must reference one of the supplied evidence IDs (E1...E${evidenceRaw.length}). If evidence is insufficient, return null / UNKNOWN. Never fabricate AUM, client numbers, adviser numbers, technology usage, executives, initiatives, partnerships, acquisitions, Salesforce usage or AI projects.

Distinguish:
- FACT = directly supported by supplied evidence
- INFERENCE = reasonable interpretation derived from one or more supplied facts
- HYPOTHESIS = possible sales pain/opportunity requiring discovery validation
Never convert a hypothesis into a fact.

Company: ${name}
Domain: ${domain}
${suggestedSegment ? `Suggested segment: ${suggestedSegment}` : "Segment: infer from evidence if possible."}

EVIDENCE:
${evidenceBlock}

Return JSON matching the schema. For companyProfile numeric fields, return null if not evidenced. For scoringInputs, set level based ONLY on evidence:
- icpAlignment: confirmed | inferred | unknown
- wealthDataComplexity: high | medium | low | unknown
- commercialScale: large | medium | small | unknown
- multiCustodianComplexity: confirmed | likely | unknown
- technologyCompatibility: confirmed | likely | unknown
- strategicRelevance: confirmed | inferred | unknown
- transformationInitiative: confirmed | likely | unknown
- aiDataInitiative: confirmed | likely | unknown
- technologyModernisation: confirmed | likely | unknown
- executiveChange: confirmed | likely | unknown
- expansionMA: confirmed | likely | unknown
- hiringTrigger: confirmed | likely | unknown
- salesforceRoute: confirmed | likely | unknown
- entryAngle: strong | some | none
Do not set "confirmed" without supporting evidence IDs. Where there is no evidence, use "unknown".`;

    const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: responseSchema,
      model: "claude_sonnet_4_6"
    });

    const si = llm.scoringInputs || {};
    const profile = llm.companyProfile || {};
    const seg = (suggestedSegment || llm.segmentClassification?.segment || profile.segment || "").trim() || undefined;

    // --- Scoring (calculated, not LLM-invented) ---
    const flanksFitDims = [
      dim("ICP Alignment", points(si.icpAlignment?.level, { confirmed: 10, inferred: 6, unknown: 0 }), 10, si.icpAlignment?.level || "unknown", si.icpAlignment?.reason, si.icpAlignment?.supportingEvidenceIds),
      dim("Wealth Data Complexity", points(si.wealthDataComplexity?.level, { high: 15, medium: 9, low: 4, unknown: 0 }), 15, si.wealthDataComplexity?.level || "unknown", si.wealthDataComplexity?.reason, si.wealthDataComplexity?.supportingEvidenceIds),
      dim("Commercial Potential", points(si.commercialScale?.level, { large: 10, medium: 6, small: 3, unknown: 0 }), 10, si.commercialScale?.level || "unknown", si.commercialScale?.reason, si.commercialScale?.supportingEvidenceIds),
      dim("Multi-Custodian Complexity", points(si.multiCustodianComplexity?.level, { confirmed: 10, likely: 6, unknown: 0 }), 10, si.multiCustodianComplexity?.level || "unknown", si.multiCustodianComplexity?.reason, si.multiCustodianComplexity?.supportingEvidenceIds),
      dim("Technology / Integration Compatibility", points(si.technologyCompatibility?.level, { confirmed: 10, likely: 6, unknown: 0 }), 10, si.technologyCompatibility?.level || "unknown", si.technologyCompatibility?.reason, si.technologyCompatibility?.supportingEvidenceIds),
      dim("Strategic Relevance", points(si.strategicRelevance?.level, { confirmed: 5, inferred: 3, unknown: 0 }), 5, si.strategicRelevance?.level || "unknown", si.strategicRelevance?.reason, si.strategicRelevance?.supportingEvidenceIds)
    ];
    const timingDims = [
      dim("Transformation Initiative", points(si.transformationInitiative?.level, { confirmed: 5, likely: 3, unknown: 0 }), 5, si.transformationInitiative?.level || "unknown", si.transformationInitiative?.reason, si.transformationInitiative?.supportingEvidenceIds),
      dim("AI / Data Initiative", points(si.aiDataInitiative?.level, { confirmed: 5, likely: 3, unknown: 0 }), 5, si.aiDataInitiative?.level || "unknown", si.aiDataInitiative?.reason, si.aiDataInitiative?.supportingEvidenceIds),
      dim("Technology Modernisation", points(si.technologyModernisation?.level, { confirmed: 4, likely: 2, unknown: 0 }), 4, si.technologyModernisation?.level || "unknown", si.technologyModernisation?.reason, si.technologyModernisation?.supportingEvidenceIds),
      dim("Executive / Organisational Change", points(si.executiveChange?.level, { confirmed: 3, likely: 1, unknown: 0 }), 3, si.executiveChange?.level || "unknown", si.executiveChange?.reason, si.executiveChange?.supportingEvidenceIds),
      dim("Expansion / M&A / Product Change", points(si.expansionMA?.level, { confirmed: 4, likely: 2, unknown: 0 }), 4, si.expansionMA?.level || "unknown", si.expansionMA?.reason, si.expansionMA?.supportingEvidenceIds),
      dim("Relevant Hiring / Active Trigger", points(si.hiringTrigger?.level, { confirmed: 4, likely: 2, unknown: 0 }), 4, si.hiringTrigger?.level || "unknown", si.hiringTrigger?.reason, si.hiringTrigger?.supportingEvidenceIds)
    ];
    const execsWithNames = (llm.relevantExecutives || []).filter((e) => e.personName);
    const routes = llm.possibleRelationshipRoutes || [];
    const partnerVerified = routes.some((r) => r.routeType === "Partner" && r.routeStatus === "verified");
    const partnerInvestigate = routes.some((r) => r.routeType === "Partner" && r.routeStatus === "to_investigate");
    const eventVerified = routes.some((r) => (r.routeType === "Event" || r.routeType === "Existing Relationship") && r.routeStatus === "verified");
    const accessDims = [
      dim("Identifiable Buying Committee", execsWithNames.length >= 2 ? 3 : execsWithNames.length === 1 ? 2 : 0, 3, execsWithNames.length >= 2 ? "confirmed" : execsWithNames.length === 1 ? "likely" : "unknown", `${execsWithNames.length} named executive(s) identified`, []),
      dim("Partner / Ecosystem Route", partnerVerified ? 4 : partnerInvestigate ? 1 : 0, 4, partnerVerified ? "confirmed" : partnerInvestigate ? "likely" : "unknown", partnerVerified ? "Verified partner route" : partnerInvestigate ? "Partner route to investigate" : "No partner route", []),
      dim("Salesforce / Technology Route", points(si.salesforceRoute?.level, { confirmed: 3, likely: 1, unknown: 0 }), 3, si.salesforceRoute?.level || "unknown", si.salesforceRoute?.reason, si.salesforceRoute?.supportingEvidenceIds),
      dim("Event / Relationship Route", eventVerified ? 2 : 0, 2, eventVerified ? "confirmed" : "unknown", eventVerified ? "Verified event/relationship route" : "No event route", []),
      dim("Compelling Personalised Entry Angle", points(si.entryAngle?.level, { strong: 3, some: 1, none: 0 }), 3, si.entryAngle?.level || "none", si.entryAngle?.reason, si.entryAngle?.supportingEvidenceIds)
    ];

    const sum = (arr) => arr.reduce((a, d) => a + d.score, 0);
    const ffRaw = sum(flanksFitDims);
    const tmRaw = sum(timingDims);
    const acRaw = sum(accessDims);
    const norm = (raw, max) => Math.round((raw / max) * 100);
    const flanksFit = norm(ffRaw, 60);
    const timing = norm(tmRaw, 25);
    const access = norm(acRaw, 15);

    const sourcesCount = evidenceRaw.length;
    const evidenceConfidence = Math.max(0, Math.min(100, Math.round(sourcesCount * 8) - (allSearchesOk ? 0 : 15)));
    const priority = Math.round(0.45 * flanksFit + 0.30 * timing + 0.15 * access + 0.10 * evidenceConfidence);
    const tier = priority >= 80 ? "Tier 1" : priority >= 65 ? "Tier 2" : "Tier 3";

    const scoreBreakdown = {
      flanksFit: { raw: ffRaw, maximum: 60, normalized: flanksFit, dimensions: flanksFitDims },
      timing: { raw: tmRaw, maximum: 25, normalized: timing, dimensions: timingDims },
      access: { raw: acRaw, maximum: 15, normalized: access, dimensions: accessDims },
      evidenceConfidence: { score: evidenceConfidence, sourcesCount, reason: `${sourcesCount} source(s) retrieved${allSearchesOk ? "" : " (some searches failed)"}` },
      priority: { flanksFit, timing, access, evidenceConfidence, score: priority }
    };

    // Map evidence index -> meta for sourcing signals/routes
    const metaByIndex = evidenceRaw;

    function mapIds(ids) {
      return (ids || []).map((x) => idMap[x] || x).filter(Boolean);
    }
    function urlForIds(ids) {
      for (const x of (ids || [])) {
        const idx = parseInt(String(x).replace("E", "")) - 1;
        if (metaByIndex[idx]) return metaByIndex[idx].url;
      }
      return null;
    }
    function dateForIds(ids) {
      for (const x of (ids || [])) {
        const idx = parseInt(String(x).replace("E", "")) - 1;
        if (metaByIndex[idx] && metaByIndex[idx].published_date) return metaByIndex[idx].published_date.slice(0, 10);
      }
      return null;
    }

    const accountFields = {
      name,
      domain,
      segment: seg,
      subsegment: profile.subsegment || null,
      headquarters: profile.headquarters || null,
      ukPresence: profile.ukPresence || null,
      employeeCount: profile.employeeCount || null,
      aum: profile.aum || null,
      clientCount: profile.clientCount || null,
      advisorCount: profile.advisorCount || null,
      locations: profile.locations || null,
      description: profile.description || null,
      website: profile.website || (domain.startsWith("http") ? domain : `https://${domain}`),
      linkedin: profile.linkedin || null,
      flanksFitScore: flanksFit,
      timingScore: timing,
      accessScore: access,
      evidenceConfidence,
      priorityScore: priority,
      tier,
      primaryTrigger: (llm.signals && llm.signals[0] && llm.signals[0].headline) || null,
      recommendedAction: (routes[0] && routes[0].recommendedAction) || null,
      salesforceDetected: si.salesforceRoute?.level === "confirmed" || si.salesforceRoute?.level === "likely",
      aiInitiativeDetected: si.aiDataInitiative?.level === "confirmed" || si.aiDataInitiative?.level === "likely",
      highDataComplexity: si.wealthDataComplexity?.level === "high" || si.wealthDataComplexity?.level === "medium",
      activeTrigger: tmRaw > 0,
      dataSource: "live",
      researchedAt: new Date().toISOString(),
      sourcesCount,
      scoreBreakdown
    };

    let account;
    if (existing) {
      account = await base44.entities.Account.update(existing.id, accountFields);
    } else {
      account = await base44.entities.Account.create(accountFields);
    }

    // Re-create evidence (deleted above on refresh) — re-insert the persisted evidence under the final account name
    // (Evidence was already created with account = name; if existing.name differs from name, re-link not needed since we used `name`.)

    // Signals
    if (llm.signals && llm.signals.length) {
      await base44.entities.AccountSignal.bulkCreate(
        llm.signals.map((s) => ({
          account: name,
          signalType: s.signalType,
          headline: s.headline,
          description: s.description || null,
          signalDate: s.signalDate || dateForIds(s.supportingEvidenceIds) || null,
          sourceUrl: urlForIds(s.supportingEvidenceIds),
          sourceName: null,
          evidenceType: s.evidenceType || "INFERENCE",
          confidence: s.confidence || null,
          commercialRelevance: s.commercialRelevance || null,
          signalScore: null,
          supportingEvidenceIds: mapIds(s.supportingEvidenceIds)
        }))
      );
    }

    // Pain hypotheses
    if (llm.painHypotheses && llm.painHypotheses.length) {
      await base44.entities.PainHypothesis.bulkCreate(
        llm.painHypotheses.map((p) => ({
          account: name,
          hypothesis: p.hypothesis,
          reason: p.reason || null,
          evidence: p.evidence || null,
          confidence: p.confidence || null,
          validationRequired: true,
          discoveryQuestion: p.discoveryQuestion || null,
          supportingEvidenceIds: mapIds(p.supportingEvidenceIds)
        }))
      );
    }

    // Buying committee
    if (llm.relevantExecutives && llm.relevantExecutives.length) {
      await base44.entities.BuyingCommitteeMember.bulkCreate(
        llm.relevantExecutives.map((e) => ({
          account: name,
          personName: e.personName || null,
          title: e.title,
          roleType: e.roleType,
          linkedinUrl: e.linkedinUrl || null,
          influence: e.confidence || null,
          likelyPriority: e.personName ? "High" : "Medium",
          evidence: e.personName ? "Identified from public source" : "Not yet identified",
          sourceUrl: urlForIds(e.supportingEvidenceIds),
          supportingEvidenceIds: mapIds(e.supportingEvidenceIds)
        }))
      );
    }

    // Relationship routes
    if (routes.length) {
      await base44.entities.RelationshipRoute.bulkCreate(
        routes.map((r) => ({
          account: name,
          routeType: r.routeType,
          routeDescription: r.routeDescription || null,
          organisation: r.organisation || null,
          person: r.person || null,
          confidence: r.confidence || null,
          recommendedAction: r.recommendedAction || null,
          routeStatus: r.routeStatus === "verified" ? "verified" : "to_investigate",
          sourceUrl: urlForIds(r.supportingEvidenceIds),
          supportingEvidenceIds: mapIds(r.supportingEvidenceIds)
        }))
      );
    }

    return Response.json({ accountId: account.id, account, sourcesCount, warnings: allSearchesOk ? [] : ["Some searches failed; evidence confidence reduced."] });
  } catch (error) {
    return Response.json({ error: 'Research temporarily unavailable. Please retry.' }, { status: 503 });
  }
}