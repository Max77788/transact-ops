"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MapPin, ToggleLeft, ToggleRight, Plus, X } from "lucide-react";

const ORG_ID = "d1000000-0000-0000-0000-000000000001";

interface Profile {
  id: string;
  full_name: string;
  role: string;
  location: string;
  active: boolean;
  avatar_url?: string;
}

const ROLE_COLORS: Record<string, string> = {
  admin: "#ffa040",
  manager: "#c8f064",
  staff: "#64c8f0",
  agent: "#b088ff",
  lead: "#ff6b6b",
  tc: "#4ade80",
  tm: "#f0c864",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  manager: "Manager",
  staff: "Staff",
  agent: "Agent",
  lead: "Lead",
  tc: "Coordinator",
  tm: "Manager",
};

function AddMemberModal({ onClose, onCreated }: { onClose: () => void; onCreated: (p: Profile) => void }) {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("agent");
  const [location, setLocation] = useState("US");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    if (!fullName.trim()) { setError("Name is required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/profiles", {
        method: "POST", headers: { "Content-Type": "application/json", "x-org-id": ORG_ID },
        body: JSON.stringify({ full_name: fullName.trim(), role, location }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      onCreated({ ...json.data, active: true });
      onClose();
    } catch (e: any) { setError(e.message); } finally { setSubmitting(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)", fontFamily: "Instrument Serif, serif" }}>Add Team Member</h3>
          <button onClick={onClose} style={{ color: "var(--text3)" }}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} placeholder="Full name *" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <select className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="agent">Agent</option><option value="lead">Lead</option><option value="tc">Coordinator</option><option value="tm">Manager</option><option value="admin">Admin</option><option value="staff">Staff</option>
          </select>
          <select className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="US">US</option><option value="India">India</option>
          </select>
        </div>
        {error && <p className="text-xs mt-3" style={{ color: "var(--high)" }}>{error}</p>}
        <button className="w-full mt-4 rounded-lg py-2.5 text-sm font-semibold" style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }} onClick={submit} disabled={submitting}>
          {submitting ? "Adding..." : "Add Member"}
        </button>
      </div>
    </div>
  );
}

function RolePill({ role }: { role: string }) {
  const color = ROLE_COLORS[role] || "#888";
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: color + "20",
        color,
        fontFamily: "DM Mono, monospace",
        border: `1px solid ${color}40`,
      }}
    >
      {ROLE_LABELS[role] || role}
    </span>
  );
}

export function TeamClient({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [showAdd, setShowAdd] = useState(false);

  const toggleActive = async (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  if (profiles.length === 0) {
    return (
      <div className="px-4 sm:px-6 pt-4 pb-6">
        <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--text3)" }}>
          No team members yet. Add users in Supabase Auth.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 pt-4 pb-6">
      {/* Header with Add button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg" style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}>
          Team · {profiles.length} members
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          <Plus size={14} /> Add Member
        </button>
      </div>

      {/* Mobile: card list */}
      <div className="sm:hidden space-y-2">
        {profiles.map((p) => {
          const color = ROLE_COLORS[p.role] || "#888";
          const initials = p.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2);
          return (
            <div
              key={p.id}
              className={cn("rounded-lg p-4", !p.active && "opacity-40")}
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="rounded-full flex items-center justify-center shrink-0 text-xs font-medium"
                    style={{
                      width: 36,
                      height: 36,
                      backgroundColor: color + "20",
                      color,
                      fontFamily: "Instrument Serif, serif",
                    }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                      {p.full_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <RolePill role={p.role} />
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text2)" }}>
                        <MapPin size={10} />
                        {p.location || "—"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(p.id)}
                  className="shrink-0 p-1"
                  style={{ color: p.active ? "var(--accent)" : "var(--text3)" }}
                >
                  {p.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div
        className="hidden sm:block rounded-lg overflow-hidden"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div
          className="flex items-center px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider"
          style={{
            color: "var(--text3)",
            fontFamily: "DM Mono, monospace",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span className="flex-1">Name</span>
          <span className="w-[120px]">Role</span>
          <span className="w-[100px]">Location</span>
          <span className="w-[100px]">Status</span>
          <span className="w-[60px]" />
        </div>

        {profiles.map((p) => {
          const color = ROLE_COLORS[p.role] || "#888";
          const initials = p.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2);
          return (
            <div
              key={p.id}
              className={cn("flex items-center px-4 py-3 transition-colors", !p.active && "opacity-40")}
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="rounded-full flex items-center justify-center shrink-0 text-xs font-medium"
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: color + "20",
                    color,
                    fontFamily: "Instrument Serif, serif",
                  }}
                >
                  {initials}
                </div>
                <span className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                  {p.full_name}
                </span>
              </div>

              <div className="w-[120px]">
                <RolePill role={p.role} />
              </div>

              <div className="w-[100px]">
                <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text2)" }}>
                  <MapPin size={10} style={{ color: "var(--text3)" }} />
                  {p.location || "—"}
                </span>
              </div>

              <div className="w-[100px]">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium"
                  style={{
                    color: p.active ? "var(--accent)" : "var(--text3)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: p.active ? "var(--accent)" : "var(--border)" }}
                  />
                  {p.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="w-[60px] text-right">
                <button
                  onClick={() => toggleActive(p.id)}
                  className="transition-colors p-0.5"
                  style={{ color: p.active ? "var(--accent)" : "var(--text3)" }}
                >
                  {p.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} onCreated={(p) => setProfiles((prev) => [p, ...prev])} />}
    </div>
  );
}
