"use client";

import { useState } from "react";
import { Circle, Plus, X } from "lucide-react";

const ORG_ID = "d1000000-0000-0000-0000-000000000001";

type DBStage = {
  id: string;
  name: string;
  idx: number;
  description?: string;
  steps?: { id: string; name: string; idx: number }[];
};

function AddStageModal({ onClose, onCreated }: { onClose: () => void; onCreated: (s: DBStage) => void }) {
  const [name, setName] = useState("");
  const [idx, setIdx] = useState("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    if (!name.trim() || !idx) { setError("Name and index are required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/stages", {
        method: "POST", headers: { "Content-Type": "application/json", "x-org-id": ORG_ID },
        body: JSON.stringify({ name: name.trim(), idx: Number(idx), description: desc.trim() || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      onCreated({ ...json.data, steps: [] });
      onClose();
    } catch (e: any) { setError(e.message); } finally { setSubmitting(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: "var(--card)", border: "1px solid var(--line)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--ink)", fontFamily: "Instrument Serif, serif" }}>Add Stage</h3>
          <button onClick={onClose} style={{ color: "var(--muted2)" }}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} placeholder="Stage name *" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} placeholder="Index (0-10) *" type="number" value={idx} onChange={(e) => setIdx(e.target.value)} />
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        {error && <p className="text-xs mt-3" style={{ color: "var(--red)" }}>{error}</p>}
        <button className="w-full mt-4 rounded-lg py-2.5 text-sm font-semibold" style={{ backgroundColor: "var(--accent)", color: "var(--paper)" }} onClick={submit} disabled={submitting}>
          {submitting ? "Adding..." : "Add Stage"}
        </button>
      </div>
    </div>
  );
}

function AddStepModal({ stageId, onClose, onCreated }: { stageId: string; onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [idx, setIdx] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    if (!name.trim() || !idx) { setError("Name and index are required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/stage-steps", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage_id: stageId, name: name.trim(), idx: Number(idx) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      onCreated();
      onClose();
    } catch (e: any) { setError(e.message); } finally { setSubmitting(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: "var(--card)", border: "1px solid var(--line)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--ink)", fontFamily: "Instrument Serif, serif" }}>Add Step</h3>
          <button onClick={onClose} style={{ color: "var(--muted2)" }}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} placeholder="Step name *" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} placeholder="Order (0-N) *" type="number" value={idx} onChange={(e) => setIdx(e.target.value)} />
        </div>
        {error && <p className="text-xs mt-3" style={{ color: "var(--red)" }}>{error}</p>}
        <button className="w-full mt-4 rounded-lg py-2.5 text-sm font-semibold" style={{ backgroundColor: "var(--accent)", color: "var(--paper)" }} onClick={submit} disabled={submitting}>
          {submitting ? "Adding..." : "Add Step"}
        </button>
      </div>
    </div>
  );
}

export function StagesClient({ initialStages }: { initialStages: DBStage[] }) {
  const [stages, setStages] = useState(initialStages);
  const [showAddStage, setShowAddStage] = useState(false);
  const [addStepFor, setAddStepFor] = useState<string | null>(null);

  const sorted = [...stages].sort((a, b) => a.idx - b.idx);

  return (
    <div className="px-4 sm:px-6 pt-4 pb-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: "Instrument Serif, serif", color: "var(--ink)" }}>
          Pipeline Stages · {sorted.length}
        </h2>
        <button
          onClick={() => setShowAddStage(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor: "var(--accent)", color: "var(--paper)" }}
        >
          <Plus size={14} /> Add Stage
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted2)" }}>No stages configured.</p>
      ) : (
        sorted.map((stage) => (
          <div key={stage.id} className="rounded-lg p-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--line)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--card3)", color: "var(--muted)", fontFamily: "DM Mono, monospace" }}>
                {stage.idx}
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>{stage.name}</span>
              {stage.description && (
                <span className="text-[11px]" style={{ color: "var(--muted2)" }}>— {stage.description}</span>
              )}
              <button
                onClick={() => setAddStepFor(stage.id)}
                className="ml-auto flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold"
                style={{ backgroundColor: "var(--accent)" + "20", color: "var(--accent)" }}
              >
                <Plus size={10} /> Add Step
              </button>
            </div>

            {stage.steps && stage.steps.length > 0 ? (
              <div className="space-y-1.5">
                {[...stage.steps].sort((a, b) => a.idx - b.idx).map((step) => (
                  <div key={step.id} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm" style={{ color: "var(--muted)" }}>
                    <Circle size={14} style={{ color: "var(--muted2)" }} />
                    {step.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "var(--muted2)" }}>No steps defined</p>
            )}
          </div>
        ))
      )}

      {showAddStage && <AddStageModal onClose={() => setShowAddStage(false)} onCreated={(s) => setStages((prev) => [...prev, s])} />}
      {addStepFor && (
        <AddStepModal
          stageId={addStepFor}
          onClose={() => setAddStepFor(null)}
          onCreated={() => {
            // Refresh stages to get updated steps
            fetch("/api/stages", { headers: { "x-org-id": ORG_ID } })
              .then(r => r.json())
              .then(d => { if (d.data) setStages(d.data); })
              .catch(() => {});
            setAddStepFor(null);
          }}
        />
      )}
    </div>
  );
}
