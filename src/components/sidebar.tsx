"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ListChecks,
  Mail,
  MessageSquare,
  Users,
  Building2,
  GitBranch,
  Settings2,
  Calendar,
} from "lucide-react";

interface NavItem {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  dotColor: string;
  badge?: number;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: "Email Triage",
    sublabel: "Gmail → tasks",
    icon: <Mail size={16} />,
    dotColor: "#64c8f0",
    badge: 5,
    href: "/email",
  },
  {
    label: "Pipeline",
    sublabel: "Board + table",
    icon: <GitBranch size={16} />,
    dotColor: "#c8f064",
    badge: 10,
    href: "/pipeline",
  },
  {
    label: "Daily Tasks",
    sublabel: "Property + general",
    icon: <ListChecks size={16} />,
    dotColor: "#ffa040",
    badge: 8,
    href: "/daily-tasks",
  },
  {
    label: "Communications",
    sublabel: "Mon feedback · Wed OH",
    icon: <MessageSquare size={16} />,
    dotColor: "#b088ff",
    badge: 3,
    href: "/communications",
  },
  {
    label: "Owner Check-ins",
    sublabel: "Booking · calls · calendar",
    icon: <Calendar size={16} />,
    dotColor: "#4ade80",
    href: "/owner-checkins",
  },
  {
    label: "Team",
    sublabel: "People · roles · load",
    icon: <Building2 size={16} />,
    dotColor: "#ff6b6b",
    href: "/team",
  },
  {
    label: "Stages",
    sublabel: "Checklists · targets",
    icon: <Settings2 size={16} />,
    dotColor: "#f0c864",
    href: "/stages",
  },
];

export function Sidebar({
  currentPath = "/pipeline",
}: {
  currentPath?: string;
}) {
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col z-30"
      style={{ width: "var(--sidebar-w)", backgroundColor: "var(--surface)" }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-3">
        {/* Eyebrow */}
        <p
          className="tracking-[0.15em] uppercase"
          style={{
            fontSize: "9px",
            fontFamily: "DM Mono, monospace",
            color: "var(--text3)",
            letterSpacing: "0.15em",
          }}
        >
          Brokerage OS
        </p>
        {/* Logo */}
        <h1
          className="text-xl tracking-tight mt-0.5"
          style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}
        >
          Transact
          <span style={{ color: "var(--accent)" }}>Ops</span>
        </h1>
        {/* Subtitle */}
        <p
          className="text-[11px] mt-0.5 tracking-wide uppercase"
          style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
        >
          Houston · US + India team
        </p>
      </div>

      {/* Divider */}
      <div
        className="mx-4"
        style={{ height: 1, backgroundColor: "var(--border)" }}
      />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2 py-2 rounded-md transition-colors relative group",
                isActive ? "font-medium" : "font-normal"
              )}
              style={{
                color: isActive ? "var(--accent)" : "var(--text2)",
                backgroundColor: isActive
                  ? "rgba(200,240,100,0.06)"
                  : "transparent",
                borderLeft: isActive
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
              }}
            >
              {/* Dot */}
              <span
                className="shrink-0 rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: item.dotColor,
                }}
              />
              {/* Label + sublabel */}
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: isActive ? "var(--accent)" : "var(--surface3)",
                        color: isActive ? "var(--bg)" : "var(--text2)",
                        fontFamily: "DM Mono, monospace",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p
                  className="leading-tight"
                  style={{
                    fontSize: "10px",
                    fontFamily: "DM Mono, monospace",
                    color: "var(--text3)",
                    marginTop: "1px",
                  }}
                >
                  {item.sublabel}
                </p>
              </div>
            </a>
          );
        })}
      </nav>

      {/* Integration Footer */}
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div
          style={{
            fontSize: "10px",
            fontFamily: "DM Mono, monospace",
            color: "var(--text3)",
            lineHeight: "1.6",
          }}
        >
          <div>Gmail · DocuSign · Drive connected</div>
          <div style={{ fontWeight: 700, color: "var(--text2)" }}>
            n8n: automations connected
          </div>
          <div>Airtable: not yet connected</div>
        </div>
      </div>
    </aside>
  );
}
