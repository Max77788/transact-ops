import type {
  EmailCard,
  MondayFeedbackCard,
  OpenHouseCard,
  ScheduleSlot,
  OwnerCard,
  CalendarEvent,
} from "./types";

export const mockEmails: EmailCard[] = [
  {
    id: "e1",
    propertyName: "1204 Highland Ave, Santa Monica",
    senderType: "Agent",
    senderName: "Sarah Chen",
    date: "Jun 14, 2026 — 10:42 AM",
    urgency: "high",
    summary:
      "Buyer's inspection report came back with significant foundation concerns. Need to discuss repair credits before the contingency deadline Friday.",
    proposedTask: "Review inspection report and draft repair addendum",
  },
  {
    id: "e2",
    propertyName: "82 Riverside Dr, Austin",
    senderType: "Title Company",
    senderName: "First American Title",
    date: "Jun 14, 2026 — 9:15 AM",
    urgency: "medium",
    summary:
      "Preliminary title report is ready. One outstanding lien from 2019 needs resolution. Sending documents for review.",
    proposedTask: "Review title report and flag lien for resolution",
  },
  {
    id: "e3",
    propertyName: "3100 Wilshire Blvd #502, Los Angeles",
    senderType: "Lender",
    senderName: "Wells Fargo Mortgage",
    date: "Jun 13, 2026 — 4:30 PM",
    urgency: "low",
    summary:
      "Conditional loan approval received. Two outstanding conditions: 2024 tax returns and updated pay stubs needed from buyer.",
    proposedTask: "Forward conditional approval to buyer and request docs",
  },
  {
    id: "e4",
    propertyName: "451 Oak Grove, Portland",
    senderType: "Inspector",
    senderName: "Pacific Home Inspections",
    date: "Jun 13, 2026 — 2:00 PM",
    urgency: "high",
    summary:
      "Roof has active leaks in three locations. HVAC system is 22 years old and non-functional. Recommend immediate remediation.",
    proposedTask: "Share inspection report with seller and get repair estimates",
  },
  {
    id: "e5",
    propertyName: "2200 Market St #12, San Francisco",
    senderType: "Attorney",
    senderName: "Goldstein & Park LLP",
    date: "Jun 13, 2026 — 11:20 AM",
    urgency: "medium",
    summary:
      "HOA documents reviewed. Rental cap has been reached — buyer's intent to lease may be blocked. Need to advise on options.",
    proposedTask: "Review HOA bylaws and discuss rental restriction with buyer",
  },
  {
    id: "e6",
    propertyName: "67 Beacon Hill Rd, Boston",
    senderType: "Client",
    senderName: "Michael Torres",
    date: "Jun 12, 2026 — 6:45 PM",
    urgency: "low",
    summary:
      "Question about the closing cost breakdown — specifically the transfer tax calculation looks higher than expected.",
    proposedTask: "Respond with closing cost breakdown and transfer tax explanation",
  },
];

