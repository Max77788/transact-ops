"use client";

import { useState } from "react";
import { ShellLayout } from "@/components/shell-layout";
import { cn } from "@/lib/utils";
import { MOCK_STAGE_CONFIGS, STAGES, StageConfig, StageConfigStep, StageKey } from "@/lib/data";
import {
  GripVertical,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Lock,
  Anchor,
  Info,
} from "lucide-react";

// ---- Stage Card ----

function StageCard({
  config,
  onUpdate,
}: {
  config: StageConfig;
  onUpdate: (updated: StageConfig) => void;
}) {
  const [newStepText, setNewStepText] = useState("");

  const handleTargetDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdate({ ...config, targetDays: val });
    }
  };

  const handleToggleStep = (stepId: string) => {
    onUpdate({
      ...config,
      steps: config.steps.map((s) =>
        s.id === stepId ? { ...s, done: !s.done } : s
      ),
    });
  };

  const handleAddStep = () => {
    const trimmed = newStepText.trim();
    if (!trimmed) return;
    const id = `${config.key}-st${config.steps.length + 1}`;
    onUpdate({
      ...config,
      steps: [...config.steps, { id, label: trimmed, done: false }],
    });
    setNewStepText("");
  };

  const handleDeleteStep = (stepId: string) => {
    onUpdate({
      ...config,
      steps: config.steps.filter((s) => s.id !== stepId),
    });
  };

  const handleAnchorToggle = () => {
    onUpdate({ ...config, isCloseDateAnchor: !config.isCloseDateAnchor });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddStep();
    }
  };

  const doneCount = config.steps.filter((s) => s.done).length;
  const progressPct = config.steps.length > 0
    ? Math.round((doneCount / config.steps.length) * 100)
    : 0;

  return (
    <div
      className="rounded-xl p-5 transition-colors hover:brightness-105"
      style={{ backgroundColor: "var(--surface)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-medium rounded-full px-2 py-0.5"
            style={{
              backgroundColor: "var(--surface3)",
              color: "var(--text2)",
              fontFamily: "DM Mono, monospace",
            }}
          >
            {config.idx}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full shrink-0"
              style={{ width: 8, height: 8, backgroundColor: config.color }}
            />
            <div className="flex items-center gap-1.5">
              <h3
                className="text-base font-medium"
                style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}
              >
                {config.label}
              </h3>
              {/* Lock icon (immutable) */}
              <span title="Stage is immutable">
                <Lock size={11} style={{ color: "var(--text3)" }} />
              </span>
            </div>
            {/* Anchor badge */}
            {config.isCloseDateAnchor && (
              <span
                className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: config.color + "20",
                  color: config.color,
                  fontFamily: "DM Mono, monospace",
                  border: `1px solid ${config.color}40`,
                }}
              >
                <Anchor size={10} />
                ANCHOR
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
          >
            Steps
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
          >
            {doneCount}/{config.steps.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full" style={{ backgroundColor: "var(--surface3)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progressPct}%`, backgroundColor: config.color }}
          />
        </div>
      </div>

      {/* Target Days */}
      <div className="mb-4">
        <label
          className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
          style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
        >
          Target Days
        </label>
        <input
          type="number"
          min={0}
          value={config.targetDays}
          onChange={handleTargetDaysChange}
          className="w-20 px-2.5 py-1.5 rounded-md text-sm outline-none transition-colors"
          style={{
            backgroundColor: "var(--surface2)",
            color: "var(--text)",
            border: `1px solid var(--border)`,
            fontFamily: "DM Mono, monospace",
          }}
        />
      </div>

      {/* Divider */}
      <div className="mb-4" style={{ height: 1, backgroundColor: "var(--border)" }} />

      {/* Checklist Steps */}
      <div className="mb-3">
        <p
          className="text-[10px] font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
        >
          Checklist
        </p>
        <div className="space-y-1.5">
          {config.steps.map((step) => (
            <StepItem
              key={step.id}
              step={step}
              onToggle={() => handleToggleStep(step.id)}
              onDelete={() => handleDeleteStep(step.id)}
              color={config.color}
            />
          ))}
        </div>
      </div>

      {/* Add Step */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Add step..."
          value={newStepText}
          onChange={(e) => setNewStepText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2.5 py-1.5 rounded-md text-sm outline-none transition-colors"
          style={{
            backgroundColor: "var(--surface2)",
            color: "var(--text)",
            border: `1px solid var(--border)`,
            fontFamily: "DM Sans, sans-serif",
          }}
        />
        <button
          onClick={handleAddStep}
          className="shrink-0 p-1.5 rounded-md transition-colors hover:brightness-110"
          style={{ backgroundColor: "var(--surface3)", color: "var(--text2)" }}
          title="Add step"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Close Date Anchor */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name="closeDateAnchor"
            checked={config.isCloseDateAnchor}
            onChange={handleAnchorToggle}
            className="sr-only"
          />
          <span
            className="rounded-full shrink-0 flex items-center justify-center transition-colors"
            style={{
              width: 16,
              height: 16,
              border: `2px solid ${config.isCloseDateAnchor ? config.color : "var(--border)"}`,
              backgroundColor: config.isCloseDateAnchor ? config.color : "transparent",
            }}
          >
            {config.isCloseDateAnchor && (
              <span
                className="rounded-full"
                style={{ width: 6, height: 6, backgroundColor: "var(--bg)" }}
              />
            )}
          </span>
          <span
            className="text-[11px] group-hover:opacity-80 transition-opacity"
            style={{ color: config.isCloseDateAnchor ? "var(--text)" : "var(--text2)" }}
          >
            Close date anchor — entering this stage sets contract close date
          </span>
        </label>
      </div>
    </div>
  );
}

// ---- Step Item ----

function StepItem({
  step,
  onToggle,
  onDelete,
  color,
}: {
  step: StageConfigStep;
  onToggle: () => void;
  onDelete: () => void;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-2 rounded-md group transition-colors"
      style={{ backgroundColor: "var(--surface2)" }}
    >
      {/* Drag handle */}
      <button
        className="shrink-0 cursor-grab opacity-30 group-hover:opacity-60 transition-opacity"
        style={{ color: "var(--text3)" }}
        title="Reorder"
      >
        <GripVertical size={12} />
      </button>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="shrink-0 transition-colors"
        style={{ color: step.done ? color : "var(--text3)" }}
      >
        {step.done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
      </button>

      {/* Label */}
      <span
        className="flex-1 text-sm truncate"
        style={{
          color: step.done ? "var(--text)" : "var(--text2)",
          textDecoration: step.done ? "line-through" : "none",
          textDecorationColor: "var(--text3)",
        }}
      >
        {step.label}
      </span>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-all"
        style={{ color: "var(--high)" }}
        title="Delete step"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

// ---- CLOSE DATE ANCHOR PANEL ----

function AnchorPanel({ configs }: { configs: StageConfig[] }) {
  const anchorConfig = configs.find((c) => c.isCloseDateAnchor);
  if (!anchorConfig) return null;

  const totalPlanDays = configs.reduce((sum, c) => sum + c.targetDays, 0);

  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Anchor size={14} style={{ color: anchorConfig.color }} />
        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
          Close Date Anchor: <span style={{ color: anchorConfig.color }}>{anchorConfig.label}</span>
        </span>
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: anchorConfig.color + "20",
            color: anchorConfig.color,
            fontFamily: "DM Mono, monospace",
          }}
        >
          Stage {anchorConfig.idx}
        </span>
      </div>
      <p className="text-[11px] mb-3" style={{ color: "var(--text2)" }}>
        When a deal enters this stage, its contract close date is automatically set. The pipeline plan estimates
        the close date as <strong style={{ color: "var(--text)" }}>entered date + {totalPlanDays} days</strong>.
      </p>

      {/* Variance flags */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--red)" }}>
          <span className="rounded-full shrink-0" style={{ width: 6, height: 6, backgroundColor: "var(--red)" }} />
          Behind plan — deal exceeded stage target
        </span>
        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--accent)" }}>
          <span className="rounded-full shrink-0" style={{ width: 6, height: 6, backgroundColor: "var(--accent)" }} />
          Ahead of plan — deal is moving faster than target
        </span>
        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text2)" }}>
          <span className="rounded-full shrink-0" style={{ width: 6, height: 6, backgroundColor: "var(--text2)" }} />
          On track
        </span>
      </div>
    </div>
  );
}

// ---- STAGES PAGE ----

export default function StagesPage() {
  const [stageConfigs, setStageConfigs] = useState<StageConfig[]>(MOCK_STAGE_CONFIGS);

  const handleUpdate = (updated: StageConfig) => {
    setStageConfigs((prev) =>
      prev.map((sc) => (sc.key === updated.key ? updated : sc))
    );
  };

  const handleCloseDateAnchor = (selectedKey: StageKey) => {
    setStageConfigs((prev) =>
      prev.map((sc) => ({
        ...sc,
        isCloseDateAnchor: sc.key === selectedKey,
      }))
    );
  };

  const handleUpdateWithAnchor = (updated: StageConfig) => {
    if (updated.isCloseDateAnchor) {
      handleCloseDateAnchor(updated.key);
    }
    handleUpdate(updated);
  };

  const totalPlanDays = stageConfigs.reduce((sum, c) => sum + c.targetDays, 0);

  return (
    <ShellLayout>
      <div className="px-6 pt-4 pb-6">
        {/* Stage note banner */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg mb-4"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <Info size={14} style={{ color: "var(--accent)" }} />
          <span className="text-xs" style={{ color: "var(--text2)" }}>
            Pipeline stages are fixed — you configure what needs to happen inside each one.
          </span>
        </div>

        {/* Plan length meta strip */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[11px]" style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>
            PLAN LENGTH
          </span>
          <span className="text-sm font-medium" style={{ color: "var(--accent)", fontFamily: "DM Mono, monospace" }}>
            {totalPlanDays} days
          </span>
          <span className="text-[11px]" style={{ color: "var(--text3)" }}>
            (sum of all stage targets)
          </span>
        </div>

        {/* Close date anchor panel */}
        <AnchorPanel configs={stageConfigs} />

        {/* Stage cards grid — 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stageConfigs.map((config) => (
            <StageCard
              key={config.key}
              config={config}
              onUpdate={handleUpdateWithAnchor}
            />
          ))}
        </div>
      </div>
    </ShellLayout>
  );
}
