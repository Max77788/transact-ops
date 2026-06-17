import { getEmailFlags } from "@/lib/queries";
import EmailClient from "./email-client";

export const dynamic = "force-dynamic";
const ORG_ID = "d1000000-0000-0000-0000-000000000001";

export default async function EmailPage() {
  let flags: any[] = [];
  try { flags = await getEmailFlags(ORG_ID); } catch {}
  return <EmailClient initialFlags={flags} />;
}
