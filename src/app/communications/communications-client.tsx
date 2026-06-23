"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

function AddFeedbackModal({ onClose, onCreated }: { onClose: () => void; onCreated: (f: any) => void }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    if (!content.trim()) { setError("Content is required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/feedbacks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: content.trim() }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      onCreated(json.data);
      onClose();
    } catch (e: any) { setError(e.message); } finally { setSubmitting(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: "var(--card)", border: "1px solid var(--line)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--ink)", fontFamily: "Instrument Serif, serif" }}>Add Feedback Draft</h3>
          <button onClick={onClose} style={{ color: "var(--muted2)" }}><X size={18} /></button>
        </div>
        <textarea className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} placeholder="Feedback content *" rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
        {error && <p className="text-xs mt-3" style={{ color: "var(--red)" }}>{error}</p>}
        <button className="w-full mt-4 rounded-lg py-2.5 text-sm font-semibold" style={{ backgroundColor: "var(--accent)", color: "var(--paper)" }} onClick={submit} disabled={submitting}>
          {submitting ? "Creating..." : "Add Feedback"}
        </button>
      </div>
    </div>
  );
}

function AddOpenHouseModal({ onClose, onCreated }: { onClose: () => void; onCreated: (oh: any) => void }) {
  const [dealId, setDealId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deals, setDeals] = useState<any[]>([]);
  useState(() => {
    fetch("/api/deals", { headers: { "x-org-id": "d1000000-0000-0000-0000-000000000001" } })
      .then(r => r.json()).then(d => setDeals(d.data || [])).catch(() => {});
  });
  const submit = async () => {
    if (!dealId || !scheduledAt) { setError("Deal and date are required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/open-houses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deal_id: dealId, scheduled_at: scheduledAt }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      onCreated(json.data);
      onClose();
    } catch (e: any) { setError(e.message); } finally { setSubmitting(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: "var(--card)", border: "1px solid var(--line)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--ink)", fontFamily: "Instrument Serif, serif" }}>Add Open House</h3>
          <button onClick={onClose} style={{ color: "var(--muted2)" }}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <select className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} value={dealId} onChange={(e) => setDealId(e.target.value)}>
            <option value="">Select property *</option>
            {deals.map((d: any) => <option key={d.id} value={d.id}>{d.address}</option>)}
          </select>
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        </div>
        {error && <p className="text-xs mt-3" style={{ color: "var(--red)" }}>{error}</p>}
        <button className="w-full mt-4 rounded-lg py-2.5 text-sm font-semibold" style={{ backgroundColor: "var(--accent)", color: "var(--paper)" }} onClick={submit} disabled={submitting}>
          {submitting ? "Creating..." : "Schedule Open House"}
        </button>
      </div>
    </div>
  );
}

export default function CommunicationsClient({ initialFeedback, initialOpenHouses }: { initialFeedback: any[]; initialOpenHouses: any[] }) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [openHouses, setOpenHouses] = useState(initialOpenHouses);
  const [showFeedbackAdd, setShowFeedbackAdd] = useState(false);
  const [showOpenHouseAdd, setShowOpenHouseAdd] = useState(false);

  return (
    <div className="px-4 sm:px-6 pt-4 pb-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg" style={{ fontFamily: "Instrument Serif, serif", color: "var(--ink)" }}>Communications</h2>
        </div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted2)", fontFamily: "DM Mono, monospace" }}>Feedback Drafts ({feedback.length})</h3>
          <button onClick={() => setShowFeedbackAdd(true)} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold" style={{ backgroundColor: "var(--accent)", color: "var(--paper)" }}><Plus size={12} /> Add</button>
        </div>
        {feedback.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted2)" }}>No feedback drafts yet.</p>
        ) : (
          <div className="space-y-2">
            {feedback.map((f: any) => (
              <div key={f.id} className="rounded-lg p-3" style={{ backgroundColor: "var(--card)", border: "1px solid var(--line)" }}>
                <p className="text-xs line-clamp-2" style={{ color: "var(--muted)" }}>{f.content?.slice(0, 200)}</p>
                <span className="text-[10px] mt-1 inline-block" style={{ color: "var(--muted2)", fontFamily: "DM Mono, monospace" }}>{f.submitted ? "Sent" : "Draft"} · {new Date(f.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted2)", fontFamily: "DM Mono, monospace" }}>Open Houses ({openHouses.length})</h3>
          <button onClick={() => setShowOpenHouseAdd(true)} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold" style={{ backgroundColor: "var(--accent)", color: "var(--paper)" }}><Plus size={12} /> Add</button>
        </div>
        {openHouses.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted2)" }}>No open houses scheduled.</p>
        ) : (
          <div className="space-y-2">
            {openHouses.map((oh: any) => (
              <div key={oh.id} className="rounded-lg p-3" style={{ backgroundColor: "var(--card)", border: "1px solid var(--line)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>{oh.deals?.address || "Unknown property"}</p>
                <span className="text-[10px]" style={{ color: "var(--muted2)", fontFamily: "DM Mono, monospace" }}>{new Date(oh.scheduled_at).toLocaleString()} · {oh.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFeedbackAdd && <AddFeedbackModal onClose={() => setShowFeedbackAdd(false)} onCreated={(f) => setFeedback((prev) => [f, ...prev])} />}
      {showOpenHouseAdd && <AddOpenHouseModal onClose={() => setShowOpenHouseAdd(false)} onCreated={(oh) => setOpenHouses((prev) => [oh, ...prev])} />}
    </div>
  );
}
