// ============================================================================
// API: /api/checkins — List all checkins or create a new checkin
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const orgId = request.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { data: null, error: "Missing x-org-id header" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from("checkins")
      .select("*, owner:owners!inner(*), actions:checkin_actions(*)")
      .eq("owners.org_id", orgId)
      .order("scheduled_date", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Failed to fetch checkins" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { data: null, error: "Missing x-org-id header" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { owner_id, scheduled_date } = body;

    if (!owner_id || !scheduled_date) {
      return NextResponse.json(
        { data: null, error: "owner_id and scheduled_date are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify owner belongs to this org
    const { data: owner } = await (supabase as any)
      .from("owners")
      .select("id, org_id")
      .eq("id", owner_id)
      .eq("org_id", orgId)
      .single();

    if (!owner) {
      return NextResponse.json(
        { data: null, error: "Owner not found or not in this org" },
        { status: 404 }
      );
    }

    const { data, error } = await (supabase as any)
      .from("checkins")
      .insert({
        owner_id,
        scheduled_date,
        scheduled_time: body.scheduled_time ?? null,
        status: "awaiting",
        stage_idx_at_call: body.stage_idx_at_call ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Failed to create checkin" },
      { status: 500 }
    );
  }
}
