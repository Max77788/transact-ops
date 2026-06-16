import { getProfiles } from "@/lib/queries";
import { TeamClient } from "./team-client";

export const dynamic = "force-dynamic";

const ORG_ID = "d1000000-0000-0000-0000-000000000001";

export default async function TeamPage() {
  const profiles = await getProfiles(ORG_ID);
  return <TeamClient initialProfiles={profiles} />;
}
