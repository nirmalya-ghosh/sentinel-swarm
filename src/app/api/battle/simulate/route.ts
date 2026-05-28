import { NextResponse } from "next/server";

export async function POST() {
  const attackerScore = Math.floor(38 + Math.random() * 34);
  const defenderScore = Math.floor(62 + Math.random() * 32);

  return NextResponse.json({
    redTeam: {
      action: "Generated evasive cloud credential attack path",
      successProbability: attackerScore,
    },
    blueTeam: {
      action: "Deployed policy guardrail, honeytoken lure, and EDR isolation",
      successProbability: defenderScore,
    },
    securityScore: Math.max(30, Math.min(99, defenderScore - attackerScore + 72)),
  });
}
