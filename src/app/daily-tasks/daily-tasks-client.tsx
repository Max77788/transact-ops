"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Trash2, CheckCircle2, Circle, Plus, X } from "lucide-react";

const ORG_ID = "d1000000-0000-0000-0000-000000000001";

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

function AddTaskModal({ onClose, onCreated }: { onClose: () => void; onCreated: (t: TaskItem) => void }) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [recurrence, setRecurrence] = useState("once");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!title.trim()) { setError("Title is required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-org-id": ORG_ID },
        body: JSON.stringify({ title: title.trim(), assigned_to: assignee.trim() || null, recurrence }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      const t = json.data;
      onCreated({
        id: t.id, text: t.title, done: false, priority: "med",
        assignee: t.assigned_to ? t.assigned_to.slice(0, 2).toUpperCase() : "JT",
        recurrence: (t.recurrence || "once") as "once" | "daily" | "weekly",
        dealName: null,
      });
      onClose();
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: "var(--card)", border: "1px solid var(--line)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--ink)", fontFamily: "Instrument Serif, serif" }}>Add Task</h3>
          <button onClick={onClose} style={{ color: "var(--muted2)" }}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} placeholder="Task title *" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} placeholder="Assignee initials (e.g. JT)" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
          <select className="w-full rounded-lg px-3 py-2.5 text-sm border" style={{ backgroundColor: "var(--paper)", color: "var(--ink)", borderColor: "var(--line)" }} value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        {error && <p className="text-xs mt-3" style={{ color: "var(--red)" }}>{error}</p>}
        <button className="w-full mt-4 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--accent)", color: "var(--paper)" }} onClick={submit} disabled={submitting}>
          {submitting ? "Creating..." : "Create Task"}
        </button>
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle, onDelete }: { task: TaskItem; onToggle: () => void; onDelete: () => void }) {
  return (
    <div className="group flex items-center gap-2.5 py-2 px-2 rounded-md transition-colors hover:brightness-110">
      <button onClick={onToggle} className="shrink-0">
        {task.done ? <CheckCircle2 size={16} style={{ color: "var(--accent)" }} /> : <Circle size={16} style={{ color: "var(--muted2)" }} />}
      </button>
      <span className={cn("text-sm flex-1 truncate")} style={{ color: task.done ? "var(--muted2)" : "var(--ink)", textDecoration: task.done ? "line-through" : "none" }}>
        {task.text}
      </span>
      <span className="shrink-0 rounded-full" style={{ width: 7, height: 7, backgroundColor: priorityColors[task.priority] }} />
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: "var(--card3)", color: "var(--muted)", fontFamily: "DM Mono, monospace" }}>
        {task.assignee}
      </span>
      <span className="text-[10px] font-medium shrink-0 hidden sm:inline" style={{ color: "var(--muted2)", fontFamily: "DM Mono, monospace" }}>
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
        <span className="text-[10px] font-medium ml-auto" style={{ color: "var(--muted2)", fontFamily: "DM Mono, monospace" }}>{completed}/{group.tasks.length}</span>
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
        <span className="text-[10px] font-medium" style={{ color: "var(--muted2)", fontFamily: "DM Mono, monospace" }}>{completed}/{group.tasks.length}</span>
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
  const [showAdd, setShowAdd] = useState(false);

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
    <>
    <div className="px-4 sm:px-6 pt-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg" style={{ fontFamily: "Instrument Serif, serif", color: "var(--ink)" }}>Daily Tasks</h2>
            <p className="text-xs" style={{ color: "var(--muted2)" }}>
              {dateLabel} · {doneCount}/{tasks.length} done
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "var(--paper)" }}
          >
            <Plus size={14} /> Add Task
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 rounded-full" style={{ backgroundColor: "var(--card3)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, backgroundColor: "var(--accent)" }} />
        </div>

        {/* Tab toggle */}
        <div className="flex gap-1 mb-4">
          <button
            className="flex-1 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            style={{ backgroundColor: activeTab === "properties" ? "var(--accent)" : "var(--card3)", color: activeTab === "properties" ? "var(--paper)" : "var(--muted)" }}
            onClick={() => setActiveTab("properties")}
          >
            Properties ({propertyGroups.length})
          </button>
          <button
            className="flex-1 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            style={{ backgroundColor: activeTab === "brokerage" ? "var(--accent)" : "var(--card3)", color: activeTab === "brokerage" ? "var(--paper)" : "var(--muted)" }}
            onClick={() => setActiveTab("brokerage")}
          >
            Brokerage ({brokerageGroups.reduce((s, g) => s + g.tasks.length, 0)})
          </button>
        </div>

        {/* Content */}
        {tasks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm" style={{ color: "var(--muted2)" }}>No tasks yet. Add tasks from the pipeline or email triage.</p>
          </div>
        ) : activeTab === "properties" ? (
          propertyGroups.map((g) => <PropertyGroupComp key={g.propertyName} group={g} onToggle={toggleTask} onDelete={deleteTask} />)
        ) : (
          brokerageGroups.map((g, i) => <BrokerageGroupComp key={i} group={g} onToggle={toggleTask} onDelete={deleteTask} />)
        )}
      </div>
      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} onCreated={(t) => setTasks((prev) => [t, ...prev])} />}
    </>
  );
}
