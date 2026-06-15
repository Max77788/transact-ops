"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Phone,
  MapPin,
  User,
  Calendar,
  Clock,
  Link2,
  RefreshCw,
  Merge,
  Check,
  X,
  RotateCcw,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockOwners, mockCalendarEvents } from "@/lib/mock-data";
import type {
  OwnerCard,
  OwnerStatus,
  Sentiment,
  AgendaItem,
  ActionItem,
} from "@/lib/types";

const statusConfig: Record<
  OwnerStatus,
  { color: string; bg: string; dot: string; label: string }
> = {
  awaiting: {
    color: "var(--purple)",
    bg: "rgba(176,136,255,0.12)",
    dot: "bg-[var(--purple)]",
    label: "Awaiting",
  },
  scheduled: {
    color: "var(--low)",
    bg: "rgba(100,200,240,0.12)",
    dot: "bg-[var(--low)]",
    label: "Scheduled",
  },
  completed: {
    color: "var(--green)",
    bg: "rgba(74,222,128,0.12)",
    dot: "bg-[var(--green)]",
    label: "Completed",
  },
  noshow: {
    color: "var(--high)",
    bg: "rgba(255,107,107,0.12)",
    dot: "bg-[var(--high)]",
    label: "No Show",
  },
};

const sentimentConfig: Record<Sentiment, { emoji: string; label: string }> = {
  positive: { emoji: "😊", label: "Positive" },
  neutral: { emoji: "😐", label: "Neutral" },
  negative: { emoji: "😟", label: "Negative" },
};

// ---- Calendar Helper ----

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const first = new Date(year, month, 1).getDay();
  return first === 0 ? 6 : first - 1; // Monday = 0
}

