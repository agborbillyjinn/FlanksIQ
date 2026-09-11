#  ### FlanksIQ — AI-Powered UK Territory & Account Intelligence

**FlanksIQ** is an AI-powered territory and account intelligence platform built to demonstrate how I would approach building and executing Flanks' UK go-to-market strategy.

It transforms live public-web research into an evidence-led enterprise sales workflow:

**Account Universe → ICP Qualification → Live Research → Buying Signals → Flanks Fit → Why Now → Opportunity Priority → Pain Hypotheses → Buying Committee → Routes Into Account → Account Strategy → Discovery → MEDDPICC → Next Action**

Rather than allowing AI to present assumptions as facts, FlanksIQ separates **verified facts, grounded findings and hypotheses requiring discovery**, following the principle:

> **AI proposes. Evidence proves. Sales validates.**

Accounts are prioritised across **structural fit, timing, accessibility and evidence confidence**, helping distinguish a great-fit account from one that actually deserves sales attention now.

FlanksIQ also models **ecosystem and multiplier opportunities**—such as WealthTech platforms, CRMs, technology partners and SIs—where one integration or partnership could potentially provide access to multiple downstream wealth institutions.

The result is not simply more account research. It is an **actionable enterprise sales strategy** showing why to pursue an account, who to engage, how to get in, what hypotheses to validate, which Flanks capability may provide the initial wedge, and what the seller should do next.

**Built as a personal GTM execution system—not as an official Flanks product.**



# Base44 Project

Use this repository to run and edit the app locally, then publish changes back through Base44.

Any change pushed to the repo will also be reflected in the Base44 Builder.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. Install the Base44 CLI: `npm install -g base44@latest`.

See the [Base44 CLI docs](https://docs.base44.com/developers/references/cli/get-started/overview) if you want to run Base44 commands directly.

## Run Locally

Run the full local development environment from the project root:

```bash
base44 dev
```

`base44 dev` starts the local Base44 development backend and, when this app is configured for it, also starts the frontend dev server for you. Use the frontend URL printed by the command.

For example, when the Base44 project config includes a `serveCommand`, `base44 dev` can launch the frontend too:

```json5
{
  "site": {
    "serveCommand": "npm run dev"
  }
}
```

In a Base44 project this lives in `base44/config.jsonc`.

## Run Only The Frontend

If you only want to work on the frontend against the hosted Base44 backend, run:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Use The Hosted Backend

For frontend-only development, create or update `.env.local` in the project root:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

`VITE_BASE44_APP_ID` identifies the Base44 app.

`VITE_BASE44_APP_BASE_URL` tells the Base44 Vite plugin where to send local `/api` requests. Point it at your deployed Base44 app URL when you want the local frontend to use the hosted backend.

When you use `base44 dev`, the command injects the local Base44 values for you, so `.env.local` is mainly needed for frontend-only workflows.

## Publish Your Changes

After pushing your changes to git, open the Base44 dashboard and publish the app:

```bash
base44 dashboard open
```

## Docs & Support

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Base44 CLI command reference: [https://docs.base44.com/developers/references/cli/commands/introduction](https://docs.base44.com/developers/references/cli/commands/introduction)

Support: [https://app.base44.com/support](https://app.base44.com/support)
