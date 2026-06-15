// ============================================================================
// API: /api/email/scan — Mock AI email triage: flags emails and creates tasks
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { logAiRun } from "@/lib/queries";
import { createAdminClient } from "@/lib/supabase/server";

// Mock email corpus
const MOCK_EMAILS = [
  {
    from: "buyer.jane@gmail.com",
    subject: "Offer for 123 Main St — Attached",
    snippet: "Please find my signed offer for the property at 123 Main Street. I'm offering $525,000 with a 30-day close.",
    flag_type: "offer",
    priority: "high",
  },
  {
    from: "title@escrowpros.com",
    subject: "Title Report — 456 Oak Ave",
    snippet: "The preliminary title report for 456 Oak Avenue is complete. No encumbrances found.",
    flag_type: "title",
    priority: "medium",
  },
  {
    from: "lender@firstbank.com",
    subject: "Pre-approval — Walker deal",
    snippet: "Attached is the pre-approval letter for the Walker buyer. Loan amount up to $600K.",
    flag_type: "finance",
    priority: "medium",
  },
  {
    from: "inspector@homecheck.com",
    subject: "Inspection report ready — 789 Pine",
    snippet: "The home inspection report for 789 Pine Street is complete. Several minor items noted — full report attached.",
    flag_type: "inspection",
    priority: "high",
  },
  {
    from: "newsletter@realestateweekly.com",
    subject: "This week's market update",
    snippet: "Click here to read about the latest trends in the real estate market this June.",
    flag_type: "spam",
    priority: "low",
  },
  {
    from: "seller.bob@outlook.com",
    subject: "Question about my listing",
    snippet: "Hi, I had a question about the upcoming open house. Can we reschedule to Sunday instead of Saturday?",
    flag_type: "seller_comms",
    priority: "medium",
  },
  {
    from: "appraiser@valuecheck.com",
    subject: "Appraisal scheduled — 101 Elm",
    snippet: "The appraisal for 101 Elm Street has been scheduled for Thursday at 10am. Please confirm access.",
    flag_type: "appraisal",
    priority: "high",
  },
  {
    from: "attorney@lawfirm.com",
    subject: "Contract review complete",
    snippet: "I've reviewed the purchase agreement for the Henderson deal. A few redlines attached for your review.",
    flag_type: "legal",
    priority: "high",
  },
];

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { data: null, error: "Missing x-org-id header" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const supabase = createAdminClient();

    // Simulate AI triage: pick 3-5 actionable emails (skip spam)
    const actionable = MOCK_EMAILS.filter((e) => e.flag_type !== "spam");
    const count = Math.floor(Math.random() * 3) + 3; // 3-5
    const selected = actionable.slice(0, Math.min(count, actionable.length));

    const flags: any[] = [];
    const tasks: any[] = [];

    for (const email of selected) {
      // Insert email_flag
      const { data: flag } = await (supabase as any)
        .from("email_flags")
        .insert({
          org_id: orgId,
          from_email: email.from,
          subject: email.subject,
          body_snippet: email.snippet,
          flag_type: email.flag_type,
          ai_summary: `Auto-triaged: ${email.flag_type} — ${email.snippet.slice(0, 80)}...`,
          triaged: false,
        })
        .select()
        .single();

      // Create a corresponding task
      const { data: task } = await (supabase as any)
        .from("tasks")
        .insert({
          org_id: orgId,
          title: `[${email.flag_type.toUpperCase()}] ${email.subject}`,
          description: email.snippet,
          completed: false,
        })
        .select()
        .single();

      flags.push(flag);
      tasks.push(task);
    }

    const result = { flags_created: flags.length, tasks_created: tasks.length, flags, tasks };

    // Log AI run
    await logAiRun({
      org_id: orgId,
      run_type: "email_triage",
      input: { email_count: MOCK_EMAILS.length },
      output: { flagged: flags.length, tasks_created: tasks.length },
      status: "completed",
    });

    return NextResponse.json({ data: result, error: null }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Email scan failed" },
      { status: 500 }
    );
  }
}
