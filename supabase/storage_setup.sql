-- Run this in Supabase SQL Editor to enable private Study Space uploads.

-- 1. Create the study-materials storage bucket as private.
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-materials', 'study-materials', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. Re-create clean storage policies.
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can upload their own materials" ON storage.objects;
  DROP POLICY IF EXISTS "Users can read their own materials" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own materials" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own materials" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for study materials" ON storage.objects;
END $$;

CREATE POLICY "Users can upload their own materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'study-materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read their own materials"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'study-materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own materials"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'study-materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'study-materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
