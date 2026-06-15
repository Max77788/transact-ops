// Temporary debug endpoint — REMOVE AFTER USE
import { NextResponse } from "next/server";
import { getDeals } from "@/lib/queries";

export async function GET() {
  try {
    const orgId = "d1000000-0000-0000-0000-000000000001";
    const deals = await getDeals(orgId);
    return NextResponse.json({
      ok: true,
      count: deals?.length ?? 0,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + "...",
      has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      deals,
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err.message,
      stack: err.stack?.slice(0, 500),
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + "...",
      has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
  }
}
