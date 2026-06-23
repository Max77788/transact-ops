"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  Send,
  RefreshCw,
  Edit3,
  CheckSquare,
  Square,
  Calendar,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockMondayFeedback, mockOpenHouses, mockScheduleSlots } from "@/lib/mock-data";
import type {
  MondayFeedbackCard,
  OpenHouseCard,
  Sentiment,
  ShowingEntry,
} from "@/lib/types";

const sentimentConfig: Record<Sentiment, { color: string; dot: string }> = {
  positive: { color: "var(--green)", dot: "bg-[var(--green)]" },
  neutral: { color: "var(--lime)", dot: "bg-[var(--lime)]" },
  negative: { color: "var(--red)", dot: "bg-[var(--red)]" },
};

type CommTab = "monday" | "wednesday";

export default function Communications() {
  const [tab, setTab] = useState<CommTab>("monday");

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center border-b border-[var(--line)]">
        <button
          onClick={() => setTab("monday")}
          className={cn(
            "flex-1 py-3 text-sm font-medium text-center transition-all border-b-2",
            tab === "monday"
              ? "border-[var(--purple)] text-[var(--purple)]"
              : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
          )}
        >
          Monday Feedback
        </button>
        <button
          onClick={() => setTab("wednesday")}
          className={cn(
            "flex-1 py-3 text-sm font-medium text-center transition-all border-b-2",
            tab === "wednesday"
              ? "border-[var(--blue)] text-[var(--blue)]"
              : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
          )}
        >
          Wednesday Open Houses
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === "monday" ? <MondayTab /> : <WednesdayTab />}
      </div>
    </div>
  );
}

// ---- Monday Feedback Tab ----

function MondayTab() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {/* Info header */}
      <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--line)]">
        <div className="flex items-center gap-2 mb-1.5">
          <RefreshCw size={14} className="text-[var(--purple)]" />
          <span className="text-sm font-medium text-[var(--purple)]">
            Automated Feedback Drafts
          </span>
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Every Monday morning, TransactOps drafts personalized showing feedback
          emails based on the week's activity. Review, edit, and send to your
          sellers below.
        </p>
      </div>

      {/* Feedback cards */}
      {mockMondayFeedback.map((card) => (
        <MondayFeedbackCardItem key={card.id} card={card} />
      ))}
    </div>
  );
}

