"use client";

import { GitBranch, ListChecks, Mail, MessageSquare, Users, Sliders, UserCircle } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  {
    label: "Pipeline",
    description: "Track deal stages and advance transactions",
    href: "/pipeline",
    icon: <GitBranch size={20} />,
    color: "#c8f064",
  },
  {
    label: "Daily Tasks",
    description: "Manage property and brokerage tasks",
    href: "/daily-tasks",
    icon: <ListChecks size={20} />,
    color: "#ffa040",
  },
  {
    label: "Email Triage",
    description: "Process incoming transaction emails",
    href: "/email",
    icon: <Mail size={20} />,
    color: "#64c8f0",
  },
  {
    label: "Communications",
    description: "Showing feedback and open house messages",
    href: "/communications",
    icon: <MessageSquare size={20} />,
    color: "#b088ff",
  },
  {
    label: "Owner Check-ins",
    description: "Weekly owner conversation cycles",
    href: "/owner-checkins",
    icon: <Users size={20} />,
    color: "#4ade80",
  },
  {
    label: "Team",
    description: "Manage team members and roles",
    href: "/team",
    icon: <UserCircle size={20} />,
    color: "#ff6b6b",
  },
  {
    label: "Stages",
    description: "Configure pipeline stages and steps",
    href: "/stages",
    icon: <Sliders size={20} />,
    color: "#f0c864",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
        <h1
          className="text-3xl mb-2"
          style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}
        >
          Welcome to{" "}
          <span style={{ color: "var(--accent)" }}>TransactOps</span>
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--text2)" }}>
          Real estate transaction operations console
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl w-full">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-start gap-3 p-4 rounded-lg transition-colors hover:brightness-110"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <div
                className="p-2 rounded-md shrink-0"
                style={{ backgroundColor: link.color + "18", color: link.color }}
              >
                {link.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {link.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
}
