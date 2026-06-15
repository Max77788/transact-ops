// ============================================================================
// API: /api/tasks — List all tasks or create a new task
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getTasks, createTask } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const orgId = request.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { data: null, error: "Missing x-org-id header" },
        { status: 400 }
      );
    }

    const tasks = await getTasks(orgId);
    return NextResponse.json({ data: tasks, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { data: null, error: "Missing x-org-id header" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { data: null, error: "title is required" },
        { status: 400 }
      );
    }

    const task = await createTask({
      org_id: orgId,
      title: title.trim(),
      deal_id: body.deal_id ?? null,
      description: body.description ?? null,
      assigned_to: body.assigned_to ?? null,
      due_date: body.due_date ?? null,
      recurrence: body.recurrence ?? null,
      completed: false,
    });

    return NextResponse.json({ data: task, error: null }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Failed to create task" },
      { status: 500 }
    );
  }
}
