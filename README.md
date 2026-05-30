# Sentinel Swarm

Sentinel Swarm is a production-style futuristic AI cybersecurity platform built with Next.js 15, TypeScript, TailwindCSS, Framer Motion, shadcn-style primitives, Supabase, and a Python FastAPI AI microservice designed for Azure OpenAI Service.

## Features

- Cinematic dark landing page with animated cyber visuals, glassmorphism, smooth motion, and CTAs.
- Supabase Auth login/signup flow with middleware session refresh.
- Responsive autonomous SOC dashboard with sidebar, top nav, live threat feed, analytics charts, severity indicators, incident timeline, and health scores.
- Five collaborative AI agents: Monitor, Analyst, Defender, Recovery, and Orchestrator.
- Conflict-resolution manager with confidence matrices and explicit audit reasoning.
- Inline adversarial prompt guard for malicious log entries.
- Lightweight RAG grounding over seeded NIST/MITRE incident response playbooks.
- Active containment simulation for firewall blocks, Supabase Auth session revocation, and key rotation.
- AI vs AI battle simulator with Red Team attacker, Blue Team defender, live logs, probabilities, and security score.
- Animated threat intelligence world map with attack pulses.
- Client PDF incident report generator plus server markdown report API.
- Polling-ready API routes for threats, agent collaboration, battle simulation, and reports.
- Demo mode for unauthenticated evaluation while keeping operational routes protected by default.
- Incident detail pages with MITRE ATT&CK mapping, evidence, affected assets, and remediation actions.
- Command palette, toast alerts, voice alert trigger, audit log, RBAC display, onboarding, settings, health check, and hardened security headers.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The dashboard works with generated demo data even before Supabase or Azure keys are added. Run the FastAPI service to enable the production-style agent layer.

```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEMO_MODE=true
SENTINEL_SWARM_AI_URL=http://127.0.0.1:8000
SENTINEL_SWARM_PROXY_TOKEN=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_DEPLOYMENT_NAME=
AZURE_OPENAI_GUARD_DEPLOYMENT_NAME=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Enable email/password auth.
4. Add the public URL and anon key to `.env.local`.
5. To enable Google login, turn on the Google provider in Supabase Auth, add your Google OAuth client ID/secret, and allow `http://localhost:3000/auth/callback` as a redirect URL for local development.

## AI Orchestration

Next.js API routes act as secure reverse proxies into `server/main.py`. The FastAPI service runs a deterministic five-agent state loop, inspects logs for prompt injection before model exposure, retrieves grounded NIST/MITRE playbook context, executes mock containment actions, and returns structured JSON to the dashboard. Without Azure variables, the service and Next.js proxy both fall back to deterministic demo responses.

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel
```

Configure all environment variables in the Vercel project settings. For production, keep Supabase RLS enabled, use service-role keys only in server-only code, and rotate keys after demos.
