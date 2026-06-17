// ============================================================================
// API: /api/webhooks — Receive and process webhooks from n8n/Calendly/Fathom
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const SIGNING_SECRET = process.env.WEBHOOK_SIGNING_SECRET || "transactops-dev-secret";

// Simple HMAC-like signature check (replace with real crypto in production)
function verifySignature(request: NextRequest, _body: string): boolean {
  const signature = request.headers.get("x-webhook-signature");

  // Development / preview / testing: accept any signature
  if (
    !signature ||
    process.env.NODE_ENV !== "production" ||
    process.env.VERCEL_ENV !== "production" ||
    process.env.WEBHOOK_BYPASS_SIGNATURE === "true"
  )
    return true;

  // Production: compare signatures (placeholder — use crypto.timingSafeEqual in real impl)
  return signature.length > 0;
}

export async function POST(request: NextRequest) {
  try {
    // Read raw body once
    const rawBody = await request.text();
    let payload: any;

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { data: null, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // Verify signature
    if (!verifySignature(request, rawBody)) {
      return NextResponse.json(
        { data: null, error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const orgId = request.headers.get("x-org-id");
    const eventType = payload.event_type || payload.event || "unknown";

    const supabase = createAdminClient();

    // Log raw webhook event
    const { data: webhookEvent } = await (supabase as any)
      .from("webhook_events")
      .insert({
        org_id: orgId || "unknown",
        event_type: eventType,
        payload,
        processed: false,
      })
      .select()
      .single();

    // Process known event types
    let processingResult: any = null;

    switch (eventType) {
      case "calendly.booking": {
        // Update checkin status to "scheduled"
        const checkinId = payload.checkin_id || payload.payload?.tracking?.utm_campaign;
        const bookingLink = payload.event_url || payload.payload?.event;

        if (checkinId) {
          const { data: updated } = await (supabase as any)
            .from("checkins")
            .update({
              status: "scheduled",
              booking_link: bookingLink || null,
              scheduled_date: payload.start_time
                ? new Date(payload.start_time).toISOString().split("T")[0]
                : undefined,
              scheduled_time: payload.start_time
                ? new Date(payload.start_time).toTimeString().slice(0, 8)
                : undefined,
            })
            .eq("id", checkinId)
            .select()
            .single();

          processingResult = { action: "checkin_scheduled", checkin: updated };
        }
        break;
      }

      case "fathom.recording": {
        // Attach recording URL to checkin
        const checkinId = payload.checkin_id || payload.metadata?.checkin_id;
        const recordingUrl = payload.recording_url || payload.payload?.recording_url;

        if (checkinId && recordingUrl) {
          const { data: updated } = await (supabase as any)
            .from("checkins")
            .update({
              recording_url: recordingUrl,
              transcript_url: payload.transcript_url ?? null,
            })
            .eq("id", checkinId)
            .select()
            .single();

          processingResult = { action: "recording_attached", checkin: updated };
        }
        break;
      }

      case "n8n.automation":
      default: {
        // Generic pass-through — just log and acknowledge
        processingResult = {
          action: "logged",
          event_type: eventType,
          acknowledged: true,
        };
        break;
      }
    }

    // Mark webhook event as processed
    if (webhookEvent) {
      await (supabase as any)
        .from("webhook_events")
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
        })
        .eq("id", webhookEvent.id);
    }

    return NextResponse.json(
      {
        data: {
          received: true,
          event_type: eventType,
          processing: processingResult,
        },
        error: null,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