function MondayFeedbackCardItem({ card }: { card: MondayFeedbackCard }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-[var(--card)] border border-[var(--line)] overflow-hidden">
      {/* Head */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--card2)]/50 transition-all text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <h3
            className="font-serif text-[15px] text-[var(--ink)] truncate"
            style={{ fontFamily: "Instrument Serif, serif", fontSize: "15px" }}
          >
            {card.address}
          </h3>
          <span
            className="px-2 py-0.5 rounded text-[11px] font-medium font-mono shrink-0"
            style={{
              backgroundColor: "rgba(176,136,255,0.12)",
              color: "var(--purple)",
              fontFamily: "DM Mono, monospace",
            }}
          >
            {card.showingCount} showings this week
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[11px] font-medium font-mono",
              card.status === "draft"
                ? "bg-[var(--amber)]/10 text-[var(--amber)]"
                : "bg-[var(--green)]/10 text-[var(--green)]"
            )}
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            {card.status === "draft" ? "Draft" : "Sent"}
          </span>
          {expanded ? (
            <ChevronDown size={16} className="text-[var(--muted2)]" />
          ) : (
            <ChevronRight size={16} className="text-[var(--muted2)]" />
          )}
        </div>
      </button>

      {/* Expandable body */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[var(--line)] pt-4">
          {/* Showings table */}
          <div>
            <div className="text-xs font-medium text-[var(--muted)] mb-2 uppercase tracking-wider">
              Showings
            </div>
            <div className="rounded-lg border border-[var(--line)] overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[var(--card2)] text-[var(--muted)]">
                    <th className="text-left py-2 px-3 font-medium font-mono">Date</th>
                    <th className="text-left py-2 px-3 font-medium font-mono">Agent</th>
                    <th className="text-left py-2 px-3 font-medium font-mono">Feedback</th>
                    <th className="text-center py-2 px-3 font-medium font-mono w-12">Sent.</th>
                  </tr>
                </thead>
                <tbody>
                  {card.showings.map((s, i) => (
                    <tr
                      key={i}
                      className="border-t border-[var(--line)] text-[var(--ink)]"
                    >
                      <td className="py-2.5 px-3 font-mono text-[var(--muted)]">{s.date}</td>
                      <td className="py-2.5 px-3">{s.agent}</td>
                      <td className="py-2.5 px-3 text-[var(--muted)] leading-relaxed">
                        {s.feedback}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Circle
                          size={8}
                          className="inline-block"
                          fill={sentimentConfig[s.sentiment].color}
                          stroke={sentimentConfig[s.sentiment].color}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Draft label */}
          <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
            Draft Email
          </div>

          {/* Editable draft textarea */}
          <textarea
            className="w-full min-h-[140px] bg-[var(--card2)] border border-[var(--line)] rounded-lg p-3 text-sm text-[var(--ink)] leading-relaxed resize-y focus:outline-none focus:border-[var(--purple)] transition-colors placeholder-[var(--muted2)]"
            defaultValue={card.draftText}
            style={{ fontFamily: "DM Sans, sans-serif" }}
          />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[var(--purple)]/10 text-[var(--purple)] hover:bg-[var(--purple)]/20 transition-all">
              <RefreshCw size={12} />
              Regenerate
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-all">
              <Send size={12} />
              Send
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-[var(--muted2)] hover:text-[var(--muted)] hover:bg-[var(--card2)] transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Wednesday Tab ----

function WednesdayTab() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scheduledCount = mockScheduleSlots.length;
  const sentCount = mockOpenHouses.filter((o) => o.status === "sent").length;

  return (
    <div className="flex h-full">
      {/* Left: Open house list (2/3) */}
      <div className="flex-[2] overflow-y-auto px-6 py-4 space-y-3 border-r border-[var(--line)]">
        {mockOpenHouses.map((card) => (
          <OpenHouseCardItem
            key={card.id}
            card={card}
            selected={selected.has(card.id)}
            onToggle={() => toggleSelect(card.id)}
          />
        ))}
      </div>

      {/* Right: Schedule panel (1/3, sticky) */}
      <div className="flex-1 p-4 space-y-5 overflow-y-auto">
        <div>
          <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
            ️ Wednesday Schedule
          </h3>
          <div className="space-y-2">
            {mockScheduleSlots.map((slot, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[var(--card)] border border-[var(--line)]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={12} className="text-[var(--blue)]" />
                  <span className="text-xs font-medium text-[var(--ink)] font-mono">
                    {slot.time}
                  </span>
                </div>
                <div className="text-xs text-[var(--muted)] leading-relaxed">
                  {slot.address}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--muted)]">Scheduled</span>
            <span className="text-sm font-mono font-medium text-[var(--ink)]">
              {scheduledCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--muted)]">Sent</span>
            <span className="text-sm font-mono font-medium text-[var(--ink)]">
              {sentCount}
            </span>
          </div>
        </div>

        {/* Send All button */}
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium bg-[var(--blue)]/10 text-[var(--blue)] hover:bg-[var(--blue)]/20 transition-all">
          <Send size={12} />
          Send All ({mockOpenHouses.length})
        </button>
      </div>
    </div>
  );
}

function OpenHouseCardItem({
  card,
  selected,
  onToggle,
}: {
  card: OpenHouseCard;
  selected: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-[var(--card)] border border-[var(--line)] overflow-hidden">
      {/* Head */}
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={onToggle}
          className="shrink-0 text-[var(--muted2)] hover:text-[var(--blue)] transition-colors"
        >
          {selected ? (
            <CheckSquare size={18} className="text-[var(--blue)]" />
          ) : (
            <Square size={18} />
          )}
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center justify-between min-w-0 text-left"
        >
          <div className="min-w-0">
            <h3
              className="font-serif text-[15px] text-[var(--ink)] truncate"
              style={{ fontFamily: "Instrument Serif, serif", fontSize: "15px" }}
            >
              {card.address}
            </h3>
            <div className="text-xs font-mono text-[var(--muted2)] mt-0.5">
              {card.reason}
            </div>
          </div>
          {expanded ? (
            <ChevronDown size={16} className="text-[var(--muted2)] shrink-0 ml-2" />
          ) : (
            <ChevronRight size={16} className="text-[var(--muted2)] shrink-0 ml-2" />
          )}
        </button>
      </div>

      {/* Expandable body */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[var(--line)] pt-4">
          {/* Date/Time form */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-[var(--muted)] mb-1.5 font-medium">
                Date
              </label>
              <input
                type="date"
                defaultValue={card.date}
                className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] transition-colors font-mono"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-[var(--muted)] mb-1.5 font-medium">
                Time
              </label>
              <input
                type="time"
                defaultValue={card.time}
                className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] transition-colors font-mono"
              />
            </div>
          </div>

          {/* Email preview textarea */}
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1.5 font-medium uppercase tracking-wider">
              Email Preview
            </label>
            <textarea
              className="w-full min-h-[120px] bg-[var(--card2)] border border-[var(--line)] rounded-lg p-3 text-sm text-[var(--ink)] leading-relaxed resize-y focus:outline-none focus:border-[var(--blue)] transition-colors placeholder-[var(--muted2)]"
              defaultValue={card.emailPreview}
              style={{ fontFamily: "DM Sans, sans-serif" }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[var(--blue)]/10 text-[var(--blue)] hover:bg-[var(--blue)]/20 transition-all">
              <RefreshCw size={12} />
              Generate
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[var(--blue)]/10 text-[var(--blue)] hover:bg-[var(--blue)]/20 transition-all">
              <Edit3 size={12} />
              Edit
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-all">
              <Send size={12} />
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