export const mockMondayFeedback: MondayFeedbackCard[] = [
  {
    id: "mf1",
    address: "1204 Highland Ave, Santa Monica",
    showingCount: 4,
    status: "draft",
    showings: [
      {
        date: "Jun 10",
        agent: "David Kim",
        feedback:
          "Buyers loved the natural light but concerned about the kitchen size. Considering an offer.",
        sentiment: "positive",
      },
      {
        date: "Jun 11",
        agent: "Lisa Park",
        feedback:
          "Nice property but priced about 5% above comparables. Clients are thinking it over.",
        sentiment: "neutral",
      },
      {
        date: "Jun 12",
        agent: "James Wilson",
        feedback:
          "Clients felt the neighborhood was too noisy. Not interested in proceeding.",
        sentiment: "negative",
      },
      {
        date: "Jun 13",
        agent: "Maria Garcia",
        feedback:
          "Strong interest. Clients are pre-approved and may submit an offer this week.",
        sentiment: "positive",
      },
    ],
    draftText:
      "Hi Sarah, here's your weekly showing feedback for 1204 Highland Ave. We had 4 showings this week with mixed feedback. Two agents reported positive interest — David Kim's buyers are considering an offer and Maria Garcia's clients may submit this week. Lisa Park noted the price is slightly above comparables, and James Wilson's clients weren't interested due to neighborhood noise. Overall sentiment is cautiously optimistic. Let's discuss any adjustments you'd like to make.",
  },
  {
    id: "mf2",
    address: "451 Oak Grove, Portland",
    showingCount: 3,
    status: "sent",
    showings: [
      {
        date: "Jun 9",
        agent: "Tom Bradley",
        feedback:
          "Buyers are very interested. The yard is exactly what they're looking for.",
        sentiment: "positive",
      },
      {
        date: "Jun 10",
        agent: "Rachel Nguyen",
        feedback:
          "Beautiful home but the inspection concerns are holding clients back.",
        sentiment: "neutral",
      },
      {
        date: "Jun 12",
        agent: "Chris O'Brien",
        feedback:
          "Love the layout. Waiting to see if the seller addresses the roof issues before making a decision.",
        sentiment: "positive",
      },
    ],
    draftText:
      "Hi Mark, feedback for 451 Oak Grove this week. 3 showings — two positive, one neutral. Tom Bradley's and Chris O'Brien's buyers are interested but waiting on the roof situation. Rachel Nguyen's clients are cautious about inspection findings. Recommend addressing the major repair items to convert these interested parties into offers.",
  },
];

export const mockOpenHouses: OpenHouseCard[] = [
  {
    id: "oh1",
    address: "3100 Wilshire Blvd #502, Los Angeles",
    reason: "New listing — first open house",
    date: "2026-06-17",
    time: "13:00",
    emailPreview:
      "Join us this Wednesday for an exclusive open house at 3100 Wilshire Blvd #502. This stunning 2-bed, 2-bath condo features floor-to-ceiling windows with panoramic city views...",
    status: "draft",
  },
  {
    id: "oh2",
    address: "2200 Market St #12, San Francisco",
    reason: "Price reduction — refresh interest",
    date: "2026-06-17",
    time: "11:00",
    emailPreview:
      "New price! 2200 Market St #12 is now listed at $875,000. Come see this beautifully updated 1-bedroom in the heart of the Castro with modern finishes...",
    status: "draft",
  },
  {
    id: "oh3",
    address: "82 Riverside Dr, Austin",
    reason: "Back on market — relist open house",
    date: "2026-06-17",
    time: "14:00",
    emailPreview:
      "Back on market! 82 Riverside Dr is available again. This spacious 4-bedroom home on the Colorado River offers incredible outdoor living...",
    status: "sent",
  },
];

export const mockScheduleSlots: ScheduleSlot[] = [
  { time: "11:00 AM", address: "2200 Market St #12" },
  { time: "1:00 PM", address: "3100 Wilshire Blvd #502" },
  { time: "2:00 PM", address: "82 Riverside Dr" },
];

export const mockCalendarEvents: CalendarEvent[] = [
  { date: "2026-06-03", ownerIds: ["o1"] },
  { date: "2026-06-04", ownerIds: ["o1"] },
  { date: "2026-06-10", ownerIds: ["o2"] },
  { date: "2026-06-12", ownerIds: ["o3"] },
  { date: "2026-06-17", ownerIds: ["o4", "o5"] },
];

