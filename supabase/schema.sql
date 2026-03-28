-- Think-Two MVP: Supabase Schema

-- Ensure pg_crypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Enable RLS for courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
-- Policy: Courses are readable by everyone
CREATE POLICY "Courses are viewable by everyone" ON public.courses
    FOR SELECT TO authenticated, anon USING (true);

-- 2. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    transcript TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Enable RLS for lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
-- Policy: Lessons are readable by everyone
CREATE POLICY "Lessons are viewable by everyone" ON public.lessons
    FOR SELECT TO authenticated, anon USING (true);


-- 3. Users Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    xp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- Policy: Users can only read and update their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE TO authenticated USING (auth.uid() = id);
    
-- Function to automatically create a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 4. Scalable User Progress Table
DROP TABLE IF EXISTS public.user_progress CASCADE;
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    started_topics JSONB DEFAULT '[]'::jsonb,
    completed_topics JSONB DEFAULT '[]'::jsonb,
    activity_dates JSONB DEFAULT '[]'::jsonb,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);
-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
-- Policy: Users can only view, insert, and update their own progress
CREATE POLICY "Users can view own progress" ON public.user_progress
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);


-- =====================================
-- MOCK DATA INJECTION
-- =====================================

-- Insert Mock Course
INSERT INTO public.courses (id, title, description)
VALUES 
    ('c0000000-0000-0000-0000-00000000000a', 'Next.js App Router Masterclass', 'Master advanced concepts in Next.js 14 including Server Actions, Mutations, and Suspense.')
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Lessons
INSERT INTO public.lessons (id, course_id, title, video_url, transcript, order_index)
VALUES 
    ('10000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-00000000000a', 'Introduction to the App Router', 'dQw4w9WgXcQ', 'Welcome to the course...', 1),
    ('10000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-00000000000a', 'Building Mutational State with Server Actions', 'dQw4w9WgXcQ', '[00:00 - 02:45] Welcome to Module 4. In this lesson...', 2),
    ('10000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-00000000000a', 'Optimistic UI Updates', 'dQw4w9WgXcQ', 'Now lets look at optimistic updates...', 3)
ON CONFLICT (id) DO NOTHING;
