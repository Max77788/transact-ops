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
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  dotColor: string;
  badge?: number;
  href: string;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Transactions",
    items: [
      {
        label: "Pipeline",
        icon: <GitBranch size={16} />,
        dotColor: "#c8f064",
        badge: 10,
        href: "/pipeline",
      },
      {
        label: "Daily Tasks",
        icon: <ListChecks size={16} />,
        dotColor: "#ffa040",
        badge: 8,
        href: "/daily-tasks",
      },
    ],
  },
  {
    title: "Communications",
    items: [
      {
        label: "Email Triage",
        icon: <Mail size={16} />,
        dotColor: "#64c8f0",
        badge: 5,
        href: "/email",
      },
      {
        label: "Communications",
        icon: <MessageSquare size={16} />,
        dotColor: "#b088ff",
        badge: 3,
        href: "/communications",
      },
    ],
  },
  {
    title: "Relationships",
    items: [
      {
        label: "Owner Check-ins",
        icon: <Users size={16} />,
        dotColor: "#4ade80",
        href: "/owner-checkins",
      },
      {
        label: "Team",
        icon: <Building2 size={16} />,
        dotColor: "#ff6b6b",
        href: "/team",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        label: "Pipeline Stages",
        icon: <Settings2 size={16} />,
        dotColor: "#f0c864",
        href: "/stages",
      },
    ],
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
        <h1
          className="text-xl tracking-tight"
          style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}
        >
          Transact
          <span style={{ color: "var(--accent)" }}>Ops</span>
        </h1>
        <p
          className="text-[11px] mt-0.5 tracking-wide uppercase"
          style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
        >
          brokerage operations
        </p>
      </div>

      {/* Divider */}
      <div
        className="mx-4"
        style={{ height: 1, backgroundColor: "var(--border)" }}
      />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <p
              className="text-[10px] font-medium tracking-widest uppercase px-2 mb-2"
              style={{
                color: "var(--text3)",
                fontFamily: "DM Mono, monospace",
              }}
            >
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors relative group",
                      isActive
                        ? "font-medium"
                        : "font-normal"
                    )}
                    style={{
                      color: isActive ? "var(--text)" : "var(--text2)",
                      backgroundColor: isActive
                        ? "var(--surface3)"
                        : "transparent",
                      borderLeft: isActive
                        ? `2px solid var(--accent)`
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
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: "var(--surface3)",
                          color: "var(--text2)",
                          fontFamily: "DM Mono, monospace",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-3"
        style={{ borderTop: `1px solid var(--border)` }}
      >
        <p
          className="text-[10px]"
          style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
        >
          Torres & Webb Realty
        </p>
        <p
          className="text-[10px] mt-0.5"
          style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
        >
          v1.0.0
        </p>
      </div>
    </aside>
  );
}
