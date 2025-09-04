-- V1__init.sql
-- Core schema for users, teams, and team_pokemon

-- 1) Users: store the owner of teams (IDs match your frontend's string userId)
CREATE TABLE IF NOT EXISTS users (
  id           VARCHAR(100) PRIMARY KEY,
  display_name VARCHAR(60)  NOT NULL,
  email        VARCHAR(255) NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 2) Teams: accept client-provided string IDs (nanoid). Scope by user_id.
CREATE TABLE IF NOT EXISTS teams (
  id         VARCHAR(64)  PRIMARY KEY,         -- nanoid is ~21 chars; 64 gives us room
  user_id    VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(30)  NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Speed up lookups by user
CREATE INDEX IF NOT EXISTS idx_teams_user_id ON teams(user_id);

-- 3) Team Pokémon: snapshot display data; prevent dupes within a team.
CREATE TABLE IF NOT EXISTS team_pokemon (
  team_id    VARCHAR(64)  NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  pokemon_id INT          NOT NULL,            -- Pokédex ID
  name       VARCHAR(60)  NOT NULL,
  sprite     VARCHAR(300) NOT NULL,
  types      JSONB        NOT NULL,            -- e.g. ["fire","flying"]
  PRIMARY KEY (team_id, pokemon_id)
);

CREATE INDEX IF NOT EXISTS idx_team_pokemon_team_id ON team_pokemon(team_id);

-- 4) Auto-update updated_at on changes (handy for auditing)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_teams_updated_at ON teams;
CREATE TRIGGER trg_teams_updated_at
BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
