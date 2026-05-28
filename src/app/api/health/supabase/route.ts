import { NextResponse } from "next/server";
export async function GET() {
  const started = Date.now();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      {
        status: "offline",
        latencyMs: Date.now() - started,
        checkedAt: new Date().toISOString(),
        detail: "Supabase environment variables are missing",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: key },
      cache: "no-store",
    });
    const latencyMs = Date.now() - started;

    return NextResponse.json({
      status: response.ok ? "connected" : "degraded",
      latencyMs,
      checkedAt: new Date().toISOString(),
      detail: response.ok ? "Supabase Auth reachable" : `Supabase responded with ${response.status}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "offline",
        latencyMs: Date.now() - started,
        checkedAt: new Date().toISOString(),
        detail: error instanceof Error ? error.message : "Unknown health check failure",
      },
      { status: 503 },
    );
  }
}
