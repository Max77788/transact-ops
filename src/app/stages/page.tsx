import { getStages } from "@/lib/queries";
import { StagesClient } from "./stages-client";

export const dynamic = "force-dynamic";
const ORG_ID = "d1000000-0000-0000-0000-000000000001";

export default async function StagesPage() {
  const stages = await getStages(ORG_ID);
  return <StagesClient initialStages={stages} />;
}
