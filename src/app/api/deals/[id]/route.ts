// ============================================================================
// API: /api/deals/[id] — Read, update, or advance a specific deal
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getDeal, advanceDeal } from "@/lib/queries";
import { createAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deal = await getDeal(id);
    if (!deal) {
      return NextResponse.json(
        { data: null, error: "Deal not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: deal, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Failed to fetch deal" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const supabase = createAdminClient();

    // Build update payload from allowed fields
    type DealUpdate = Database["public"]["Tables"]["deals"]["Update"];
    const updates: DealUpdate = {};
    const allowedFields = [
      "address",
      "client_name",
      "client_email",
      "client_phone",
      "agent",
      "price",
      "type",
      "status",
      "close_date",
      "contract_close_date",
      "notes",
      "stage_idx",
      "stage_entered_at",
      "active_entered_at",
    ] as const;

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as any)[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { data: null, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    (updates as any).updated_at = new Date().toISOString();

    const { data, error } = await (supabase as any)
      .from("deals")
      .update(updates as any)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    if (!data) {
      return NextResponse.json(
        { data: null, error: "Deal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Failed to update deal" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.stage_idx === undefined || typeof body.stage_idx !== "number") {
      return NextResponse.json(
        { data: null, error: "stage_idx (number) is required" },
        { status: 400 }
      );
    }

    const deal = await advanceDeal(id, body.stage_idx);
    return NextResponse.json({ data: deal, error: null });
  } catch (err: any) {
    const status = err.message === "Deal not found" ? 404 : 500;
    return NextResponse.json(
      { data: null, error: err.message || "Failed to advance deal" },
      { status }
    );
  }
}
