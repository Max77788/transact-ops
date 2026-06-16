"use client";

import { useState } from "react";
import { ShellLayout } from "@/components/shell-layout";
import { cn } from "@/lib/utils";
import { MapPin, X, ToggleLeft, ToggleRight } from "lucide-react";

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

  const toggleActive = async (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  return (
    <ShellLayout actionLabel="Add member" onActionClick={() => {}}>
      <div className="px-6 pt-4 pb-6">
        <div
          className="rounded-lg overflow-hidden"
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
            <span style={{ width: "35%" }}>Name</span>
            <span style={{ width: "20%" }}>Role</span>
            <span style={{ width: "15%" }}>Location</span>
            <span style={{ width: "15%" }}>Status</span>
            <span style={{ width: "15%" }} />
          </div>

          {profiles.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--text3)" }}>
              No team members yet. Add users in Supabase Auth.
            </div>
          ) : (
            profiles.map((p) => {
              const color = ROLE_COLORS[p.role] || "#888";
              const initials = p.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2);

              return (
                <div
                  key={p.id}
                  className={cn(
                    "flex items-center px-4 py-3 transition-colors",
                    !p.active && "opacity-40"
                  )}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-3" style={{ width: "35%" }}>
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
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                        {p.full_name}
                      </p>
                    </div>
                  </div>

                  <div style={{ width: "20%" }}>
                    <RolePill role={p.role} />
                  </div>

                  <div style={{ width: "15%" }}>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} style={{ color: "var(--text3)" }} />
                      <span className="text-[11px]" style={{ color: "var(--text2)" }}>
                        {p.location || "—"}
                      </span>
                    </span>
                  </div>

                  <div style={{ width: "15%" }}>
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium"
                      style={{
                        color: p.active ? "var(--accent)" : "var(--text3)",
                        fontFamily: "DM Mono, monospace",
                      }}
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: p.active ? "var(--accent)" : "var(--border)",
                        }}
                      />
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div style={{ width: "15%", textAlign: "right" }}>
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
            })
          )}
        </div>
      </div>
    </ShellLayout>
  );
}
