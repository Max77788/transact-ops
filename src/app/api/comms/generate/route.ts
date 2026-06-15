// ============================================================================
// API: /api/comms/generate — Mock AI communication generation (feedback/open_house)
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { logAiRun, getDeal } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

const SUPPORTED_TYPES = ["feedback", "open_house"] as const;
type CommsType = (typeof SUPPORTED_TYPES)[number];

function mockFeedbackDraft(deal: any) {
  return {
    subject: `Showing Feedback — ${deal.address}`,
    body: `Hi ${deal.client_name},\n\nThank you so much for the opportunity to show your beautiful home at ${deal.address} today. The buyers were very impressed with the natural light in the living room and the updated kitchen.\n\nThey mentioned they're comparing your property with two others in the area, but felt yours had the best layout. They plan to discuss financing tonight and I'll follow up tomorrow.\n\nI'll keep you posted on any developments. In the meantime, please don't hesitate to reach out with any questions.\n\nBest,\n${deal.agent}`,
    deal_id: deal.id,
    deal_address: deal.address,
    client_name: deal.client_name,
  } as const;
}

function mockOpenHouseDraft(deal: any) {
  const nextWeekend = new Date();
  nextWeekend.setDate(nextWeekend.getDate() + ((6 - nextWeekend.getDay()) % 7 || 7));
  if (nextWeekend.getDay() === 6) nextWeekend.setDate(nextWeekend.getDate() + 1);

  return {
    campaign_name: `Open House — ${deal.address}`,
    subject_line: `🏡 You're Invited: Open House at ${deal.address}`,
    channels: ["email", "social", "signs"],
    email_body: `Dear Friends and Neighbors,\n\nWe're excited to invite you to an exclusive Open House at ${deal.address}!\n\n📅 Date: ${nextWeekend.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}\n🕐 Time: 1:00 PM – 4:00 PM\n\nThis stunning property features [3 bedrooms, 2 bathrooms, updated kitchen, large backyard]. Don't miss this opportunity to see it in person!\n\nLight refreshments will be served. Feel free to bring friends and family.\n\nSee you there!\n— ${deal.agent}`,
    social_copy:
      `🏡 OPEN HOUSE this Sunday! Come see ${deal.address} — a beautiful home with [updated kitchen] and [large backyard]. 1-4 PM. Don't miss it! #OpenHouse #RealEstate`,
    suggested_schedule: nextWeekend.toISOString().split("T")[0],
    deal_id: deal.id,
    deal_address: deal.address,
  } as const;
}

type FeedbackDraft = ReturnType<typeof mockFeedbackDraft>;
type OpenHouseDraft = ReturnType<typeof mockOpenHouseDraft>;

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
    const commsType = body.type as CommsType;
    const dealIds: string[] = body.deal_ids ?? [];

    if (!commsType || !SUPPORTED_TYPES.includes(commsType)) {
      return NextResponse.json(
        {
          data: null,
          error: `Unsupported type: "${commsType}". Must be one of: ${SUPPORTED_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!dealIds.length) {
      return NextResponse.json(
        { data: null, error: "At least one deal_id is required" },
        { status: 400 }
      );
    }

    const drafts: any[] = [];
    const supabase = await createClient();

    for (const dealId of dealIds) {
      const deal = await getDeal(dealId);
      if (!deal) {
        return NextResponse.json(
          { data: null, error: `Deal not found: ${dealId}` },
          { status: 404 }
        );
      }

      const draft =
        commsType === "feedback"
          ? mockFeedbackDraft(deal)
          : mockOpenHouseDraft(deal);

      // Persist feedback draft if type is feedback
      if (commsType === "feedback") {
        const fbDraft = draft as FeedbackDraft;
        // Check for existing showings to link
        const { data: showings } = await (supabase as any)
          .from("showings")
          .select("id")
          .eq("deal_id", dealId)
          .limit(1);

        if (showings && showings.length > 0) {
          await (supabase as any).from("feedback_drafts").insert({
            showing_id: showings[0].id,
            from_email: "agent@transactops.com",
            content: fbDraft.body,
            submitted: false,
          });
        }
      }

      // Persist open house if type is open_house
      if (commsType === "open_house") {
        const ohDraft = draft as OpenHouseDraft;
        const scheduledAt = new Date(ohDraft.suggested_schedule + "T13:00:00").toISOString();
        const endAt = new Date(ohDraft.suggested_schedule + "T16:00:00").toISOString();
        await (supabase as any).from("open_houses").insert({
          deal_id: dealId,
          org_id: orgId,
          scheduled_at: scheduledAt,
          end_at: endAt,
          status: "scheduled",
        });
      }

      drafts.push(draft);
    }

    // Log AI run
    await logAiRun({
      org_id: orgId,
      run_type: `comms_${commsType}`,
      input: { type: commsType, deal_ids: dealIds },
      output: { drafts_generated: drafts.length },
      status: "completed",
    });

    return NextResponse.json({ data: { drafts }, error: null }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Communication generation failed" },
      { status: 500 }
    );
  }
}
