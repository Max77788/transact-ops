// ---- Pipeline Types ----

import type {
  EmailCard,
  MondayFeedbackCard,
  OpenHouseCard,
  ShowingEntry,
  ScheduleSlot,
  OwnerCard,
  CalendarEvent,
} from "./types";

export type StageKey = "s0" | "s1" | "s2" | "s3" | "s4" | "s5" | "s6";

export interface StageDef {
  key: StageKey;
  label: string;
  color: string;
  targetDays: number;
}

export interface StageStep {
  id: string;
  label: string;
  done: boolean;
}

export interface Deal {
  id: string;
  address: string;
  client: string;
  price: string;
  type: string;
  agent: string;
  stage: StageKey;
  daysInStage: number;
  nextStep: string;
  closeDate: string;
  stageEntered: string;
  targetDays: number;
  steps: StageStep[];
}

export const STAGES: StageDef[] = [
  { key: "s0", label: "Lead", color: "#9b8aff", targetDays: 7 },
  { key: "s1", label: "Showing", color: "#64c8f0", targetDays: 14 },
  { key: "s2", label: "Offer", color: "#ffa040", targetDays: 10 },
  { key: "s3", label: "Inspection", color: "#ff6b6b", targetDays: 14 },
  { key: "s4", label: "Closing", color: "#f0c864", targetDays: 30 },
  { key: "s5", label: "Post-Close", color: "#c8f064", targetDays: 14 },
  { key: "s6", label: "Complete", color: "#64f0c8", targetDays: 0 },
];

