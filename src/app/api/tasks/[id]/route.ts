// ============================================================================
// API: /api/tasks/[id] — Toggle task completion status
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { toggleTask } from "@/lib/queries";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.completed === undefined || typeof body.completed !== "boolean") {
      return NextResponse.json(
        { data: null, error: "completed (boolean) is required" },
        { status: 400 }
      );
    }

    const task = await toggleTask(id, body.completed);
    if (!task) {
      return NextResponse.json(
        { data: null, error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: task, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message || "Failed to update task" },
      { status: 500 }
    );
  }
}
