"use client";

import { useState, useEffect } from "react";
import { ShellLayout } from "@/components/shell-layout";
import { cn } from "@/lib/utils";
import { STAGES, MOCK_DEALS, Deal, StageKey, StageHistoryEntry } from "@/lib/data";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Circle,
  LayoutGrid,
  List,
  ArrowUpDown,
  Clock,
  X,
} from "lucide-react";

type ViewMode = "board" | "list";
type SortKey = "address" | "client" | "stage" | "daysInStage" | "nextStep" | "closeDate";
type SortDir = "asc" | "desc";

function daysBadge(days: number, target: number) {
  if (target === 0) return null;
  const over = days > target;
  return (
    <span
      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
      style={{
        backgroundColor: over ? "var(--red)" : "var(--surface3)",
        color: over ? "#fff" : "var(--text2)",
        fontFamily: "DM Mono, monospace",
      }}
    >
      {days}d
    </span>
  );
}

// ---- BOARD VIEW ----

function BoardView({ deals }: { deals: Deal[] }) {
  const dealsByStage: Record<StageKey, Deal[]> = {} as Record<StageKey, Deal[]>;
  STAGES.forEach((s) => (dealsByStage[s.key] = []));
  deals.forEach((d) => dealsByStage[d.stage].push(d));

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 px-6 pt-4" style={{ height: "calc(100vh - var(--topbar-h))" }}>
      {STAGES.map((stage) => (
        <div
          key={stage.key}
          className="flex flex-col shrink-0 rounded-lg"
          style={{ width: 210, backgroundColor: "var(--surface)" }}
        >
          <div
            className="flex items-center justify-between px-3 py-2.5 rounded-t-lg"
            style={{ backgroundColor: stage.color + "18" }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="rounded-full shrink-0"
                style={{ width: 7, height: 7, backgroundColor: stage.color }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: stage.color, fontFamily: "DM Mono, monospace" }}
              >
                {stage.label}
              </span>
            </div>
            <span
              className="text-[10px] font-medium rounded-full px-1.5 py-0.5"
              style={{
                backgroundColor: "var(--surface3)",
                color: "var(--text2)",
                fontFamily: "DM Mono, monospace",
              }}
            >
              {dealsByStage[stage.key].length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
            {dealsByStage[stage.key].map((deal) => (
              <div
                key={deal.id}
                className="rounded-md p-2.5 cursor-pointer transition-colors hover:brightness-110"
                style={{
                  backgroundColor: "var(--surface2)",
                  borderLeft: `2px solid ${stage.color}`,
                }}
              >
                <p className="text-xs font-medium truncate mb-0.5" style={{ color: "var(--text)" }}>
                  {deal.address}
                </p>
                <p className="text-[11px] truncate mb-1.5" style={{ color: "var(--text2)" }}>
                  {deal.client}
                </p>
                <p className="text-[11px] truncate mb-1.5" style={{ color: "var(--text3)" }}>
                  {deal.nextStep}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>
                    {deal.price}
                  </span>
                  {daysBadge(deal.daysInStage, deal.targetDays)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- HISTORY TIMELINE ----

function HistoryTimeline({ history, currentStage }: { history: StageHistoryEntry[]; currentStage: StageKey }) {
  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div
        className="absolute left-[7px] top-2 bottom-2"
        style={{ width: 2, backgroundColor: "var(--border)" }}
      />
      <div className="space-y-4">
        {history.map((entry, i) => {
          const stageColor = STAGES.find((s) => s.key === entry.stageKey)?.color || "#888";
          const isCurrent = entry.isCurrent;
          const overTarget = entry.targetDays > 0 && entry.durationDays > entry.targetDays;

          return (
            <div key={i} className="relative">
              {/* Dot */}
              <span
                className="absolute rounded-full shrink-0"
                style={{
                  left: -21,
                  top: 4,
                  width: isCurrent ? 12 : 8,
                  height: isCurrent ? 12 : 8,
                  backgroundColor: stageColor,
                  border: isCurrent ? "2px solid var(--accent)" : "none",
                  boxShadow: isCurrent ? "0 0 6px " + stageColor : "none",
                }}
              />
              {/* Content */}
              <div className="pb-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-xs font-medium"
                    style={{ color: isCurrent ? "var(--accent)" : stageColor }}
                  >
                    {entry.stageLabel}
                  </span>
                  {isCurrent && (
                    <span
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "var(--bg)",
                        fontFamily: "DM Mono, monospace",
                      }}
                    >
                      NOW
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px]" style={{ color: "var(--text3)" }}>
                    Entered {entry.enteredDate}
                  </span>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: overTarget ? "var(--red)" + "20" : "var(--accent)" + "20",
                      color: overTarget ? "var(--red)" : "var(--accent)",
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    {entry.durationDays}d{entry.targetDays > 0 ? ` / ${entry.targetDays}d` : ""}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--text3)" }}>
                    by {entry.movedBy}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text3)" }}>
                    {entry.stepsCompleted}/{entry.totalSteps} steps
                  </span>
                </div>
                {entry.correctionNote && (
                  <p className="text-[10px] mt-1 italic" style={{ color: "var(--med)" }}>
                    ⚠ {entry.correctionNote}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- LIST VIEW ----

function ListView({ deals }: { deals: Deal[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("daysInStage");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedTab, setExpandedTab] = useState<"checklist" | "history">("checklist");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...deals].sort((a, b) => {
    let va: string | number = a[sortKey];
    let vb: string | number = b[sortKey];
    if (sortKey === "daysInStage") {
      va = a.daysInStage;
      vb = b.daysInStage;
    }
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const stageName = (key: StageKey) => STAGES.find((s) => s.key === key)?.label || key;
  const stageColor = (key: StageKey) => STAGES.find((s) => s.key === key)?.color || "#888";

  const columns: { key: SortKey; label: string; width?: string }[] = [
    { key: "address", label: "Address", width: "20%" },
    { key: "client", label: "Client", width: "16%" },
    { key: "stage", label: "Stage", width: "11%" },
    { key: "daysInStage", label: "Days", width: "7%" },
    { key: "nextStep", label: "Next Step", width: "20%" },
    { key: "closeDate", label: "Close Date", width: "12%" },
  ];

  return (
    <div className="px-6 pt-4 pb-4">
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface)" }}>
        {/* Table header */}
        <div
          className="flex items-center px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider"
          style={{
            color: "var(--text3)",
            fontFamily: "DM Mono, monospace",
            borderBottom: `1px solid var(--border)`,
          }}
        >
          {columns.map((col) => (
            <button
              key={col.key}
              className="flex items-center gap-1 hover:text-text transition-colors"
              style={{ width: col.width, color: "inherit" }}
              onClick={() => handleSort(col.key)}
            >
              {col.label}
              <ArrowUpDown size={10} />
            </button>
          ))}
          <div style={{ width: "5%" }} />
        </div>

        {/* Table rows */}
        <div>
          {sorted.map((deal) => {
            const isExpanded = expandedId === deal.id;
            const stageLabel = stageName(deal.stage);
            const sc = stageColor(deal.stage);
            const overTarget = deal.targetDays > 0 && deal.daysInStage > deal.targetDays;

            return (
              <div key={deal.id}>
                <div
                  className={cn(
                    "flex items-center px-4 py-3 cursor-pointer transition-colors",
                    isExpanded && "brightness-110"
                  )}
                  style={{
                    borderBottom: `1px solid var(--border)`,
                    backgroundColor: isExpanded ? "var(--surface2)" : "transparent",
                  }}
                  onClick={() => {
                    if (expandedId === deal.id) {
                      setExpandedId(null);
                    } else {
                      setExpandedId(deal.id);
                      setExpandedTab("checklist");
                    }
                  }}
                >
                  <div className="flex items-center gap-2" style={{ width: "20%" }}>
                    {isExpanded ? (
                      <ChevronDown size={14} style={{ color: "var(--text3)" }} />
                    ) : (
                      <ChevronRight size={14} style={{ color: "var(--text3)" }} />
                    )}
                    <span className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                      {deal.address}
                    </span>
                  </div>
                  <span className="text-sm truncate" style={{ width: "16%", color: "var(--text2)" }}>
                    {deal.client}
                  </span>
                  <span className="text-xs truncate flex items-center gap-1.5" style={{ width: "11%" }}>
                    <span className="rounded-full shrink-0" style={{ width: 6, height: 6, backgroundColor: sc }} />
                    <span style={{ color: sc }}>{stageLabel}</span>
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{
                      width: "7%",
                      color: overTarget ? "var(--red)" : "var(--text2)",
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    {deal.daysInStage}d
                  </span>
                  <span className="text-xs truncate" style={{ width: "20%", color: "var(--text3)" }}>
                    {deal.nextStep}
                  </span>
                  <span className="text-xs" style={{ width: "12%", color: "var(--text2)" }}>
                    {deal.closeDate}
                  </span>
                  <div style={{ width: "5%" }} />
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div
                    className="px-4 py-4"
                    style={{
                      backgroundColor: "var(--surface2)",
                      borderBottom: `1px solid var(--border)`,
                    }}
                  >
                    {/* Detail grid */}
                    <div className="grid grid-cols-4 gap-x-6 gap-y-3 mb-4">
                      {[
                        { label: "Client", value: deal.client },
                        { label: "Price", value: deal.price },
                        { label: "Type", value: deal.type },
                        { label: "Agent", value: deal.agent },
                        { label: "Close Date", value: deal.closeDate },
                        { label: "Stage Entered", value: deal.stageEntered },
                        {
                          label: "Days in Stage",
                          value: (
                            <span style={{ color: overTarget ? "var(--red)" : "var(--text2)" }}>
                              {deal.daysInStage}d
                            </span>
                          ),
                        },
                        {
                          label: "Target",
                          value: deal.targetDays > 0 ? `${deal.targetDays}d` : "—",
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <p
                            className="text-[10px] font-medium uppercase tracking-wider mb-0.5"
                            style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
                          >
                            {item.label}
                          </p>
                          <p className="text-sm" style={{ color: "var(--text)" }}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Tabs: Checklist / History */}
                    <div className="flex items-center gap-1 mb-3">
                      <button
                        className={cn(
                          "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
                        )}
                        style={{
                          backgroundColor: expandedTab === "checklist" ? "var(--surface3)" : "transparent",
                          color: expandedTab === "checklist" ? "var(--text)" : "var(--text2)",
                        }}
                        onClick={() => setExpandedTab("checklist")}
                      >
                        Checklist
                      </button>
                      <button
                        className={cn(
                          "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
                        )}
                        style={{
                          backgroundColor: expandedTab === "history" ? "var(--surface3)" : "transparent",
                          color: expandedTab === "history" ? "var(--text)" : "var(--text2)",
                        }}
                        onClick={() => setExpandedTab("history")}
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          History
                        </span>
                      </button>
                    </div>

                    {/* Tab content */}
                    {expandedTab === "checklist" && (
                      <div className="mb-4">
                        <div className="space-y-1.5">
                          {deal.steps.map((step) => (
                            <div key={step.id} className="flex items-center gap-2">
                              {step.done ? (
                                <CheckCircle2 size={14} style={{ color: "var(--accent)" }} />
                              ) : (
                                <Circle size={14} style={{ color: "var(--text3)" }} />
                              )}
                              <span
                                className="text-sm"
                                style={{
                                  color: step.done ? "var(--text)" : "var(--text3)",
                                }}
                              >
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {expandedTab === "history" && (
                      <div className="mb-4">
                        <HistoryTimeline history={deal.stageHistory} currentStage={deal.stage} />
                      </div>
                    )}

                    {/* Advance button */}
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors hover:brightness-110"
                        style={{
                          backgroundColor: "var(--accent)",
                          color: "var(--bg)",
                        }}
                      >
                        <ArrowRight size={12} />
                        Advance Deal
                      </button>
                      <span className="text-[11px]" style={{ color: "var(--text3)" }}>
                        Move to next stage
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- ADD DEAL MODAL ----

function AddDealModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [address, setAddress] = useState("");
  const [client, setClient] = useState("");
  const [agent, setAgent] = useState("");
  const [stage, setStage] = useState<StageKey>("s0");
  const [closeDate, setCloseDate] = useState("");
  const [price, setPrice] = useState("");
  const [tc, setTc] = useState("");

  if (!open) return null;

  const handleAdd = () => {
    // In a real app this would call an API
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 w-full max-w-lg"
        style={{ backgroundColor: "var(--surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-lg"
            style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}
          >
            Add deal
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors"
            style={{ color: "var(--text2)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Property address */}
          <div>
            <label
              className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
            >
              Property address
            </label>
            <input
              type="text"
              placeholder="123 Main St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
            />
          </div>

          {/* Client name + Agent (row) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                Client name
              </label>
              <input
                type="text"
                placeholder="John Smith"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              />
            </div>
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                Agent
              </label>
              <input
                type="text"
                placeholder="Jessica Torres"
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              />
            </div>
          </div>

          {/* Stage select + Close date (row) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as StageKey)}
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                Close date
              </label>
              <input
                type="date"
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              />
            </div>
          </div>

          {/* Sale price + TC assigned (row) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                Sale price
              </label>
              <input
                type="text"
                placeholder="$450,000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              />
            </div>
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                TC assigned
              </label>
              <select
                value={tc}
                onChange={(e) => setTc(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                <option value="">Select TC…</option>
                <option value="RM">Raj Mehta</option>
                <option value="PS">Priya Sharma</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-medium transition-colors"
            style={{
              backgroundColor: "var(--surface3)",
              color: "var(--text2)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-md text-xs font-medium transition-colors hover:brightness-110"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--bg)",
            }}
          >
            Add deal
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- PIPELINE PAGE ----

export default function PipelinePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deals, setDeals] = useState<Deal[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/deals", { headers: { "x-org-id": "00000000-0000-0000-0000-000000000001" } })
      .then((r) => r.json())
      .then((d) => { if (d.data) setDeals(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayDeals = deals ?? MOCK_DEALS;

  return (
    <ShellLayout actionLabel="Add deal" onActionClick={() => setShowAddModal(true)}>
      {/* View toggle */}
      <div className="flex items-center gap-1 px-6 pt-4 pb-2">
        <button
          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors")}
          style={{
            backgroundColor: viewMode === "board" ? "var(--surface3)" : "transparent",
            color: viewMode === "board" ? "var(--text)" : "var(--text2)",
          }}
          onClick={() => setViewMode("board")}
        >
          <LayoutGrid size={14} />
          Board
        </button>
        <button
          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors")}
          style={{
            backgroundColor: viewMode === "list" ? "var(--surface3)" : "transparent",
            color: viewMode === "list" ? "var(--text)" : "var(--text2)",
          }}
          onClick={() => setViewMode("list")}
        >
          <List size={14} />
          List
        </button>
      </div>

      {viewMode === "board" ? <BoardView deals={displayDeals} /> : <ListView deals={displayDeals} />}

      {/* Add Deal Modal */}
      <AddDealModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </ShellLayout>
  );
}