export const MOCK_DEALS: Deal[] = [
  {
    id: "d1",
    address: "1428 Elm Street",
    client: "Sarah & Michael Chen",
    price: "$785,000",
    type: "Sale",
    agent: "Jessica Torres",
    stage: "s0",
    daysInStage: 3,
    nextStep: "Send disclosure packet",
    closeDate: "2026-07-15",
    stageEntered: "2026-06-12",
    targetDays: 7,
    steps: [
      { id: "st1", label: "Initial consultation complete", done: true },
      { id: "st2", label: "Pre-approval letter received", done: true },
      { id: "st3", label: "Property criteria defined", done: false },
      { id: "st4", label: "Send disclosure packet", done: false },
    ],
  },
  {
    id: "d2",
    address: "3200 Oak Grove Ave",
    client: "David Park",
    price: "$1,250,000",
    type: "Sale",
    agent: "Marcus Webb",
    stage: "s1",
    daysInStage: 5,
    nextStep: "Schedule second showing",
    closeDate: "2026-08-01",
    stageEntered: "2026-06-10",
    targetDays: 14,
    steps: [
      { id: "st1", label: "MLS listing live", done: true },
      { id: "st2", label: "Photos uploaded", done: true },
      { id: "st3", label: "First open house held", done: true },
      { id: "st4", label: "Schedule second showing", done: false },
    ],
  },
  {
    id: "d3",
    address: "755 River Bend Dr",
    client: "Ana Rodriguez",
    price: "$560,000",
    type: "Sale",
    agent: "Jessica Torres",
    stage: "s2",
    daysInStage: 8,
    nextStep: "Counter-offer review",
    closeDate: "2026-07-20",
    stageEntered: "2026-06-07",
    targetDays: 10,
    steps: [
      { id: "st1", label: "Offer received", done: true },
      { id: "st2", label: "Comparables analysis done", done: true },
      { id: "st3", label: "Counter-offer prepared", done: false },
      { id: "st4", label: "Attorney review", done: false },
    ],
  },
  {
    id: "d4",
    address: "2100 Pine Street #4B",
    client: "Robert Kim",
    price: "$425,000",
    type: "Sale",
    agent: "Lisa Chang",
    stage: "s2",
    daysInStage: 12,
    nextStep: "Finalize purchase agreement",
    closeDate: "2026-07-05",
    stageEntered: "2026-06-03",
    targetDays: 10,
    steps: [
      { id: "st1", label: "Offer accepted", done: true },
      { id: "st2", label: "Earnest money deposited", done: true },
      { id: "st3", label: "Purchase agreement drafted", done: false },
      { id: "st4", label: "Finalize purchase agreement", done: false },
    ],
  },
  {
    id: "d5",
    address: "88 Harbor View Ln",
    client: "Thomas & Emily Blake",
    price: "$2,100,000",
    type: "Sale",
    agent: "Marcus Webb",
    stage: "s3",
    daysInStage: 6,
    nextStep: "Review inspection report",
    closeDate: "2026-07-30",
    stageEntered: "2026-06-09",
    targetDays: 14,
    steps: [
      { id: "st1", label: "Home inspection scheduled", done: true },
      { id: "st2", label: "Inspection completed", done: true },
      { id: "st3", label: "Review inspection report", done: false },
      { id: "st4", label: "Negotiate repairs", done: false },
    ],
  },
  {
    id: "d6",
    address: "550 Maple Avenue",
    client: "Jennifer Walsh",
    price: "$645,000",
    type: "Sale",
    agent: "Jessica Torres",
    stage: "s3",
    daysInStage: 16,
    nextStep: "Negotiate repair credits",
    closeDate: "2026-06-28",
    stageEntered: "2026-05-30",
    targetDays: 14,
    steps: [
      { id: "st1", label: "Home inspection done", done: true },
      { id: "st2", label: "Appraisal ordered", done: true },
      { id: "st3", label: "Repair list compiled", done: true },
      { id: "st4", label: "Negotiate repair credits", done: false },
    ],
  },
  {
    id: "d7",
    address: "1200 Cedar Crest Ct",
    client: "Mark & Lisa Wong",
    price: "$890,000",
    type: "Sale",
    agent: "Lisa Chang",
    stage: "s4",
    daysInStage: 22,
    nextStep: "Final walkthrough",
    closeDate: "2026-06-25",
    stageEntered: "2026-05-24",
    targetDays: 30,
    steps: [
      { id: "st1", label: "Title search complete", done: true },
      { id: "st2", label: "Loan approved", done: true },
      { id: "st3", label: "Closing docs prepared", done: true },
      { id: "st4", label: "Final walkthrough", done: false },
    ],
  },
  {
    id: "d8",
    address: "33 Sunset Blvd",
    client: "Carlos Mendez",
    price: "$370,000",
    type: "Lease",
    agent: "Marcus Webb",
    stage: "s4",
    daysInStage: 35,
    nextStep: "Sign closing documents",
    closeDate: "2026-06-20",
    stageEntered: "2026-05-10",
    targetDays: 30,
    steps: [
      { id: "st1", label: "Title cleared", done: true },
      { id: "st2", label: "Final underwriting done", done: true },
      { id: "st3", label: "Closing scheduled", done: true },
      { id: "st4", label: "Sign closing documents", done: false },
    ],
  },
  {
    id: "d9",
    address: "901 Lake Shore Dr",
    client: "Priya Sharma",
    price: "$1,800,000",
    type: "Sale",
    agent: "Jessica Torres",
    stage: "s5",
    daysInStage: 4,
    nextStep: "Send thank-you gift",
    closeDate: "2026-06-15",
    stageEntered: "2026-06-11",
    targetDays: 14,
    steps: [
      { id: "st1", label: "Transaction closed", done: true },
      { id: "st2", label: "Keys transferred", done: true },
      { id: "st3", label: "Send thank-you gift", done: false },
      { id: "st4", label: "Request testimonial", done: false },
    ],
  },
  {
    id: "d10",
    address: "460 Park Avenue #12",
    client: "James & Olivia Hart",
    price: "$1,050,000",
    type: "Sale",
    agent: "Lisa Chang",
    stage: "s6",
    daysInStage: 30,
    nextStep: "Archive file",
    closeDate: "2026-05-15",
    stageEntered: "2026-05-15",
    targetDays: 0,
    steps: [
      { id: "st1", label: "All docs archived", done: true },
      { id: "st2", label: "Testimonial received", done: true },
      { id: "st3", label: "Referral requested", done: true },
    ],
  },
];

// ---- Daily Tasks Types ----

export type Priority = "high" | "med" | "low";
export type Recurrence = "daily" | "weekly" | "once";

