-- FORGE: stories that expire after 24 hours.
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  media_url text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);

create index if not exists stories_expires_at_idx on public.stories (expires_at desc);
create index if not exists stories_profile_created_idx on public.stories (profile_id, created_at desc);

alter table public.stories enable row level security;

drop policy if exists "Stories are readable by everyone" on public.stories;
create policy "Stories are readable by everyone"
  on public.stories for select
  to authenticated
  using (expires_at > now());

drop policy if exists "Users create their own stories" on public.stories;
create policy "Users create their own stories"
  on public.stories for insert
  to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "Users delete their own stories" on public.stories;
create policy "Users delete their own stories"
  on public.stories for delete
  to authenticated
  using (profile_id = auth.uid());

-- Remove expired stories automatically whenever this migration is reapplied;
-- a scheduled Supabase job can later clean them up daily.
delete from public.stories where expires_at <= now();
