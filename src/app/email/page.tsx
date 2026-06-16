import { getEmailFlags } from "@/lib/queries";

export const dynamic = "force-dynamic";
const ORG_ID = "d1000000-0000-0000-0000-000000000001";

export default async function EmailPage() {
  const flags = await getEmailFlags(ORG_ID);

  return (
    <div className="px-6 pt-4 pb-6">
      <h2 className="text-lg mb-4" style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}>
        Email Triage · {flags?.length || 0} flagged
      </h2>

      {!flags || flags.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text3)" }}>No emails flagged yet. Connect Gmail integration.</p>
      ) : (
        <div className="space-y-2">
          {flags.map((f: any) => (
            <div
              key={f.id}
              className="rounded-lg p-4"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                    {f.subject || "(no subject)"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text3)" }}>
                    From: {f.from_email} · {f.flag_type}
                  </p>
                  {f.body_snippet && (
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text2)" }}>
                      {f.body_snippet}
                    </p>
                  )}
                </div>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: f.triaged ? "var(--accent)" + "20" : "var(--surface3)",
                    color: f.triaged ? "var(--accent)" : "var(--text2)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {f.triaged ? "Done" : "New"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
