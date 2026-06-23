"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

const ORG_ID = "d1000000-0000-0000-0000-000000000001";

function AddFlagModal({ onClose, onCreated }: { onClose: () => void; onCreated: (f: any) => void }) {
  const [subject, setSubject] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [flagType, setFlagType] = useState("attention");
  const [bodySnippet, setBodySnippet] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!subject.trim() || !fromEmail.trim()) { setError("Subject and from email are required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/email-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-org-id": ORG_ID },
        body: JSON.stringify({ subject: subject.trim(), from_email: fromEmail.trim(), flag_type: flagType, body_snippet: bodySnippet.trim() || null }),
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
      <div className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: "var(--card)", border: "1px solid var(--line)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--ink)", fontFamily: "Instrument Serif, serif" }}>Flag Email</h3>
          <button onClick={onClose} style={{ color: "var(--muted2)" }}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} placeholder="Subject *" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} placeholder="From email *" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
          <select className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} value={flagType} onChange={(e) => setFlagType(e.target.value)}>
            <option value="attention">Needs Attention</option>
            <option value="urgent">Urgent</option>
            <option value="info">Info</option>
            <option value="contract">Contract</option>
          </select>
          <textarea className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} placeholder="Body snippet (optional)" rows={3} value={bodySnippet} onChange={(e) => setBodySnippet(e.target.value)} />
        </div>
        {error && <p className="text-xs mt-3" style={{ color: "var(--red)" }}>{error}</p>}
        <button className="w-full mt-4 rounded-lg py-2.5 text-sm font-semibold" style={{ backgroundColor: "var(--accent)", color: "var(--paper)" }} onClick={submit} disabled={submitting}>
          {submitting ? "Creating..." : "Flag Email"}
        </button>
      </div>
    </div>
  );
}

export default function EmailClient({ initialFlags }: { initialFlags: any[] }) {
  const [flags, setFlags] = useState(initialFlags);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="px-4 sm:px-6 pt-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg" style={{ fontFamily: "Instrument Serif, serif", color: "var(--ink)" }}>
          Email Triage · {flags.length} flagged
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor: "var(--accent)", color: "var(--paper)" }}
        >
          <Plus size={14} /> Flag Email
        </button>
      </div>

      {flags.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted2)" }}>No emails flagged yet.</p>
      ) : (
        <div className="space-y-2">
          {flags.map((f: any) => (
            <div key={f.id} className="rounded-lg p-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--line)" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>{f.subject || "(no subject)"}</p>
                  <p className="text-xs" style={{ color: "var(--muted2)" }}>From: {f.from_email} · {f.flag_type}</p>
                  {f.body_snippet && <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--muted)" }}>{f.body_snippet}</p>}
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: f.triaged ? "var(--accent)" + "20" : "var(--card3)", color: f.triaged ? "var(--accent)" : "var(--muted)", fontFamily: "DM Mono, monospace" }}>
                  {f.triaged ? "Done" : "New"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddFlagModal onClose={() => setShowAdd(false)} onCreated={(f) => setFlags((prev) => [f, ...prev])} />}
    </div>
  );
}
