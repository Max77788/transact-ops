// ---- Email Triage Types ----

export type Urgency = "high" | "medium" | "low";

export type SenderType =
  | "Agent"
  | "Title Company"
  | "Lender"
  | "Inspector"
  | "Attorney"
  | "Client";

export interface EmailCard {
  id: string;
  propertyName: string;
  senderType: SenderType;
  senderName: string;
  date: string;
  urgency: Urgency;
  summary: string;
  proposedTask: string;
}

// ---- Communications Types ----

export type Sentiment = "positive" | "neutral" | "negative";

export interface ShowingEntry {
  date: string;
  agent: string;
  feedback: string;
  sentiment: Sentiment;
}

export interface MondayFeedbackCard {
  id: string;
  address: string;
  showingCount: number;
  status: "draft" | "sent";
  showings: ShowingEntry[];
  draftText: string;
}

export interface OpenHouseCard {
  id: string;
  address: string;
  reason: string;
  date: string;
  time: string;
  emailPreview: string;
  status: "draft" | "sent";
}

export interface ScheduleSlot {
  time: string;
  address: string;
}

// ---- Owner Check-ins Types ----

export type OwnerStatus =
  | "awaiting"
  | "scheduled"
  | "completed"
  | "noshow";

export type DealType = "Sale" | "Lease";

export interface AgendaItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TalkingPoint {
  id: string;
  text: string;
}

export interface ActionItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ConversationCycle {
  date: string;
  status: OwnerStatus;
  summary: string;
  notes: string;
  sentiment: Sentiment;
}

export interface OwnerCard {
  id: string;
  name: string;
  address: string;
  agent: string;
  phone: string;
  dealType: DealType;
  stage: string;
  status: OwnerStatus;
  bookingLink: string;
  calendlyLink: string;
  callDate: string;
  callTime: string;
  stageAtCall: string;
  reminderDays: number;
  talkingPoints: TalkingPoint[];
  agendaItems: AgendaItem[];
  sentiment: Sentiment;
  aiSummary: string;
  actionItems: ActionItem[];
  rawNotes: string;
  conversationHistory: ConversationCycle[];
}

export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  ownerIds: string[];
}
