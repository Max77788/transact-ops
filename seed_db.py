"""Seed TransactOps with demo data, using existing TAP Hub profiles."""
import psycopg2, urllib.parse

PASSWORD = "NsHd9sN7FnP3Tpae"
dsn = f"postgresql://postgres:{urllib.parse.quote_plus(PASSWORD)}@db.phgogybfgovrlcdmifpv.supabase.co:6543/postgres"
conn = psycopg2.connect(dsn)
conn.autocommit = True
cur = conn.cursor()

ORG_ID = "d1000000-0000-0000-0000-000000000001"

# 1. Organization
cur.execute(
    "INSERT INTO organizations (id, name) VALUES (%s, %s) ON CONFLICT DO NOTHING",
    (ORG_ID, "Peak Realty Group")
)

# 2. Use existing TAP Hub profiles (they already have IDs from auth.users)
cur.execute("SELECT id, full_name FROM profiles WHERE active = true ORDER BY full_name")
existing = cur.fetchall()
print(f"Existing profiles: {[(r[0][:8], r[1]) for r in existing]}")

# Map profile names for seed
profile_map = {}
for pid, name in existing:
    if "Terry" in name:
        profile_map["terry"] = pid
    elif "Lindsay" in name:
        profile_map["lindsay"] = pid
    elif "Misty" in name:
        profile_map["misty"] = pid
    elif "Jill" in name:
        profile_map["jill"] = pid
    elif "Aaron" in name:
        profile_map["aaron"] = pid
    elif "Paula" in name:
        profile_map["paula"] = pid

# Update profiles with org_id and user_id
for key, pid in profile_map.items():
    cur.execute("UPDATE profiles SET org_id = %s, user_id = %s WHERE id = %s", (ORG_ID, pid, pid))

# 3. Stages (idx 0..6)
stages_data = [
    (0, "Lead", "New lead, not yet contacted"),
    (1, "Active", "Under contract or actively working"),
    (2, "Closing Prep", "Preparing for closing"),
    (3, "Closed", "Deal closed successfully"),
    (4, "Post-Close", "Follow-up and referrals"),
    (5, "On Hold", "Temporarily paused"),
    (6, "Lost", "Deal lost or withdrawn"),
]
stage_ids = {}
for idx, name, desc in stages_data:
    cur.execute(
        "INSERT INTO stages (org_id, name, idx, description) VALUES (%s, %s, %s, %s) RETURNING id",
        (ORG_ID, name, idx, desc)
    )
    stage_ids[idx] = cur.fetchone()[0]

# 4. Stage steps
steps_data = [
    (0, 0, "Initial contact made"),
    (0, 1, "Property info sent"),
    (1, 0, "Contract signed"),
    (1, 1, "Inspection scheduled"),
    (1, 2, "Appraisal ordered"),
    (2, 0, "Title report reviewed"),
    (2, 1, "Final walkthrough"),
    (3, 0, "Closing docs signed"),
    (3, 1, "Funds disbursed"),
]
step_ids = []
for stage_idx, step_idx, name in steps_data:
    cur.execute(
        "INSERT INTO stage_steps (stage_id, org_id, name, idx) VALUES (%s, %s, %s, %s) RETURNING id",
        (stage_ids[stage_idx], ORG_ID, name, step_idx)
    )
    step_ids.append(cur.fetchone()[0])

# 5. Deals
deals_data = [
    ("1428 Elm Street", "Robert & Janet Miller", "Sarah Chen", 1, "sale", "active"),
    ("3200 Oak Grove Ave", "Diana Park", "Mark Reynolds", 2, "sale", "active"),
    ("755 River Bend Dr", "Greenfield Holdings LLC", "David Chen", 1, "lease", "active"),
    ("2100 Pine Street #4B", "Williams Family Trust", "Jessica Torres", 3, "sale", "active"),
    ("88 Harbor View Ln", "Andre & Chloe Moreau", "Lisa Park", 1, "sale", "active"),
]
deal_ids = {}
for addr, client, agent, stage_idx, dtype, status in deals_data:
    cur.execute(
        """INSERT INTO deals (org_id, address, client_name, agent, stage_idx, type, status)
           VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
        (ORG_ID, addr, client, agent, stage_idx, dtype, status)
    )
    deal_ids[addr] = cur.fetchone()[0]

# 6. Tasks (property-level + brokerage-wide)
assignees = list(profile_map.values())
tasks_data = [
    # 1428 Elm Street
    ("1428 Elm Street", "Send disclosure packet to buyer's agent", "high", 0, "once"),
    ("1428 Elm Street", "Follow up on pre-approval letter from lender", "med", 1, "once"),
    ("1428 Elm Street", "Update MLS listing with new photos", "low", 0, "once"),
    # 3200 Oak Grove Ave
    ("3200 Oak Grove Ave", "Confirm open house staffing for Saturday", "high", 1, "once"),
    ("3200 Oak Grove Ave", "Send showing feedback summary to sellers", "med", 0, "weekly"),
    # 755 River Bend Dr
    ("755 River Bend Dr", "Prepare counter-offer for review", "high", 2, "once"),
    ("755 River Bend Dr", "Send comps analysis to seller", "low", 2, "once"),
    # 2100 Pine Street #4B
    ("2100 Pine Street #4B", "Finalize purchase agreement language", "med", 3, "once"),
    # 88 Harbor View Ln
    ("88 Harbor View Ln", "Schedule buyer consultation call", "high", 4, "once"),
    # Brokerage-wide (no deal)
    (None, "Review weekly pipeline report", "med", 0, "weekly"),
    (None, "Update team availability calendar", "low", 1, "daily"),
    (None, "Send Monday morning team update", "med", 2, "weekly"),
]

for addr, title, priority, assignee_idx, recurrence in tasks_data:
    a = assignees[assignee_idx % len(assignees)]
    d = deal_ids.get(addr) if addr else None
    cur.execute(
        """INSERT INTO tasks (org_id, deal_id, title, assigned_to, recurrence)
           VALUES (%s, %s, %s, %s, %s)""",
        (ORG_ID, d, title, a, recurrence)
    )

# 7. Owners + Checkins
owners_data = [
    ("Robert & Janet Miller", "1428 Elm Street", "310-555-0121"),
    ("Diana Park", "3200 Oak Grove Ave", "503-555-0342"),
    ("Greenfield Holdings LLC", "755 River Bend Dr", "213-555-0789"),
    ("Williams Family Trust", "2100 Pine Street #4B", "512-555-0456"),
    ("Andre & Chloe Moreau", "88 Harbor View Ln", "415-555-0891"),
]

import datetime
for name, addr, phone in owners_data:
    cur.execute(
        "INSERT INTO owners (org_id, full_name, property_address, phone) VALUES (%s, %s, %s, %s) RETURNING id",
        (ORG_ID, name, addr, phone)
    )
    owner_id = cur.fetchone()[0]
    # Create a checkin
    d = datetime.date.today() + datetime.timedelta(days=7)
    cur.execute(
        "INSERT INTO checkins (owner_id, scheduled_date, status) VALUES (%s, %s, 'awaiting')",
        (owner_id, d.isoformat())
    )

# Count results
for tbl in ['organizations','stages','stage_steps','deals','tasks','owners','checkins']:
    cur.execute(f"SELECT count(*) FROM {tbl}")
    print(f"  {tbl}: {cur.fetchone()[0]} rows")

cur.close()
conn.close()
print("\nSeed complete!")
