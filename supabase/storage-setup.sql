-- Off the Hook — Supabase Storage setup
-- Run in Supabase Dashboard → SQL Editor

-- Public bucket for product images (read via CDN URL)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read access for product images
drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects for select
  using (bucket_id = 'media');

-- Service role uploads bypass RLS; no insert policy needed for admin API uploads.
