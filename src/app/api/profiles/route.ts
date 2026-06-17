// ============================================================================
// API: /api/profiles — List or create team members
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
      .from("profiles")
      .select("*")
      .eq("org_id", orgId)
      .order("full_name");
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
    const { full_name, role, location } = body;
    if (!full_name || !role || !location) {
      return NextResponse.json(
        { data: null, error: "full_name, role, and location are required" },
        { status: 400 }
      );
    }
    const supabase = createAdminClient();
    const { data, error } = await (supabase as any)
      .from("profiles")
      .insert({
        org_id: orgId,
        full_name,
        role,
        location,
        active: true,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: err.message }, { status: 500 });
  }
}
