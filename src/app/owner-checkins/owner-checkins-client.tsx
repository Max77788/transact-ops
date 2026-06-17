"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

const ORG_ID = "d1000000-0000-0000-0000-000000000001";

function AddCheckinModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: any) => void }) {
  const [owners, setOwners] = useState<any[]>([]);
  const [ownerId, setOwnerId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/owners", { headers: { "x-org-id": ORG_ID } })
      .then(r => r.json())
      .then(d => setOwners(d.data || []))
      .catch(() => {});
  }, []);

  const submit = async () => {
    if (!ownerId || !scheduledDate) { setError("Owner and date are required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-org-id": ORG_ID },
        body: JSON.stringify({ owner_id: ownerId, scheduled_date: scheduledDate, scheduled_time: scheduledTime || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      onCreated(json.data);
      onClose();
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)", fontFamily: "Instrument Serif, serif" }}>Schedule Check-in</h3>
          <button onClick={onClose} style={{ color: "var(--text3)" }}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <select className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
            <option value="">Select owner *</option>
            {owners.map((o: any) => (
              <option key={o.id} value={o.id}>{o.full_name} — {o.property_address}</option>
            ))}
          </select>
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
        </div>
        {error && <p className="text-xs mt-3" style={{ color: "var(--high)" }}>{error}</p>}
        <button className="w-full mt-4 rounded-lg py-2.5 text-sm font-semibold" style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }} onClick={submit} disabled={submitting}>
          {submitting ? "Scheduling..." : "Schedule Check-in"}
        </button>
      </div>
    </div>
  );
}

export default function OwnerCheckinsClient({ initialCheckins }: { initialCheckins: any[] }) {
  const [checkins, setCheckins] = useState(initialCheckins);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="px-4 sm:px-6 pt-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg" style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}>
          Owner Check-ins · {checkins.length} scheduled
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          <Plus size={14} /> Schedule
        </button>
      </div>

      {checkins.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text3)" }}>No check-ins scheduled yet.</p>
      ) : (
        <div className="space-y-2">
          {checkins.map((c: any) => (
            <div key={c.id} className="rounded-lg p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{c.owner?.full_name || "Unknown Owner"}</p>
                  <p className="text-xs" style={{ color: "var(--text3)" }}>{c.owner?.property_address} · {c.scheduled_date}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: c.status === "completed" ? "var(--accent)" + "20" : "var(--surface3)", color: c.status === "completed" ? "var(--accent)" : "var(--text2)", fontFamily: "DM Mono, monospace" }}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddCheckinModal onClose={() => setShowAdd(false)} onCreated={(c) => setCheckins((prev) => [c, ...prev])} />}
    </div>
  );
}