export const mockOwners: OwnerCard[] = [
  {
    id: "o1",
    name: "Robert & Janet Miller",
    address: "1204 Highland Ave, Santa Monica, CA 90401",
    agent: "Sarah Chen",
    phone: "(310) 555-0121",
    dealType: "Sale",
    stage: "Inspection",
    status: "awaiting",
    bookingLink: "https://calendly.com/smita/miller-checkin",
    calendlyLink: "https://calendly.com/smita/miller-checkin",
    callDate: "",
    callTime: "",
    stageAtCall: "Post-inspection review",
    reminderDays: 5,
    talkingPoints: [
      {
        id: "tp1",
        text: "Inspection report — roof leak in master bedroom, HVAC 22 years old",
      },
      {
        id: "tp2",
        text: "Repair credits: buyer requesting $15,000 for roof + $8,000 for HVAC",
      },
      { id: "tp3", text: "Contingency deadline: June 20 — 5 days remaining" },
      {
        id: "tp4",
        text: "Market update: 2 competing offers on similar properties in neighborhood",
      },
    ],
    agendaItems: [
      { id: "ag1", text: "Review inspection findings together", done: false },
      { id: "ag2", text: "Discuss repair credit negotiation strategy", done: false },
      { id: "ag3", text: "Confirm timeline for remediation", done: false },
      { id: "ag4", text: "Next showing availability", done: false },
    ],
    sentiment: "neutral",
    aiSummary: "",
    actionItems: [],
    rawNotes: "",
    conversationHistory: [],
  },
  {
    id: "o2",
    name: "Diana Park",
    address: "451 Oak Grove, Portland, OR 97201",
    agent: "Mark Reynolds",
    phone: "(503) 555-0342",
    dealType: "Sale",
    stage: "Negotiation",
    status: "scheduled",
    bookingLink: "https://calendly.com/smita/park-checkin",
    calendlyLink: "https://calendly.com/smita/park-checkin",
    callDate: "2026-06-17",
    callTime: "10:00 AM",
    stageAtCall: "Counter-offer review",
    reminderDays: 3,
    talkingPoints: [
      {
        id: "tp1",
        text: "Counter received: $610,000 (list was $625,000) with $10k closing credit",
      },
      {
        id: "tp2",
        text: "Inspection items: roof replacement quoted at $12,500, HVAC at $9,200",
      },
      { id: "tp3", text: "Buyer pre-approved, 20% down, closing in 30 days" },
      {
        id: "tp4",
        text: "Consider counter-counter at $618,000 with $12k credit for repairs",
      },
    ],
    agendaItems: [
      { id: "ag1", text: "Present counter-offer details", done: false },
      { id: "ag2", text: "Discuss inspection repair strategy", done: false },
      { id: "ag3", text: "Review net proceeds at different price points", done: false },
      { id: "ag4", text: "Set deadline for response", done: false },
    ],
    sentiment: "neutral",
    aiSummary: "",
    actionItems: [],
    rawNotes: "",
    conversationHistory: [
      {
        date: "2026-06-03",
        status: "completed",
        summary:
          "Discussed initial offer strategy. Owner wants to list at $625k with flexibility to $600k. Reviewed comps and market conditions.",
        notes:
          "Diana is motivated to sell quickly — relocating for work. Mentioned she's willing to offer repair credits if needed. Preferred closing timeline is 45 days.",
        sentiment: "positive",
      },
    ],
  },
  {
    id: "o3",
    name: "Greenfield Holdings LLC",
    address: "3100 Wilshire Blvd #502, Los Angeles, CA 90010",
    agent: "David Chen",
    phone: "(213) 555-0789",
    dealType: "Lease",
    stage: "Lease Negotiation",
    status: "completed",
    bookingLink: "https://calendly.com/smita/greenfield-checkin",
    calendlyLink: "https://calendly.com/smita/greenfield-checkin",
    callDate: "2026-06-12",
    callTime: "2:00 PM",
    stageAtCall: "Lease terms finalization",
    reminderDays: 0,
    talkingPoints: [],
    agendaItems: [],
    sentiment: "positive",
    aiSummary:
      "Call completed successfully. Owner agreed to lease terms for 3100 Wilshire Blvd #502. Tenant is a tech startup with strong financials — 3-year lease at $4,200/month with 3% annual escalator. Security deposit and first month's rent due by June 20. Owner expressed satisfaction with the tenant selection process.",
    actionItems: [
      {
        id: "ai1",
        text: "Send final lease agreement for digital signature",
        done: false,
      },
      {
        id: "ai2",
        text: "Coordinate move-in inspection for June 28",
        done: false,
      },
      {
        id: "ai3",
        text: "Collect security deposit ($8,400) and first month rent ($4,200)",
        done: true,
      },
    ],
    rawNotes:
      "Greenfield was very pleased with the tenant profile. Mentioned they're considering listing another unit in the building next quarter. Lease terms all agreed — no changes from the draft. Tenant wants early move-in on the 28th if possible.",
    conversationHistory: [
      {
        date: "2026-05-28",
        status: "scheduled",
        summary:
          "Pre-call prep session. Reviewed tenant applications and narrowed to top 3 candidates.",
        notes: "",
        sentiment: "neutral",
      },
      {
        date: "2026-06-12",
        status: "completed",
        summary:
          "Lease terms finalized with owner. Greenfield approved tech startup tenant at $4,200/month.",
        notes:
          "Greenfield was very pleased. Considering listing another unit. Lease terms agreed — no changes.",
        sentiment: "positive",
      },
    ],
  },
  {
    id: "o4",
    name: "The Williams Family Trust",
    address: "82 Riverside Dr, Austin, TX 78701",
    agent: "Jessica Torres",
    phone: "(512) 555-0456",
    dealType: "Sale",
    stage: "Closing",
    status: "noshow",
    bookingLink: "https://calendly.com/smita/williams-checkin",
    calendlyLink: "https://calendly.com/smita/williams-checkin",
    callDate: "2026-06-14",
    callTime: "11:00 AM",
    stageAtCall: "Pre-closing review",
    reminderDays: 0,
    talkingPoints: [],
    agendaItems: [],
    sentiment: "neutral",
    aiSummary: "",
    actionItems: [
      {
        id: "ai1",
        text: "Reschedule call — owner did not answer after 3 attempts",
        done: false,
      },
      {
        id: "ai2",
        text: "Send urgent email about closing docs deadline",
        done: false,
      },
    ],
    rawNotes:
      "Called 3 times — no answer. Left voicemail. Closing is in 4 days and we still need signatures on the final disclosure package. Texted the trustee's cell.",
    conversationHistory: [
      {
        date: "2026-06-01",
        status: "completed",
        summary:
          "Pre-closing document review. All conditions satisfied, closing scheduled for June 18.",
        notes:
          "Trustee (James Williams) confirmed all docs look good. Wired earnest money. Coordinating with title company for final closing statement.",
        sentiment: "positive",
      },
    ],
  },
  {
    id: "o5",
    name: "Andre & Chloe Moreau",
    address: "2200 Market St #12, San Francisco, CA 94114",
    agent: "Lisa Park",
    phone: "(415) 555-0891",
    dealType: "Sale",
    stage: "Offer Review",
    status: "scheduled",
    bookingLink: "https://calendly.com/smita/moreau-checkin",
    calendlyLink: "https://calendly.com/smita/moreau-checkin",
    callDate: "2026-06-17",
    callTime: "3:00 PM",
    stageAtCall: "Multiple offer review",
    reminderDays: 3,
    talkingPoints: [
      {
        id: "tp1",
        text: "Received 3 offers: $895k (all cash, 14 day close), $910k (financed, 30 day), $880k (contingent on sale)",
      },
      {
        id: "tp2",
        text: "All-cash offer is cleanest but $15k below the financed offer",
      },
      {
        id: "tp3",
        text: "HOA rental cap reached — buyer's intended use matters",
      },
      { id: "tp4", text: "Market is hot in this area — comps support $900k+" },
    ],
    agendaItems: [
      { id: "ag1", text: "Present all three offers with pros/cons", done: false },
      { id: "ag2", text: "Discuss cash vs financed tradeoffs", done: false },
      { id: "ag3", text: "Review HOA rental restrictions", done: false },
      { id: "ag4", text: "Decide on counter-strategy", done: false },
    ],
    sentiment: "neutral",
    aiSummary: "",
    actionItems: [],
    rawNotes: "",
    conversationHistory: [],
  },
];
