import { createAdminClient } from "@/lib/supabase/server";
import CommunicationsClient from "./communications-client";

export const dynamic = "force-dynamic";
const ORG_ID = "d1000000-0000-0000-0000-000000000001";

export default async function CommunicationsPage() {
  const supabase = createAdminClient();

  let feedback: any[] = [];
  let openHouses: any[] = [];

  try {
    const { data: f } = await (supabase as any)
      .from("feedback_drafts").select("*").order("created_at", { ascending: false }).limit(10);
    feedback = f || [];
  } catch {}

  try {
    const { data: oh } = await (supabase as any)
      .from("open_houses").select("*, deals!open_houses_deal_id_fkey(address)").order("scheduled_at", { ascending: true }).limit(10);
    openHouses = oh || [];
  } catch {}

  return <CommunicationsClient initialFeedback={feedback} initialOpenHouses={openHouses} />;
}
