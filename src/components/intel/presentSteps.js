export const presentSteps = [
  {
    title: "Prioritise the Territory",
    page: "dashboard",
    target: "territory-scores",
    objective: "Explain how the UK territory is prioritised rather than just listed.",
    recommendedInteraction: "Point to Fit, Timing, Access and Priority. Then open the recommended account.",
    doNotSay: "Don't claim accounts are prioritised purely by size.",
    nextInteraction: "Open RBC Brewin Dolphin to advance to Account Intelligence.",
    say: `If you gave me the UK territory tomorrow, the first problem I'd want to solve is where I should spend my selling time.

I wouldn't prioritise accounts purely by size. I'd look at structural Flanks fit, whether there is a reason to engage now, how accessible the account is, and how confident I am in the underlying evidence.

That gives me a prioritised territory rather than simply a list of logos.`,
    note: "Point briefly to Fit, Timing, Access and Priority. Then select a LIVE RESEARCH account.",
  },
  {
    title: "Understand the Opportunity",
    page: "account",
    target: "account-header",
    objective: "Explain the difference between Flanks Fit and Opportunity Priority.",
    recommendedInteraction: "Point to Fit, Timing, Access, Evidence and Priority.",
    doNotSay: "Don't present the score as an AI judgement.",
    nextInteraction: "Move to Why Now.",
    say: `Taking this account as an example, FlanksIQ has conducted live web-grounded research and turned that into an initial account thesis.

I've deliberately separated Flanks Fit from Opportunity Priority.

Fit tells me whether this structurally looks like a strong Flanks account.

Priority tells me how much attention I should give it right now.`,
    note: "Point to Fit, Timing, Access, Evidence and Priority.",
  },
  {
    title: "Find the Trigger",
    page: "account",
    target: "why-now",
    objective: "Explain why this account deserves attention now.",
    recommendedInteraction: "Click one signal and explain its commercial relevance. Do not read every signal.",
    doNotSay: "Don't read every article.",
    nextInteraction: "Move to Hypotheses.",
    say: `The next question is why now.

Rather than prospecting purely because a company matches the ICP, I'm looking for observable signals that could create a commercial reason to engage — transformation, AI and data initiatives, technology change, hiring, expansion or leadership changes.

The important thing is that the system distinguishes between verified information, grounded findings and things that still need validation.`,
    note: "Open one source if useful, but do not spend too long reading articles.",
  },
  {
    title: "Turn Evidence Into Discovery",
    page: "account",
    target: "hypotheses",
    objective: "Show that pains are hypotheses, not facts.",
    recommendedInteraction: "Open one Pain Hypothesis and read its Discovery Question.",
    doNotSay: "Don't present a hypothesis as customer truth.",
    nextInteraction: "Move to Solution Mapping.",
    say: `This is where I deliberately don't want AI pretending it knows the customer's problems.

The evidence gives me an account thesis, but the potential pains are explicitly hypotheses.

For example, if the evidence suggests increasing platform complexity or data transformation, that might indicate aggregation, reconciliation or wealth-data challenges.

But I wouldn't present that as fact. I'd turn it into a discovery question.

AI proposes. Evidence proves. Sales validates.`,
    note: "Point to one Hypothesis — Validate card and its discovery question.",
  },
  {
    title: "Determine the Wedge and Route",
    page: "account",
    target: "solution",
    objective: "Identify the plausible Flanks wedge and the highest-probability route in.",
    recommendedInteraction: "Walk through Solution Mapping, then Routes Into Account.",
    doNotSay: "Don't imply an unverified partner relationship exists.",
    nextInteraction: "Move to Account Strategy.",
    say: `Once I have a hypothesis, I can map the potential initial Flanks wedge.

That might start with Aggregate to create the unified wealth-data layer, potentially expand through Lume for enrichment and reconciliation, and ultimately support CRM, reporting, advisory or AI workflows.

But I also don't think account development should automatically mean cold outbound.

I'm looking at direct routes, partners, technology relationships, Salesforce where relevant, events and existing relationships.

The objective is to find the highest-probability path into the buying committee.`,
    note: "Do not imply an unverified partner relationship exists.",
  },
  {
    title: "Turn Intelligence Into Execution",
    page: "account",
    target: "strategy",
    objective: "Show how research becomes an executable strategy.",
    recommendedInteraction: "Show Discovery Questions and briefly show MEDDPICC. Use the existing generated strategy — don't regenerate live.",
    doNotSay: "Don't read the generated email word-for-word.",
    nextInteraction: "Move to Recommended Next Action.",
    say: `The research only becomes valuable if it changes what I do next.

So the final layer converts the account intelligence into an executable sales strategy — who I approach, the pain I need to validate, the commercial trigger, discovery questions, outreach and an initial MEDDPICC view.`,
    note: "Show Discovery Questions and briefly show MEDDPICC. Do not read the generated email word-for-word.",
  },
  {
    title: "Make It Actionable",
    page: "account",
    target: "next-action",
    objective: "Land on the specific next AE action.",
    recommendedInteraction: "Point to the Recommended Next Action.",
    doNotSay: "Don't claim AI replaces sales judgement.",
    nextInteraction: "STOP. Only analyse another company if the interviewer asks.",
    say: `The output I actually care about is this: what should I do next?

The objective isn't to replace sales judgement with AI. It's to reduce research time, improve prioritisation and give me a stronger hypothesis before I speak to the customer.

Sales fundamentals still come first. AI improves the speed and quality of execution.

And this isn't a static dataset. The research workflow is live, so if you gave me another UK institution, I could run the same initial analysis against it.`,
    note: "STOP HERE. Do not automatically launch another analysis. Only analyse another company if the interviewer asks to see it.",
  },
];