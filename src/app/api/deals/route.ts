// ============================================================================
// API: /api/deals — List all deals or create a new deal
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getDeals, createDeal } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const orgId = request.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { data: null, error: "Missing x-org-id header" },
        { status: 400 }
      );
    }

    const deals = await getDeals(orgId);
    return NextResponse.json({ data: deals, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Failed to fetch deals" },
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
    const { address, client_name, agent } = body;

    // Required fields
    if (!address || !client_name || !agent) {
      return NextResponse.json(
        { data: null, error: "address, client_name, and agent are required" },
        { status: 400 }
      );
    }

    const deal = await createDeal({
      org_id: orgId,
      address,
      client_name,
      agent,
      stage_idx: body.stage_idx ?? 0,
      price: body.price ?? null,
      type: body.type ?? "sale",
      close_date: body.close_date ?? null,
      client_email: body.client_email ?? null,
      client_phone: body.client_phone ?? null,
      notes: body.notes ?? null,
    });

    return NextResponse.json({ data: deal, error: null }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Failed to create deal" },
      { status: 500 }
    );
  }
}
