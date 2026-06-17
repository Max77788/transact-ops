// ============================================================================
// API: /api/open-houses — List or create open houses
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await (supabase as any)
      .from("open_houses")
      .select("*, deals!open_houses_deal_id_fkey(address)")
      .order("scheduled_at", { ascending: true })
      .limit(50);
    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deal_id, scheduled_at } = body;
    if (!deal_id || !scheduled_at) {
      return NextResponse.json({ data: null, error: "deal_id and scheduled_at are required" }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { data, error } = await (supabase as any)
      .from("open_houses")
      .insert({ deal_id, scheduled_at, status: "scheduled" })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: err.message }, { status: 500 });
  }
}
