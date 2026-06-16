import { createAdminClient } from "@/lib/supabase/server";
import { DailyTasksClient } from "./daily-tasks-client";

export const dynamic = "force-dynamic";
const ORG_ID = "d1000000-0000-0000-0000-000000000001";

export default async function DailyTasksPage() {
  const supabase = createAdminClient();

  // Fetch tasks with optional deal name
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, completed, assigned_to, recurrence, deal_id, deals!tasks_deal_id_fkey(address)")
    .eq("org_id", ORG_ID)
    .order("created_at", { ascending: false });

  const mapped = (tasks || []).map((t: any) => ({
    id: t.id,
    text: t.title,
    done: t.completed ?? false,
    priority: "med" as const,
    assignee: t.assigned_to ? t.assigned_to.slice(0, 2).toUpperCase() : "JT",
    recurrence: (t.recurrence || "once") as "once" | "daily" | "weekly",
    dealName: t.deals?.address || null,
  }));

  return <DailyTasksClient initialTasks={mapped} />;
}