export interface TaskItem {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
  assignee: string;
  recurrence: Recurrence;
}

export interface PropertyTaskGroup {
  propertyName: string;
  tasks: TaskItem[];
}

export interface BrokerageTaskGroup {
  label: string;
  color: string;
  tasks: TaskItem[];
}

export const MOCK_PROPERTY_TASKS: PropertyTaskGroup[] = [
  {
    propertyName: "1428 Elm Street",
    tasks: [
      {
        id: "pt1",
        text: "Send disclosure packet to buyer's agent",
        done: false,
        priority: "high",
        assignee: "JT",
        recurrence: "once",
      },
      {
        id: "pt2",
        text: "Follow up on pre-approval letter from lender",
        done: false,
        priority: "med",
        assignee: "JT",
        recurrence: "daily",
      },
      {
        id: "pt3",
        text: "Update MLS listing with new photos",
        done: true,
        priority: "low",
        assignee: "MW",
        recurrence: "once",
      },
    ],
  },
  {
    propertyName: "3200 Oak Grove Ave",
    tasks: [
      {
        id: "pt4",
        text: "Confirm open house staffing for Saturday",
        done: false,
        priority: "high",
        assignee: "MW",
        recurrence: "weekly",
      },
      {
        id: "pt5",
        text: "Send showing feedback summary to sellers",
        done: true,
        priority: "med",
        assignee: "MW",
        recurrence: "daily",
      },
    ],
  },
  {
    propertyName: "755 River Bend Dr",
    tasks: [
      {
        id: "pt6",
        text: "Prepare counter-offer for review",
        done: false,
        priority: "high",
        assignee: "JT",
        recurrence: "once",
      },
      {
        id: "pt7",
        text: "Send comps analysis to seller",
        done: true,
        priority: "med",
        assignee: "JT",
        recurrence: "once",
      },
    ],
  },
  {
    propertyName: "2100 Pine Street #4B",
    tasks: [
      {
        id: "pt8",
        text: "Finalize purchase agreement language",
        done: false,
        priority: "high",
        assignee: "LC",
        recurrence: "once",
      },
    ],
  },
  {
    propertyName: "88 Harbor View Ln",
    tasks: [
      {
        id: "pt9",
        text: "Review home inspection report",
        done: false,
        priority: "high",
        assignee: "MW",
        recurrence: "once",
      },
      {
        id: "pt10",
        text: "Schedule termite inspection",
        done: false,
        priority: "med",
        assignee: "MW",
        recurrence: "once",
      },
    ],
  },
];

export const MOCK_BROKERAGE_TASKS: BrokerageTaskGroup[] = [
  {
    label: "Compliance",
    color: "#ff6b6b",
    tasks: [
      {
        id: "bt1",
        text: "File quarterly transaction report with state board",
        done: false,
        priority: "high",
        assignee: "LC",
        recurrence: "weekly",
      },
    ],
  },
  {
    label: "Marketing",
    color: "#64c8f0",
    tasks: [
      {
        id: "bt2",
        text: "Schedule social media posts for new listings",
        done: false,
        priority: "med",
        assignee: "JT",
        recurrence: "daily",
      },
      {
        id: "bt3",
        text: "Update brokerage website with sold properties",
        done: true,
        priority: "low",
        assignee: "MW",
        recurrence: "weekly",
      },
    ],
  },
  {
    label: "Admin",
    color: "#c8f064",
    tasks: [
      {
        id: "bt4",
        text: "Process expense reports for team",
        done: false,
        priority: "med",
        assignee: "LC",
        recurrence: "weekly",
      },
      {
        id: "bt5",
        text: "Order office supplies",
        done: false,
        priority: "low",
        assignee: "LC",
        recurrence: "once",
      },
    ],
  },
];

// ---- Email Triage Mock Data ----

