import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const signalTypeEnum = [
  "AI", "Data Transformation", "Digital Transformation", "Salesforce", "Hiring",
  "Executive Change", "M&A", "Expansion", "New Product", "Regulatory",
  "Wealth Expansion", "Technology Modernisation", "Partnership"
];

const scoringLevel = {
  type: "object",
  properties: {
    level: { type: "string" },
    reason: { type: "string" },
    confidence: { type: "number" },
    sourceName: { type: "string" },
    sourceUrl: { type: "string" }
  },
  required: ["level", "reason"]
};

const responseSchema = {
  type: "object",
  properties: {
    companyProfile: {
      type: "object",
      properties: {
        name: { type: "string" },
        segment: { type: "string" },
        subsegment: { type: "string" },
        headquarters: { type: "string" },
        ukPresence: { type: "string" },
        employeeCount: { type: "number" },
        aum: { type: "number" },
        clientCount: { type: "number" },
        advisorCount: { type: "number" },
        locations: { type: "string" },
        description: { type: "string" },
        website: { type: "string" },
        linkedin: { type: "string" },
        classification: { type: "string", enum: ["VERIFIED_FACT", "GROUNDED_FINDING", "UNKNOWN"] },
        confidence: { type: "number" },
        sourceName: { type: "string" },
        sourceUrl: { type: "string" }
      }
    },
    signals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          signalType: { type: "string", enum: signalTypeEnum },
          headline: { type: "string" },
          description: { type: "string" },
          classification: { type: "string", enum: ["VERIFIED_FACT", "GROUNDED_FINDING", "HYPOTHESIS"] },
          confidence: { type: "number" },
          sourceName: { type: "string" },
          sourceUrl: { type: "string" },
          publishedDate: { type: "string" },
          signalDate: { type: "string" },
          commercialRelevance: { type: "string" }
        },
        required: ["signalType", "headline", "classification"]
      }
    },
    executives: {
      type: "array",
      items: {
        type: "object",
        properties: {
          personName: { type: "string" },
          title: { type: "string" },
          roleType: { type: "string", enum: ["Economic Buyer", "Champion", "Technical Buyer", "User", "Risk", "Commercial", "Influencer"] },
          linkedinUrl: { type: "string" },
          classification: { type: "string", enum: ["VERIFIED_FACT", "GROUNDED_FINDING", "UNKNOWN"] },
          confidence: { type: "number" },
          sourceName: { type: "string" },
          sourceUrl: { type: "string" }
        },
        required: ["title", "roleType", "classification"]
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
          discoveryQuestion: { type: "string" }
        },
        required: ["hypothesis", "reason"]
      }
    },
    relationshipRoutes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          routeType: { type: "string", enum: ["Direct", "Partner", "Salesforce", "Technology", "Event", "Existing Relationship"] },
          routeDescription: { type: "string" },
          organisation: { type: "string" },
          person: { type: "string" },
          confidence: { type: "number" },
          recommendedAction: { type: "string" },
          routeStatus: { type: "string", enum: ["verified", "to_investigate"] },
          sourceName: { type: "string" },
          sourceUrl: { type: "string" }
        },
        required: ["routeType", "routeStatus"]
      }
    },
    scoringInputs: {
      type: "object",
      properties: {
        icpAlignment: scoringLevel,
        wealthDataComplexity: scoringLevel,
        commercialScale: scoringLevel,
        multiCustodianComplexity: scoringLevel,
        technologyCompatibility: scoringLevel,
        strategicRelevance: scoringLevel,
        transformationInitiative: scoringLevel,
        aiDataInitiative: scoringLevel,
        technologyModernisation: scoringLevel,
        executiveChange: scoringLevel,
        expansionMA: scoringLevel,
        hiringTrigger: scoringLevel,
        salesforceRoute: scoringLevel,
        entryAngle: scoringLevel,
        identifiableCommittee: scoringLevel,
        partnerRoute: scoringLevel,
        eventRoute: scoringLevel
      }
    }
  },
  required: ["companyProfile", "signals", "executives", "painHypotheses", "relationshipRoutes", "scoringInputs"]
};

function points(level, map) {
  return map[level] != null ? map[level] : 0;
}

