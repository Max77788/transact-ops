-- ============================================================================
-- TransactOps Seed Data
-- Run after migrations: supabase db reset
-- ============================================================================

begin;

-- --------------------------------------------------------------------------
-- 1. ORGANIZATION
-- --------------------------------------------------------------------------
insert into organizations (id, name) values
  ('d1000000-0000-0000-0000-000000000001', 'Peak Realty Group');

-- --------------------------------------------------------------------------
-- 2. PROFILES (4 team members)
-- NOTE: user_id values are placeholders — replace with real auth.users IDs
--       after creating users in Supabase Auth.
-- --------------------------------------------------------------------------
insert into profiles (id, org_id, user_id, full_name, role, location, avatar_url) values
  ('e2000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sarah Chen',    'lead',  'US',    null),
  ('e2000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Raj Patel',     'tc',    'India', null),
  ('e2000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001',
   'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Mike Johnson',  'tm',    'US',    null),
  ('e2000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001',
   'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Emily Davis',   'agent', 'US',    null);

-- --------------------------------------------------------------------------
-- 3. STAGES (idx 0..6)
-- --------------------------------------------------------------------------
insert into stages (id, org_id, name, idx, description) values
  ('f3000000-0000-0000-0000-000000000000', 'd1000000-0000-0000-0000-000000000001',
   'Lead / Inquiry', 0, 'New lead captured, initial contact pending'),
  ('f3000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   'Appointment Set', 1, 'Listing appointment or buyer consult scheduled'),
  ('f3000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001',
   'Signed / Active', 2, 'Agreement signed, deal is active'),
  ('f3000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001',
   'Under Contract', 3, 'Offer accepted, contract executed'),
  ('f3000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001',
   'Inspection / Due Diligence', 4, 'Inspections, appraisal, loan processing'),
  ('f3000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001',
   'Closing Prep', 5, 'Final walkthrough, docs, settlement coordination'),
  ('f3000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000001',
   'Closed', 6, 'Transaction complete, funds disbursed');

-- --------------------------------------------------------------------------
-- 4. STAGE STEPS (key milestones per stage)
-- --------------------------------------------------------------------------

-- Stage 0: Lead / Inquiry
insert into stage_steps (id, stage_id, org_id, name, idx) values
  ('f4000000-0000-0000-0000-000000000001', 'f3000000-0000-0000-0000-000000000000', 'd1000000-0000-0000-0000-000000000001', 'Initial outreach', 0),
  ('f4000000-0000-0000-0000-000000000002', 'f3000000-0000-0000-0000-000000000000', 'd1000000-0000-0000-0000-000000000001', 'Qualify lead', 1),
  ('f4000000-0000-0000-0000-000000000003', 'f3000000-0000-0000-0000-000000000000', 'd1000000-0000-0000-0000-000000000001', 'Send CMA / info packet', 2);

-- Stage 1: Appointment Set
insert into stage_steps (id, stage_id, org_id, name, idx) values
  ('f4000000-0000-0000-0000-000000000004', 'f3000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Confirm appointment', 0),
  ('f4000000-0000-0000-0000-000000000005', 'f3000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Prep listing presentation', 1),
  ('f4000000-0000-0000-0000-000000000006', 'f3000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Run comps', 2);

-- Stage 2: Signed / Active
insert into stage_steps (id, stage_id, org_id, name, idx) values
  ('f4000000-0000-0000-0000-000000000007', 'f3000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'Sign listing agreement', 0),
  ('f4000000-0000-0000-0000-000000000008', 'f3000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'Professional photos', 1),
  ('f4000000-0000-0000-0000-000000000009', 'f3000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'MLS listing live', 2),
  ('f4000000-0000-0000-0000-000000000010', 'f3000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'Marketing launch', 3);

-- Stage 3: Under Contract
insert into stage_steps (id, stage_id, org_id, name, idx) values
  ('f4000000-0000-0000-0000-000000000011', 'f3000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'Offer received', 0),
  ('f4000000-0000-0000-0000-000000000012', 'f3000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'Negotiate terms', 1),
  ('f4000000-0000-0000-0000-000000000013', 'f3000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'Contract executed', 2),
  ('f4000000-0000-0000-0000-000000000014', 'f3000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'EMD deposited', 3);

-- Stage 4: Inspection / Due Diligence
insert into stage_steps (id, stage_id, org_id, name, idx) values
  ('f4000000-0000-0000-0000-000000000015', 'f3000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'Schedule inspection', 0),
  ('f4000000-0000-0000-0000-000000000016', 'f3000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'Review inspection report', 1),
  ('f4000000-0000-0000-0000-000000000017', 'f3000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'Negotiate repairs', 2),
  ('f4000000-0000-0000-0000-000000000018', 'f3000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'Appraisal ordered', 3),
  ('f4000000-0000-0000-0000-000000000019', 'f3000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'Loan commitment', 4);

-- Stage 5: Closing Prep
insert into stage_steps (id, stage_id, org_id, name, idx) values
  ('f4000000-0000-0000-0000-000000000020', 'f3000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001', 'Final walkthrough', 0),
  ('f4000000-0000-0000-0000-000000000021', 'f3000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001', 'Review closing disclosure', 1),
  ('f4000000-0000-0000-0000-000000000022', 'f3000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001', 'Coordinate with title', 2),
  ('f4000000-0000-0000-0000-000000000023', 'f3000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001', 'Schedule closing', 3);

-- Stage 6: Closed
insert into stage_steps (id, stage_id, org_id, name, idx) values
  ('f4000000-0000-0000-0000-000000000024', 'f3000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000001', 'Funds disbursed', 0),
  ('f4000000-0000-0000-0000-000000000025', 'f3000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000001', 'Keys delivered', 1),
  ('f4000000-0000-0000-0000-000000000026', 'f3000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000001', 'Send thank-you / review request', 2),
  ('f4000000-0000-0000-0000-000000000027', 'f3000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000001', 'File closed', 3);

-- --------------------------------------------------------------------------
-- 5. DEALS (6 deals across stages)
-- --------------------------------------------------------------------------
insert into deals (id, org_id, address, client_name, client_email, client_phone, agent, stage_idx, stage_entered_at, active_entered_at, close_date, contract_close_date, price, type, status, notes) values
  -- Deal 1: Lead stage (Stage 0)
  ('a5000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   '742 Evergreen Terrace, Springfield, IL 62701',
   'Alice Henderson', 'alice@example.com', '+1-312-555-0101',
   'Emily Davis', 0,
   '2026-06-01 09:00:00+00', null, null, null, 425000, 'sale', 'active',
   'Inbound Zillow lead — wants to sell before fall'),
  -- Deal 2: Appointment stage (Stage 1)
  ('a5000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001',
   '123 Oak Lane, Denver, CO 80202',
   'Bob & Carol Martinez', 'bob.martinez@example.com', '+1-720-555-0202',
   'Sarah Chen', 1,
   '2026-05-28 14:00:00+00', null, null, null, 680000, 'sale', 'active',
   'Referral from past client — listing appointment scheduled for June 18'),
  -- Deal 3: Active stage (Stage 2)
  ('a5000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001',
   '456 Maple Drive, Austin, TX 78701',
   'David Nguyen', 'david.nguyen@example.com', '+1-512-555-0303',
   'Emily Davis', 2,
   '2026-05-15 10:00:00+00', '2026-05-15 10:00:00+00', null, null, 525000, 'sale', 'active',
   'Listing went live May 20 — 3 showings so far, positive feedback'),
  -- Deal 4: Under Contract (Stage 3)
  ('a5000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001',
   '789 Pine Street, Portland, OR 97201',
   'Grace Kim', 'grace.kim@example.com', '+1-503-555-0404',
   'Sarah Chen', 3,
   '2026-05-10 08:00:00+00', '2026-04-20 08:00:00+00', '2026-07-15', '2026-06-10',
   890000, 'sale', 'active',
   'Multiple offers — accepted $890k, 21-day close'),
  -- Deal 5: Inspection stage (Stage 4)
  ('a5000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001',
   '321 Birch Avenue, Seattle, WA 98101',
   'Frank & Lisa Torres', 'frank.torres@example.com', '+1-206-555-0505',
   'Emily Davis', 4,
   '2026-04-25 11:00:00+00', '2026-04-01 11:00:00+00', '2026-06-30', '2026-05-15',
   1120000, 'sale', 'active',
   'Inspection found minor roof issue — negotiating credit'),
  -- Deal 6: Closed (Stage 6)
  ('a5000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000001',
   '555 Cedar Court, Chicago, IL 60601',
   'Helen Park', 'helen.park@example.com', '+1-312-555-0606',
   'Emily Davis', 6,
   '2026-04-01 12:00:00+00', '2026-02-15 12:00:00+00', '2026-05-30', '2026-05-30',
   375000, 'sale', 'closed',
   'Smooth transaction — first-time buyer, closed on time');

-- --------------------------------------------------------------------------
-- 6. DEAL STEP STATUS (mark some steps complete)
-- --------------------------------------------------------------------------
-- Deal 3 (Active): steps completed
insert into deal_step_status (deal_id, step_id, completed, completed_at) values
  ('a5000000-0000-0000-0000-000000000003', 'f4000000-0000-0000-0000-000000000007', true, '2026-05-16 10:00:00+00'),
  ('a5000000-0000-0000-0000-000000000003', 'f4000000-0000-0000-0000-000000000008', true, '2026-05-18 14:00:00+00'),
  ('a5000000-0000-0000-0000-000000000003', 'f4000000-0000-0000-0000-000000000009', true, '2026-05-20 09:00:00+00');

-- Deal 4 (Under Contract): steps completed
insert into deal_step_status (deal_id, step_id, completed, completed_at) values
  ('a5000000-0000-0000-0000-000000000004', 'f4000000-0000-0000-0000-000000000011', true, '2026-05-05 15:00:00+00'),
  ('a5000000-0000-0000-0000-000000000004', 'f4000000-0000-0000-0000-000000000012', true, '2026-05-08 11:00:00+00'),
  ('a5000000-0000-0000-0000-000000000004', 'f4000000-0000-0000-0000-000000000013', true, '2026-05-10 08:00:00+00'),
  ('a5000000-0000-0000-0000-000000000004', 'f4000000-0000-0000-0000-000000000014', true, '2026-05-12 16:00:00+00');

-- Deal 5 (Inspection): some steps complete
insert into deal_step_status (deal_id, step_id, completed, completed_at) values
  ('a5000000-0000-0000-0000-000000000005', 'f4000000-0000-0000-0000-000000000015', true, '2026-04-26 09:00:00+00'),
  ('a5000000-0000-0000-0000-000000000005', 'f4000000-0000-0000-0000-000000000016', true, '2026-04-30 13:00:00+00');

-- Deal 6 (Closed): all steps complete
insert into deal_step_status (deal_id, step_id, completed, completed_at) values
  ('a5000000-0000-0000-0000-000000000006', 'f4000000-0000-0000-0000-000000000024', true, '2026-05-30 10:00:00+00'),
  ('a5000000-0000-0000-0000-000000000006', 'f4000000-0000-0000-0000-000000000025', true, '2026-05-30 14:00:00+00'),
  ('a5000000-0000-0000-0000-000000000006', 'f4000000-0000-0000-0000-000000000026', true, '2026-05-31 09:00:00+00'),
  ('a5000000-0000-0000-0000-000000000006', 'f4000000-0000-0000-0000-000000000027', true, '2026-06-05 12:00:00+00');

-- --------------------------------------------------------------------------
-- 7. STAGE HISTORY (track deal progression)
-- --------------------------------------------------------------------------
-- Deal 3: Lead → Appt → Active
insert into stage_history (deal_id, stage_idx, entered_at, exited_at) values
  ('a5000000-0000-0000-0000-000000000003', 0, '2026-05-01 09:00:00+00', '2026-05-10 14:00:00+00'),
  ('a5000000-0000-0000-0000-000000000003', 1, '2026-05-10 14:00:00+00', '2026-05-15 10:00:00+00'),
  ('a5000000-0000-0000-0000-000000000003', 2, '2026-05-15 10:00:00+00', null);

-- Deal 4: Lead → Appt → Active → Contract
insert into stage_history (deal_id, stage_idx, entered_at, exited_at) values
  ('a5000000-0000-0000-0000-000000000004', 0, '2026-04-01 08:00:00+00', '2026-04-10 10:00:00+00'),
  ('a5000000-0000-0000-0000-000000000004', 1, '2026-04-10 10:00:00+00', '2026-04-20 08:00:00+00'),
  ('a5000000-0000-0000-0000-000000000004', 2, '2026-04-20 08:00:00+00', '2026-05-10 08:00:00+00'),
  ('a5000000-0000-0000-0000-000000000004', 3, '2026-05-10 08:00:00+00', null);

-- Deal 5: Lead → Appt → Active → Contract → Inspection
insert into stage_history (deal_id, stage_idx, entered_at, exited_at) values
  ('a5000000-0000-0000-0000-000000000005', 0, '2026-03-01 11:00:00+00', '2026-03-15 11:00:00+00'),
  ('a5000000-0000-0000-0000-000000000005', 1, '2026-03-15 11:00:00+00', '2026-04-01 11:00:00+00'),
  ('a5000000-0000-0000-0000-000000000005', 2, '2026-04-01 11:00:00+00', '2026-04-20 11:00:00+00'),
  ('a5000000-0000-0000-0000-000000000005', 3, '2026-04-20 11:00:00+00', '2026-04-25 11:00:00+00'),
  ('a5000000-0000-0000-0000-000000000005', 4, '2026-04-25 11:00:00+00', null);

-- Deal 6: Full progression through to Closed
insert into stage_history (deal_id, stage_idx, entered_at, exited_at) values
  ('a5000000-0000-0000-0000-000000000006', 0, '2026-01-10 12:00:00+00', '2026-01-25 12:00:00+00'),
  ('a5000000-0000-0000-0000-000000000006', 1, '2026-01-25 12:00:00+00', '2026-02-15 12:00:00+00'),
  ('a5000000-0000-0000-0000-000000000006', 2, '2026-02-15 12:00:00+00', '2026-03-01 12:00:00+00'),
  ('a5000000-0000-0000-0000-000000000006', 3, '2026-03-01 12:00:00+00', '2026-03-20 12:00:00+00'),
  ('a5000000-0000-0000-0000-000000000006', 4, '2026-03-20 12:00:00+00', '2026-04-01 12:00:00+00'),
  ('a5000000-0000-0000-0000-000000000006', 5, '2026-04-01 12:00:00+00', '2026-05-30 12:00:00+00'),
  ('a5000000-0000-0000-0000-000000000006', 6, '2026-05-30 12:00:00+00', null);

-- --------------------------------------------------------------------------
-- 8. TASKS (property-level + brokerage-wide)
-- --------------------------------------------------------------------------
insert into tasks (id, org_id, deal_id, title, description, assigned_to, due_date, completed, recurrence) values
  -- Deal-specific tasks
  ('b6000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   'a5000000-0000-0000-0000-000000000001', 'Call Alice — initial discovery',
   'Learn timeline, motivation, property details',
   'e2000000-0000-0000-0000-000000000004', '2026-06-16 17:00:00+00', false, null),
  ('b6000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001',
   'a5000000-0000-0000-0000-000000000002', 'Prep listing presentation',
   'Comps, marketing plan, net sheet',
   'e2000000-0000-0000-0000-000000000001', '2026-06-17 12:00:00+00', false, null),
  ('b6000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001',
   'a5000000-0000-0000-0000-000000000003', 'Order professional photos',
   null,
   'e2000000-0000-0000-0000-000000000002', '2026-06-10 12:00:00+00', true, null),
  ('b6000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001',
   'a5000000-0000-0000-0000-000000000004', 'Deposit EMD with title company',
   'Confirm receipt and send to file',
   'e2000000-0000-0000-0000-000000000002', '2026-05-13 17:00:00+00', true, null),
  ('b6000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001',
   'a5000000-0000-0000-0000-000000000005', 'Schedule roof repair estimate',
   'Need 2 bids from licensed contractors',
   'e2000000-0000-0000-0000-000000000004', '2026-06-20 17:00:00+00', false, null),
  -- Brokerage-wide tasks (no deal_id)
  ('b6000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000001',
   null, 'Team standup — weekly sync',
   'Review pipeline, blockers, wins',
   'e2000000-0000-0000-0000-000000000003', '2026-06-16 10:00:00+00', false, 'weekly'),
  ('b6000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000001',
   null, 'Send monthly newsletter',
   'Market update + recent closings',
   'e2000000-0000-0000-0000-000000000001', '2026-06-25 17:00:00+00', false, 'monthly');

-- --------------------------------------------------------------------------
-- 9. OWNERS (4 owners to call)
-- --------------------------------------------------------------------------
insert into owners (id, org_id, full_name, email, phone, property_address, notes) values
  ('c7000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   'Alice Henderson', 'alice@example.com', '+1-312-555-0101',
   '742 Evergreen Terrace, Springfield, IL 62701',
   'Considering selling — inherited property, needs guidance on market timing'),
  ('c7000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001',
   'Bob Martinez', 'bob.martinez@example.com', '+1-720-555-0202',
   '123 Oak Lane, Denver, CO 80202',
   'Empty nester looking to downsize — referred by past client'),
  ('c7000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001',
   'Grace Kim', 'grace.kim@example.com', '+1-503-555-0404',
   '789 Pine Street, Portland, OR 97201',
   'Relocating for work, motivated seller, under contract already'),
  ('c7000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001',
   'Helen Park', 'helen.park@example.com', '+1-312-555-0606',
   '555 Cedar Court, Chicago, IL 60601',
   'Closed — follow-up call for review / referral');

-- --------------------------------------------------------------------------
-- 10. CHECKINS (calls with owners)
-- --------------------------------------------------------------------------
insert into checkins (id, owner_id, scheduled_date, scheduled_time, status, booking_link, stage_idx_at_call, raw_notes, ai_summary, combined_summary, sentiment, recording_url, transcript_url, call_date) values
  -- Checkin 1: Scheduled (upcoming)
  ('d8000000-0000-0000-0000-000000000001', 'c7000000-0000-0000-0000-000000000001',
   '2026-06-18', '14:00:00', 'scheduled',
   'https://cal.com/peak-realty/alice-discovery', 0,
   null, null, null, null, null, null, null),
  -- Checkin 2: Completed — positive
  ('d8000000-0000-0000-0000-000000000002', 'c7000000-0000-0000-0000-000000000002',
   '2026-06-10', '10:00:00', 'completed',
   'https://cal.com/peak-realty/bob-listing', 1,
   'Bob is motivated to sell. Wants to list by July. Home needs minor staging. Discussed comps in the $650-700k range. He is interviewing 2 other agents but liked our marketing plan.',
   'Owner Bob Martinez is a motivated seller targeting a July listing. Property at 123 Oak Lane needs minor staging. Price expectation aligned at $650-700k. Competition: interviewing 2 other agents. Recommendation: follow up with the listing presentation and a staging vendor referral within 48 hours.',
   'Bob Martinez — 123 Oak Lane, Denver. MOTIVATED SELLER. Wants to list by July. Price range: $650-700k. Staging needed. Competing with 2 other agents. Next step: send listing presentation + stage referral, follow up by June 12.',
   'pos',
   'https://storage.example.com/recordings/checkin-d8000002.mp3',
   'https://storage.example.com/transcripts/checkin-d8000002.txt',
   '2026-06-10 10:05:00+00'),
  -- Checkin 3: Completed — neutral (inspection updates)
  ('d8000000-0000-0000-0000-000000000003', 'c7000000-0000-0000-0000-000000000003',
   '2026-06-08', '11:00:00', 'completed',
   'https://cal.com/peak-realty/grace-contract-update', 4,
   'Grace is anxious about the roof issue but understands the credit option. Appraisal came in at value. She''s already packed most of the house. Moving date is July 20.',
   'Owner Grace Kim expressed some anxiety about the inspection finding (minor roof issue) but is receptive to the credit option. Appraisal came in at contract value — no issues there. She is on track with packing for her July 20 relocation. Overall sentiment neutral — some stress but no deal risk.',
   'Grace Kim — 789 Pine Street. INSPECTION: roof credit negotiation in progress. Appraisal OK. Packing on track. Relocation July 20. Anxiety level: moderate. No deal risk.',
   'neu',
   'https://storage.example.com/recordings/checkin-d8000003.mp3',
   'https://storage.example.com/transcripts/checkin-d8000003.txt',
   '2026-06-08 11:10:00+00'),
  -- Checkin 4: Completed — positive (post-close)
  ('d8000000-0000-0000-0000-000000000004', 'c7000000-0000-0000-0000-000000000004',
   '2026-06-02', '15:00:00', 'completed',
   'https://cal.com/peak-realty/helen-post-close', 6,
   'Helen is thrilled with the home. Closing was smooth. She appreciated the weekly updates during the process. She mentioned her sister may be looking to buy next year — potential referral. Asked about home warranty registration.',
   'Owner Helen Park is extremely satisfied with her purchase and the transaction process. She specifically praised the weekly communication cadence. Potential referral: sister looking to buy in 2027. Action item: send home warranty registration link.',
   'Helen Park — 555 Cedar Court. CLOSED. Extremely satisfied. Praised weekly updates. Referral opportunity: sister buying next year. Action: send warranty link + schedule 6-month check-in.',
   'pos',
   'https://storage.example.com/recordings/checkin-d8000004.mp3',
   'https://storage.example.com/transcripts/checkin-d8000004.txt',
   '2026-06-02 15:10:00+00');

-- --------------------------------------------------------------------------
-- 11. CHECKIN ACTIONS (action items from checkin calls)
-- --------------------------------------------------------------------------
insert into checkin_actions (id, checkin_id, description, completed, completed_at, assigned_to) values
  -- From Bob's checkin
  ('e9000000-0000-0000-0000-000000000001', 'd8000000-0000-0000-0000-000000000002',
   'Send listing presentation deck to Bob', false, null,
   'e2000000-0000-0000-0000-000000000001'),
  ('e9000000-0000-0000-0000-000000000002', 'd8000000-0000-0000-0000-000000000002',
   'Refer staging vendor (Staged Perfectly Inc)', false, null,
   'e2000000-0000-0000-0000-000000000001'),
  ('e9000000-0000-0000-0000-000000000003', 'd8000000-0000-0000-0000-000000000002',
   'Follow up call by June 12', false, null,
   'e2000000-0000-0000-0000-000000000001'),
  -- From Grace's checkin
  ('e9000000-0000-0000-0000-000000000004', 'd8000000-0000-0000-0000-000000000003',
   'Get second roof estimate from licensed contractor', false, null,
   'e2000000-0000-0000-0000-000000000004'),
  ('e9000000-0000-0000-0000-000000000005', 'd8000000-0000-0000-0000-000000000003',
   'Confirm credit amount with buyer agent', false, null,
   'e2000000-0000-0000-0000-000000000004'),
  -- From Helen's checkin
  ('e9000000-0000-0000-0000-000000000006', 'd8000000-0000-0000-0000-000000000004',
   'Send home warranty registration link', true, '2026-06-03 09:00:00+00',
   'e2000000-0000-0000-0000-000000000002'),
  ('e9000000-0000-0000-0000-000000000007', 'd8000000-0000-0000-0000-000000000004',
   'Schedule 6-month check-in call (Dec 2026)', false, null,
   'e2000000-0000-0000-0000-000000000004');

-- --------------------------------------------------------------------------
-- 12. SUMMARY TEMPLATES
-- --------------------------------------------------------------------------
insert into summary_templates (id, org_id, name, stage_idx, content) values
  ('f0000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   'Discovery Call Summary', 0,
   'OWNER_NAME — PROPERTY_ADDRESS. TIMELINE. MOTIVATION. Price expectation: PRICE_RANGE. Next step: NEXT_ACTION.'),
  ('f0000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001',
   'Listing Appointment Summary', 1,
   'OWNER_NAME — PROPERTY_ADDRESS. Comps discussed: COMP_RANGE. Staging needs: STAGING. Competition: COMPETITION. Next step: NEXT_ACTION.'),
  ('f0000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001',
   'Contract Update Summary', 3,
   'OWNER_NAME — PROPERTY_ADDRESS. CONTRACT_STATUS. Key dates: DATES. Action items: ACTIONS.'),
  ('f0000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001',
   'Post-Close Summary', 6,
   'OWNER_NAME — PROPERTY_ADDRESS. CLOSED. Satisfaction: SATISFACTION. Referral opportunity: REFERRAL. Action items: ACTIONS.');

-- --------------------------------------------------------------------------
-- 13. EMAIL FLAGS (3 AI-triaged emails)
-- --------------------------------------------------------------------------
insert into email_flags (id, org_id, deal_id, from_email, subject, body_snippet, flag_type, ai_summary, triaged, triaged_at) values
  ('a0000000-0000-0000-0000-100000000001', 'd1000000-0000-0000-0000-000000000001',
   'a5000000-0000-0000-0000-000000000004', 'buyers.agent@compass.com',
   'Offer submitted — 789 Pine Street',
   'Please find attached our clients offer of $875,000 with 20% down, 30-day close, inspection contingency waived...',
   'offer',
   'Buyer agent submitted an offer for 789 Pine Street: $875k, 20% down, 30-day close, waived inspection contingency. Below asking but strong terms.',
   true, '2026-05-05 14:00:00+00'),
  ('a0000000-0000-0000-0000-100000000002', 'd1000000-0000-0000-0000-000000000001',
   'a5000000-0000-0000-0000-000000000005', 'inspector@homecheckpro.com',
   'Inspection report ready — 321 Birch Avenue',
   'The inspection report for 321 Birch Avenue is complete. Key findings: minor roof damage on north slope, estimated repair $2,500...',
   'inspection',
   'Inspection report for 321 Birch Ave: minor roof damage ($2,500 est.), no structural issues. Recommend roof credit negotiation.',
   true, '2026-04-29 16:00:00+00'),
  ('a0000000-0000-0000-0000-100000000003', 'd1000000-0000-0000-0000-000000000001',
   null, 'potential.buyer@gmail.com',
   'Question about 456 Maple Drive listing',
   'Hi, I saw your listing for 456 Maple Drive. Is the property still available? We are pre-approved and would like to schedule a showing this weekend...',
   'question',
   'Prospective buyer inquiry for 456 Maple Drive (Active listing). Pre-approved, wants weekend showing. Route to Emily Davis.',
   false, null);

-- --------------------------------------------------------------------------
-- 14. SHOWINGS (with feedback)
-- --------------------------------------------------------------------------
insert into showings (id, deal_id, org_id, scheduled_at, buyer_name, buyer_email, buyer_phone, status, notes) values
  -- Showing 1: Completed with feedback
  ('b0000000-0000-0000-0000-100000000001', 'a5000000-0000-0000-0000-000000000003',
   'd1000000-0000-0000-0000-000000000001',
   '2026-05-22 14:00:00+00', 'James Wilson', 'jwilson@example.com', '+1-512-555-0707',
   'completed', 'Loved the kitchen and backyard. Concerned about proximity to highway noise.'),
  -- Showing 2: Completed with feedback
  ('b0000000-0000-0000-0000-100000000002', 'a5000000-0000-0000-0000-000000000003',
   'd1000000-0000-0000-0000-000000000001',
   '2026-05-24 10:00:00+00', 'Maria Rodriguez', 'maria.r@example.com', '+1-512-555-0808',
   'completed', 'Very interested. Wants to bring spouse for second showing. Asked about school district boundaries.'),
  -- Showing 3: Scheduled (upcoming)
  ('b0000000-0000-0000-0000-100000000003', 'a5000000-0000-0000-0000-000000000003',
   'd1000000-0000-0000-0000-000000000001',
   '2026-06-17 15:30:00+00', 'Tom & Jennifer Lee', 'tomlee@example.com', '+1-512-555-0909',
   'scheduled', 'Pre-approved buyers relocating from San Francisco.');

-- --------------------------------------------------------------------------
-- 15. FEEDBACK DRAFTS
-- --------------------------------------------------------------------------
insert into feedback_drafts (id, showing_id, from_email, content, submitted, submitted_at) values
  -- James Wilson feedback
  ('c0000000-0000-0000-0000-100000000001', 'b0000000-0000-0000-0000-100000000001',
   'jwilson@example.com',
   'Beautiful home! The kitchen renovation is stunning and the backyard is perfect for entertaining. Our only concern is the highway noise from the east side — we''d want to check decibel levels. Overall rating: 8/10.',
   true, '2026-05-22 20:00:00+00'),
  ('c0000000-0000-0000-0000-100000000002', 'b0000000-0000-0000-0000-100000000001',
   'emily.davis@peakrealty.com',
   'Buyer James Wilson liked the kitchen and yard but flagged highway noise. I''d suggest a noise check during rush hour for future showings. He''s seeing 2 other properties this week.',
   true, '2026-05-22 18:30:00+00'),
  -- Maria Rodriguez feedback
  ('c0000000-0000-0000-0000-100000000003', 'b0000000-0000-0000-0000-100000000002',
   'maria.r@example.com',
   'We love this house! It checks all our boxes — open floorplan, great natural light, and the Maple Drive neighborhood is exactly where we want to be. Planning to bring my husband for a second showing on Saturday. Rating: 9/10.',
   true, '2026-05-24 14:00:00+00');

-- --------------------------------------------------------------------------
-- 16. INTEGRATIONS
-- --------------------------------------------------------------------------
insert into integrations (id, org_id, provider, config, enabled) values
  ('d0000000-0000-0000-0000-100000000001', 'd1000000-0000-0000-0000-000000000001',
   'vapi',
   '{"phone_number_id": "vapi-pn-001", "assistant_id": "vapi-asst-transactops"}',
   true),
  ('d0000000-0000-0000-0000-100000000002', 'd1000000-0000-0000-0000-000000000001',
   'google_calendar',
   '{"calendar_id": "peakrealty@group.calendar.google.com", "sync_enabled": true}',
   true);

commit;
