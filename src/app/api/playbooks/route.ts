import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { demoPlaybooks } from "@/services/supabase-demo";

export async function GET(request: Request) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ playbooks: demoPlaybooks, source: "demo" });
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();
  let query = supabase.from("response_playbooks").select("*").order("created_at", { ascending: false }).limit(50);
  if (q) query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%,tactic.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) return NextResponse.json({ playbooks: demoPlaybooks, source: "demo", detail: error.message });
  return NextResponse.json({ playbooks: data?.length ? data : demoPlaybooks, source: "supabase" });
}

export async function POST(request: Request) {
  const supabase = getSupabaseServiceClient();
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid playbook payload" }, { status: 400 });
  if (!supabase) return NextResponse.json({ playbook: body, source: "demo" });
  const { data, error } = await supabase.from("response_playbooks").insert(body).select().single();
  if (error) return NextResponse.json({ playbook: body, source: "demo", detail: error.message });
  return NextResponse.json({ playbook: data, source: "supabase" });
}