function dim(name, score, maximumScore, level, reason, confidence) {
  return { name, score, maximumScore, level: level || "unknown", reason: reason || null, confidence: confidence != null ? confidence : null };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const name = body && body.name && body.name.trim();
    const domain = body && body.domain && body.domain.trim();
    if (!name || !domain) return Response.json({ error: 'name and domain are required' }, { status: 400 });

    const prompt = `You are conducting live public-web account research for an enterprise Account Executive selling wealth-data infrastructure (Flanks: "Aggregate" unifies multi-custodian wealth data; "Lume" enriches and reconciles it) into UK wealth management and financial services.

Use the live internet context available to you to research the company: ${name} (website: ${domain}).

Research across ALL of these areas (prioritise the most recent information for timing):
1. Company profile (name, segment, headquarters, UK presence, locations, description, website, LinkedIn)
2. Wealth-management / financial-services segment and subsegment
3. Scale indicators (employees)
4. AUM where publicly available
5. Client numbers where publicly available
6. Adviser numbers where publicly available
7. Digital transformation programmes
8. Data transformation / data infrastructure programmes
9. AI initiatives and AI/data projects
10. Technology modernisation
11. Salesforce / CRM indicators
12. Acquisitions
13. Expansion (geographic or segment)
14. New products / launches
15. Relevant hiring signals
16. Executive changes
17. Relevant senior executives (name + title only when publicly identifiable)
18. Wealth-data complexity indicators (multi-custodian, held-away assets, reconciliation, reporting complexity)
19. Partnerships and other recent buying signals

STRICT RESEARCH RULES:
- You are conducting live public-web research. Do not fill gaps with assumptions or prior knowledge.
- If information cannot be established from available live internet context, return UNKNOWN / null. Do not guess.
- Never invent: AUM, client counts, adviser counts, executive names, technology usage, Salesforce usage, acquisitions, partnerships, transformation programmes, or AI initiatives.
- Separate factual research from sales interpretation.
- Return a confidence score (0-100) for every important finding.

EVIDENCE CLASSIFICATIONS (use exactly these for every signal, executive and the company profile):
- VERIFIED_FACT — the finding is supported by enough identifiable source information (and a sourceUrl is available) to substantiate the claim.
- GROUNDED_FINDING — information returned from live internet-grounded research where full source provenance is incomplete (sourceUrl may be null).
- HYPOTHESIS — a sales interpretation / hypothesis requiring discovery validation (use this only for signals that are clearly interpretive, not for sourced facts).
Never present an unsupported claim as VERIFIED_FACT. If sourceUrl is unavailable, leave it null — never fabricate a URL.

For each signal, set signalType to one of: ${signalTypeEnum.join(", ")}. Emit a signal for every notable finding in those categories. Put company profile / scale / wealth-data complexity facts into companyProfile and the scoringInputs reasons rather than as signals.

For scoringInputs, set "level" for each dimension based ONLY on what the live research supports:
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
- identifiableCommittee: confirmed | likely | unknown
- partnerRoute: confirmed | likely | unknown
- eventRoute: confirmed | likely | unknown
Do not set "confirmed" without supporting research. Where there is no evidence, use "unknown". Provide a short reason and a confidence score for each.

For executives: include a person ONLY when a name is publicly identifiable from the research; otherwise omit that executive. Never invent a name. Set roleType to the closest buying-committee role.

For relationshipRoutes: set routeStatus to "verified" only where the route is evidenced (e.g. a named partnership, a confirmed Salesforce ecosystem, a confirmed event/relationship); otherwise "to_investigate". Never imply Flanks has a relationship with another organisation without evidence.

For painHypotheses: generate likely sales pains derivable from the researched evidence (e.g. fragmented custodian data, held-away assets, incomplete wealth visibility, manual reconciliation, portfolio reporting complexity, data-quality problems, adviser administration, AI-data readiness). Each must include why the hypothesis exists, the research finding that prompted it, a confidence score, and a discovery question. These are HYPOTHESIS — VALIDATE by definition.

Return strictly as JSON matching the schema. Use null for any field that cannot be established.`;

    const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: "gemini_3_1_pro",
      response_json_schema: responseSchema
    });

    const profile = llm.companyProfile || {};
    const signals = Array.isArray(llm.signals) ? llm.signals : [];
    const executives = Array.isArray(llm.executives) ? llm.executives : [];
    const pains = Array.isArray(llm.painHypotheses) ? llm.painHypotheses : [];
    const routes = Array.isArray(llm.relationshipRoutes) ? llm.relationshipRoutes : [];
    const si = llm.scoringInputs || {};

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

    // Persist research findings as Evidence (the research log)
    const now = new Date().toISOString();
    if (signals.length) {
      await base44.entities.Evidence.bulkCreate(
        signals.map((s) => ({
          account: name,
          claim: `${s.headline}${s.description ? `. ${s.description}` : ""}`.slice(0, 1000),
          sourceUrl: s.sourceUrl || null,
          sourceTitle: s.sourceName || null,
          publishedDate: s.publishedDate || s.signalDate || null,
          evidenceType: s.classification || "GROUNDED_FINDING",
          confidence: s.confidence != null ? s.confidence : null,
          retrievedAt: now,
          searchTheme: s.signalType
        }))
      );
    }

    // --- Scoring (calculated deterministically from research levels, not LLM-invented) ---
    const flanksFitDims = [
      dim("ICP Alignment", points(si.icpAlignment?.level, { confirmed: 10, inferred: 6 }), 10, si.icpAlignment?.level, si.icpAlignment?.reason, si.icpAlignment?.confidence),
      dim("Wealth Data Complexity", points(si.wealthDataComplexity?.level, { high: 15, medium: 9, low: 4 }), 15, si.wealthDataComplexity?.level, si.wealthDataComplexity?.reason, si.wealthDataComplexity?.confidence),
      dim("Commercial Potential", points(si.commercialScale?.level, { large: 10, medium: 6, small: 3 }), 10, si.commercialScale?.level, si.commercialScale?.reason, si.commercialScale?.confidence),
      dim("Multi-Custodian Complexity", points(si.multiCustodianComplexity?.level, { confirmed: 10, likely: 6 }), 10, si.multiCustodianComplexity?.level, si.multiCustodianComplexity?.reason, si.multiCustodianComplexity?.confidence),
      dim("Technology / Integration Compatibility", points(si.technologyCompatibility?.level, { confirmed: 10, likely: 6 }), 10, si.technologyCompatibility?.level, si.technologyCompatibility?.reason, si.technologyCompatibility?.confidence),
      dim("Strategic Relevance", points(si.strategicRelevance?.level, { confirmed: 5, inferred: 3 }), 5, si.strategicRelevance?.level, si.strategicRelevance?.reason, si.strategicRelevance?.confidence)
    ];
    const timingDims = [
      dim("Transformation Initiative", points(si.transformationInitiative?.level, { confirmed: 5, likely: 3 }), 5, si.transformationInitiative?.level, si.transformationInitiative?.reason, si.transformationInitiative?.confidence),
      dim("AI / Data Initiative", points(si.aiDataInitiative?.level, { confirmed: 5, likely: 3 }), 5, si.aiDataInitiative?.level, si.aiDataInitiative?.reason, si.aiDataInitiative?.confidence),
      dim("Technology Modernisation", points(si.technologyModernisation?.level, { confirmed: 4, likely: 2 }), 4, si.technologyModernisation?.level, si.technologyModernisation?.reason, si.technologyModernisation?.confidence),
      dim("Executive / Organisational Change", points(si.executiveChange?.level, { confirmed: 3, likely: 1 }), 3, si.executiveChange?.level, si.executiveChange?.reason, si.executiveChange?.confidence),
      dim("Expansion / M&A / Product Change", points(si.expansionMA?.level, { confirmed: 4, likely: 2 }), 4, si.expansionMA?.level, si.expansionMA?.reason, si.expansionMA?.confidence),
      dim("Relevant Hiring / Other Trigger", points(si.hiringTrigger?.level, { confirmed: 4, likely: 2 }), 4, si.hiringTrigger?.level, si.hiringTrigger?.reason, si.hiringTrigger?.confidence)
    ];
    const accessDims = [
      dim("Identifiable Buying Committee", points(si.identifiableCommittee?.level, { confirmed: 3, likely: 2 }), 3, si.identifiableCommittee?.level, si.identifiableCommittee?.reason, si.identifiableCommittee?.confidence),
      dim("Partner / Ecosystem Route", points(si.partnerRoute?.level, { confirmed: 4, likely: 1 }), 4, si.partnerRoute?.level, si.partnerRoute?.reason, si.partnerRoute?.confidence),
      dim("Salesforce / Technology Route", points(si.salesforceRoute?.level, { confirmed: 3, likely: 1 }), 3, si.salesforceRoute?.level, si.salesforceRoute?.reason, si.salesforceRoute?.confidence),
      dim("Event / Relationship Route", points(si.eventRoute?.level, { confirmed: 2, likely: 1 }), 2, si.eventRoute?.level, si.eventRoute?.reason, si.eventRoute?.confidence),
      dim("Compelling Entry Angle", points(si.entryAngle?.level, { strong: 3, some: 1, none: 0 }), 3, si.entryAngle?.level, si.entryAngle?.reason, si.entryAngle?.confidence)
    ];

    const sum = (arr) => arr.reduce((a, d) => a + d.score, 0);
    const ffRaw = sum(flanksFitDims);
    const tmRaw = sum(timingDims);
    const acRaw = sum(accessDims);
    const norm = (raw, max) => Math.round((raw / max) * 100);
    const flanksFit = norm(ffRaw, 60);
    const timing = norm(tmRaw, 25);
    const access = norm(acRaw, 15);

    const sourcesCount = signals.filter((s) => s.sourceUrl).length;
    const verifiedCount = signals.filter((s) => s.classification === "VERIFIED_FACT").length;
    const evidenceConfidence = Math.max(0, Math.min(100, (signals.length ? 5 : 0) + sourcesCount * 8 + verifiedCount * 4));
    const priority = Math.round(0.45 * flanksFit + 0.30 * timing + 0.15 * access + 0.10 * evidenceConfidence);
    const tier = priority >= 80 ? "Tier 1" : priority >= 65 ? "Tier 2" : "Tier 3";

    const scoreBreakdown = {
      flanksFit: { raw: ffRaw, maximum: 60, normalized: flanksFit, dimensions: flanksFitDims },
      timing: { raw: tmRaw, maximum: 25, normalized: timing, dimensions: timingDims },
      access: { raw: acRaw, maximum: 15, normalized: access, dimensions: accessDims },
      evidenceConfidence: { score: evidenceConfidence, sourcesCount, verifiedCount, reason: `${sourcesCount} sourced finding(s), ${verifiedCount} verified fact(s) from live internet research` },
      priority: { flanksFit, timing, access, evidenceConfidence, score: priority }
    };

    const seg = (profile.segment || "").trim() || undefined;
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
      primaryTrigger: (signals[0] && signals[0].headline) || null,
      recommendedAction: (routes[0] && routes[0].recommendedAction) || null,
      salesforceDetected: si.salesforceRoute?.level === "confirmed" || si.salesforceRoute?.level === "likely",
      aiInitiativeDetected: si.aiDataInitiative?.level === "confirmed" || si.aiDataInitiative?.level === "likely",
      highDataComplexity: si.wealthDataComplexity?.level === "high" || si.wealthDataComplexity?.level === "medium",
      activeTrigger: tmRaw > 0,
      dataSource: "live",
      researchedAt: now,
      sourcesCount,
      scoreBreakdown
    };

    let account;
    if (existing) {
      account = await base44.entities.Account.update(existing.id, accountFields);
    } else {
      account = await base44.entities.Account.create(accountFields);
    }

    // Signals (Why Now)
    if (signals.length) {
      await base44.entities.AccountSignal.bulkCreate(
        signals.map((s) => ({
          account: name,
          signalType: s.signalType,
          headline: s.headline,
          description: s.description || null,
          signalDate: s.signalDate || s.publishedDate || null,
          sourceUrl: s.sourceUrl || null,
          sourceName: s.sourceName || null,
          evidenceType: s.classification || "GROUNDED_FINDING",
          confidence: s.confidence != null ? s.confidence : null,
          commercialRelevance: s.commercialRelevance || null,
          signalScore: null,
          supportingEvidenceIds: []
        }))
      );
    }

    // Pain hypotheses
    if (pains.length) {
      await base44.entities.PainHypothesis.bulkCreate(
        pains.map((p) => ({
          account: name,
          hypothesis: p.hypothesis,
          reason: p.reason || null,
          evidence: p.evidence || null,
          confidence: p.confidence != null ? p.confidence : null,
          validationRequired: true,
          discoveryQuestion: p.discoveryQuestion || null,
          supportingEvidenceIds: []
        }))
      );
    }

    // Buying committee
    if (executives.length) {
      await base44.entities.BuyingCommitteeMember.bulkCreate(
        executives.map((e) => ({
          account: name,
          personName: e.personName || null,
          title: e.title,
          roleType: e.roleType,
          linkedinUrl: e.linkedinUrl || null,
          influence: e.confidence != null ? e.confidence : null,
          likelyPriority: e.personName ? "High" : "Medium",
          evidence: e.personName ? (e.classification === "VERIFIED_FACT" ? "Identified from public source" : "Identified from live research (partial provenance)") : "Not yet identified — likely persona",
          sourceUrl: e.sourceUrl || null,
          supportingEvidenceIds: []
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
          confidence: r.confidence != null ? r.confidence : null,
          recommendedAction: r.recommendedAction || null,
          routeStatus: r.routeStatus === "verified" ? "verified" : "to_investigate",
          sourceUrl: r.sourceUrl || null,
          supportingEvidenceIds: []
        }))
      );
    }

    return Response.json({ accountId: account.id, account, sourcesCount, warnings: [] });
  } catch (error) {
    return Response.json({ error: 'Live research temporarily unavailable. Please retry.' }, { status: 503 });
  }
}