export const mockEmails: EmailCard[] = [
  {
    id: "e1",
    propertyName: "1428 Elm Street",
    senderType: "Lender",
    senderName: "First National Bank",
    date: "2026-06-14",
    urgency: "high",
    summary: "Pre-approval letter ready for review — needs signature by EOD",
    proposedTask: "Review and forward pre-approval letter to client",
  },
  {
    id: "e2",
    propertyName: "3200 Oak Grove Ave",
    senderType: "Agent",
    senderName: "Marcus Webb",
    date: "2026-06-14",
    urgency: "medium",
    summary: "Buyer wants second showing Saturday at 2pm",
    proposedTask: "Schedule second showing for Saturday 2pm",
  },
  {
    id: "e3",
    propertyName: "755 River Bend Dr",
    senderType: "Attorney",
    senderName: "Davis & Associates",
    date: "2026-06-13",
    urgency: "high",
    summary: "Counter-offer review complete — recommends acceptance with minor changes",
    proposedTask: "Review attorney notes and prepare revised counter",
  },
  {
    id: "e4",
    propertyName: "88 Harbor View Ln",
    senderType: "Inspector",
    senderName: "Apex Home Inspections",
    date: "2026-06-13",
    urgency: "medium",
    summary: "Inspection report attached — found minor roof damage",
    proposedTask: "Review inspection report, share with buyers",
  },
  {
    id: "e5",
    propertyName: "1200 Cedar Crest Ct",
    senderType: "Title Company",
    senderName: "Landmark Title Co",
    date: "2026-06-12",
    urgency: "low",
    summary: "Title search complete — no liens found, clear to close",
    proposedTask: "File title report in transaction folder",
  },
];

// ---- Communications Mock Data ----

export const mockMondayFeedback: MondayFeedbackCard[] = [
  {
    id: "mf1",
    address: "1428 Elm Street",
    showingCount: 3,
    status: "draft",
    showings: [
      { date: "2026-06-10", agent: "Jessica Torres", feedback: "Buyers loved the kitchen but concerned about the basement", sentiment: "neutral" },
      { date: "2026-06-12", agent: "Marcus Webb", feedback: "Great layout, strong interest", sentiment: "positive" },
      { date: "2026-06-13", agent: "Lisa Chang", feedback: "Price is a bit high for the area", sentiment: "negative" },
    ],
    draftText: "Hi sellers, here's your weekly showing feedback. We had 3 showings this week with generally positive reception. One buyer expressed concern about the basement, and another felt the price was slightly high. Let's discuss strategy on our call tomorrow.",
  },
  {
    id: "mf2",
    address: "3200 Oak Grove Ave",
    showingCount: 5,
    status: "sent",
    showings: [
      { date: "2026-06-09", agent: "Marcus Webb", feedback: "Stunning property, buyers very impressed", sentiment: "positive" },
      { date: "2026-06-10", agent: "Jessica Torres", feedback: "Multiple offers expected", sentiment: "positive" },
      { date: "2026-06-11", agent: "Lisa Chang", feedback: "Best listing in the neighborhood", sentiment: "positive" },
      { date: "2026-06-12", agent: "Marcus Webb", feedback: "Buyers asking about school district", sentiment: "neutral" },
      { date: "2026-06-13", agent: "Jessica Torres", feedback: "Very strong interest, possible offer coming", sentiment: "positive" },
    ],
    draftText: "Hi sellers, fantastic week! 5 showings and overwhelming positive feedback. We're expecting multiple offers. Let's schedule a call to discuss strategy.",
  },
];

export const mockOpenHouses: OpenHouseCard[] = [
  {
    id: "oh1",
    address: "2100 Pine Street #4B",
    reason: "Price reduction — new price $410,000",
    date: "2026-06-20",
    time: "1:00 PM - 4:00 PM",
    emailPreview: "Join us this Saturday for an open house at 2100 Pine Street #4B. Recently reduced to $410,000...",
    status: "draft",
  },
  {
    id: "oh2",
    address: "550 Maple Avenue",
    reason: "Back on market — buyer financing fell through",
    date: "2026-06-21",
    time: "11:00 AM - 2:00 PM",
    emailPreview: "Great news — 550 Maple Avenue is back on the market! Join us Sunday for an open house...",
    status: "draft",
  },
];

