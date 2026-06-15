"use client";

import { Bell, Plus, Search } from "lucide-react";

interface MetaStat {
  label: string;
  value: string;
}

interface TopbarProps {
  title: string;
  stats?: MetaStat[];
}

export function Topbar({ title, stats = [] }: TopbarProps) {
  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-6"
      style={{
        height: "var(--topbar-h)",
        backgroundColor: "var(--bg)",
        borderBottom: `1px solid var(--border)`,
      }}
    >
      {/* Left: Title + Meta */}
      <div className="flex items-center gap-4 min-w-0">
        <h2
          className="text-lg truncate"
          style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}
        >
          {title}
        </h2>
        {stats.length > 0 && (
          <div className="flex items-center gap-3">
            <div
              style={{ width: 1, height: 16, backgroundColor: "var(--border)" }}
            />
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span style={{ color: "var(--text3)" }}>·</span>
                )}
                <span
                  className="text-[11px]"
                  style={{
                    color: "var(--text3)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {stat.label}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--bg)",
          }}
        >
          <Plus size={14} />
          Add Deal
        </button>
        <button
          className="p-1.5 rounded-md transition-colors"
          style={{ color: "var(--text2)" }}
        >
          <Search size={16} />
        </button>
        <button
          className="p-1.5 rounded-md transition-colors relative"
          style={{ color: "var(--text2)" }}
        >
          <Bell size={16} />
          <span
            className="absolute top-0.5 right-0.5 rounded-full"
            style={{
              width: 6,
              height: 6,
              backgroundColor: "var(--red)",
            }}
          />
        </button>
        <div
          className="ml-2 rounded-full flex items-center justify-center text-[11px] font-medium"
          style={{
            width: 28,
            height: 28,
            backgroundColor: "var(--surface3)",
            color: "var(--accent)",
            fontFamily: "DM Mono, monospace",
          }}
        >
          JT
        </div>
      </div>
    </header>
  );
}
