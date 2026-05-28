import { NextResponse } from "next/server";
import { threats } from "@/data/threats";
import { orchestrateAgents } from "@/services/agents";
import type { Threat } from "@/types/security";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { threat?: Threat } | null;
  const threat = body?.threat ?? threats[0];
  const messages = await orchestrateAgents(threat);
  return NextResponse.json({
    orchestration: "langchain-crewai-compatible",
    messages,
  });
}
