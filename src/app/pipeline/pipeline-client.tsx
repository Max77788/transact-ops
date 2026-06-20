"use client";

import { useState, useMemo } from "react";
import {
  Plus, X, LayoutGrid, List, ChevronRight, ChevronLeft,
  Circle, CheckCircle, Clock, ArrowRight, DollarSign,
  MapPin, User, Calendar, GripVertical
} from "lucide-react";

const ORG_ID = "d1000000-0000-0000-0000-000000000001";

// ── Types ──
type DBStage = {
  id: string; name: string; idx: number; description?: string;
  steps?: { id: string; name: string; idx: number }[];
};
type Deal = {
  id: string; address: string; client_name: string; agent: string;
  stage_idx: number; price: number | null; type: string; status: string;
  client_email?: string; client_phone?: string; notes?: string;
  stage_entered_at?: string; active_entered_at?: string;
  stage_steps?: { id: string; step_id: string; completed: boolean; completed_at?: string }[];
  stage_history?: { id: string; stage_idx: number; entered_at: string; exited_at?: string }[];
};

// ── Color palette for stage columns ──
const STAGE_COLORS = [
  { bg: "#f0f4ff", border: "#b8ccff", accent: "#4c6ef5" },
  { bg: "#fff4e6", border: "#ffc078", accent: "#f76707" },
  { bg: "#e6fcf5", border: "#96f2d7", accent: "#0ca678" },
  { bg: "#f3f0ff", border: "#c4b5fd", accent: "#7950f2" },
  { bg: "#fff0f6", border: "#faa2c1", accent: "#d6336c" },
  { bg: "#e6f7ff", border: "#7cc4f2", accent: "#1c7ed6" },
  { bg: "#faf5ff", border: "#d0bfff", accent: "#9c36b5" },
];

const STATUS_LABELS: Record<string, string> = {
  active: "Active", closed: "Closed", withdrawn: "Withdrawn", lost: "Lost",
};

