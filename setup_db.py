"""Create TransactOps schema cleanly, handling TAP Hub conflicts."""
import psycopg2, urllib.parse

PASSWORD = "NsHd9sN7FnP3Tpae"
REF = "phgogybfgovrlcdmifpv"

dsn = f"postgresql://postgres:{urllib.parse.quote_plus(PASSWORD)}@db.{REF}.supabase.co:6543/postgres"
conn = psycopg2.connect(dsn)
conn.autocommit = True
cur = conn.cursor()

# Create missing helper functions
cur.execute("""
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = now(); RETURN NEW; END;
    $$ LANGUAGE plpgsql
""")

cur.execute("""
    CREATE OR REPLACE FUNCTION add_updated_at_trigger(tbl text)
    RETURNS void AS $$
    BEGIN
        EXECUTE format(
            'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
            tbl
        );
    END;
    $$ LANGUAGE plpgsql
""")

# Create tables in dependency order
TABLES = [
    # (name, sql)
    ("organizations", """
        CREATE TABLE IF NOT EXISTS organizations (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            name text NOT NULL,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        )
    """),
    ("stages", """
        CREATE TABLE IF NOT EXISTS stages (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
            name text NOT NULL,
            idx smallint NOT NULL CHECK (idx BETWEEN 0 AND 6),
            description text,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE(org_id, idx)
        )
    """),
    ("stage_steps", """
        CREATE TABLE IF NOT EXISTS stage_steps (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            stage_id uuid NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
            org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
            name text NOT NULL,
            idx smallint NOT NULL DEFAULT 0,
            description text,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        )
    """),
    ("deals", """
        CREATE TABLE IF NOT EXISTS deals (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
            address text NOT NULL,
            client_name text NOT NULL,
            client_email text,
            client_phone text,
            agent text NOT NULL,
            stage_idx smallint NOT NULL DEFAULT 0 CHECK (stage_idx BETWEEN 0 AND 6),
            stage_entered_at timestamptz NOT NULL DEFAULT now(),
            active_entered_at timestamptz,
            close_date date,
            contract_close_date date,
            price numeric(12,2),
            type text NOT NULL DEFAULT 'sale' CHECK (type IN ('sale','lease')),
            status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','closed','withdrawn','lost')),
            notes text,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        )
    """),
    ("deal_step_status", """
        CREATE TABLE IF NOT EXISTS deal_step_status (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
            step_id uuid NOT NULL REFERENCES stage_steps(id) ON DELETE CASCADE,
            completed boolean NOT NULL DEFAULT false,
            completed_at timestamptz,
            notes text,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE(deal_id, step_id)
        )
    """),
    ("stage_history", """
        CREATE TABLE IF NOT EXISTS stage_history (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
            stage_idx smallint NOT NULL CHECK (stage_idx BETWEEN 0 AND 6),
            entered_at timestamptz NOT NULL DEFAULT now(),
            exited_at timestamptz,
            created_at timestamptz NOT NULL DEFAULT now()
        )
    """),
    ("tasks", """
        CREATE TABLE IF NOT EXISTS tasks (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
            deal_id uuid REFERENCES deals(id) ON DELETE SET NULL,
            title text NOT NULL,
            description text,
            assigned_to uuid,
            due_date timestamptz,
            completed boolean NOT NULL DEFAULT false,
            completed_at timestamptz,
            recurrence text,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        )
    """),
    ("owners", """
        CREATE TABLE IF NOT EXISTS owners (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
            full_name text NOT NULL,
            email text,
            phone text,
            property_address text NOT NULL,
            notes text,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        )
    """),
    ("checkins", """
        CREATE TABLE IF NOT EXISTS checkins (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
            scheduled_date date NOT NULL,
            scheduled_time time,
            status text NOT NULL DEFAULT 'awaiting' CHECK (status IN ('awaiting','scheduled','completed','noshow')),
            booking_link text,
            stage_idx_at_call smallint,
            raw_notes text,
            ai_summary text,
            combined_summary text,
            sentiment text CHECK (sentiment IN ('pos','neu','neg')),
            recording_url text,
            transcript_url text,
            call_date timestamptz,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        )
    """),
    ("checkin_actions", """
        CREATE TABLE IF NOT EXISTS checkin_actions (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            checkin_id uuid NOT NULL REFERENCES checkins(id) ON DELETE CASCADE,
            description text NOT NULL,
            completed boolean NOT NULL DEFAULT false,
            completed_at timestamptz,
            assigned_to uuid,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        )
    """),
    ("email_flags", """
        CREATE TABLE IF NOT EXISTS email_flags (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
            deal_id uuid REFERENCES deals(id) ON DELETE SET NULL,
            from_email text NOT NULL,
            subject text,
            body_snippet text,
            flag_type text NOT NULL,
            ai_summary text,
            triaged boolean NOT NULL DEFAULT false,
            triaged_at timestamptz,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        )
    """),
]

for name, ddl in TABLES:
    cur.execute(ddl)
    print(f"  ✓ {name}")

# Add triggers (skip if table just created via IF NOT EXISTS but had no trigger)
for name, _ in TABLES:
    if name in ('stage_history', 'organizations'):  # no updated_at triggers for these
        continue
    try:
        cur.execute(f"SELECT add_updated_at_trigger('{name}')")
    except Exception:
        pass  # trigger already exists

print("\nAll tables created!")

# Verify
for name, _ in TABLES:
    cur.execute(f"SELECT count(*) FROM {name}")
    print(f"  {name}: {cur.fetchone()[0]} rows")

cur.close()
conn.close()
