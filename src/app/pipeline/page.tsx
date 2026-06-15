"use client";

import { useState } from "react";
import { ShellLayout } from "@/components/shell-layout";
import { cn } from "@/lib/utils";
import { STAGES, MOCK_DEALS, Deal, StageKey } from "@/lib/data";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Circle,
  LayoutGrid,
  List,
  ArrowUpDown,
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
          {/* Stage header */}
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

          {/* Stage cards */}
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
                <p
                  className="text-xs font-medium truncate mb-0.5"
                  style={{ color: "var(--text)" }}
                >
                  {deal.address}
                </p>
                <p
                  className="text-[11px] truncate mb-1.5"
                  style={{ color: "var(--text2)" }}
                >
                  {deal.client}
                </p>
                <p
                  className="text-[11px] truncate mb-1.5"
                  style={{ color: "var(--text3)" }}
                >
                  {deal.nextStep}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px]"
                    style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
                  >
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

// ---- LIST VIEW ----

function ListView({ deals }: { deals: Deal[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("daysInStage");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    { key: "address", label: "Address", width: "22%" },
    { key: "client", label: "Client", width: "18%" },
    { key: "stage", label: "Stage", width: "12%" },
    { key: "daysInStage", label: "Days", width: "8%" },
    { key: "nextStep", label: "Next Step", width: "22%" },
    { key: "closeDate", label: "Close Date", width: "13%" },
  ];

  return (
    <div className="px-6 pt-4 pb-4">
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: "var(--surface)" }}
      >
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
                  onClick={() => setExpandedId(isExpanded ? null : deal.id)}
                >
                  <div className="flex items-center gap-2" style={{ width: "22%" }}>
                    {isExpanded ? (
                      <ChevronDown size={14} style={{ color: "var(--text3)" }} />
                    ) : (
                      <ChevronRight size={14} style={{ color: "var(--text3)" }} />
                    )}
                    <span className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                      {deal.address}
                    </span>
                  </div>
                  <span className="text-sm truncate" style={{ width: "18%", color: "var(--text2)" }}>
                    {deal.client}
                  </span>
                  <span className="text-xs truncate flex items-center gap-1.5" style={{ width: "12%" }}>
                    <span className="rounded-full shrink-0" style={{ width: 6, height: 6, backgroundColor: sc }} />
                    <span style={{ color: sc }}>{stageLabel}</span>
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{
                      width: "8%",
                      color: overTarget ? "var(--red)" : "var(--text2)",
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    {deal.daysInStage}d
                  </span>
                  <span className="text-xs truncate" style={{ width: "22%", color: "var(--text3)" }}>
                    {deal.nextStep}
                  </span>
                  <span className="text-xs" style={{ width: "13%", color: "var(--text2)" }}>
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

                    {/* Stage checklist */}
                    <div className="mb-4">
                      <p
                        className="text-[10px] font-medium uppercase tracking-wider mb-2"
                        style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
                      >
                        Stage Checklist
                      </p>
                      <div className="space-y-1.5">
                        {deal.steps.map((step) => (
                          <div key={step.id} className="flex items-center gap-2">
                            {step.done ? (
                              <CheckCircle2 size={14} style={{ color: "var(--accent)" }} />
                            ) : (
                              <Circle size={14} style={{ color: "var(--text3)" }} />
                            )}
                            <span
                              className={cn(
                                "text-sm",
                                step.done ? "" : ""
                              )}
                              style={{
                                color: step.done ? "var(--text)" : "var(--text3)",
                                textDecoration: step.done ? "none" : "none",
                              }}
                            >
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Advance button */}
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: "var(--accent)",
                          color: "var(--bg)",
                        }}
                      >
                        <ArrowRight size={12} />
                        Advance Deal
                      </button>
                      <span
                        className="text-[11px]"
                        style={{ color: "var(--text3)" }}
                      >
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

// ---- PIPELINE PAGE ----

export default function PipelinePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("board");

  return (
    <ShellLayout>
      {/* View toggle */}
      <div
        className="flex items-center gap-1 px-6 pt-4 pb-2"
      >
        <button
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          )}
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
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          )}
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

      {viewMode === "board" ? (
        <BoardView deals={MOCK_DEALS} />
      ) : (
        <ListView deals={MOCK_DEALS} />
      )}
    </ShellLayout>
  );
}
