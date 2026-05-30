import { NextResponse } from "next/server";
import { threats } from "@/data/threats";
import { analyzeThreat } from "@/services/swarm";
import { persistSwarmRun } from "@/services/swarm-persistence";
import type { Threat } from "@/types/security";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { threat?: Threat } | null;
  const threat = body?.threat ?? threats[0];
  const swarm = await analyzeThreat(threat);
  await persistSwarmRun(threat, swarm);
  return NextResponse.json(swarm);
}
