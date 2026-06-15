"use client";

import { ShellLayout } from "@/components/shell-layout";
import { cn } from "@/lib/utils";
import { MOCK_TEAM, ROLE_COLORS, TeamMember, TeamRole, AtRiskDeal } from "@/lib/data";
import {
  MapPin,
  Mail,
  AlertTriangle,
  GripVertical,
} from "lucide-react";

// ---- Workload Bar ----

function WorkloadBar({ deals, tasks }: { deals: number; tasks: number }) {
  const total = deals + tasks;
  const pct = Math.min(Math.round((total / 14) * 100), 100);
  const hue = pct > 80 ? "var(--high)" : pct > 50 ? "var(--med)" : "var(--accent)";

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1.5 rounded-full"
        style={{ backgroundColor: "var(--surface3)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            backgroundColor: hue,
          }}
        />
      </div>
      <span
        className="text-[10px] font-medium shrink-0"
        style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
      >
        {pct}%
      </span>
    </div>
  );
}

// ---- At-Risk Indicator ----

function AtRiskBadge({ deals }: { deals: AtRiskDeal[] }) {
  if (deals.length === 0) return (
    <span
      className="text-[10px]"
      style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
    >
      No at-risk deals
    </span>
  );

  return (
    <div className="flex items-center gap-1.5">
      <AlertTriangle size={12} style={{ color: "var(--high)" }} />
      <span
        className="text-[10px] font-medium"
        style={{ color: "var(--high)", fontFamily: "DM Mono, monospace" }}
      >
        {deals.length} at-risk
      </span>
      <span
        className="text-[10px] truncate"
        style={{ color: "var(--text3)" }}
      >
        — {deals.map(d => d.address).join(", ")}
      </span>
    </div>
  );
}

// ---- Role Badge ----

function RoleBadge({ role, label }: { role: TeamRole; label: string }) {
  const color = ROLE_COLORS[role];
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-full inline-block"
      style={{
        backgroundColor: color + "20",
        color: color,
        fontFamily: "DM Mono, monospace",
        border: `1px solid ${color}40`,
      }}
    >
      {label}
    </span>
  );
}

// ---- Member Card ----

function MemberCard({ member }: { member: TeamMember }) {
  const roleColor = ROLE_COLORS[member.role];

  return (
    <div
      className="rounded-xl p-5 transition-colors hover:brightness-110"
      style={{ backgroundColor: "var(--surface)" }}
    >
      {/* Header: Avatar + Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div
          className="rounded-full flex items-center justify-center shrink-0 text-base font-medium"
          style={{
            width: 48,
            height: 48,
            backgroundColor: roleColor + "20",
            color: roleColor,
            fontFamily: "Instrument Serif, serif",
          }}
        >
          {member.initials}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="text-lg truncate"
            style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}
          >
            {member.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <RoleBadge role={member.role} label={member.roleLabel} />
            <span
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "var(--surface3)",
                color: "var(--text2)",
                fontFamily: "DM Mono, monospace",
              }}
            >
              {member.location}
            </span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} style={{ color: "var(--text3)" }} />
          <span
            className="text-[11px]"
            style={{ color: "var(--text2)" }}
          >
            {member.location}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mail size={12} style={{ color: "var(--text3)" }} />
          <span
            className="text-[11px] truncate"
            style={{ color: "var(--text2)" }}
          >
            {member.email}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className="mb-4"
        style={{ height: 1, backgroundColor: "var(--border)" }}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p
            className="text-[10px] font-medium uppercase tracking-wider mb-1"
            style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
          >
            Active
          </p>
          <p
            className="text-xl font-medium"
            style={{ color: "var(--accent)", fontFamily: "DM Mono, monospace" }}
          >
            {member.activeDeals}
          </p>
        </div>
        <div>
          <p
            className="text-[10px] font-medium uppercase tracking-wider mb-1"
            style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
          >
            Tasks Due
          </p>
          <p
            className="text-xl font-medium"
            style={{ color: member.tasksDue > 3 ? "var(--high)" : "var(--text)", fontFamily: "DM Mono, monospace" }}
          >
            {member.tasksDue}
          </p>
        </div>
        <div>
          <p
            className="text-[10px] font-medium uppercase tracking-wider mb-1"
            style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
          >
            Check-ins
          </p>
          <p
            className="text-xl font-medium"
            style={{ color: "var(--text)", fontFamily: "DM Mono, monospace" }}
          >
            {member.checkinsThisWeek}
          </p>
        </div>
      </div>

      {/* Workload */}
      <div className="mb-3">
        <p
          className="text-[10px] font-medium uppercase tracking-wider mb-1.5"
          style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
        >
          Workload
        </p>
        <WorkloadBar deals={member.activeDeals} tasks={member.tasksDue} />
      </div>

      {/* At-Risk */}
      <div>
        <AtRiskBadge deals={member.atRiskDeals} />
      </div>
    </div>
  );
}

// ---- TEAM PAGE ----

export default function TeamPage() {
  return (
    <ShellLayout>
      <div className="px-6 pt-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_TEAM.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </ShellLayout>
  );
}
