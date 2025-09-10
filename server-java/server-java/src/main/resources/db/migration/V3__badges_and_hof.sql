-- V3__badges_and_hof.sql
-- Hall of Fame (immutable snapshots) + User Badges (aggregated per version)

-- Use pgcrypto for UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Hall of Fame entries
CREATE TABLE IF NOT EXISTS hall_of_fame_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_name   VARCHAR(30)  NOT NULL,
  earned_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  power_score INT          NOT NULL,
  badges      TEXT[]       NOT NULL DEFAULT '{}',   -- list of badge names at the time
  snapshot    JSONB        NOT NULL,                -- { teamId?, pokemon: [{id,name,sprite,types}] }
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hof_user_id ON hall_of_fame_entries(user_id);

-- 2) User badges (aggregated by name + badge_version)
CREATE TABLE IF NOT EXISTS user_badges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(100) NOT NULL,             -- e.g., "First Team", "Full Squad"
  description   VARCHAR(300) NOT NULL,
  earned_at     TIMESTAMPTZ  NOT NULL DEFAULT now(), -- last time this badge (version) was earned
  count         INT          NOT NULL DEFAULT 1 CHECK (count >= 1),
  badge_version INT          NOT NULL DEFAULT 1,
  hof_entry_id  UUID         NULL REFERENCES hall_of_fame_entries(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_badge UNIQUE (user_id, name, badge_version) -- aggregate by version
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- 3) updated_at triggers
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_hof_updated_at ON hall_of_fame_entries;
CREATE TRIGGER trg_hof_updated_at
BEFORE UPDATE ON hall_of_fame_entries
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_user_badges_updated_at ON user_badges;
CREATE TRIGGER trg_user_badges_updated_at
BEFORE UPDATE ON user_badges
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