// ════════════════════════════════════════════════════════════
// Add Deal Modal
// ════════════════════════════════════════════════════════════
function AddDealModal({ stages, onClose, onCreated }: {
  stages: DBStage[]; onClose: () => void; onCreated: (d: Deal) => void;
}) {
  const [address, setAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [agent, setAgent] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("sale");
  const [stageIdx, setStageIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!address.trim() || !clientName.trim() || !agent.trim()) {
      setError("Address, client name, and agent are required."); return;
    }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-org-id": ORG_ID },
        body: JSON.stringify({
          address: address.trim(), client_name: clientName.trim(),
          agent: agent.trim(), price: price ? Number(price) : null,
          type, stage_idx: stageIdx,
        }),
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
          <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>Add Deal</h3>
          <button onClick={onClose} style={{ color: "var(--text3)" }}><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <input className="w-full rounded-lg px-3 py-2.5 text-lg border font-bold" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} placeholder="Property address *" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input className="w-full rounded-lg px-3 py-2.5 text-lg border" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} placeholder="Client name *" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <input className="w-full rounded-lg px-3 py-2.5 text-lg border" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} placeholder="Agent *" value={agent} onChange={(e) => setAgent(e.target.value)} />
          <div className="flex gap-3">
            <input className="flex-1 rounded-lg px-3 py-2.5 text-lg border" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <select className="flex-1 rounded-lg px-3 py-2.5 text-lg border" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="sale">Sale</option><option value="lease">Lease</option>
            </select>
          </div>
          <select className="w-full rounded-lg px-3 py-2.5 text-lg border" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} value={stageIdx} onChange={(e) => setStageIdx(Number(e.target.value))}>
            {stages.map((s) => (<option key={s.id} value={s.idx}>{s.name}</option>))}
          </select>
        </div>
        {error && <p className="text-lg font-bold mt-3" style={{ color: "#e03131" }}>{error}</p>}
        <button className="w-full mt-4 rounded-lg py-2.5 text-lg font-bold transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }} onClick={submit} disabled={submitting}>
          {submitting ? "Creating..." : "Create Deal"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Deal Detail Slideover
// ════════════════════════════════════════════════════════════
function DealSlideover({ deal, stages, onClose, onAdvance }: {
  deal: Deal; stages: DBStage[]; onClose: () => void;
  onAdvance: (dealId: string, newStageIdx: number) => void;
}) {
  const currentStage = stages.find((s) => s.idx === deal.stage_idx);
  const currentStageSteps = currentStage?.steps || [];
  const completedStepIds = new Set(
    (deal.stage_steps || []).filter((s) => s.completed).map((s) => s.step_id)
  );
  const history = (deal.stage_history || []).sort((a, b) =>
    new Date(b.entered_at).getTime() - new Date(a.entered_at).getTime()
  );
  const [advancing, setAdvancing] = useState(false);

  const handleAdvance = async () => {
    const nextIdx = deal.stage_idx + 1;
    if (nextIdx >= stages.length) return;
    setAdvancing(true);
    try {
      const res = await fetch(`/api/deals/${deal.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage_idx: nextIdx }),
      });
      if (!res.ok) throw new Error("Failed to advance");
      onAdvance(deal.id, nextIdx);
    } catch (e) {
      console.error(e);
    } finally { setAdvancing(false); }
  };

  const handleMoveBack = async (targetIdx: number) => {
    setAdvancing(true);
    try {
      const res = await fetch(`/api/deals/${deal.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage_idx: targetIdx }),
      });
      if (!res.ok) throw new Error("Failed to move");
      onAdvance(deal.id, targetIdx);
    } catch (e) {
      console.error(e);
    } finally { setAdvancing(false); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const daysInStage = deal.stage_entered_at
    ? Math.floor((Date.now() - new Date(deal.stage_entered_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="fixed inset-0 z-40 flex" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose} />
      {/* Panel */}
      <div className="relative ml-auto w-full max-w-lg h-full overflow-y-auto shadow-2xl" style={{
        backgroundColor: "var(--bg)", borderLeft: "1px solid var(--border)",
      }}>
        {/* Header */}
        <div className="sticky top-0 z-10 p-5 border-b-[3px]" style={{
          backgroundColor: "var(--bg)", borderColor: "var(--border)",
        }}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>{deal.address}</h2>
              <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>
                {deal.client_name} · {deal.agent}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:opacity-70" style={{ backgroundColor: "var(--surface3)", color: "var(--text)" }}>
              <X size={20} />
            </button>
          </div>
          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="text-lg font-bold px-3 py-1.5 rounded-lg border-[3px]" style={{
              backgroundColor: "#ffffff", borderColor: "#1a1a2e", color: "#1a1a2e",
            }}>
              {currentStage?.name || `Stage ${deal.stage_idx}`}
            </span>
            {deal.price && (
              <span className="text-lg font-bold px-3 py-1.5 rounded-lg border-[3px]" style={{
                backgroundColor: "#ffffff", color: "#0ca678", borderColor: "#0ca678",
              }}>
                ${Number(deal.price).toLocaleString()}
              </span>
            )}
            <span className="text-lg font-bold px-3 py-1.5 rounded-lg border-[3px]" style={{
              backgroundColor: "#ffffff", color: "#1c7ed6", borderColor: "#1c7ed6",
            }}>
              {deal.type.toUpperCase()}
            </span>
            <span className="text-lg font-bold px-3 py-1.5 rounded-lg border-[3px]" style={{
              backgroundColor: daysInStage > 14 ? "#ffe3e3" : "#ffffff",
              color: daysInStage > 14 ? "#e03131" : "#495057",
              borderColor: daysInStage > 14 ? "#e03131" : "#adb5bd",
            }}>
              <Clock size={16} className="inline mr-1" />{daysInStage}d in stage
            </span>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Stage advancement */}
          <section>
            <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>Stage Progress</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {stages.map((s, i) => {
                const isCurrent = s.idx === deal.stage_idx;
                const isPast = s.idx < deal.stage_idx;
                return (
                  <button
                    key={s.id}
                    disabled={!isPast}
                    onClick={() => isPast && handleMoveBack(s.idx)}
                    className="text-lg font-bold px-3 py-2 rounded-lg border-[3px] transition-all"
                    style={{
                      backgroundColor: isCurrent ? "var(--accent)" : isPast ? "#e6fcf5" : "var(--surface3)",
                      color: isCurrent ? "#fff" : isPast ? "#0ca678" : "var(--text3)",
                      borderColor: isCurrent ? "var(--accent)" : isPast ? "#0ca678" : "var(--border)",
                      cursor: isPast ? "pointer" : "default",
                      opacity: isPast ? 1 : 0.6,
                    }}
                  >
                    {isPast ? <CheckCircle size={16} className="inline mr-1" /> : <Circle size={16} className="inline mr-1" />}
                    {s.name}
                  </button>
                );
              })}
            </div>
            {deal.stage_idx < stages.length - 1 && (
              <button
                onClick={handleAdvance}
                disabled={advancing}
                className="mt-3 text-lg font-bold px-5 py-3 rounded-lg border-[3px] transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: "#0ca678", color: "#fff", borderColor: "#087f5b",
                }}
              >
                <ArrowRight size={18} className="inline mr-2" />
                {advancing ? "Advancing..." : `Advance to ${stages[deal.stage_idx + 1]?.name || "Next Stage"}`}
              </button>
            )}
          </section>

          {/* Stage checklist */}
          {currentStageSteps.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>
                Checklist · {currentStage?.name}
              </h3>
              <div className="space-y-2">
                {currentStageSteps.sort((a, b) => a.idx - b.idx).map((step) => {
                  const done = completedStepIds.has(step.id);
                  return (
                    <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border-[3px]"
                      style={{
                        backgroundColor: done ? "#e6fcf5" : "var(--surface)",
                        borderColor: done ? "#0ca678" : "var(--border)",
                      }}
                    >
                      {done ? (
                        <CheckCircle size={20} style={{ color: "#0ca678" }} />
                      ) : (
                        <Circle size={20} style={{ color: "var(--text3)" }} />
                      )}
                      <span className="text-lg font-bold" style={{
                        color: done ? "#0ca678" : "var(--text)",
                        textDecoration: done ? "line-through" : "none",
                      }}>
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Stage history */}
          {history.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>Stage History</h3>
              <div className="space-y-2">
                {history.map((h) => {
                  const stageName = stages.find((s) => s.idx === h.stage_idx)?.name || `Stage ${h.stage_idx}`;
                  const duration = h.exited_at
                    ? Math.floor((new Date(h.exited_at).getTime() - new Date(h.entered_at).getTime()) / (1000 * 60 * 60 * 24))
                    : null;
                  return (
                    <div key={h.id} className="flex items-center gap-3 p-3 rounded-lg border-[3px]" style={{
                      backgroundColor: "var(--surface)", borderColor: "var(--border)",
                    }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                      <div className="flex-1">
                        <span className="text-lg font-bold" style={{ color: "var(--text)" }}>{stageName}</span>
                        <span className="text-lg ml-2" style={{ color: "var(--text3)" }}>
                          {formatDate(h.entered_at)}
                          {duration !== null && ` · ${duration}d`}
                        </span>
                      </div>
                      {!h.exited_at && (
                        <span className="text-lg font-bold px-2 py-1 rounded-lg border-[3px]"
                          style={{ backgroundColor: "#e6fcf5", color: "#0ca678", borderColor: "#0ca678" }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Notes */}
          <section>
            <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>Notes</h3>
            <div className="p-4 rounded-lg border-[3px] text-lg font-bold" style={{
              backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text2)",
              minHeight: "80px",
            }}>
              {deal.notes || "No notes yet."}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Main Pipeline Client
// ════════════════════════════════════════════════════════════
export default function PipelineClient({
  initialDeals, initialStages,
}: {
  initialDeals: any[]; initialStages: any[];
}) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [stages] = useState<DBStage[]>(initialStages);
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const sortedStages = useMemo(() => [...stages].sort((a, b) => a.idx - b.idx), [stages]);
  const selectedDeal = useMemo(() => deals.find((d) => d.id === selectedDealId) || null, [deals, selectedDealId]);

  const dealsByStage = useMemo(() => {
    const map: Record<number, Deal[]> = {};
    sortedStages.forEach((s) => { map[s.idx] = []; });
    deals.forEach((d) => {
      if (!map[d.stage_idx]) map[d.stage_idx] = [];
      map[d.stage_idx].push(d);
    });
    return map;
  }, [deals, sortedStages]);

  const handleAdvance = (dealId: string, newStageIdx: number) => {
    setDeals((prev) => prev.map((d) =>
      d.id === dealId ? { ...d, stage_idx: newStageIdx, stage_entered_at: new Date().toISOString() } : d
    ));
    // Refresh the detail slideover
    setSelectedDealId(null);
    // Re-open after state update
    setTimeout(() => setSelectedDealId(dealId), 50);
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Pipeline · {deals.length} deals
        </h2>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border-[3px] overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => setViewMode("board")}
              className="px-3 py-2 text-lg font-bold transition-colors"
              style={{
                backgroundColor: viewMode === "board" ? "var(--accent)" : "var(--surface)",
                color: viewMode === "board" ? "#fff" : "var(--text)",
              }}
            >
              <LayoutGrid size={18} className="inline mr-1" />Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              className="px-3 py-2 text-lg font-bold transition-colors"
              style={{
                backgroundColor: viewMode === "table" ? "var(--accent)" : "var(--surface)",
                color: viewMode === "table" ? "#fff" : "var(--text)",
              }}
            >
              <List size={18} className="inline mr-1" />Table
            </button>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-bold border-[3px] transition-all hover:scale-[1.02]"
            style={{ backgroundColor: "var(--accent)", color: "#fff", borderColor: "var(--accent)" }}
          >
            <Plus size={20} /> Add Deal
          </button>
        </div>
      </div>

      {/* Board View */}
      {viewMode === "board" && (
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "60vh" }}>
          {sortedStages.map((stage, si) => {
            const colors = STAGE_COLORS[si % STAGE_COLORS.length];
            const stageDeals = dealsByStage[stage.idx] || [];
            return (
              <div
                key={stage.id}
                className="flex-shrink-0 w-[300px] rounded-xl flex flex-col"
                style={{ backgroundColor: colors.bg, border: "3px solid " + colors.border }}
              >
                {/* Stage header */}
                <div className="px-4 py-3 border-b-[3px]" style={{ borderColor: colors.border }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold" style={{ color: colors.accent }}>
                      {stage.name}
                    </h3>
                    <span className="text-lg font-bold px-2.5 py-1 rounded-full" style={{
                      backgroundColor: colors.accent, color: "#fff",
                    }}>
                      {stageDeals.length}
                    </span>
                  </div>
                  {stage.description && (
                    <p className="text-lg mt-1 font-bold" style={{ color: "#495057" }}>{stage.description}</p>
                  )}
                </div>

                {/* Stage cards */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  {stageDeals.map((deal) => {
                    const daysInStage = deal.stage_entered_at
                      ? Math.floor((Date.now() - new Date(deal.stage_entered_at).getTime()) / (1000 * 60 * 60 * 24))
                      : 0;
                    return (
                      <div
                        key={deal.id}
                        onClick={() => setSelectedDealId(deal.id)}
                        className="p-3 rounded-lg cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg border-[3px]"
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: daysInStage > 14 ? "#e03131" : "#dee2e6",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        }}
                      >
                        <p className="text-lg font-bold leading-snug" style={{ color: "var(--text)" }}>
                          {deal.address}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-lg font-bold" style={{ color: "var(--accent)" }}>
                            {deal.client_name}
                          </span>
                          <span className="text-lg" style={{ color: "var(--text3)" }}>·</span>
                          <span className="text-lg font-bold" style={{ color: "var(--text2)" }}>
                            {deal.agent}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold px-2 py-1 rounded-lg border-[3px]" style={{
                            backgroundColor: daysInStage > 14 ? "#ffe3e3" : "#f8f9fa",
                            borderColor: daysInStage > 14 ? "#e03131" : "#adb5bd",
                            color: daysInStage > 14 ? "#e03131" : "#495057",
                          }}>
                            <Clock size={14} className="inline mr-1" />{daysInStage}d
                          </span>
                          {deal.price && (
                            <span className="text-lg font-bold" style={{ color: "#0ca678" }}>
                              ${Number(deal.price).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {stageDeals.length === 0 && (
                    <div className="text-lg font-bold text-center py-8" style={{ color: "var(--text3)" }}>
                      No deals
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="rounded-xl overflow-hidden border-[3px]" style={{ borderColor: "var(--border)" }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "3px solid var(--border)", backgroundColor: "var(--surface)" }}>
                  <th className="text-left px-4 py-3 text-lg font-bold" style={{ color: "var(--text)" }}>Address</th>
                  <th className="text-left px-4 py-3 text-lg font-bold" style={{ color: "var(--text)" }}>Client</th>
                  <th className="text-left px-4 py-3 text-lg font-bold" style={{ color: "var(--text)" }}>Agent</th>
                  <th className="text-left px-4 py-3 text-lg font-bold" style={{ color: "var(--text)" }}>Stage</th>
                  <th className="text-left px-4 py-3 text-lg font-bold" style={{ color: "var(--text)" }}>Price</th>
                  <th className="text-left px-4 py-3 text-lg font-bold" style={{ color: "var(--text)" }}>Days</th>
                  <th className="text-left px-4 py-3 text-lg font-bold" style={{ color: "var(--text)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {deals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-lg font-bold" style={{ color: "var(--text3)" }}>
                      No deals in pipeline yet. Click "Add Deal" to create one.
                    </td>
                  </tr>
                ) : (
                  deals.map((deal) => {
                    const daysInStage = deal.stage_entered_at
                      ? Math.floor((Date.now() - new Date(deal.stage_entered_at).getTime()) / (1000 * 60 * 60 * 24))
                      : 0;
                    const stageName = sortedStages.find((s) => s.idx === deal.stage_idx)?.name || `Stage ${deal.stage_idx}`;
                    return (
                      <tr
                        key={deal.id}
                        onClick={() => setSelectedDealId(deal.id)}
                        className="cursor-pointer transition-colors hover:bg-opacity-50 border-b-[3px]"
                        style={{ borderColor: "var(--border)", backgroundColor: "#ffffff" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
                      >
                        <td className="px-4 py-3 text-lg font-bold" style={{ color: "var(--text)" }}>{deal.address}</td>
                        <td className="px-4 py-3 text-lg font-bold" style={{ color: "var(--accent)" }}>{deal.client_name}</td>
                        <td className="px-4 py-3 text-lg font-bold" style={{ color: "var(--text2)" }}>{deal.agent}</td>
                        <td className="px-4 py-3">
                          <span className="text-lg font-bold px-3 py-1.5 rounded-lg border-[3px]"
                            style={{ borderColor: "var(--border)", color: "var(--text)" }}
                          >{stageName}</span>
                        </td>
                        <td className="px-4 py-3 text-lg font-bold" style={{ color: "#0ca678" }}>
                          {deal.price ? `$${Number(deal.price).toLocaleString()}` : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-lg font-bold px-3 py-1.5 rounded-lg border-[3px]" style={{
                            backgroundColor: daysInStage > 14 ? "#ffe3e3" : "#f8f9fa",
                            borderColor: daysInStage > 14 ? "#e03131" : "#adb5bd",
                            color: daysInStage > 14 ? "#e03131" : "#495057",
                          }}>{daysInStage}d</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-lg font-bold px-3 py-1.5 rounded-lg border-[3px]" style={{
                            backgroundColor: deal.status === "active" ? "#e6fcf5" : "var(--surface3)",
                            borderColor: deal.status === "active" ? "#0ca678" : "var(--border)",
                            color: deal.status === "active" ? "#0ca678" : "var(--text2)",
                          }}>{STATUS_LABELS[deal.status] || deal.status}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddDealModal
          stages={sortedStages}
          onClose={() => setShowAdd(false)}
          onCreated={(d) => setDeals((prev) => [d, ...prev])}
        />
      )}

      {selectedDeal && (
        <DealSlideover
          deal={selectedDeal}
          stages={sortedStages}
          onClose={() => setSelectedDealId(null)}
          onAdvance={handleAdvance}
        />
      )}
    </div>
  );
}
