import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ audit: [], source: "demo" });

  const { searchParams } = new URL(request.url);
  const target = searchParams.get("target");
  let query = supabase.from("operator_activity").select("*").order("created_at", { ascending: false }).limit(50);
  if (target) query = query.eq("target", target);

  const { data, error } = await query;
  if (error) return NextResponse.json({ audit: [], source: "demo", detail: error.message });
  return NextResponse.json({ audit: data, source: "supabase" });
}

export async function POST(request: Request) {
  const supabase = getSupabaseServiceClient();
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid audit payload" }, { status: 400 });
  if (!supabase) return NextResponse.json({ audit: body, source: "demo" });

  const { data, error } = await supabase.from("operator_activity").insert(body).select().single();
  if (error) return NextResponse.json({ audit: body, source: "demo", detail: error.message });
  return NextResponse.json({ audit: data, source: "supabase" });
}
