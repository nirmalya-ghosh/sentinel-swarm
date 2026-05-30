# Sentinel Swarm FastAPI AI Service

This service owns the AI layer for Sentinel Swarm:

- Azure OpenAI backed five-agent SOC swarm.
- Inline prompt-injection guard before model exposure.
- Lightweight local RAG over seeded NIST/MITRE playbooks.
- Deterministic demo mode when Azure variables are missing.
- Mock containment executors for firewall, Supabase Auth session revocation, and key rotation.

## Run locally

```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The Next.js app proxies to `SENTINEL_SWARM_AI_URL`, defaulting to `http://127.0.0.1:8000`.

## Azure environment

```bash
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
AZURE_OPENAI_GUARD_DEPLOYMENT_NAME=phi-4-mini
DEMO_MODE=false
```
