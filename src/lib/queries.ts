// @ts-nocheck - Database types need regeneration from live Supabase schema
// ============================================================================
// TransactOps: Database Query Helpers
// Server-side Supabase queries. Uses service role for admin, user session for RLS.
// ============================================================================

import { createAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

export type Deal = Database["public"]["Tables"]["deals"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Checkin = Database["public"]["Tables"]["checkins"]["Row"];
export type Owner = Database["public"]["Tables"]["owners"]["Row"];
export type Stage = Database["public"]["Tables"]["stages"]["Row"];
export type StageStep = Database["public"]["Tables"]["stage_steps"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type EmailFlag = Database["public"]["Tables"]["email_flags"]["Row"];

// ---- DEALS ----

export async function getDeals(orgId: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("deals")
    .select("*, stage_steps:deal_step_status(*)")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getDeal(id: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("deals")
    .select("*, stage_steps:deal_step_status(*), stage_history(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createDeal(values: Partial<Deal>) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("deals")
    .insert({ ...values, stage_entered_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;

  // Log stage history
  await supabase.from("stage_history").insert({
    deal_id: data.id,
    stage_idx: data.stage_idx ?? 0,
    entered_at: data.stage_entered_at,
  });

  return data;
}

export async function advanceDeal(id: string, newStageIdx: number) {
  const supabase = await createAdminClient();

  // Get current deal
  const { data: deal } = await supabase.from("deals").select("*").eq("id", id).single();
  if (!deal) throw new Error("Deal not found");

  const oldIdx = deal.stage_idx;
  const now = new Date().toISOString();

  // Update deal
  const { data, error } = await supabase
    .from("deals")
    .update({
      stage_idx: newStageIdx,
      stage_entered_at: now,
      ...(oldIdx === 0 && newStageIdx === 1 ? { active_entered_at: now } : {}),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  // Close previous stage history entry
  await supabase
    .from("stage_history")
    .update({ exited_at: now })
    .eq("deal_id", id)
    .eq("stage_idx", oldIdx)
    .is("exited_at", null);

  // Log new stage
  await supabase.from("stage_history").insert({
    deal_id: id,
    stage_idx: newStageIdx,
    entered_at: now,
  });

  // Active stage trigger: create owner + checkin if moving to Active
  if (newStageIdx === 1) {
    const ownerName = deal.client_name || "Owner";
    const { data: owner } = await supabase
      .from("owners")
      .insert({
        org_id: deal.org_id,
        full_name: ownerName,
        property_address: deal.address,
        email: deal.client_email,
        phone: deal.client_phone,
      })
      .select()
      .single();

    if (owner) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 7);
      await supabase.from("checkins").insert({
        owner_id: owner.id,
        scheduled_date: nextDate.toISOString().split("T")[0],
        status: "awaiting",
        stage_idx_at_call: newStageIdx,
      });
    }
  }

  return data;
}

// ---- TASKS ----

export async function getTasks(orgId: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTask(values: Partial<Task>) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from("tasks").insert(values).select().single();
  if (error) throw error;
  return data;
}

export async function toggleTask(id: string, completed: boolean) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed, completed_at: completed ? new Date().toISOString() : null })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- CHECKINS ----

export async function getCheckins(orgId: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("checkins")
    .select("*, owner:owners(*), actions:checkin_actions(*)")
    .order("scheduled_date", { ascending: true });
  if (error) throw error;
  return data;
}

export async function updateCheckin(id: string, values: Partial<Checkin>) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("checkins")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- OWNERS ----

export async function getOwners(orgId: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("owners")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// ---- EMAIL FLAGS ----

export async function getEmailFlags(orgId: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("email_flags")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// ---- STAGES ----

export async function getStages(orgId: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("stages")
    .select("*, steps:stage_steps(*)")
    .eq("org_id", orgId)
    .order("idx");
  if (error) throw error;
  return data;
}

// ---- AI RUNS (audit) ----

export async function logAiRun(values: {
  org_id: string;
  deal_id?: string;
  run_type: string;
  input?: any;
  output?: any;
  status: string;
  error?: string;
}) {
  const supabase = await createAdminClient();
  await supabase.from("ai_runs").insert(values);
}

// ---- TEAM ----

export async function getProfiles(orgId: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("org_id", orgId)
    .order("full_name");
  if (error) throw error;
  return data;
}
