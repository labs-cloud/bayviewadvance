-- Bank statement uploads for the funding application.
--
-- Applicant bank statements are uploaded directly from the browser to Supabase
-- Storage (bypassing Vercel's ~4.5MB serverless request body limit) and the
-- send-application-email API downloads them server-side to attach to the
-- submission email.
--
-- The bucket is PRIVATE: anonymous applicants may upload, but only the service
-- role (used by the API) can read the files back.

-- Private bucket, PDF only, capped at 15MB per file.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('bank-statements', 'bank-statements', false, 15728640, array['application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Allow anonymous + authenticated clients to upload (INSERT only) into the
-- bucket. No SELECT/UPDATE/DELETE policies are granted, so uploaded statements
-- cannot be read, listed, or modified by clients — the service role (which
-- bypasses RLS) is the only reader.
drop policy if exists "Anyone can upload bank statements" on storage.objects;
create policy "Anyone can upload bank statements"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'bank-statements');
