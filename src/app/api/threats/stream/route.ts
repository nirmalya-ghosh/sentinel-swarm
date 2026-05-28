import { NextResponse } from "next/server";
import { threats } from "@/data/threats";

export async function GET() {
  const enriched = threats.map((threat) => ({
    ...threat,
    timestamp: new Date().toISOString(),
    confidence: Math.min(99, threat.confidence + Math.floor(Math.random() * 3)),
  }));

  return NextResponse.json({ threats: enriched, mode: "polling", refreshMs: 4000 });
}
