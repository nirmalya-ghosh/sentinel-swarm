# Sentinel Swarm

Sentinel Swarm is a production-style futuristic AI cybersecurity platform built with Next.js 15, TypeScript, TailwindCSS, Framer Motion, shadcn-style primitives, Supabase, OpenAI, and LangChain/CrewAI-compatible orchestration routes.

## Features

- Cinematic dark landing page with animated cyber visuals, glassmorphism, smooth motion, and CTAs.
- Supabase Auth login/signup flow with middleware session refresh.
- Responsive autonomous SOC dashboard with sidebar, top nav, live threat feed, analytics charts, severity indicators, incident timeline, and health scores.
- Four collaborative AI agents: Monitor, Analyst, Defender, and Recovery.
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

The dashboard works with generated demo data even before Supabase/OpenAI keys are added. Add real keys to enable Supabase sessions and OpenAI-backed agent orchestration.

## Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Enable email/password auth.
4. Add the public URL and anon key to `.env.local`.
5. To enable Google login, turn on the Google provider in Supabase Auth, add your Google OAuth client ID/secret, and allow `http://localhost:3000/auth/callback` as a redirect URL for local development.

## AI Orchestration

`src/services/agents.ts` uses a CrewAI/LangChain-compatible agent contract. Without `OPENAI_API_KEY`, it returns deterministic demo messages. With an OpenAI key, `/api/agents/collaborate` asks the model to produce structured collaboration messages for the SOC agents.

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel
```

Configure all environment variables in the Vercel project settings. For production, keep Supabase RLS enabled, use service-role keys only in server-only code, and rotate keys after demos.
