-- PromptX Supabase Schema
-- Run this in your Supabase SQL Editor (supabase.com → your project → SQL Editor)

CREATE TABLE IF NOT EXISTS users (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT      NOT NULL,
  email      TEXT      UNIQUE NOT NULL,
  password_hash TEXT   NOT NULL,
  is_pro     BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prompts (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT    NOT NULL,
  description TEXT    NOT NULL,
  category    TEXT    NOT NULL CHECK (category IN ('image', 'video', 'website')),
  preview_url TEXT    NOT NULL,
  prompt_text TEXT    NOT NULL,
  ai_tool     TEXT    NOT NULL,
  tags        JSONB   NOT NULL DEFAULT '[]',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_free     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Optional audit log of Pro purchases
CREATE TABLE IF NOT EXISTS pro_purchases (
  id                BIGSERIAL PRIMARY KEY,
  user_id           BIGINT NOT NULL REFERENCES users(id),
  stripe_session_id TEXT   NOT NULL UNIQUE,
  amount_cents      INTEGER NOT NULL DEFAULT 1000,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
