"use client";

import { useState } from "react";
import { ShellLayout } from "@/components/shell-layout";
import { cn } from "@/lib/utils";
import { MOCK_TEAM, ROLE_COLORS, TeamMember, TeamRole, AtRiskDeal } from "@/lib/data";
import {
  MapPin,
  AlertTriangle,
  Plus,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// ---- Workload Pillbar ----

function WorkloadPillbar({ deals, tasks }: { deals: number; tasks: number }) {
  const total = deals + tasks;
  const pct = Math.min(Math.round((total / 14) * 100), 100);
  const hue = pct > 80 ? "var(--high)" : pct > 50 ? "var(--med)" : "var(--accent)";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "var(--surface3)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: hue }}
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

// ---- Role Pill ----

function RolePill({ role, label }: { role: TeamRole; label: string }) {
  const color = ROLE_COLORS[role];
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center"
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

// ---- Location Tag ----

function LocationTag({ location }: { location: string }) {
  return (
    <span className="flex items-center gap-1">
      <MapPin size={10} style={{ color: "var(--text3)" }} />
      <span className="text-[11px]" style={{ color: "var(--text2)" }}>
        {location}
      </span>
    </span>
  );
}

// ---- Risk Flag ----

function RiskFlag({ deals }: { deals: AtRiskDeal[] }) {
  if (deals.length === 0) {
    return (
      <span className="text-[10px]" style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>
        —
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1" title={deals.map(d => d.address).join(", ")}>
      <AlertTriangle size={10} style={{ color: "var(--high)" }} />
      <span className="text-[10px] font-medium" style={{ color: "var(--high)", fontFamily: "DM Mono, monospace" }}>
        {deals.length}
      </span>
    </div>
  );
}

// ---- ADD MEMBER MODAL ----

const LOCATIONS = ["US", "India", "Philippines", "Mexico"];
const ROLE_OPTIONS: { key: TeamRole; label: string }[] = [
  { key: "lead", label: "Transaction Lead" },
  { key: "tc", label: "Transaction Coordinator" },
  { key: "tm", label: "Transaction Manager" },
  { key: "admin", label: "Admin" },
  { key: "agent", label: "Agent" },
];

function AddMemberModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<TeamRole>("tc");
  const [location, setLocation] = useState("US");
  const [email, setEmail] = useState("");

  if (!open) return null;

  const handleAdd = () => {
    if (!name.trim()) return;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 w-full max-w-md"
        style={{ backgroundColor: "var(--surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg" style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}>
            Add team member
          </h3>
          <button onClick={onClose} className="p-1 rounded-md transition-colors" style={{ color: "var(--text2)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
            >
              Name
            </label>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm outline-none"
              style={{ backgroundColor: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
          </div>

          {/* Role + Location (row) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as TeamRole)}
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm outline-none"
              style={{ backgroundColor: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-medium transition-colors"
            style={{ backgroundColor: "var(--surface3)", color: "var(--text2)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-md text-xs font-medium transition-colors hover:brightness-110"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            Add member
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- TEAM PAGE ----

export default function TeamPage() {
  const [team, setTeam] = useState(MOCK_TEAM);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleActive = (id: string) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
  };

  return (
    <ShellLayout actionLabel="Add member" onActionClick={() => setShowAddModal(true)}>
      <div className="px-6 pt-4 pb-6">
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface)" }}>
          {/* Table header */}
          <div
            className="flex items-center px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider"
            style={{
              color: "var(--text3)",
              fontFamily: "DM Mono, monospace",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span style={{ width: "24%" }}>Name</span>
            <span style={{ width: "16%" }}>Role</span>
            <span style={{ width: "10%" }}>Location</span>
            <span style={{ width: "10%", textAlign: "right" }}>Active Deals</span>
            <span style={{ width: "10%", textAlign: "right" }}>Tasks Due</span>
            <span style={{ width: "18%" }}>Workload</span>
            <span style={{ width: "7%" }}>Risk</span>
            <span style={{ width: "5%" }} />
          </div>

          {/* Table rows */}
          {team.map((member) => {
            const color = ROLE_COLORS[member.role];
            const initials = member.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <div
                key={member.id}
                className={cn(
                  "flex items-center px-4 py-3 transition-colors",
                  !member.active && "opacity-40"
                )}
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                {/* Name with avatar */}
                <div className="flex items-center gap-3" style={{ width: "24%" }}>
                  <div
                    className="rounded-full flex items-center justify-center shrink-0 text-xs font-medium"
                    style={{
                      width: 32,
                      height: 32,
                      backgroundColor: color + "20",
                      color: color,
                      fontFamily: "Instrument Serif, serif",
                    }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                      {member.name}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: "var(--text3)" }}>
                      {member.email}
                    </p>
                  </div>
                </div>

                {/* Role pill */}
                <div style={{ width: "16%" }}>
                  <RolePill role={member.role} label={member.roleLabel} />
                </div>

                {/* Location tag */}
                <div style={{ width: "10%" }}>
                  <LocationTag location={member.location} />
                </div>

                {/* Active Deals */}
                <div style={{ width: "10%", textAlign: "right" }}>
                  <span className="text-sm font-medium" style={{ color: "var(--accent)", fontFamily: "DM Mono, monospace" }}>
                    {member.activeDeals}
                  </span>
                </div>

                {/* Tasks Due */}
                <div style={{ width: "10%", textAlign: "right" }}>
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: member.tasksDue > 3 ? "var(--high)" : "var(--text2)",
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    {member.tasksDue}
                  </span>
                </div>

                {/* Workload pillbar */}
                <div style={{ width: "18%" }}>
                  <WorkloadPillbar deals={member.activeDeals} tasks={member.tasksDue} />
                </div>

                {/* Risk flag */}
                <div style={{ width: "7%" }}>
                  <RiskFlag deals={member.atRiskDeals} />
                </div>

                {/* Active toggle */}
                <div style={{ width: "5%" }}>
                  <button
                    onClick={() => toggleActive(member.id)}
                    className="transition-colors p-0.5"
                    style={{ color: member.active ? "var(--accent)" : "var(--text3)" }}
                    title={member.active ? "Active — click to deactivate" : "Inactive — click to activate"}
                  >
                    {member.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddMemberModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </ShellLayout>
  );
}
