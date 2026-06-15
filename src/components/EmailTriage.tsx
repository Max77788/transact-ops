"use client";

import { useState, useEffect } from "react";
import { Mail, ArrowRight, Check, X, Search, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockEmails } from "@/lib/mock-data";
import type { Urgency, EmailCard, SenderType } from "@/lib/types";

const urgencyConfig: Record<Urgency, { color: string; bg: string; border: string; label: string }> = {
  high: {
    color: "var(--high)",
    bg: "rgba(255,107,107,0.12)",
    border: "border-l-[var(--high)]",
    label: "High",
  },
  medium: {
    color: "var(--med)",
    bg: "rgba(255,160,64,0.12)",
    border: "border-l-[var(--med)]",
    label: "Medium",
  },
  low: {
    color: "var(--low)",
    bg: "rgba(100,200,240,0.12)",
    border: "border-l-[var(--low)]",
    label: "Low",
  },
};

const senderColors: Record<string, string> = {
  Agent: "rgba(200,240,100,0.15)",
  "Title Company": "rgba(176,136,255,0.15)",
  Lender: "rgba(100,200,240,0.15)",
  Inspector: "rgba(255,160,64,0.15)",
  Attorney: "rgba(255,107,107,0.15)",
  Client: "rgba(100,200,240,0.15)",
};

const senderText: Record<string, string> = {
  Agent: "var(--accent)",
  "Title Company": "var(--purple)",
  Lender: "var(--low)",
  Inspector: "var(--med)",
  Attorney: "var(--high)",
  Client: "var(--low)",
};

// Map API email flags to EmailCard format
function mapFlagToEmailCard(flag: any, idx: number): EmailCard {
  const flagTypeMap: Record<string, { senderType: SenderType; urgency: Urgency }> = {
    offer: { senderType: "Agent", urgency: "high" },
    title: { senderType: "Title Company", urgency: "medium" },
    finance: { senderType: "Lender", urgency: "medium" },
    inspection: { senderType: "Inspector", urgency: "high" },
    appraisal: { senderType: "Lender", urgency: "high" },
    legal: { senderType: "Attorney", urgency: "high" },
    seller_comms: { senderType: "Client", urgency: "medium" },
  };
  const mapped = flagTypeMap[flag.flag_type] || { senderType: "Agent" as SenderType, urgency: "low" as Urgency };
  return {
    id: flag.id || `flag-${idx}`,
    propertyName: flag.subject || "Untitled",
    senderType: mapped.senderType,
    senderName: flag.from_email || "Unknown",
    date: new Date(flag.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    urgency: mapped.urgency,
    summary: flag.body_snippet || flag.ai_summary || "",
    proposedTask: `Review ${flag.flag_type} for ${flag.subject || "this deal"}`,
  };
}

export default function EmailTriage() {
  const [filter, setFilter] = useState<Urgency | "all">("all");
  const [scanning, setScanning] = useState(false);
  const [emails, setEmails] = useState<EmailCard[]>([]);
  const [loading, setLoading] = useState(true);

  // On mount, try to fetch flagged emails from API; fall back to mock
  const fetchEmails = async () => {
    try {
      const r = await fetch("/api/email/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-org-id": "d1000000-0000-0000-0000-000000000001" },
        body: JSON.stringify({}),
      });
      const d = await r.json();
      if (d.data?.flags?.length) {
        setEmails(d.data.flags.map((f: any, i: number) => mapFlagToEmailCard(f, i)));
        return;
      }
    } catch {}
    setEmails(mockEmails);
  };

  useEffect(() => {
    fetchEmails().finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? emails : emails.filter((e) => e.urgency === filter);

  const handleScan = async () => {
    setScanning(true);
    try {
      const r = await fetch("/api/email/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-org-id": "d1000000-0000-0000-0000-000000000001" },
        body: JSON.stringify({}),
      });
      const d = await r.json();
      if (d.data?.flags?.length) {
        setEmails(d.data.flags.map((f: any, i: number) => mapFlagToEmailCard(f, i)));
      }
    } catch {
      // silently fall back to current emails
    } finally {
      setScanning(false);
    }
  };

  const handleAccept = (id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
  };

  const handleDismiss = (id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <h2 className="font-serif text-lg text-[var(--text)] tracking-tight">
          Email Triage
        </h2>
        <div className="flex items-center gap-3">
          {/* Filter pills */}
          <div className="flex items-center gap-1.5 bg-[var(--surface)] rounded-lg p-1">
            {(["all", "high", "medium", "low"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  filter === f
                    ? "bg-[var(--surface2)] text-[var(--text)]"
                    : "text-[var(--text2)] hover:text-[var(--text)]"
                )}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {/* Scan inbox button */}
          <button
            onClick={handleScan}
            disabled={scanning}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all",
              scanning
                ? "bg-[var(--accent)]/20 text-[var(--accent)] cursor-wait"
                : "bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20"
            )}
          >
            <Search size={14} className={scanning ? "animate-pulse" : ""} />
            {scanning ? "Scanning..." : "Scan Inbox"}
          </button>
        </div>
      </div>

      {/* Scanning state */}
      {scanning && (
        <div className="mx-6 mt-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={16} className="text-[var(--accent)] animate-pulse" />
            <span className="text-sm font-medium text-[var(--accent)]">
              Scanning inbox...
            </span>
          </div>
          <div className="h-1.5 bg-[var(--surface2)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--accent)] rounded-full animate-pulse w-2/3" />
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text3)]">
          <Loader2 size={24} className="mb-3 animate-spin opacity-50" />
          <span className="text-sm">Loading flagged emails...</span>
        </div>
      )}

      {/* Email cards */}
      {!loading && (
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {filtered.map((email) => (
          <EmailCardItem
            key={email.id}
            email={email}
            onAccept={() => handleAccept(email.id)}
            onDismiss={() => handleDismiss(email.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--text3)]">
            <Mail size={32} className="mb-3 opacity-50" />
            <span className="text-sm">No emails in this category</span>
          </div>
        )}
        </div>
      )}
    </div>
  );
}

