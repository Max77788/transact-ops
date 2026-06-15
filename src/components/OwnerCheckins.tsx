"use client";

import { useState, useMemo, useEffect } from "react";
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
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockOwners, mockCalendarEvents } from "@/lib/mock-data";
import type {
  OwnerCard,
  OwnerStatus,
  Sentiment,
  AgendaItem,
  ActionItem,
  CalendarEvent,
  DealType,
} from "@/lib/types";

// ---- Status config with border colors ----
const statusConfig: Record<
  OwnerStatus,
  { color: string; bg: string; dot: string; label: string; borderColor: string }
> = {
  awaiting: {
    color: "#f0c864",
    bg: "rgba(240,200,100,0.12)",
    dot: "#f0c864",
    label: "Awaiting booking",
    borderColor: "#f0c864",
  },
  scheduled: {
    color: "#64c8f0",
    bg: "rgba(100,200,240,0.12)",
    dot: "#64c8f0",
    label: "Scheduled",
    borderColor: "#64c8f0",
  },
  completed: {
    color: "#64f0c8",
    bg: "rgba(100,240,200,0.12)",
    dot: "#64f0c8",
    label: "Completed",
    borderColor: "#64f0c8",
  },
  noshow: {
    color: "#ffa040",
    bg: "rgba(255,160,64,0.12)",
    dot: "#ffa040",
    label: "No-show",
    borderColor: "#ffa040",
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
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

export default function OwnerCheckins() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [owners, setOwners] = useState<OwnerCard[]>(mockOwners);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [loading, setLoading] = useState(true);

  // On mount, try to fetch checkins from API; fall back to mock
  useEffect(() => {
    fetch("/api/checkins", { headers: { "x-org-id": "d1000000-0000-0000-0000-000000000001" } })
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.length) {
          const apiOwners: OwnerCard[] = [];
          const apiEvents: CalendarEvent[] = [];
          d.data.forEach((c: any) => {
            const owner = c.owner || {};
            const o: OwnerCard = {
              id: c.id,
              name: owner.name || "Unknown",
              address: owner.address || "",
              agent: owner.agent || "",
              phone: owner.phone || "",
              dealType: (owner.deal_type as DealType) || "Sale",
              stage: owner.stage || "",
              status: (c.status as OwnerStatus) || "awaiting",
              bookingLink: owner.booking_link || "",
              calendlyLink: owner.calendly_link || "",
              callDate: c.scheduled_date || "",
              callTime: c.scheduled_time || "",
              stageAtCall: c.stage_idx_at_call != null ? `Stage ${c.stage_idx_at_call}` : "",
              reminderDays: 0,
              talkingPoints: [],
              agendaItems: (c.actions || []).map((a: any, i: number) => ({
                id: a.id || `ag-${i}`,
                text: a.text || a.title || "",
                done: a.done ?? false,
              })),
              sentiment: (c.sentiment as Sentiment) || "neutral",
              aiSummary: c.ai_summary || "",
              actionItems: [],
              rawNotes: c.raw_notes || "",
              conversationHistory: [],
            };
            apiOwners.push(o);
            if (c.scheduled_date) {
              apiEvents.push({ date: c.scheduled_date, ownerIds: [c.id] });
            }
          });
          setOwners(apiOwners);
          setCalendarEvents(apiEvents);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDay, daysInMonth]);

  // Build a map from date -> { time, firstName }[] for event chips
  const eventsByDate = useMemo(() => {
    const map: Record<string, { time: string; firstName: string; ownerId: string }[]> = {};
    calendarEvents.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      ev.ownerIds.forEach((id) => {
        const owner = owners.find((o) => o.id === id);
        if (owner) {
          const firstName = owner.name.split(" ")[0].replace("&", "").trim();
          map[ev.date].push({
            time: owner.callTime || "",
            firstName: firstName,
            ownerId: id,
          });
        }
      });
    });
    return map;
  }, [calendarEvents, owners]);

  // Filter owners by selected date
  const filteredOwners = useMemo(() => {
    const allOwners = [...owners];
    if (selectedDay) {
      const events = eventsByDate[selectedDay] || [];
      const ownerIds = events.map((e) => e.ownerId);
      if (ownerIds.length > 0) {
        return allOwners.filter((o) => ownerIds.includes(o.id));
      }
      return [];
    }
    return allOwners;
  }, [selectedDay, eventsByDate, owners]);

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

  // Progress bar: completed calls / total calls with status
  const totalCalls = owners.filter((o) =>
    ["completed", "noshow", "scheduled"].includes(o.status)
  ).length;
  const completedCalls = owners.filter(
    (o) => o.status === "completed"
  ).length;
  const completionPct = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;

  // Total scheduled count for calendar header
  const totalScheduled = calendarEvents.length;

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

  const clearFilter = () => setSelectedDay(null);

  // Format selected date for display
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDay) return null;
    const [y, m, d] = selectedDay.split("-");
    const monthName = MONTHS[parseInt(m) - 1];
    return `${monthName} ${parseInt(d)}, ${y}`;
  }, [selectedDay]);

  const groupOrder: { key: OwnerStatus; dotColor: string; title: string }[] = [
    { key: "awaiting", dotColor: "#f0c864", title: "Awaiting booking" },
    { key: "scheduled", dotColor: "#64c8f0", title: "Scheduled" },
    { key: "completed", dotColor: "#64f0c8", title: "Completed" },
    { key: "noshow", dotColor: "#ffa040", title: "No-show" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div
        className="px-6"
        style={{
          height: "3px",
          backgroundColor: "var(--border)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${completionPct}%`,
            backgroundColor: "#f0c864",
            transition: "width 0.5s ease",
            borderRadius: "0 2px 2px 0",
          }}
        />
      </div>

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
          <div className="text-center">
            <h3
              className="font-serif text-lg text-[var(--text)] tracking-tight leading-tight"
              style={{ fontFamily: "Instrument Serif, serif", fontSize: "18px" }}
            >
              {MONTHS[month]} {year}
            </h3>
            <p
              className="text-[10px]"
              style={{ fontFamily: "DM Mono, monospace", color: "var(--text3)" }}
            >
              {totalScheduled} scheduled · click a day to filter
            </p>
          </div>
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
              className="text-center py-1 text-[var(--text3)] uppercase tracking-wider"
              style={{ fontSize: "9px", fontFamily: "DM Mono, monospace" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((d, i) => {
            if (d === null) {
              return (
                <div
                  key={`empty-${i}`}
                  className="rounded-md"
                  style={{ minHeight: "70px", backgroundColor: "var(--surface)" }}
                />
              );
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
                  "flex flex-col items-start rounded-md text-xs transition-all p-1",
                  selected
                    ? ""
                    : today
                    ? ""
                    : "hover:bg-[var(--surface)]"
                )}
                style={{
                  minHeight: "70px",
                  backgroundColor: selected
                    ? "rgba(240,200,100,0.15)"
                    : today
                    ? "var(--surface2)"
                    : "var(--surface)",
                  border: selected
                    ? "1px solid rgba(240,200,100,0.4)"
                    : today
                    ? "1px solid rgba(240,200,100,0.5)"
                    : "1px solid var(--border)",
                }}
              >
                <span
                  className={cn(
                    "text-xs font-medium",
                    today ? "text-[#f0c864]" : "text-[var(--text2)]"
                  )}
                  style={today ? { fontFamily: "DM Sans, sans-serif" } : {}}
                >
                  {d}
                </span>
                {/* Event chips */}
                <div className="flex flex-col gap-0.5 mt-1 w-full overflow-hidden">
                  {events.slice(0, 3).map((ev, ei) => (
                    <div
                      key={ei}
                      className="truncate rounded-sm px-1 py-px"
                      style={{
                        fontSize: "9px",
                        fontFamily: "DM Mono, monospace",
                        backgroundColor: "rgba(100,200,240,0.18)",
                        color: "var(--low)",
                        lineHeight: "1.4",
                      }}
                    >
                      {ev.time ? `${ev.time.replace(" AM","").replace(" PM","")} ` : ""}
                      {ev.firstName}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <span
                      style={{
                        fontSize: "9px",
                        fontFamily: "DM Mono, monospace",
                        color: "var(--text3)",
                      }}
                    >
                      +{events.length - 3} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date filter bar */}
      <div
        className="px-6 py-2 flex items-center gap-3 border-b border-[var(--border)]"
        style={{ backgroundColor: "var(--surface2)" }}
      >
        {selectedDay ? (
          <>
            <span
              className="text-xs"
              style={{ color: "var(--text2)", fontFamily: "DM Sans, sans-serif" }}
            >
              Showing{" "}
              <strong style={{ color: "var(--text)" }}>
                {formattedSelectedDate}
              </strong>{" "}
              · {filteredOwners.length} booking{filteredOwners.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={clearFilter}
              className="flex items-center gap-1 text-xs transition-colors hover:opacity-80"
              style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
            >
              ← Clear filter
            </button>
          </>
        ) : (
          <span
            className="text-xs"
            style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
          >
            Showing all check-ins
          </span>
        )}
      </div>

      {/* Detail list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {selectedDay && filteredOwners.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Calendar size={28} className="mb-3 opacity-50" style={{ color: "var(--text3)" }} />
            <span className="text-sm" style={{ color: "var(--text3)" }}>No check-ins on this day</span>
          </div>
        )}

        {!selectedDay && filteredOwners.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Calendar size={32} className="mb-3 opacity-50" style={{ color: "var(--text3)" }} />
            <span className="text-sm" style={{ color: "var(--text3)" }}>
              Select a day to view check-ins
            </span>
          </div>
        )}

        {/* Grouped by status */}
        {groupOrder.map(({ key, dotColor, title }) => {
          const owners = grouped[key];
          if (owners.length === 0) return null;

          return (
            <div key={key}>
              {/* Section header */}
              <div className="flex items-center gap-2 mb-3">
                {/* Colored dot */}
                <span
                  className="shrink-0 rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: dotColor,
                  }}
                />
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: dotColor, fontFamily: "DM Mono, monospace" }}
                >
                  {title}
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
                >
                  {owners.length}
                </span>
                {/* Line after count */}
                <div
                  className="flex-1"
                  style={{ height: "1px", backgroundColor: "var(--border)" }}
                />
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
  const [actionItems, setActionItems] = useState(owner.actionItems);
  const [status, setStatus] = useState<OwnerStatus>(owner.status);
  const [newTask, setNewTask] = useState("");

  const scfg = statusConfig[status];

  const toggleAgenda = (id: string) => {
    setAgendaItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  };

  const toggleAction = (id: string) => {
    setActionItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  };

  const handleMerge = () => {
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

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const newId = `ft-${Date.now()}`;
    setActionItems((prev) => [
      ...prev,
      { id: newId, text: newTask.trim(), done: false },
    ]);
    setNewTask("");
  };

  const completedAgenda = agendaItems.filter((a) => a.done).length;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${scfg.borderColor}`,
      }}
    >
      {/* Card head */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 hover:bg-[var(--surface2)]/50 transition-all text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3
                className="font-serif text-[15px]"
                style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}
              >
                {owner.name}
              </h3>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-medium"
                style={{
                  backgroundColor:
                    owner.dealType === "Sale"
                      ? "rgba(200,240,100,0.12)"
                      : "rgba(100,200,240,0.12)",
                  color:
                    owner.dealType === "Sale" ? "var(--accent)" : "var(--low)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {owner.dealType}
              </span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-medium"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text2)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {owner.stage}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: "var(--text2)" }}>
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

            {/* Reminder pill — for scheduled calls */}
            {status === "scheduled" && owner.reminderDays > 0 && (
              <div
                className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor:
                    owner.reminderDays < 2
                      ? "rgba(255,107,107,0.15)"
                      : "rgba(255,160,64,0.12)",
                  color:
                    owner.reminderDays < 2 ? "var(--high)" : "var(--med)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                <Clock size={10} />
                Reminder in {owner.reminderDays} day{owner.reminderDays !== 1 ? "s" : ""}
              </div>
            )}

            {/* Reminder pill — for awaiting */}
            {status === "awaiting" && owner.reminderDays > 0 && (
              <div
                className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: "rgba(255,160,64,0.12)",
                  color: "var(--med)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                <Clock size={10} />
                {owner.reminderDays}d since last contact
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
              style={{
                backgroundColor: scfg.bg,
                color: scfg.color,
                fontFamily: "DM Mono, monospace",
              }}
            >
              {scfg.label}
            </span>
            {expanded ? (
              <ChevronDown size={16} style={{ color: "var(--text3)" }} />
            ) : (
              <ChevronRight size={16} style={{ color: "var(--text3)" }} />
            )}
          </div>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div
          className="px-4 pb-4 space-y-5 pt-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* Awaiting state */}
          {status === "awaiting" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text2)" }}>
                <Link2 size={14} style={{ color: "#f0c864" }} />
                <span>Owner hasn&apos;t booked a check-in call yet.</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={owner.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: "rgba(240,200,100,0.12)",
                    color: "#f0c864",
                  }}
                >
                  <Link2 size={12} />
                  Copy Booking Link
                </a>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: "rgba(240,200,100,0.12)",
                    color: "#f0c864",
                  }}
                >
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
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "var(--surface2)" }}
                >
                  <div
                    className="text-[10px] uppercase tracking-wider mb-1 font-medium"
                    style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
                  >
                    Call Date/Time
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "var(--text)", fontFamily: "DM Mono, monospace" }}
                  >
                    {owner.callDate} at {owner.callTime}
                  </div>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "var(--surface2)" }}
                >
                  <div
                    className="text-[10px] uppercase tracking-wider mb-1 font-medium"
                    style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
                  >
                    Stage at Call
                  </div>
                  <div className="text-sm" style={{ color: "var(--text)" }}>
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
                  className="inline-flex items-center gap-1.5 text-xs hover:underline"
                  style={{ color: "var(--low)" }}
                >
                  <Link2 size={12} />
                  Open Calendly
                </a>
              </div>

              {/* LLM Prep section */}
              {owner.talkingPoints.length > 0 && (
                <div>
                  <div
                    className="text-xs font-medium uppercase tracking-wider mb-2"
                    style={{ color: "var(--text2)", fontFamily: "DM Mono, monospace" }}
                  >
                    🤖 Call Prep — Talking Points
                  </div>
                  <div className="space-y-2">
                    {owner.talkingPoints.map((tp) => (
                      <div
                        key={tp.id}
                        className="p-2.5 rounded-lg text-xs leading-relaxed"
                        style={{
                          backgroundColor: "var(--surface2)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                        }}
                      >
                        {tp.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agenda checklist */}
              {agendaItems.length > 0 && (
                <div>
                  <div
                    className="text-xs font-medium uppercase tracking-wider mb-2"
                    style={{ color: "var(--text2)", fontFamily: "DM Mono, monospace" }}
                  >
                    📋 Agenda ({completedAgenda}/{agendaItems.length})
                  </div>
                  <div className="space-y-1.5">
                    {agendaItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleAgenda(item.id)}
                        className="flex items-center gap-2 w-full text-left text-xs rounded-md p-1.5 transition-all hover:bg-[var(--surface2)]"
                        style={{ color: "var(--text)" }}
                      >
                        {item.done ? (
                          <Check size={14} className="shrink-0" style={{ color: "#64f0c8" }} />
                        ) : (
                          <div
                            className="w-3.5 h-3.5 rounded shrink-0"
                            style={{ border: "1px solid var(--border)" }}
                          />
                        )}
                        <span
                          className={cn(
                            item.done && "line-through"
                          )}
                          style={item.done ? { color: "var(--text3)" } : {}}
                        >
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Completed / Noshow states */}
          {(status === "completed" || status === "noshow") && (
            <div className="space-y-5">
              {/* Sentiment selector */}
              <div>
                <div
                  className="text-xs font-medium uppercase tracking-wider mb-2"
                  style={{ color: "var(--text2)", fontFamily: "DM Mono, monospace" }}
                >
                  Sentiment
                </div>
                <div className="flex items-center gap-2">
                  {(
                    Object.entries(sentimentConfig) as [
                      Sentiment,
                      { emoji: string; label: string }
                    ][]
                  ).map(([key, { emoji, label }]) => (
                    <button
                      key={key}
                      onClick={() => setSentiment(key)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                        sentiment === key
                          ? ""
                          : ""
                      )}
                      style={{
                        backgroundColor:
                          sentiment === key
                            ? "var(--surface2)"
                            : "transparent",
                        border:
                          sentiment === key
                            ? "1px solid var(--border)"
                            : "1px solid transparent",
                        color:
                          sentiment === key
                            ? "var(--text)"
                            : "var(--text3)",
                      }}
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
                  <div
                    className="text-xs font-medium uppercase tracking-wider mb-2"
                    style={{ color: "var(--text2)", fontFamily: "DM Mono, monospace" }}
                  >
                    🤖 AI Summary
                  </div>
                  <div
                    className="p-3 rounded-lg text-sm leading-relaxed"
                    style={{
                      backgroundColor: "var(--surface2)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    {mergedSummary || owner.aiSummary}
                  </div>
                </div>
              )}

              {/* Raw notes textarea */}
              <div>
                <div
                  className="text-xs font-medium uppercase tracking-wider mb-2"
                  style={{ color: "var(--text2)", fontFamily: "DM Mono, monospace" }}
                >
                  📝 Raw Notes
                </div>
                <textarea
                  className="w-full min-h-[100px] rounded-lg p-3 text-sm leading-relaxed resize-y focus:outline-none transition-colors"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter call notes..."
                  style={{
                    backgroundColor: "var(--surface2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                />
              </div>

              {/* Merge button */}
              <button
                onClick={handleMerge}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: "rgba(176,136,255,0.12)",
                  color: "var(--purple)",
                }}
              >
                <Merge size={12} />
                Merge Notes → AI Summary
              </button>

              {/* Outcome buttons in completed body */}
              <div className="flex items-center gap-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  onClick={() => setStatus("completed")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor:
                      status === "completed"
                        ? "rgba(100,240,200,0.15)"
                        : "rgba(100,240,200,0.06)",
                    color: "#64f0c8",
                    border:
                      status === "completed"
                        ? "1px solid rgba(100,240,200,0.3)"
                        : "1px solid transparent",
                  }}
                >
                  <Check size={12} />
                  ✓ Completed
                </button>
                <button
                  onClick={() => setStatus("noshow")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor:
                      status === "noshow"
                        ? "rgba(255,107,107,0.15)"
                        : "rgba(255,107,107,0.06)",
                    color: "var(--high)",
                    border:
                      status === "noshow"
                        ? "1px solid rgba(255,107,107,0.3)"
                        : "1px solid transparent",
                  }}
                >
                  <X size={12} />
                  ✕ No-show
                </button>
                <button
                  onClick={() => setStatus("awaiting")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: "var(--surface2)",
                    color: "var(--text2)",
                  }}
                >
                  <RotateCcw size={12} />
                  Back to awaiting
                </button>
              </div>

              {/* Follow-up tasks */}
              {actionItems.length > 0 && (
                <div>
                  <div
                    className="text-xs font-medium uppercase tracking-wider mb-2"
                    style={{ color: "var(--text2)", fontFamily: "DM Mono, monospace" }}
                  >
                    ✅ Follow-up tasks → assign & send to Daily Tasks
                  </div>
                  <div className="space-y-2">
                    {actionItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-xs"
                        style={{ color: "var(--text)" }}
                      >
                        <button onClick={() => toggleAction(item.id)} className="shrink-0">
                          {item.done ? (
                            <Check size={14} style={{ color: "#64f0c8" }} />
                          ) : (
                            <div
                              className="w-3.5 h-3.5 rounded"
                              style={{ border: "1px solid var(--border)" }}
                            />
                          )}
                        </button>
                        <span
                          className={cn(
                            "flex-1",
                            item.done && "line-through"
                          )}
                          style={item.done ? { color: "var(--text3)" } : {}}
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add task input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTask();
                  }}
                  placeholder="Add follow-up task..."
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs focus:outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--surface2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                />
                <button
                  onClick={handleAddTask}
                  disabled={!newTask.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: newTask.trim()
                      ? "rgba(100,200,240,0.12)"
                      : "var(--surface2)",
                    color: newTask.trim() ? "var(--low)" : "var(--text3)",
                    border: "1px solid var(--border)",
                    opacity: newTask.trim() ? 1 : 0.5,
                  }}
                >
                  <Plus size={12} />
                  Add
                </button>
              </div>

              {/* Conversation history toggle */}
              {owner.conversationHistory.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                    style={{ color: "var(--text2)" }}
                  >
                    {showHistory ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                    Conversation History ({owner.conversationHistory.length})
                  </button>
                  {showHistory && (
                    <div
                      className="mt-2 space-y-2 pl-5"
                      style={{ borderLeft: "2px solid var(--border)" }}
                    >
                      {owner.conversationHistory.map((cycle, i) => (
                        <div key={i} className="relative">
                          <div
                            className="text-[10px] mb-1"
                            style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
                          >
                            {cycle.date}
                          </div>
                          <div
                            className="text-xs leading-relaxed"
                            style={{ color: "var(--text2)" }}
                          >
                            {cycle.summary}
                          </div>
                          {cycle.notes && (
                            <div
                              className="text-xs mt-1 italic"
                              style={{ color: "var(--text3)" }}
                            >
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

          {/* Outcome buttons for awaiting / scheduled states */}
          {(status === "awaiting" || status === "scheduled") && (
            <div
              className="flex items-center gap-2 pt-2"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {status === "awaiting" && (
                <button
                  onClick={() => setStatus("scheduled")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: "rgba(100,200,240,0.12)",
                    color: "var(--low)",
                  }}
                >
                  <Calendar size={12} />
                  Mark as Scheduled
                </button>
              )}
              <button
                onClick={() => setStatus("completed")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: "rgba(100,240,200,0.12)",
                  color: "#64f0c8",
                }}
              >
                <Check size={12} />
                ✓ Completed
              </button>
              <button
                onClick={() => setStatus("noshow")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: "rgba(255,107,107,0.12)",
                  color: "var(--high)",
                }}
              >
                <X size={12} />
                ✕ No-show
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
