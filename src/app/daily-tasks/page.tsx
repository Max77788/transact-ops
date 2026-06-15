"use client";

import { useState } from "react";
import { ShellLayout } from "@/components/shell-layout";
import { cn } from "@/lib/utils";
import {
  MOCK_PROPERTY_TASKS,
  MOCK_BROKERAGE_TASKS,
  PropertyTaskGroup,
  BrokerageTaskGroup,
  TaskItem,
  Priority,
  Recurrence,
} from "@/lib/data";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Plus,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";

const priorityColors: Record<Priority, string> = {
  high: "#ff6b6b",
  med: "#ffa040",
  low: "#64c8f0",
};

const recurrenceLabels: Record<Recurrence, string> = {
  daily: "Daily",
  weekly: "Weekly",
  once: "Once",
};

const ASSIGNEES = ["JT", "MW", "LC"];

// ---- TASK ROW ----

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: TaskItem;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-center gap-2.5 py-2 px-2 rounded-md transition-colors hover:brightness-110">
      <button onClick={onToggle} className="shrink-0">
        {task.done ? (
          <CheckCircle2 size={16} style={{ color: "var(--accent)" }} />
        ) : (
          <Circle size={16} style={{ color: "var(--text3)" }} />
        )}
      </button>
      <span
        className={cn("text-sm flex-1 truncate")}
        style={{
          color: task.done ? "var(--text3)" : "var(--text)",
          textDecoration: task.done ? "line-through" : "none",
        }}
      >
        {task.text}
      </span>

      <span
        className="shrink-0 rounded-full"
        style={{ width: 7, height: 7, backgroundColor: priorityColors[task.priority] }}
        title={task.priority}
      />

      <span
        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
        style={{
          backgroundColor: "var(--surface3)",
          color: "var(--text2)",
          fontFamily: "DM Mono, monospace",
        }}
      >
        {task.assignee}
      </span>

      <span
        className="text-[10px] font-medium shrink-0 hidden sm:inline"
        style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
      >
        {recurrenceLabels[task.recurrence]}
      </span>

      <button
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
        style={{ color: "var(--text3)" }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ---- PROPERTY GROUP ----

function PropertyGroup({
  group,
  onTaskToggle,
  onTaskDelete,
}: {
  group: PropertyTaskGroup;
  onTaskToggle: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const completed = group.tasks.filter((t) => t.done).length;
  const total = group.tasks.length;

  return (
    <div className="mb-1">
      <button
        className="flex items-center gap-2 w-full py-2 px-3 rounded-md transition-colors text-left"
        style={{ backgroundColor: "var(--purple)" + "14" }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown size={14} style={{ color: "var(--purple)" }} />
        ) : (
          <ChevronRight size={14} style={{ color: "var(--purple)" }} />
        )}
        <span className="text-sm font-medium" style={{ color: "var(--purple)" }}>
          {group.propertyName}
        </span>
        <span
          className="text-[10px] font-medium ml-auto"
          style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
        >
          {completed}/{total}
        </span>
      </button>

      {expanded && (
        <div className="py-1">
          {group.tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => onTaskToggle(task.id)}
              onDelete={() => onTaskDelete(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---- BROKERAGE GROUP ----

function BrokerageGroup({
  group,
  onTaskToggle,
  onTaskDelete,
}: {
  group: BrokerageTaskGroup;
  onTaskToggle: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}) {
  const completed = group.tasks.filter((t) => t.done).length;
  const total = group.tasks.length;

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1.5 px-2">
        <span className="rounded-full shrink-0" style={{ width: 7, height: 7, backgroundColor: group.color }} />
        <span className="text-xs font-medium" style={{ color: group.color, fontFamily: "DM Mono, monospace" }}>
          {group.label}
        </span>
        <span className="text-[10px] font-medium" style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>
          {completed}/{total}
        </span>
      </div>
      <div className="pl-2">
        {group.tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={() => onTaskToggle(task.id)}
            onDelete={() => onTaskDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ---- ADD TASK MODAL ----

function AddTaskModal({ open, onClose, propertyNames }: { open: boolean; onClose: () => void; propertyNames: string[] }) {
  const [taskType, setTaskType] = useState<"property" | "brokerage">("property");
  const [selectedProperty, setSelectedProperty] = useState(propertyNames[0] || "");
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<Priority>("med");
  const [assignee, setAssignee] = useState("JT");
  const [recurrence, setRecurrence] = useState<Recurrence>("once");

  if (!open) return null;

  const handleAdd = () => {
    if (!taskName.trim()) return;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 w-full max-w-md"
        style={{ backgroundColor: "var(--surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-lg"
            style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}
          >
            Add task
          </h3>
          <button onClick={onClose} className="p-1 rounded-md transition-colors" style={{ color: "var(--text2)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Type toggle */}
          <div>
            <label
              className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
            >
              Task type
            </label>
            <div className="flex gap-1">
              <button
                className={cn("flex-1 text-xs font-medium px-3 py-1.5 rounded-md transition-colors")}
                style={{
                  backgroundColor: taskType === "property" ? "var(--accent)" : "var(--surface3)",
                  color: taskType === "property" ? "var(--bg)" : "var(--text2)",
                }}
                onClick={() => setTaskType("property")}
              >
                Property task
              </button>
              <button
                className={cn("flex-1 text-xs font-medium px-3 py-1.5 rounded-md transition-colors")}
                style={{
                  backgroundColor: taskType === "brokerage" ? "var(--accent)" : "var(--surface3)",
                  color: taskType === "brokerage" ? "var(--bg)" : "var(--text2)",
                }}
                onClick={() => setTaskType("brokerage")}
              >
                Brokerage-wide
              </button>
            </div>
          </div>

          {/* Property select (if property task) */}
          {taskType === "property" && (
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                Property
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {propertyNames.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}

          {/* Task name */}
          <div>
            <label
              className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
            >
              Task name
            </label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
            />
          </div>

          {/* Priority + Assignee + Recurrence (row) */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2 py-2 rounded-md text-xs outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                <option value="high">High</option>
                <option value="med">Med</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-2 py-2 rounded-md text-xs outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {ASSIGNEES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="text-[10px] font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
              >
                Recurrence
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as Recurrence)}
                className="w-full px-2 py-2 rounded-md text-xs outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-medium transition-colors"
            style={{ backgroundColor: "var(--surface3)", color: "var(--text2)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-md text-xs font-medium transition-colors hover:brightness-110"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            Add task
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- DAILY TASKS PAGE ----

export default function DailyTasksPage() {
  const [propertyTasks, setPropertyTasks] = useState(MOCK_PROPERTY_TASKS);
  const [brokerageTasks, setBrokerageTasks] = useState(MOCK_BROKERAGE_TASKS);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"properties" | "brokerage">("properties");

  const [dateOffset, setDateOffset] = useState(0);
  const [quickText, setQuickText] = useState("");
  const [quickPriority, setQuickPriority] = useState<Priority>("med");
  const [quickAssignee, setQuickAssignee] = useState("JT");
  const [showAddModal, setShowAddModal] = useState(false);

  const today = new Date();
  today.setDate(today.getDate() + dateOffset);
  const dateLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const allPropertyTasks = propertyTasks.flatMap((g) => g.tasks);
  const allBrokerageTasks = brokerageTasks.flatMap((g) => g.tasks);
  const allTasks = [...allPropertyTasks, ...allBrokerageTasks];
  const doneCount = allTasks.filter((t) => t.done).length;
  const totalCount = allTasks.length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const handlePropertyTaskToggle = (taskId: string) => {
    setPropertyTasks((prev) =>
      prev.map((g) => ({
        ...g,
        tasks: g.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
      }))
    );
  };

  const handleBrokerageTaskToggle = (taskId: string) => {
    setBrokerageTasks((prev) =>
      prev.map((g) => ({
        ...g,
        tasks: g.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
      }))
    );
  };

  const handlePropertyTaskDelete = (taskId: string) => {
    setPropertyTasks((prev) =>
      prev
        .map((g) => ({ ...g, tasks: g.tasks.filter((t) => t.id !== taskId) }))
        .filter((g) => g.tasks.length > 0)
    );
  };

  const handleBrokerageTaskDelete = (taskId: string) => {
    setBrokerageTasks((prev) =>
      prev
        .map((g) => ({ ...g, tasks: g.tasks.filter((t) => t.id !== taskId) }))
        .filter((g) => g.tasks.length > 0)
    );
  };

  const handleQuickAdd = () => {
    if (!quickText.trim()) return;
    const newTask: TaskItem = {
      id: `qt${Date.now()}`,
      text: quickText.trim(),
      done: false,
      priority: quickPriority,
      assignee: quickAssignee,
      recurrence: "once",
    };
    if (activeTab === "brokerage") {
      setBrokerageTasks((prev) => {
        if (prev.length === 0) {
          return [{ label: "General", color: "#c8f064", tasks: [newTask] }];
        }
        return prev.map((g, i) =>
          i === prev.length - 1 ? { ...g, tasks: [...g.tasks, newTask] } : g
        );
      });
    }
    setQuickText("");
  };

  const propertyNames = propertyTasks.map((g) => g.propertyName);

  return (
    <ShellLayout actionLabel="Add task" onActionClick={() => setShowAddModal(true)}>
      <div className="flex h-full" style={{ height: "calc(100vh - var(--topbar-h))" }}>
        {/* Left sidebar: property filter */}
        <div
          className="shrink-0 overflow-y-auto py-3 px-3 flex flex-col"
          style={{ width: 160, borderRight: `1px solid var(--border)` }}
        >
          <p
            className="text-[10px] font-medium uppercase tracking-wider mb-3 px-1"
            style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}
          >
            Properties
          </p>
          {propertyTasks.map((g) => (
            <button
              key={g.propertyName}
              className={cn(
                "text-left text-xs py-1.5 px-2 rounded-md mb-0.5 transition-colors truncate",
                selectedProperty === g.propertyName ? "font-medium" : "font-normal"
              )}
              style={{
                color: selectedProperty === g.propertyName ? "var(--text)" : "var(--text2)",
                backgroundColor: selectedProperty === g.propertyName ? "var(--surface3)" : "transparent",
              }}
              onClick={() => {
                setSelectedProperty(g.propertyName);
                setActiveTab("properties");
              }}
            >
              {g.propertyName}
            </button>
          ))}

          <div style={{ height: 1, backgroundColor: "var(--border)", margin: "8px 4px" }} />

          <button
            className={cn(
              "text-left text-xs py-1.5 px-2 rounded-md transition-colors font-medium",
              activeTab === "brokerage" ? "font-medium" : "font-normal"
            )}
            style={{
              color: activeTab === "brokerage" ? "var(--accent)" : "var(--text2)",
              backgroundColor: activeTab === "brokerage" ? "var(--surface3)" : "transparent",
            }}
            onClick={() => {
              setActiveTab("brokerage");
              setSelectedProperty(null);
            }}
          >
            Brokerage-wide
          </button>
        </div>

        {/* Right main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Progress bar */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: "var(--text2)" }}>
                Today&apos;s Progress
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--accent)", fontFamily: "DM Mono, monospace" }}
              >
                {doneCount}/{totalCount} · {progressPct}%
              </span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: 4, backgroundColor: "var(--surface3)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progressPct}%`, backgroundColor: "var(--accent)" }}
              />
            </div>
          </div>

          {/* Date nav */}
          <div className="flex items-center justify-center gap-3 py-2">
            <button
              className="p-1 rounded-md transition-colors"
              style={{ color: "var(--text2)" }}
              onClick={() => setDateOffset((d) => d - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="text-sm font-medium px-3 py-1 rounded-md transition-colors"
              style={{
                color: dateOffset === 0 ? "var(--accent)" : "var(--text2)",
                backgroundColor: dateOffset === 0 ? "var(--surface3)" : "transparent",
              }}
              onClick={() => setDateOffset(0)}
            >
              Today
            </button>
            <span className="text-sm truncate" style={{ color: "var(--text2)" }}>
              {dateLabel}
            </span>
            <button
              className="p-1 rounded-md transition-colors"
              style={{ color: "var(--text2)" }}
              onClick={() => setDateOffset((d) => d + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Task list */}
          <div className="flex-1 overflow-y-auto px-6 py-2">
            {activeTab === "properties" && (
              <div>
                {(selectedProperty
                  ? propertyTasks.filter((g) => g.propertyName === selectedProperty)
                  : propertyTasks
                ).map((g) => (
                  <PropertyGroup
                    key={g.propertyName}
                    group={g}
                    onTaskToggle={handlePropertyTaskToggle}
                    onTaskDelete={handlePropertyTaskDelete}
                  />
                ))}
              </div>
            )}

            {activeTab === "brokerage" && (
              <div>
                {brokerageTasks.map((g) => (
                  <BrokerageGroup
                    key={g.label}
                    group={g}
                    onTaskToggle={handleBrokerageTaskToggle}
                    onTaskDelete={handleBrokerageTaskDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick-add bar */}
          <div className="flex items-center gap-2 px-6 py-3" style={{ borderTop: `1px solid var(--border)` }}>
            <input
              type="text"
              placeholder="Add a task..."
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
              className="flex-1 text-sm rounded-md px-3 py-1.5 outline-none"
              style={{
                backgroundColor: "var(--surface3)",
                color: "var(--text)",
                border: `1px solid var(--border)`,
              }}
            />
            <select
              value={quickPriority}
              onChange={(e) => setQuickPriority(e.target.value as Priority)}
              className="text-xs rounded-md px-2 py-1.5 outline-none"
              style={{
                backgroundColor: "var(--surface3)",
                color: "var(--text)",
                border: `1px solid var(--border)`,
                fontFamily: "DM Mono, monospace",
              }}
            >
              <option value="high">High</option>
              <option value="med">Med</option>
              <option value="low">Low</option>
            </select>
            <select
              value={quickAssignee}
              onChange={(e) => setQuickAssignee(e.target.value)}
              className="text-xs rounded-md px-2 py-1.5 outline-none"
              style={{
                backgroundColor: "var(--surface3)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                fontFamily: "DM Mono, monospace",
              }}
            >
              {ASSIGNEES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors hover:brightness-110"
              style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
              onClick={handleQuickAdd}
            >
              <Plus size={12} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal open={showAddModal} onClose={() => setShowAddModal(false)} propertyNames={propertyNames} />
    </ShellLayout>
  );
}
