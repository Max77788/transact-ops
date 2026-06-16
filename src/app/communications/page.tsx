import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const ORG_ID = "d1000000-0000-0000-0000-000000000001";

export default async function CommunicationsPage() {
  const supabase = createAdminClient();

  const { data: feedback } = await supabase
    .from("feedback_drafts")
    .select("id, content, submitted, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: openHouses } = await supabase
    .from("open_houses")
    .select("id, scheduled_at, status, deals!open_houses_deal_id_fkey(address)")
    .order("scheduled_at", { ascending: true })
    .limit(10);

  return (
    <div className="px-6 pt-4 pb-6 space-y-6">
      <div>
        <h2 className="text-lg mb-3" style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}>
          Communications
        </h2>

        <h3 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>
          Feedback Drafts ({feedback?.length || 0})
        </h3>
        {!feedback || feedback.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text3)" }}>No feedback drafts yet.</p>
        ) : (
          <div className="space-y-2">
            {feedback.map((f: any) => (
              <div key={f.id} className="rounded-lg p-3" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-xs line-clamp-2" style={{ color: "var(--text2)" }}>{f.content?.slice(0, 200)}</p>
                <span className="text-[10px] mt-1 inline-block" style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>
                  {f.submitted ? "Sent" : "Draft"} · {new Date(f.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>
          Open Houses ({openHouses?.length || 0})
        </h3>
        {!openHouses || openHouses.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text3)" }}>No open houses scheduled.</p>
        ) : (
          <div className="space-y-2">
            {openHouses.map((oh: any) => (
              <div key={oh.id} className="rounded-lg p-3" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {oh.deals?.address || "Unknown property"}
                </p>
                <span className="text-[10px]" style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>
                  {new Date(oh.scheduled_at).toLocaleString()} · {oh.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
