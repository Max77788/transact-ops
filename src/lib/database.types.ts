// ============================================================================
// TransactOps Database Types
// Auto-generated mirror of supabase/migrations/001_schema.sql
// ============================================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ----------------------------------------------------------------------------
// ENUMS (represented as string unions in TypeScript)
// ----------------------------------------------------------------------------
export type ProfileRole = 'lead' | 'tc' | 'tm' | 'admin' | 'agent';
export type ProfileLocation = 'US' | 'India';
export type DealType = 'sale' | 'lease';
export type DealStatus = 'active' | 'closed' | 'withdrawn' | 'lost';
export type CheckinStatus = 'awaiting' | 'scheduled' | 'completed' | 'noshow';
export type CheckinSentiment = 'pos' | 'neu' | 'neg';
export type ShowingStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'noshow';
export type OpenHouseStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';
export type AiRunStatus = 'pending' | 'running' | 'completed' | 'failed';

// ----------------------------------------------------------------------------
// TABLE TYPES
// ----------------------------------------------------------------------------

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  org_id: string;
  user_id: string;
  full_name: string;
  role: ProfileRole;
  location: ProfileLocation;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Stage {
  id: string;
  org_id: string;
  name: string;
  idx: number; // 0..6
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface StageStep {
  id: string;
  stage_id: string;
  org_id: string;
  name: string;
  idx: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  org_id: string;
  address: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  agent: string;
  stage_idx: number; // 0..6
  stage_entered_at: string;
  active_entered_at: string | null;
  close_date: string | null;
  contract_close_date: string | null;
  price: number | null;
  type: DealType;
  status: DealStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DealStepStatus {
  id: string;
  deal_id: string;
  step_id: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StageHistory {
  id: string;
  deal_id: string;
  stage_idx: number; // 0..6
  entered_at: string;
  exited_at: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  org_id: string;
  deal_id: string | null;
  title: string;
  description: string | null;
  assigned_to: string | null;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  recurrence: string | null;
  created_at: string;
  updated_at: string;
}

export interface Owner {
  id: string;
  org_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  property_address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Checkin {
  id: string;
  owner_id: string;
  scheduled_date: string;
  scheduled_time: string | null;
  status: CheckinStatus;
  booking_link: string | null;
  stage_idx_at_call: number | null;
  raw_notes: string | null;
  ai_summary: string | null;
  combined_summary: string | null;
  sentiment: CheckinSentiment | null;
  recording_url: string | null;
  transcript_url: string | null;
  call_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SummaryTemplate {
  id: string;
  org_id: string;
  name: string;
  stage_idx: number | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CheckinAction {
  id: string;
  checkin_id: string;
  description: string;
  completed: boolean;
  completed_at: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailFlag {
  id: string;
  org_id: string;
  deal_id: string | null;
  from_email: string;
  subject: string | null;
  body_snippet: string | null;
  flag_type: string;
  ai_summary: string | null;
  triaged: boolean;
  triaged_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Showing {
  id: string;
  deal_id: string;
  org_id: string;
  scheduled_at: string;
  buyer_name: string;
  buyer_email: string | null;
  buyer_phone: string | null;
  status: ShowingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeedbackDraft {
  id: string;
  showing_id: string;
  from_email: string;
  content: string;
  submitted: boolean;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpenHouse {
  id: string;
  deal_id: string;
  org_id: string;
  scheduled_at: string;
  end_at: string;
  status: OpenHouseStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiRun {
  id: string;
  org_id: string;
  deal_id: string | null;
  run_type: string;
  input: Json | null;
  output: Json | null;
  status: AiRunStatus;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface Integration {
  id: string;
  org_id: string;
  provider: string;
  config: Json;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookEvent {
  id: string;
  org_id: string;
  integration_id: string | null;
  event_type: string;
  payload: Json;
  processed: boolean;
  processed_at: string | null;
  created_at: string;
}

// ----------------------------------------------------------------------------
// DATABASE SCHEMA (for use with supabase.from<>())
// ----------------------------------------------------------------------------

export interface Database {
  transact_ops: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Organization, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Organization, 'id'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Profile, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      stages: {
        Row: Stage;
        Insert: Omit<Stage, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Stage, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Stage, 'id'>>;
      };
      stage_steps: {
        Row: StageStep;
        Insert: Omit<StageStep, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<StageStep, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<StageStep, 'id'>>;
      };
      deals: {
        Row: Deal;
        Insert: Omit<Deal, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Deal, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Deal, 'id'>>;
      };
      deal_step_status: {
        Row: DealStepStatus;
        Insert: Omit<DealStepStatus, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<DealStepStatus, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<DealStepStatus, 'id'>>;
      };
      stage_history: {
        Row: StageHistory;
        Insert: Omit<StageHistory, 'id' | 'created_at'> & Partial<Pick<StageHistory, 'id' | 'created_at'>>;
        Update: Partial<Omit<StageHistory, 'id'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Task, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Task, 'id'>>;
      };
      owners: {
        Row: Owner;
        Insert: Omit<Owner, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Owner, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Owner, 'id'>>;
      };
      checkins: {
        Row: Checkin;
        Insert: Omit<Checkin, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Checkin, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Checkin, 'id'>>;
      };
      summary_templates: {
        Row: SummaryTemplate;
        Insert: Omit<SummaryTemplate, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<SummaryTemplate, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<SummaryTemplate, 'id'>>;
      };
      checkin_actions: {
        Row: CheckinAction;
        Insert: Omit<CheckinAction, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<CheckinAction, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<CheckinAction, 'id'>>;
      };
      email_flags: {
        Row: EmailFlag;
        Insert: Omit<EmailFlag, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<EmailFlag, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<EmailFlag, 'id'>>;
      };
      showings: {
        Row: Showing;
        Insert: Omit<Showing, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Showing, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Showing, 'id'>>;
      };
      feedback_drafts: {
        Row: FeedbackDraft;
        Insert: Omit<FeedbackDraft, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<FeedbackDraft, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<FeedbackDraft, 'id'>>;
      };
      open_houses: {
        Row: OpenHouse;
        Insert: Omit<OpenHouse, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<OpenHouse, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<OpenHouse, 'id'>>;
      };
      ai_runs: {
        Row: AiRun;
        Insert: Omit<AiRun, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<AiRun, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<AiRun, 'id'>>;
      };
      integrations: {
        Row: Integration;
        Insert: Omit<Integration, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Integration, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Integration, 'id'>>;
      };
      webhook_events: {
        Row: WebhookEvent;
        Insert: Omit<WebhookEvent, 'id' | 'created_at'> & Partial<Pick<WebhookEvent, 'id' | 'created_at'>>;
        Update: Partial<Omit<WebhookEvent, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
