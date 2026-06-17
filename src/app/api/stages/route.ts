// ============================================================================
// API: /api/stages — List or create pipeline stages and steps
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const orgId = request.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ data: null, error: "Missing x-org-id header" }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { data, error } = await (supabase as any)
      .from("stages")
      .select("*, steps:stage_steps(*)")
      .eq("org_id", orgId)
      .order("idx");
    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ data: null, error: "Missing x-org-id header" }, { status: 400 });
    }
    const body = await request.json();
    const { name, idx, description } = body;
    if (!name || idx === undefined) {
      return NextResponse.json(
        { data: null, error: "name and idx are required" },
        { status: 400 }
      );
    }
    const supabase = createAdminClient();
    const { data, error } = await (supabase as any)
      .from("stages")
      .insert({
        org_id: orgId,
        name,
        idx,
        description: description ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: err.message }, { status: 500 });
  }
}