function EmailCardItem({
  email,
  onAccept,
  onDismiss,
}: {
  email: EmailCard;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const cfg = urgencyConfig[email.urgency];

  return (
    <div
      className={cn(
        "rounded-xl bg-[var(--surface)] border border-[var(--border)] border-l-[3px] overflow-hidden transition-all hover:border-[var(--text3)]",
        cfg.border
      )}
      style={{ borderLeftColor: cfg.color }}
    >
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-serif text-[15px] text-[var(--text)] leading-snug"
            style={{ fontFamily: "Instrument Serif, serif", fontSize: "15px" }}
          >
            {email.propertyName}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span
              className="px-2 py-0.5 rounded text-[11px] font-medium font-mono"
              style={{
                backgroundColor: senderColors[email.senderType] || senderColors.Agent,
                color: senderText[email.senderType] || senderText.Agent,
                fontFamily: "DM Mono, monospace",
              }}
            >
              {email.senderType}
            </span>
            <span
              className="px-2 py-0.5 rounded text-[11px] font-medium font-mono"
              style={{
                backgroundColor: cfg.bg,
                color: cfg.color,
                fontFamily: "DM Mono, monospace",
              }}
            >
              {cfg.label}
            </span>
          </div>
        </div>

        {/* From + date */}
        <div
          className="text-xs text-[var(--text2)] mb-2.5"
          style={{ fontFamily: "DM Mono, monospace" }}
        >
          From: {email.senderName} · {email.date}
        </div>

        {/* Summary */}
        <p className="text-sm text-[var(--text2)] leading-relaxed mb-3.5">
          {email.summary}
        </p>

        {/* Task row */}
        <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
          <ArrowRight size={14} className="text-[var(--accent)] shrink-0" />
          <span className="text-xs text-[var(--text)] flex-1 leading-relaxed">
            {email.proposedTask}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onAccept}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-all"
            >
              <Check size={12} />
              Accept
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--text3)] hover:text-[var(--text2)] hover:bg-[var(--surface2)] transition-all"
            >
              <X size={12} />
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
