// ============================================================================
// API: /api/email-flags — List or create email flags
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
      .from("email_flags")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });
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
    const { subject, from_email, flag_type } = body;
    if (!subject || !from_email || !flag_type) {
      return NextResponse.json({ data: null, error: "subject, from_email, and flag_type are required" }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { data, error } = await (supabase as any)
      .from("email_flags")
      .insert({
        org_id: orgId,
        subject,
        from_email,
        flag_type,
        body_snippet: body.body_snippet ?? null,
        triaged: false,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: err.message }, { status: 500 });
  }
}
