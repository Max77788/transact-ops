import { getCheckins } from "@/lib/queries";

export const dynamic = "force-dynamic";
const ORG_ID = "d1000000-0000-0000-0000-000000000001";

export default async function OwnerCheckinsPage() {
  const checkins = await getCheckins(ORG_ID);

  return (
    <div className="px-6 pt-4 pb-6">
      <h2 className="text-lg mb-4" style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}>
        Owner Check-ins · {checkins?.length || 0} scheduled
      </h2>

      {!checkins || checkins.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text3)" }}>No check-ins scheduled yet.</p>
      ) : (
        <div className="space-y-2">
          {checkins.map((c: any) => (
            <div
              key={c.id}
              className="rounded-lg p-4"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    {c.owner?.full_name || "Unknown Owner"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text3)" }}>
                    {c.owner?.property_address} · {c.scheduled_date}
                  </p>
                </div>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: c.status === "completed" ? "var(--accent)" + "20" : "var(--surface3)",
                    color: c.status === "completed" ? "var(--accent)" : "var(--text2)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
