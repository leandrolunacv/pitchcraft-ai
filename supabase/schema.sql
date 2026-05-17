-- ─────────────────────────────────────────────
-- PitchCraft AI — Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────

-- 1. PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  plan text default 'free' check (plan in ('free', 'paid', 'lifetime')),
  plan_period_start timestamptz default now(),
  plan_period_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

-- 2. PITCHES (saved pitch history)
create table if not exists public.pitches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  mode text not null check (mode in ('improve', 'create')),
  title text,
  original_pitch text,
  optimized_pitch text,
  analysis jsonb,
  config jsonb,
  source_filename text,
  source_kind text check (source_kind in ('text', 'document', 'transcript')),
  created_at timestamptz default now()
);

-- 3. USAGE LOG (track monthly limits)
create table if not exists public.usage_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  action text not null,
  created_at timestamptz default now()
);

create index if not exists idx_usage_user_created on public.usage_log(user_id, created_at);
create index if not exists idx_pitches_user_created on public.pitches(user_id, created_at desc);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.pitches enable row level security;
alter table public.usage_log enable row level security;

-- Profiles policies
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Pitches policies
drop policy if exists "Users can read own pitches" on public.pitches;
create policy "Users can read own pitches" on public.pitches
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own pitches" on public.pitches;
create policy "Users can insert own pitches" on public.pitches
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own pitches" on public.pitches;
create policy "Users can update own pitches" on public.pitches
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own pitches" on public.pitches;
create policy "Users can delete own pitches" on public.pitches
  for delete using (auth.uid() = user_id);

-- Usage log policies
drop policy if exists "Users can read own usage" on public.usage_log;
create policy "Users can read own usage" on public.usage_log
  for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- AUTO-CREATE PROFILE ON SIGNUP
-- ─────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
