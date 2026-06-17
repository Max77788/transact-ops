// ============================================================================
// API: /api/stage-steps — List or create stage steps
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await (supabase as any)
      .from("stage_steps")
      .select("*")
      .order("idx");
    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stage_id, name, idx } = body;
    if (!stage_id || !name || idx === undefined) {
      return NextResponse.json(
        { data: null, error: "stage_id, name, and idx are required" },
        { status: 400 }
      );
    }
    const supabase = createAdminClient();
    const { data, error } = await (supabase as any)
      .from("stage_steps")
      .insert({ stage_id, name, idx })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: err.message }, { status: 500 });
  }
}