export default function OwnerCheckins() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null); // YYYY-MM-DD

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDay, daysInMonth]);

  // Events map by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, string[]> = {};
    mockCalendarEvents.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      ev.ownerIds.forEach((id) => {
        if (!map[ev.date].includes(id)) map[ev.date].push(id);
      });
    });
    return map;
  }, []);

  // Filter owners by selected date
  const filteredOwners = useMemo(() => {
    const owners = [...mockOwners];
    if (selectedDay) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        selectedDay.split("-")[2]
      ).padStart(2, "0")}`;
      const ownerIds = eventsByDate[dateKey] || [];
      if (ownerIds.length > 0) {
        return owners.filter((o) => ownerIds.includes(o.id));
      }
      return [];
    }
    return owners;
  }, [selectedDay, year, month, eventsByDate]);

  // Group owners by status
  const grouped = useMemo(() => {
    const groups: Record<string, OwnerCard[]> = {
      awaiting: [],
      scheduled: [],
      completed: [],
      noshow: [],
    };
    filteredOwners.forEach((o) => {
      groups[o.status]?.push(o);
    });
    return groups;
  }, [filteredOwners]);

  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(null);
  };

  const dateKey = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const isToday = (d: number) => {
    const today = new Date();
    return (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const handleDayClick = (d: number) => {
    const key = dateKey(d);
    setSelectedDay(key);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Calendar */}
      <div className="px-6 pt-4 pb-3 border-b border-[var(--border)]">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prevMonth}
            className="p-1 rounded text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <h3
            className="font-serif text-lg text-[var(--text)] tracking-tight"
            style={{ fontFamily: "Instrument Serif, serif" }}
          >
            {MONTHS[month]} {year}
          </h3>
          <button
            onClick={nextMonth}
            className="p-1 rounded text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[10px] font-medium text-[var(--text3)] uppercase tracking-wider py-1"
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((d, i) => {
            if (d === null) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }
            const key = dateKey(d);
            const events = eventsByDate[key] || [];
            const selected = selectedDay === key;
            const today = isToday(d);

            return (
              <button
                key={key}
                onClick={() => handleDayClick(d)}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-all relative",
                  selected
                    ? "bg-[var(--accent)]/10 ring-1 ring-[var(--accent)]/30"
                    : today
                    ? "bg-[var(--surface)] ring-1 ring-[var(--accent)]/20"
                    : "hover:bg-[var(--surface)]"
                )}
              >
                <span
                  className={cn(
                    "text-xs",
                    today ? "text-[var(--accent)] font-bold" : "text-[var(--text2)]"
                  )}
                  style={today ? { fontFamily: "DM Sans, sans-serif" } : {}}
                >
                  {d}
                </span>
                {events.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {events.slice(0, 3).map((_, ei) => (
                      <div
                        key={ei}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            ei === 0
                              ? "var(--purple)"
                              : ei === 1
                              ? "var(--low)"
                              : "var(--accent)",
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {selectedDay && filteredOwners.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text3)]">
            <Calendar size={28} className="mb-3 opacity-50" />
            <span className="text-sm">No check-ins on this day</span>
          </div>
        )}

        {!selectedDay && filteredOwners.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--text3)]">
            <Calendar size={32} className="mb-3 opacity-50" />
            <span className="text-sm">Select a day to view check-ins</span>
          </div>
        )}

        {/* Grouped by status */}
        {(Object.keys(grouped) as OwnerStatus[]).map((status) => {
          const owners = grouped[status];
          if (owners.length === 0) return null;
          const cfg = statusConfig[status];

          return (
            <div key={status}>
              {/* Section header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-2.5 h-2.5 rounded-full", cfg.dot)} />
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: cfg.color }}
                >
                  {cfg.label}
                </span>
                <span
                  className="text-[11px] font-mono"
                  style={{ color: "var(--text3)" }}
                >
                  {owners.length}
                </span>
              </div>

              {/* Owner cards */}
              <div className="space-y-3">
                {owners.map((owner) => (
                  <OwnerCheckinCard key={owner.id} owner={owner} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Owner Check-in Card ----

function OwnerCheckinCard({ owner }: { owner: OwnerCard }) {
  const [expanded, setExpanded] = useState(false);
  const [sentiment, setSentiment] = useState<Sentiment>(owner.sentiment);
  const [notes, setNotes] = useState(owner.rawNotes);
  const [mergedSummary, setMergedSummary] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [agendaItems, setAgendaItems] = useState(owner.agendaItems);
  const [actionItems] = useState(owner.actionItems);
  const [status, setStatus] = useState<OwnerStatus>(owner.status);

  const scfg = statusConfig[status];

  const toggleAgenda = (id: string) => {
    setAgendaItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  };

  const handleMerge = () => {
    // Simulate AI merging raw notes into summary
    setMergedSummary(
      `Combined summary: Call with ${owner.name} (${
        owner.address
      }). ${notes}. Action items: ${actionItems
        .map((a) => a.text)
        .join("; ")}. Sentiment: ${
        sentimentConfig[sentiment].label
      }. Status: ${scfg.label}.`
    );
  };

  const completedAgenda = agendaItems.filter((a) => a.done).length;

  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
      {/* Card head */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 hover:bg-[var(--surface2)]/50 transition-all text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3
                className="font-serif text-[15px] text-[var(--text)]"
                style={{ fontFamily: "Instrument Serif, serif", fontSize: "15px" }}
              >
                {owner.name}
              </h3>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-medium font-mono"
                style={{
                  backgroundColor: owner.dealType === "Sale"
                    ? "rgba(200,240,100,0.12)"
                    : "rgba(100,200,240,0.12)",
                  color: owner.dealType === "Sale" ? "var(--accent)" : "var(--low)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {owner.dealType}
              </span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-medium font-mono text-[var(--text2)]"
                style={{
                  backgroundColor: "var(--surface2)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {owner.stage}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[var(--text2)] flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin size={10} />
                {owner.address.split(",")[0]}
              </span>
              <span className="flex items-center gap-1">
                <User size={10} />
                {owner.agent}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={10} />
                {owner.phone}
              </span>
            </div>

            {/* Reminder badge */}
            {owner.reminderDays > 0 && status === "awaiting" && (
              <div
                className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-[11px] font-medium"
                style={{
                  backgroundColor: "rgba(255,160,64,0.12)",
                  color: "var(--med)",
                }}
              >
                <Clock size={10} />
                {owner.reminderDays}d since last contact
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-medium font-mono",
              )}
              style={{
                backgroundColor: scfg.bg,
                color: scfg.color,
                fontFamily: "DM Mono, monospace",
              }}
            >
              {scfg.label}
            </span>
            {expanded ? (
              <ChevronDown size={16} className="text-[var(--text3)]" />
            ) : (
              <ChevronRight size={16} className="text-[var(--text3)]" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4 space-y-5 border-t border-[var(--border)] pt-4">
          {/* Awaiting state */}
          {status === "awaiting" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-[var(--text2)]">
                <Link2 size={14} className="text-[var(--purple)]" />
                <span>Owner hasn&apos;t booked a check-in call yet.</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={owner.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[var(--purple)]/10 text-[var(--purple)] hover:bg-[var(--purple)]/20 transition-all"
                >
                  <Link2 size={12} />
                  Copy Booking Link
                </a>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[var(--purple)]/10 text-[var(--purple)] hover:bg-[var(--purple)]/20 transition-all">
                  <Send size={12} />
                  Resend Reminder
                </button>
              </div>
            </div>
          )}

          {/* Scheduled state */}
          {status === "scheduled" && (
            <div className="space-y-5">
              {/* Call details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[var(--surface2)]">
                  <div className="text-[10px] text-[var(--text3)] uppercase tracking-wider mb-1 font-medium">
                    Call Date/Time
                  </div>
                  <div className="text-sm text-[var(--text)] font-mono">
                    {owner.callDate} at {owner.callTime}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--surface2)]">
                  <div className="text-[10px] text-[var(--text3)] uppercase tracking-wider mb-1 font-medium">
                    Stage at Call
                  </div>
                  <div className="text-sm text-[var(--text)]">
                    {owner.stageAtCall}
                  </div>
                </div>
              </div>

              {/* Calendly link */}
              <div>
                <a
                  href={owner.calendlyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--low)] hover:underline"
                >
                  <Link2 size={12} />
                  Open Calendly
                </a>
              </div>

              {/* LLM Prep section */}
              <div>
                <div className="text-xs font-medium text-[var(--text2)] uppercase tracking-wider mb-2">
                  🤖 Call Prep — Talking Points
                </div>
                <div className="space-y-2">
                  {owner.talkingPoints.map((tp) => (
                    <div
                      key={tp.id}
                      className="p-2.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] leading-relaxed"
                    >
                      {tp.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Agenda checklist */}
              <div>
                <div className="text-xs font-medium text-[var(--text2)] uppercase tracking-wider mb-2">
                  📋 Agenda ({completedAgenda}/{agendaItems.length})
                </div>
                <div className="space-y-1.5">
                  {agendaItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleAgenda(item.id)}
                      className="flex items-center gap-2 w-full text-left text-xs text-[var(--text)] hover:bg-[var(--surface2)] rounded-md p-1.5 transition-all"
                    >
                      {item.done ? (
                        <Check size={14} className="text-[var(--green)] shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded border border-[var(--border)] shrink-0" />
                      )}
                      <span
                        className={cn(
                          item.done && "line-through text-[var(--text3)]"
                        )}
                      >
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Completed / Noshow states */}
          {(status === "completed" || status === "noshow") && (
            <div className="space-y-5">
              {/* Sentiment selector */}
              <div>
                <div className="text-xs font-medium text-[var(--text2)] uppercase tracking-wider mb-2">
                  Sentiment
                </div>
                <div className="flex items-center gap-2">
                  {(
                    Object.entries(sentimentConfig) as [Sentiment, { emoji: string; label: string }][]
                  ).map(([key, { emoji, label }]) => (
                    <button
                      key={key}
                      onClick={() => setSentiment(key)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                        sentiment === key
                          ? "bg-[var(--surface2)] ring-1 ring-[var(--border)]"
                          : "text-[var(--text3)] hover:text-[var(--text)]"
                      )}
                    >
                      <span className="text-base">{emoji}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              {(owner.aiSummary || mergedSummary) && (
                <div>
                  <div className="text-xs font-medium text-[var(--text2)] uppercase tracking-wider mb-2">
                    🤖 AI Summary
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] leading-relaxed">
                    {mergedSummary || owner.aiSummary}
                  </div>
                </div>
              )}

              {/* Raw notes textarea */}
              <div>
                <div className="text-xs font-medium text-[var(--text2)] uppercase tracking-wider mb-2">
                  📝 Raw Notes
                </div>
                <textarea
                  className="w-full min-h-[100px] bg-[var(--surface2)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--text)] leading-relaxed resize-y focus:outline-none focus:border-[var(--purple)] transition-colors placeholder-[var(--text3)]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter call notes..."
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
              </div>

              {/* Merge button */}
              <button
                onClick={handleMerge}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[var(--purple)]/10 text-[var(--purple)] hover:bg-[var(--purple)]/20 transition-all"
              >
                <Merge size={12} />
                Merge Notes → AI Summary
              </button>

              {/* Action items */}
              {actionItems.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-[var(--text2)] uppercase tracking-wider mb-2">
                    ✅ Action Items
                  </div>
                  <div className="space-y-2">
                    {actionItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-xs text-[var(--text)]"
                      >
                        {item.done ? (
                          <Check size={14} className="text-[var(--green)] shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded border border-[var(--border)] shrink-0" />
                        )}
                        <span
                          className={cn(
                            item.done && "line-through text-[var(--text3)]"
                          )}
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation history toggle */}
              {owner.conversationHistory.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-1.5 text-xs font-medium text-[var(--text2)] hover:text-[var(--text)] transition-colors"
                  >
                    {showHistory ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                    Conversation History ({owner.conversationHistory.length})
                  </button>
                  {showHistory && (
                    <div className="mt-2 space-y-2 pl-5 border-l-2 border-[var(--border)]">
                      {owner.conversationHistory.map((cycle, i) => (
                        <div key={i} className="relative">
                          <div className="text-[10px] font-mono text-[var(--text3)] mb-1">
                            {cycle.date}
                          </div>
                          <div className="text-xs text-[var(--text2)] leading-relaxed">
                            {cycle.summary}
                          </div>
                          {cycle.notes && (
                            <div className="text-xs text-[var(--text3)] mt-1 italic">
                              &ldquo;{cycle.notes}&rdquo;
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Outcome buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
            {status === "awaiting" && (
              <button
                onClick={() => setStatus("scheduled")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--low)]/10 text-[var(--low)] hover:bg-[var(--low)]/20 transition-all"
              >
                <Calendar size={12} />
                Mark as Scheduled
              </button>
            )}
            {(status === "scheduled" || status === "awaiting") && (
              <>
                <button
                  onClick={() => setStatus("completed")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--green)]/10 text-[var(--green)] hover:bg-[var(--green)]/20 transition-all"
                >
                  <Check size={12} />
                  Completed
                </button>
                <button
                  onClick={() => setStatus("noshow")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--high)]/10 text-[var(--high)] hover:bg-[var(--high)]/20 transition-all"
                >
                  <X size={12} />
                  No-Show
                </button>
              </>
            )}
            {(status === "completed" || status === "noshow") && (
              <button
                onClick={() => setStatus("awaiting")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface2)] text-[var(--text2)] hover:text-[var(--text)] transition-all"
              >
                <RotateCcw size={12} />
                Back to Awaiting
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
