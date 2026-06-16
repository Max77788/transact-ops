import { getDeals } from "@/lib/queries";

export const dynamic = "force-dynamic";
const ORG_ID = "d1000000-0000-0000-0000-000000000001";

export default async function PipelinePage() {
  const deals = await getDeals(ORG_ID);
  
  return (
    <div className="px-6 pt-4 pb-6">
      <h2 className="text-lg mb-4" style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}>
        Pipeline · {deals?.length || 0} deals
      </h2>
      
      {!deals || deals.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text3)" }}>No deals in pipeline yet.</p>
      ) : (
        <div className="space-y-2">
          {deals.map((d: any) => (
            <div
              key={d.id}
              className="rounded-lg p-4 flex items-center gap-4"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{d.address}</p>
                <p className="text-xs" style={{ color: "var(--text3)" }}>{d.client_name} · {d.agent} · {d.type}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--surface3)", color: "var(--text2)", fontFamily: "DM Mono, monospace" }}>
                  {d.status} · stage {d.stage_idx}
                </span>
                {d.price && (
                  <p className="text-xs mt-1 font-medium" style={{ color: "var(--accent)", fontFamily: "DM Mono, monospace" }}>
                    ${Number(d.price).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
