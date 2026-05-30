import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function GET() {
  const supabase = getSupabaseServiceClient();
  const schemaPath = path.join(process.cwd(), "supabase", "schema.sql");
  const sql = await readFile(schemaPath, "utf8");

  if (!supabase) {
    return NextResponse.json({
      ready: false,
      detail: "Supabase service credentials are missing.",
      sql,
    });
  }

  const { error } = await supabase.from("incidents").select("id").limit(1);

  return NextResponse.json({
    ready: !error,
    detail: error ? error.message : "Supabase schema is ready.",
    sql,
  });
}
