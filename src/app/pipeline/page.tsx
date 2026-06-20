import { getDeals, getStages } from "@/lib/queries";
import PipelineClient from "./pipeline-client";

export const dynamic = "force-dynamic";
const ORG_ID = "d1000000-0000-0000-0000-000000000001";

export default async function PipelinePage() {
  let deals: any[] = [];
  let stages: any[] = [];
  try {
    [deals, stages] = await Promise.all([
      getDeals(ORG_ID),
      getStages(ORG_ID),
    ]);
  } catch {}

  return <PipelineClient initialDeals={deals} initialStages={stages} />;
}
