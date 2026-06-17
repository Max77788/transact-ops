import { getCheckins } from "@/lib/queries";
import OwnerCheckinsClient from "./owner-checkins-client";

export const dynamic = "force-dynamic";
const ORG_ID = "d1000000-0000-0000-0000-000000000001";

export default async function OwnerCheckinsPage() {
  let checkins: any[] = [];
  try { checkins = await getCheckins(ORG_ID); } catch {}
  return <OwnerCheckinsClient initialCheckins={checkins} />;
}
