// ============================================================================
// API: /api/ai/run — Proxy AI calls with mock results and audit logging
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { logAiRun } from "@/lib/queries";

const SUPPORTED_FEATURES = [
  "email_triage",
  "call_summary",
  "seller_feedback",
  "open_house",
  "call_prep",
  "merge_notes",
] as const;

type Feature = (typeof SUPPORTED_FEATURES)[number];

const MOCK_RESULTS: Record<Feature, () => any> = {
  email_triage: () => ({
    flags: [
      {
        from: "buyer@example.com",
        subject: "Offer on 123 Main St",
        flag_type: "offer",
        priority: "high",
        ai_summary: "Buyer submitting an offer at $15K above asking with a 30-day close.",
      },
      {
        from: "title@escrowco.com",
        subject: "Title report ready - 456 Oak Ave",
        flag_type: "title",
        priority: "medium",
        ai_summary: "Preliminary title report is ready for review. No liens found.",
      },
      {
        from: "lender@bank.com",
        subject: "Pre-approval letter attached",
        flag_type: "finance",
        priority: "low",
        ai_summary: "Pre-approval letter for buyer on 789 Pine St deal.",
      },
    ],
    flagged_count: 3,
  }),
  call_summary: () => ({
    summary:
      "Spoke with the seller about listing updates. They're happy with the marketing but want to discuss open house scheduling for next weekend. No major concerns raised.",
    sentiment: "pos",
    actions: [
      { description: "Schedule open house for next Saturday", assigned_to: null },
      { description: "Send updated listing analytics report", assigned_to: null },
    ],
    next_checkin: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  }),
  seller_feedback: () => ({
    feedback:
      "The showing went well. Buyers loved the kitchen renovation and the backyard. They're considering making an offer but want to see comps first. The agent will follow up with comps tomorrow.",
    open_house_suggestion: "Consider scheduling an open house in 2 weeks to build momentum.",
    sentiment: "pos",
  }),
  open_house: () => ({
    summary:
      "Open house at 123 Main St had 8 visitor groups. Strong interest in the updated bathrooms and location. Two parties requested private showings. One couple is pre-approved and may submit within 48 hours.",
    visitor_count: 8,
    leads: 3,
    sentiment: "pos",
  }),
  call_prep: () => ({
    briefing:
      "This is the 3rd check-in with the seller at 123 Main St. They were previously concerned about the timeline but have been cooperative. Last check-in: price discussion — they want to hold firm at list. Ask about the recent showing feedback and if they'd consider an open house. Mention the comps you pulled.",
    deal_snapshot: {
      address: "123 Main St",
      stage: "Active",
      days_in_stage: 14,
      last_checkin: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
    },
    suggested_talking_points: [
      "Recent showing feedback",
      "Market activity in their area",
      "Open house planning",
      "Price positioning vs comps",
    ],
  }),
  merge_notes: () => ({
    combined_summary:
      "Over the past 7 days, the seller has remained engaged and cooperative. Two showings occurred with positive feedback. The seller is firm on price but open to scheduling an open house. No urgent issues — continue weekly check-ins. Overall sentiment remains positive.",
    overall_sentiment: "pos",
    timeline: [
      { date: "2025-06-08", event: "Check-in call — discussed marketing strategy", sentiment: "pos" },
      { date: "2025-06-12", event: "Showing #1 — buyers liked kitchen, considering offer", sentiment: "pos" },
      { date: "2025-06-14", event: "Showing #2 — positive feedback, no offer yet", sentiment: "neu" },
    ],
  }),
};

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
    const feature = body.feature as Feature;
    const input = body.input ?? null;

    if (!feature || !SUPPORTED_FEATURES.includes(feature)) {
      return NextResponse.json(
        {
          data: null,
          error: `Unsupported feature: "${feature}". Must be one of: ${SUPPORTED_FEATURES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Generate mock result
    const result = MOCK_RESULTS[feature]();

    // Log to ai_runs
    await logAiRun({
      org_id: orgId,
      deal_id: body.deal_id ?? input?.deal_id ?? null,
      run_type: feature,
      input,
      output: result,
      status: "completed",
    });

    return NextResponse.json({ data: result, error: null }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "AI run failed" },
      { status: 500 }
    );
  }
}
