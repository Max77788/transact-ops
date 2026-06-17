"use client";

import { Bell, Plus, Search, Menu } from "lucide-react";

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
  onMenuClick?: () => void;
}

export function Topbar({ title, stats = [], actionLabel, onActionClick, onMenuClick }: TopbarProps) {
  return (
    <header
      className="sticky top-0 z-20 flex flex-col justify-center shrink-0"
      style={{
        backgroundColor: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        padding: "12px 16px",
      }}
    >
      {/* Top row: hamburger + Title + Actions */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 -ml-1 rounded-md shrink-0"
            style={{ color: "var(--text2)" }}
          >
            <Menu size={18} />
          </button>
          <h2
            className="text-xl sm:text-2xl tracking-tight truncate"
            style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)", letterSpacing: "-0.02em" }}
          >
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {actionLabel && onActionClick && (
            <button
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
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
            className="p-1.5 rounded-md transition-colors hidden sm:block"
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
            className="rounded-lg flex items-center justify-center text-[11px] font-semibold shrink-0"
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

      {/* Meta strip — horizontally scrollable on mobile */}
      {stats.length > 0 && (
        <div
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-3 sm:gap-4 shrink-0">
              {i > 0 && (
                <div style={{ width: 1, height: 14, backgroundColor: "var(--border)" }} />
              )}
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] sm:text-[11px]"
                  style={{
                    color: stat.color || "var(--text2)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {stat.label}:
                </span>
                <strong
                  className="text-[10px] sm:text-[11px]"
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