export const mockScheduleSlots: ScheduleSlot[] = [
  { time: "9:00 AM", address: "1428 Elm Street" },
  { time: "12:00 PM", address: "" },
  { time: "3:00 PM", address: "3200 Oak Grove Ave" },
  { time: "6:00 PM", address: "" },
];

// ---- Owner Check-ins Mock Data ----

export const mockOwners: OwnerCard[] = [
  {
    id: "o1",
    name: "Sarah & Michael Chen",
    address: "1428 Elm Street",
    agent: "Jessica Torres",
    phone: "(555) 234-5678",
    dealType: "Sale",
    stage: "Lead",
    status: "scheduled",
    bookingLink: "https://calendly.com/jt/chen-checkin",
    calendlyLink: "https://calendly.com/jt/chen-checkin",
    callDate: "2026-06-15",
    callTime: "10:00 AM",
    stageAtCall: "Lead",
    reminderDays: 1,
    talkingPoints: [
      { id: "tp1", text: "Review showing activity this week" },
      { id: "tp2", text: "Discuss pricing strategy update" },
      { id: "tp3", text: "Next steps for disclosure packet" },
    ],
    agendaItems: [
      { id: "ag1", text: "Weekly market update", done: false },
      { id: "ag2", text: "Showing feedback review", done: false },
      { id: "ag3", text: "Pre-approval status", done: false },
    ],
    sentiment: "neutral",
    aiSummary: "Sellers are cautiously optimistic. Concerned about market timing. Pre-approval letter received. Need to finalize disclosure packet.",
    actionItems: [
      { id: "ai1", text: "Send updated comps by Wednesday", done: false },
      { id: "ai2", text: "Schedule photographer for new listing photos", done: true },
    ],
    rawNotes: "Call went well. Sellers want to wait 2 more weeks before considering price adjustment. Agent will follow up with updated comps.",
    conversationHistory: [
      {
        date: "2026-06-08",
        status: "completed",
        summary: "Initial listing strategy discussed. Sellers agreed on price point of $785,000.",
        notes: "Positive reception to marketing plan.",
        sentiment: "positive",
      },
      {
        date: "2026-06-01",
        status: "completed",
        summary: "First check-in. Reviewed initial showing feedback.",
        notes: "One showing, feedback was neutral.",
        sentiment: "neutral",
      },
    ],
  },
  {
    id: "o2",
    name: "David Park",
    address: "3200 Oak Grove Ave",
    agent: "Marcus Webb",
    phone: "(555) 345-6789",
    dealType: "Sale",
    stage: "Showing",
    status: "awaiting",
    bookingLink: "https://calendly.com/mw/park-checkin",
    calendlyLink: "https://calendly.com/mw/park-checkin",
    callDate: "2026-06-16",
    callTime: "2:00 PM",
    stageAtCall: "Showing",
    reminderDays: 2,
    talkingPoints: [
      { id: "tp4", text: "Open house turnout review" },
      { id: "tp5", text: "Offer expectations discussion" },
    ],
    agendaItems: [
      { id: "ag4", text: "Review showing metrics", done: false },
      { id: "ag5", text: "Discuss potential offers", done: false },
    ],
    sentiment: "positive",
    aiSummary: "5 showings this week, very strong interest. Multiple offers likely. Sellers are excited.",
    actionItems: [
      { id: "ai3", text: "Prepare offer comparison spreadsheet", done: false },
    ],
    rawNotes: "",
    conversationHistory: [
      {
        date: "2026-06-09",
        status: "completed",
        summary: "Reviewed open house results. 12 groups attended.",
        notes: "Seller very pleased with traffic.",
        sentiment: "positive",
      },
    ],
  },
  {
    id: "o3",
    name: "Ana Rodriguez",
    address: "755 River Bend Dr",
    agent: "Jessica Torres",
    phone: "(555) 456-7890",
    dealType: "Sale",
    stage: "Offer",
    status: "scheduled",
    bookingLink: "https://calendly.com/jt/rodriguez-checkin",
    calendlyLink: "https://calendly.com/jt/rodriguez-checkin",
    callDate: "2026-06-15",
    callTime: "3:00 PM",
    stageAtCall: "Offer",
    reminderDays: 0,
    talkingPoints: [
      { id: "tp6", text: "Counter-offer details" },
      { id: "tp7", text: "Attorney review status" },
    ],
    agendaItems: [
      { id: "ag6", text: "Review counter-offer terms", done: false },
      { id: "ag7", text: "Discuss attorney feedback", done: false },
    ],
    sentiment: "positive",
    aiSummary: "Offer received at $550K, countering at $560K. Attorney recommends minor language changes.",
    actionItems: [
      { id: "ai4", text: "Draft counter-offer letter", done: false },
      { id: "ai5", text: "Send attorney revisions to seller", done: false },
    ],
    rawNotes: "",
    conversationHistory: [],
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  { date: "2026-06-15", ownerIds: ["o1", "o3"] },
  { date: "2026-06-16", ownerIds: ["o2"] },
  { date: "2026-06-20", ownerIds: ["o1"] },
];

// ---- Team Types ----

export type TeamRole = "lead" | "tc" | "tm" | "admin" | "agent";

export interface AtRiskDeal {
  id: string;
  address: string;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: TeamRole;
  roleLabel: string;
  location: string;
  email: string;
  activeDeals: number;
  tasksDue: number;
  checkinsThisWeek: number;
  atRiskDeals: AtRiskDeal[];
}

export const ROLE_COLORS: Record<TeamRole, string> = {
  lead: "#b088ff",
  tc: "#64c8f0",
  tm: "#ffa040",
  admin: "#ff6b6b",
  agent: "#64f0c8",
};

export const MOCK_TEAM: TeamMember[] = [
  {
    id: "t1",
    name: "Smita Patel",
    initials: "SP",
    role: "lead",
    roleLabel: "Transaction Lead",
    location: "US",
    email: "smita@torreswebb.com",
    activeDeals: 5,
    tasksDue: 3,
    checkinsThisWeek: 4,
    atRiskDeals: [
      { id: "d7", address: "1200 Cedar Crest Ct" },
      { id: "d8", address: "33 Sunset Blvd" },
    ],
  },
  {
    id: "t2",
    name: "Raj Mehta",
    initials: "RM",
    role: "tc",
    roleLabel: "Transaction Coordinator",
    location: "India",
    email: "raj@torreswebb.com",
    activeDeals: 8,
    tasksDue: 6,
    checkinsThisWeek: 8,
    atRiskDeals: [
      { id: "d6", address: "550 Maple Avenue" },
    ],
  },
  {
    id: "t3",
    name: "Priya Sharma",
    initials: "PS",
    role: "tm",
    roleLabel: "Transaction Manager",
    location: "India",
    email: "priya@torreswebb.com",
    activeDeals: 4,
    tasksDue: 1,
    checkinsThisWeek: 5,
    atRiskDeals: [],
  },
  {
    id: "t4",
    name: "Marcus Webb",
    initials: "MW",
    role: "agent",
    roleLabel: "Agent",
    location: "US",
    email: "marcus@torreswebb.com",
    activeDeals: 6,
    tasksDue: 4,
    checkinsThisWeek: 3,
    atRiskDeals: [
      { id: "d5", address: "88 Harbor View Ln" },
    ],
  },
];

// ---- Stage Config Types ----

export interface StageConfigStep {
  id: string;
  label: string;
  done: boolean;
}

export interface StageConfig {
  key: StageKey;
  label: string;
  idx: number;
  color: string;
  targetDays: number;
  steps: StageConfigStep[];
  isCloseDateAnchor: boolean;
}

export const MOCK_STAGE_CONFIGS: StageConfig[] = STAGES.map((s, i) => ({
  key: s.key,
  label: s.label,
  idx: i,
  color: s.color,
  targetDays: s.targetDays,
  steps: [
    { id: `${s.key}-st1`, label: "Stage initiated", done: true },
    { id: `${s.key}-st2`, label: "Documents collected", done: s.key === "s6" ? true : false },
    { id: `${s.key}-st3`, label: "Review completed", done: s.key === "s6" ? true : false },
  ],
  isCloseDateAnchor: s.key === "s2",
}));
