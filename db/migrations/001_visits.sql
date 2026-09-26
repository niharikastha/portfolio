-- Run once against your Vercel Postgres (or any Postgres) database:
--   psql "$POSTGRES_URL" -f db/migrations/001_visits.sql

CREATE TABLE IF NOT EXISTS visits (
  id           BIGSERIAL PRIMARY KEY,
  seen_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip           TEXT,
  user_agent   TEXT,
  country      TEXT,
  city         TEXT,
  region       TEXT,
  referrer     TEXT,
  path         TEXT NOT NULL,
  session_id   TEXT
);

CREATE INDEX IF NOT EXISTS visits_seen_at_idx ON visits (seen_at DESC);
CREATE INDEX IF NOT EXISTS visits_ip_idx      ON visits (ip);
CREATE INDEX IF NOT EXISTS visits_session_idx ON visits (session_id);
