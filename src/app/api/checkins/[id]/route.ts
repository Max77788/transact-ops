// ============================================================================
// API: /api/checkins/[id] — Update checkin fields
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { updateCheckin } from "@/lib/queries";
import type { CheckinStatus, CheckinSentiment } from "@/lib/database.types";

const VALID_STATUSES: CheckinStatus[] = ["awaiting", "scheduled", "completed", "noshow"];
const VALID_SENTIMENTS: CheckinSentiment[] = ["pos", "neu", "neg"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { data: null, error: "Request body is empty" },
        { status: 400 }
      );
    }

    // Build updates from allowed fields
    const updates: Record<string, any> = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { data: null, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    if (body.sentiment !== undefined) {
      if (body.sentiment !== null && !VALID_SENTIMENTS.includes(body.sentiment)) {
        return NextResponse.json(
          { data: null, error: `Invalid sentiment. Must be one of: ${VALID_SENTIMENTS.join(", ")}` },
          { status: 400 }
        );
      }
      updates.sentiment = body.sentiment;
    }

    const scalarFields = [
      "notes",
      "ai_summary",
      "combined_summary",
      "raw_notes",
      "recording_url",
      "transcript_url",
      "booking_link",
      "scheduled_date",
      "scheduled_time",
      "call_date",
      "stage_idx_at_call",
    ];

    for (const field of scalarFields) {
      // Map request keys to DB column names
      const dbField = field === "notes" ? "raw_notes" : field;
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Also allow the db column name directly
    if (body.raw_notes !== undefined && !("notes" in body)) {
      updates.raw_notes = body.raw_notes;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { data: null, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const checkin = await updateCheckin(id, updates);
    if (!checkin) {
      return NextResponse.json(
        { data: null, error: "Checkin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: checkin, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Failed to update checkin" },
      { status: 500 }
    );
  }
}
