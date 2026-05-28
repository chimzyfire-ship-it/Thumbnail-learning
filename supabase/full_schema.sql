-- ============================================================
-- AETHEL SOLUTIONS — COMPLETE DATABASE SCHEMA
-- Run this entire file once in Supabase SQL Editor.
-- Every statement is idempotent (safe to re-run).
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- TABLE 1: public.users
-- Mirrors auth.users with extra profile fields.
-- Auto-populated via trigger on sign-up.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name  TEXT,
  last_name   TEXT,
  email       TEXT,
  username    TEXT,
  bio         TEXT,
  avatar_url  TEXT,
  xp          INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first so we can re-create cleanly
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own profile"   ON public.users;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
  DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
END $$;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE TO authenticated
  USING (auth.uid() = id);


-- ── Auto-create profile on sign-up ───────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- TABLE 2: public.user_progress
-- One row per user. Stores all learning progress as JSONB.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core arrays (stored as JSON arrays of topic-id strings)
  started_topics          JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_topics        JSONB NOT NULL DEFAULT '[]'::jsonb,
  activity_dates          JSONB NOT NULL DEFAULT '[]'::jsonb,
  activity_log            JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_active_topic_id    TEXT,

  -- Rich per-topic state map: { [topicId]: TopicState }
  topic_states            JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Aggregates (denormalised for fast reads)
  total_study_seconds     INTEGER NOT NULL DEFAULT 0,
  last_completed_topic_id TEXT,
  last_completed_at       TIMESTAMPTZ,
  last_synced_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_progress
  ADD COLUMN IF NOT EXISTS started_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS completed_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS activity_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS activity_log JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS last_active_topic_id TEXT,
  ADD COLUMN IF NOT EXISTS topic_states JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS total_study_seconds INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_completed_topic_id TEXT,
  ADD COLUMN IF NOT EXISTS last_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own progress"   ON public.user_progress;
  DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
  DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
END $$;

CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);


-- ── Auto-create progress row on sign-up ──────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_progress (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_progress ON auth.users;
CREATE TRIGGER on_auth_user_created_progress
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_progress();


-- ============================================================
-- TABLE 3: public.courses
-- Course catalogue (metadata only; content lives in code).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE,
  title       TEXT NOT NULL,
  description TEXT,
  tier        INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Courses are viewable by everyone" ON public.courses;
END $$;

CREATE POLICY "Courses are viewable by everyone"
  ON public.courses FOR SELECT TO authenticated, anon
  USING (true);


-- ============================================================
-- TABLE 4: public.lessons
-- Individual lesson records (video URL, transcript, order).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  topic_id    TEXT,           -- matches the topic id used in course-data.ts
  module_id   TEXT,           -- matches the module id used in course-data.ts
  module_title TEXT,
  title       TEXT NOT NULL,
  video_url   TEXT,
  transcript  TEXT,
  cheat_sheet_html TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  published   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS module_id TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS module_title TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS cheat_sheet_html TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;
CREATE UNIQUE INDEX IF NOT EXISTS lessons_topic_id_unique ON public.lessons (topic_id) WHERE topic_id IS NOT NULL;

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.lessons;
END $$;

CREATE POLICY "Lessons are viewable by everyone"
  ON public.lessons FOR SELECT TO authenticated, anon
  USING (true);


-- ============================================================
-- TABLE 5: public.notifications
-- In-app notifications for users (streaks, badges, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,          -- 'streak', 'badge', 'module_complete', 'info'
  title      TEXT NOT NULL,
  body       TEXT,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own notifications"   ON public.notifications;
  DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
END $$;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- TABLE 6: public.module_completions
-- Records when a user finishes every topic in a module.
-- Used for badges / certificates.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.module_completions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id    TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id)
);

ALTER TABLE public.module_completions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own completions"   ON public.module_completions;
  DROP POLICY IF EXISTS "Users can insert own completions" ON public.module_completions;
END $$;

CREATE POLICY "Users can view own completions"
  ON public.module_completions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON public.module_completions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- TABLE 7: public.study_materials
-- User-owned files and saved links for Study Space.
-- Files live in private Supabase Storage; this table stores metadata.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.study_materials (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category     TEXT NOT NULL DEFAULT 'other',
  name         TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  url          TEXT,
  storage_path TEXT,
  mime_type    TEXT,
  size_bytes   BIGINT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS study_materials_user_created_idx
  ON public.study_materials (user_id, created_at DESC);

ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own study materials"   ON public.study_materials;
  DROP POLICY IF EXISTS "Users can insert own study materials" ON public.study_materials;
  DROP POLICY IF EXISTS "Users can update own study materials" ON public.study_materials;
  DROP POLICY IF EXISTS "Users can delete own study materials" ON public.study_materials;
END $$;

CREATE POLICY "Users can view own study materials"
  ON public.study_materials FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study materials"
  ON public.study_materials FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study materials"
  ON public.study_materials FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study materials"
  ON public.study_materials FOR DELETE TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- TABLE 8: public.ai_usage
-- Simple daily usage counter for the built-in AI helper.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  request_count INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, usage_date)
);

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own AI usage"   ON public.ai_usage;
  DROP POLICY IF EXISTS "Users can insert own AI usage" ON public.ai_usage;
  DROP POLICY IF EXISTS "Users can update own AI usage" ON public.ai_usage;
END $$;

CREATE POLICY "Users can view own AI usage"
  ON public.ai_usage FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI usage"
  ON public.ai_usage FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI usage"
  ON public.ai_usage FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- VIEW: public.leaderboard
-- Top learners ranked by XP derived from topic_states JSON.
-- Readable by all authenticated users.
-- ============================================================
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  u.id,
  u.first_name,
  u.last_name,
  COALESCE(
    (
      SELECT SUM((value ->> 'xpAwarded')::int)
      FROM   jsonb_each(up.topic_states)
      WHERE  value ->> 'xpAwarded' IS NOT NULL
    ),
    0
  ) AS total_xp,
  COALESCE(up.total_study_seconds, 0) AS total_study_seconds,
  COALESCE(jsonb_array_length(up.completed_topics), 0) AS completed_count
FROM      public.users u
LEFT JOIN public.user_progress up ON up.user_id = u.id
ORDER BY  total_xp DESC;

GRANT SELECT ON public.leaderboard TO authenticated;


-- ============================================================
-- FUNCTION: sync_user_xp()
-- Keeps public.users.xp in sync with progress table.
-- Called automatically when user_progress is updated.
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_user_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  computed_xp INTEGER;
BEGIN
  SELECT COALESCE(
    SUM((value ->> 'xpAwarded')::int), 0
  )
  INTO computed_xp
  FROM jsonb_each(NEW.topic_states)
  WHERE value ->> 'xpAwarded' IS NOT NULL;

  UPDATE public.users
  SET    xp = computed_xp
  WHERE  id = NEW.user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_progress_update_sync_xp ON public.user_progress;
CREATE TRIGGER on_progress_update_sync_xp
  AFTER INSERT OR UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_xp();


-- ============================================================
-- SEED: Aethel Solutions — Tier 1 Course
-- ============================================================
INSERT INTO public.courses (id, slug, title, description, tier)
VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'tier-1-ai-for-everyday-life',
  'AI for Everyday Life — Tier 1',
  'Learn how to use AI tools confidently in your daily life and work. No technical background needed.',
  1
)
ON CONFLICT (id) DO NOTHING;
