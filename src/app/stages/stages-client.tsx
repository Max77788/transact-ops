"use client";

import { useState } from "react";
import { ShellLayout } from "@/components/shell-layout";
import { CheckCircle2, Circle, Lock } from "lucide-react";

type DBStage = {
  id: string;
  name: string;
  idx: number;
  description?: string;
  steps?: { id: string; name: string; idx: number }[];
};

export function StagesClient({ initialStages }: { initialStages: DBStage[] }) {
  const sorted = [...initialStages].sort((a, b) => a.idx - b.idx);

  return (
    <ShellLayout>
      <div className="px-6 pt-4 pb-6 space-y-4">
        <h2 className="text-lg" style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}>
          Pipeline Stages
        </h2>

        {sorted.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text3)" }}>No stages configured. Seed the database first.</p>
        ) : (
          sorted.map((stage) => (
            <div
              key={stage.id}
              className="rounded-lg p-4"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "var(--surface3)",
                    color: "var(--text2)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {stage.idx}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {stage.name}
                </span>
                {stage.description && (
                  <span className="text-[11px]" style={{ color: "var(--text3)" }}>
                    — {stage.description}
                  </span>
                )}
              </div>

              {stage.steps && stage.steps.length > 0 ? (
                <div className="space-y-1.5">
                  {[...stage.steps].sort((a, b) => a.idx - b.idx).map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm"
                      style={{ color: "var(--text2)" }}
                    >
                      <Circle size={14} style={{ color: "var(--text3)" }} />
                      {step.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs" style={{ color: "var(--text3)" }}>No steps defined</p>
              )}
            </div>
          ))
        )}
      </div>
    </ShellLayout>
  );
}
