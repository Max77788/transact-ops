// ============================================================================
// API: /api/owners — List or create property owners
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
      .from("owners")
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
    const { full_name, property_address } = body;
    if (!full_name || !property_address) {
      return NextResponse.json(
        { data: null, error: "full_name and property_address are required" },
        { status: 400 }
      );
    }
    const supabase = createAdminClient();
    const { data, error } = await (supabase as any)
      .from("owners")
      .insert({
        org_id: orgId,
        full_name,
        property_address,
        email: body.email ?? null,
        phone: body.phone ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: err.message }, { status: 500 });
  }
}
