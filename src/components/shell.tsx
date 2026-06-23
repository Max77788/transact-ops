"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { usePathname } from "next/navigation";

interface StatItem { label: string; value: string; color?: string; }

const pageMeta: Record<string, { title: string; stats: StatItem[] }> = {
  "/pipeline": {
    title: "Pipeline",
    stats: [
      { label: "Active deals", value: "10" },
      { label: "Pipeline value", value: "$9.9M" },
      { label: "Closing this month", value: "3" },
      { label: "Closed this month", value: "2" },
      { label: "At risk", value: "2", color: "var(--red)" },
      { label: "Avg days vs target", value: "+4.2" },
    ],
  },
  "/daily-tasks": {
    title: "Daily Tasks",
    stats: [
      { label: "Today", value: "8" },
      { label: "Done", value: "5" },
      { label: "High priority", value: "3" },
      { label: "Properties", value: "5" },
    ],
  },
  "/email": {
    title: "Email Triage",
    stats: [
      { label: "Unread", value: "6" },
      { label: "High", value: "2" },
      { label: "Medium", value: "2" },
    ],
  },
  "/communications": {
    title: "Communications",
    stats: [
      { label: "Drafts", value: "5" },
      { label: "Sent", value: "2" },
      { label: "Scheduled", value: "3" },
    ],
  },
  "/owner-checkins": {
    title: "Owner Check-ins",
    stats: [
      { label: "Scheduled", value: "2" },
      { label: "Awaiting", value: "1" },
      { label: "Complete", value: "2" },
    ],
  },
  "/team": {
    title: "Team",
    stats: [
      { label: "Members", value: "4" },
      { label: "Active deals", value: "23" },
      { label: "Tasks due", value: "14" },
    ],
  },
  "/stages": {
    title: "Pipeline Stages",
    stats: [
      { label: "Stages", value: "7" },
      { label: "Anchor", value: "Offer" },
      { label: "Total steps", value: "21" },
    ],
  },
};

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const meta = pageMeta[pathname] || { title: "TransactOps", stats: [] };
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  return (
    <div className="flex h-full">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on desktop, slide-over on mobile */}
      <Sidebar
        currentPath={pathname}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div
        className="flex flex-col flex-1 min-w-0"
        style={{ marginLeft: "max(var(--sidebar-w), 0px)" }}
      >
        <Topbar
          title={meta.title}
          stats={meta.stats}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
