import { NextResponse } from "next/server";
import { reportMarkdown } from "@/services/reports";
import type { ReportInput } from "@/types/security";

export async function POST(request: Request) {
  const body = (await request.json()) as ReportInput;
  return NextResponse.json({
    format: "markdown",
    report: reportMarkdown(body),
  });
}
