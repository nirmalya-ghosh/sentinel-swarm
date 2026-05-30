from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from agents import run_swarm
from config import Settings, get_settings
from models import SwarmResponse, ThreatInput

app = FastAPI(title="Sentinel Swarm AI Microservice", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def verify_proxy_token(
    settings: Settings = Depends(get_settings),
    x_sentinel_proxy_token: str | None = Header(default=None),
) -> None:
    if settings.allowed_proxy_token and x_sentinel_proxy_token != settings.allowed_proxy_token:
        raise HTTPException(status_code=401, detail="Invalid Sentinel proxy token")


@app.get("/health")
async def health(settings: Settings = Depends(get_settings)) -> dict[str, str | bool]:
    return {
        "status": "ok",
        "azure_ready": settings.azure_ready,
        "demo_mode": settings.effective_demo_mode,
    }


@app.post("/swarm/analyze", response_model=SwarmResponse, dependencies=[Depends(verify_proxy_token)])
async def analyze(threat: ThreatInput, settings: Settings = Depends(get_settings)) -> SwarmResponse:
    return await run_swarm(threat, settings)
