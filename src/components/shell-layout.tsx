"use client";

import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { usePathname } from "next/navigation";

interface ShellLayoutProps {
  children: React.ReactNode;
}

const pageMeta: Record<string, { title: string; stats: { label: string; value: string }[] }> = {
  "/pipeline": {
    title: "Pipeline",
    stats: [
      { label: "Active", value: "10" },
      { label: "Closing soon", value: "3" },
      { label: "Volume", value: "$9.9M" },
    ],
  },
  "/daily-tasks": {
    title: "Daily Tasks",
    stats: [
      { label: "Due today", value: "8" },
      { label: "Completed", value: "5" },
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

export function ShellLayout({ children }: ShellLayoutProps) {
  const pathname = usePathname();
  const meta = pageMeta[pathname] || { title: "TransactOps", stats: [] };

  return (
    <div className="flex h-full">
      <Sidebar currentPath={pathname} />
      <div
        className="flex flex-col flex-1 min-w-0"
        style={{ marginLeft: "var(--sidebar-w)" }}
      >
        <Topbar title={meta.title} stats={meta.stats} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
