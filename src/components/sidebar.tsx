"use client";

import { cn } from "@/lib/utils";
import {
  Mail, ListChecks, MessageSquare, Users, Building2, GitBranch, Settings2, Calendar, X,
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
  { label: "Email Triage", sublabel: "Gmail → tasks", icon: <Mail size={16} />, dotColor: "#64c8f0", badge: 5, href: "/email" },
  { label: "Pipeline", sublabel: "Board + table", icon: <GitBranch size={16} />, dotColor: "#c8f064", badge: 10, href: "/pipeline" },
  { label: "Daily Tasks", sublabel: "Property + general", icon: <ListChecks size={16} />, dotColor: "#ffa040", badge: 8, href: "/daily-tasks" },
  { label: "Communications", sublabel: "Mon feedback · Wed OH", icon: <MessageSquare size={16} />, dotColor: "#b088ff", badge: 3, href: "/communications" },
  { label: "Owner Check-ins", sublabel: "Booking · calls · calendar", icon: <Calendar size={16} />, dotColor: "#4ade80", href: "/owner-checkins" },
  { label: "Team", sublabel: "People · roles · load", icon: <Building2 size={16} />, dotColor: "#ff6b6b", href: "/team" },
  { label: "Stages", sublabel: "Checklists · targets", icon: <Settings2 size={16} />, dotColor: "#f0c864", href: "/stages" },
];

export function Sidebar({
  currentPath = "/pipeline", open = false, onClose,
}: {
  currentPath?: string; open?: boolean; onClose?: () => void;
}) {
  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 flex-col z-30"
        style={{ width: "var(--sidebar-width)", background: "linear-gradient(180deg, var(--sidebar-start) 0%, var(--sidebar-end) 100%)", color: "#ffffff" }}>
        <SidebarContent currentPath={currentPath} />
      </aside>
      <aside className={cn("lg:hidden fixed left-0 top-0 bottom-0 flex flex-col z-50 transition-transform duration-200", open ? "translate-x-0" : "-translate-x-full")}
        style={{ width: "min(var(--sidebar-width), 280px)", background: "linear-gradient(180deg, var(--sidebar-start) 0%, var(--sidebar-end) 100%)", color: "#ffffff" }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-md lg:hidden" style={{ color: "rgba(255,255,255,0.6)" }}><X size={18} /></button>
        <SidebarContent currentPath={currentPath} />
      </aside>
    </>
  );
}

function SidebarContent({ currentPath }: { currentPath: string }) {
  return (
    <>
      <div className="px-5 pt-5 pb-3">
        <p className="tracking-[0.15em] uppercase" style={{ fontSize: "9px", fontFamily: "DM Mono, monospace", color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}>Brokerage OS</p>
        <h1 className="text-xl tracking-tight mt-0.5" style={{ fontFamily: "Instrument Serif, serif", color: "#ffffff" }}>Transact<span style={{ color: "var(--blue)" }}>Ops</span></h1>
        <p className="text-[11px] mt-0.5 tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "DM Mono, monospace" }}>Houston · US + India team</p>
      </div>
      <div className="mx-4" style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <a key={item.label} href={item.href}
              className={cn("flex items-center gap-2.5 px-2 py-2 rounded-md transition-colors", isActive ? "font-semibold" : "font-normal")}
              style={{
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.75)",
                backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
              }}>
              <span className="shrink-0 rounded-full" style={{ width: 6, height: 6, backgroundColor: item.dotColor }} />
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold" style={{ fontSize: "14px" }}>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)", color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)", fontFamily: "DM Mono, monospace" }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="leading-tight" style={{ fontSize: "10px", fontFamily: "DM Mono, monospace", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>{item.sublabel}</p>
              </div>
            </a>
          );
        })}
      </nav>
      <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: "10px", fontFamily: "DM Mono, monospace", color: "rgba(255,255,255,0.35)", lineHeight: "1.6" }}>
          <div>Gmail · DocuSign · Drive connected</div>
          <div style={{ fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>n8n: automations connected</div>
          <div>Airtable: not yet connected</div>
        </div>
      </div>
    </>
  );
}
