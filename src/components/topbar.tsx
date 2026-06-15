"use client";

import { Bell, Plus, Search } from "lucide-react";

interface MetaStat {
  label: string;
  value: string;
  color?: string;
}

interface TopbarProps {
  title: string;
  stats?: MetaStat[];
  actionLabel?: string;
  onActionClick?: () => void;
}

export function Topbar({ title, stats = [], actionLabel, onActionClick }: TopbarProps) {
  return (
    <header
      className="sticky top-0 z-20 flex flex-col justify-center px-7 shrink-0"
      style={{
        backgroundColor: "var(--bg)",
        borderBottom: `1px solid var(--border)`,
        paddingTop: 15,
        paddingBottom: 12,
      }}
    >
      {/* Top row: Title + Actions */}
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-2xl tracking-tight"
          style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)", letterSpacing: "-0.02em" }}
        >
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {actionLabel && onActionClick && (
            <button
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110 hover:-translate-y-px"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--bg)",
                fontFamily: "DM Sans, sans-serif",
              }}
              onClick={onActionClick}
            >
              <Plus size={14} />
              {actionLabel}
            </button>
          )}
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
                backgroundColor: "var(--high)",
              }}
            />
          </button>
          <div
            className="ml-2 rounded-lg flex items-center justify-center text-[11px] font-semibold"
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
      </div>

      {/* Meta strip */}
      {stats.length > 0 && (
        <div className="flex items-center gap-4 flex-wrap" style={{ paddingBottom: 0 }}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-4">
              {i > 0 && (
                <div style={{ width: 1, height: 14, backgroundColor: "var(--border)", alignSelf: "stretch" }} />
              )}
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[11px]"
                  style={{
                    color: stat.color || "var(--text2)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {stat.label}:
                </span>
                <strong
                  className="text-[11px]"
                  style={{
                    color: stat.color || "var(--text)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {stat.value}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
