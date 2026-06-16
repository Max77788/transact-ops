"use client";

import { useState, useMemo } from "react";
import { ShellLayout } from "@/components/shell-layout";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Trash2, CheckCircle2, Circle, Plus } from "lucide-react";

type TaskItem = {
  id: string;
  text: string;
  done: boolean;
  priority: "high" | "med" | "low";
  assignee: string;
  recurrence: "once" | "daily" | "weekly";
  dealName: string | null;
};

type PropertyGroup = { propertyName: string; tasks: TaskItem[] };
type BrokerageGroup = { label: string; color: string; tasks: TaskItem[] };

const priorityColors: Record<string, string> = { high: "#ff6b6b", med: "#ffa040", low: "#64c8f0" };
const recurrenceLabels: Record<string, string> = { daily: "Daily", weekly: "Weekly", once: "Once" };

function TaskRow({ task, onToggle, onDelete }: { task: TaskItem; onToggle: () => void; onDelete: () => void }) {
  return (
    <div className="group flex items-center gap-2.5 py-2 px-2 rounded-md transition-colors hover:brightness-110">
      <button onClick={onToggle} className="shrink-0">
        {task.done ? <CheckCircle2 size={16} style={{ color: "var(--accent)" }} /> : <Circle size={16} style={{ color: "var(--text3)" }} />}
      </button>
      <span className={cn("text-sm flex-1 truncate")} style={{ color: task.done ? "var(--text3)" : "var(--text)", textDecoration: task.done ? "line-through" : "none" }}>
        {task.text}
      </span>
      <span className="shrink-0 rounded-full" style={{ width: 7, height: 7, backgroundColor: priorityColors[task.priority] }} />
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: "var(--surface3)", color: "var(--text2)", fontFamily: "DM Mono, monospace" }}>
        {task.assignee}
      </span>
      <span className="text-[10px] font-medium shrink-0 hidden sm:inline" style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>
        {recurrenceLabels[task.recurrence]}
      </span>
    </div>
  );
}

function PropertyGroupComp({ group, onToggle, onDelete }: { group: PropertyGroup; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(true);
  const completed = group.tasks.filter((t) => t.done).length;

  return (
    <div className="mb-1">
      <button className="flex items-center gap-2 w-full py-2 px-3 rounded-md transition-colors text-left" style={{ backgroundColor: "var(--purple)" + "14" }} onClick={() => setExpanded(!expanded)}>
        {expanded ? <ChevronDown size={14} style={{ color: "var(--purple)" }} /> : <ChevronRight size={14} style={{ color: "var(--purple)" }} />}
        <span className="text-sm font-medium" style={{ color: "var(--purple)" }}>{group.propertyName}</span>
        <span className="text-[10px] font-medium ml-auto" style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>{completed}/{group.tasks.length}</span>
      </button>
      {expanded && (
        <div className="py-1">
          {group.tasks.map((t) => <TaskRow key={t.id} task={t} onToggle={() => onToggle(t.id)} onDelete={() => onDelete(t.id)} />)}
        </div>
      )}
    </div>
  );
}

function BrokerageGroupComp({ group, onToggle, onDelete }: { group: BrokerageGroup; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  const completed = group.tasks.filter((t) => t.done).length;
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1.5 px-2">
        <span className="rounded-full shrink-0" style={{ width: 7, height: 7, backgroundColor: group.color }} />
        <span className="text-xs font-medium" style={{ color: group.color, fontFamily: "DM Mono, monospace" }}>{group.label}</span>
        <span className="text-[10px] font-medium" style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>{completed}/{group.tasks.length}</span>
      </div>
      <div className="pl-2">
        {group.tasks.map((t) => <TaskRow key={t.id} task={t} onToggle={() => onToggle(t.id)} onDelete={() => onDelete(t.id)} />)}
      </div>
    </div>
  );
}

export function DailyTasksClient({ initialTasks }: { initialTasks: TaskItem[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState<"properties" | "brokerage">("properties");
  const [dateOffset] = useState(0);

  const toggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const propertyGroups: PropertyGroup[] = useMemo(() => {
    const map = new Map<string, TaskItem[]>();
    tasks.forEach((t) => {
      const key = t.dealName || "Unassigned";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries()).map(([name, tasks]) => ({ propertyName: name, tasks }));
  }, [tasks]);

  const brokerageGroups: BrokerageGroup[] = useMemo(() => {
    const unassigned = tasks.filter((t) => !t.dealName);
    if (unassigned.length === 0) return [];
    return [{ label: "General", color: "#c8f064", tasks: unassigned }];
  }, [tasks]);

  const doneCount = tasks.filter((t) => t.done).length;
  const progressPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const today = new Date();
  today.setDate(today.getDate() + dateOffset);
  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <ShellLayout>
      <div className="px-6 pt-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg" style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}>Daily Tasks</h2>
            <p className="text-xs" style={{ color: "var(--text3)" }}>
              {dateLabel} · {doneCount}/{tasks.length} done
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 rounded-full" style={{ backgroundColor: "var(--surface3)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, backgroundColor: "var(--accent)" }} />
        </div>

        {/* Tab toggle */}
        <div className="flex gap-1 mb-4">
          <button
            className="flex-1 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            style={{ backgroundColor: activeTab === "properties" ? "var(--accent)" : "var(--surface3)", color: activeTab === "properties" ? "var(--bg)" : "var(--text2)" }}
            onClick={() => setActiveTab("properties")}
          >
            Properties ({propertyGroups.length})
          </button>
          <button
            className="flex-1 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            style={{ backgroundColor: activeTab === "brokerage" ? "var(--accent)" : "var(--surface3)", color: activeTab === "brokerage" ? "var(--bg)" : "var(--text2)" }}
            onClick={() => setActiveTab("brokerage")}
          >
            Brokerage ({brokerageGroups.reduce((s, g) => s + g.tasks.length, 0)})
          </button>
        </div>

        {/* Content */}
        {tasks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm" style={{ color: "var(--text3)" }}>No tasks yet. Add tasks from the pipeline or email triage.</p>
          </div>
        ) : activeTab === "properties" ? (
          propertyGroups.map((g) => <PropertyGroupComp key={g.propertyName} group={g} onToggle={toggleTask} onDelete={deleteTask} />)
        ) : (
          brokerageGroups.map((g, i) => <BrokerageGroupComp key={i} group={g} onToggle={toggleTask} onDelete={deleteTask} />)
        )}
      </div>
    </ShellLayout>
  );
}
