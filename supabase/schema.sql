create extension if not exists pgcrypto;

do $$
begin
  create type public.tutorial_difficulty as enum ('Facile', 'Intermédiaire', 'Avancé');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.challenge_status as enum ('Bientôt', 'En cours', 'Terminé');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.creation_visibility as enum ('private', 'public');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  avatar_url text check (char_length(avatar_url) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.tutorials (
  id text primary key check (char_length(id) <= 80),
  title text not null check (char_length(title) between 1 and 120),
  material text not null check (char_length(material) <= 80),
  difficulty public.tutorial_difficulty not null,
  duration text not null check (char_length(duration) <= 40),
  category text not null check (char_length(category) <= 80),
  image text not null check (char_length(image) <= 120),
  description text not null check (char_length(description) <= 500),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id text primary key check (char_length(id) <= 80),
  title text not null check (char_length(title) between 1 and 140),
  theme text not null check (char_length(theme) <= 120),
  status public.challenge_status not null default 'Bientôt',
  participants integer not null default 0 check (participants >= 0),
  description text not null check (char_length(description) <= 500),
  is_published boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.creations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  piece_type text not null check (char_length(piece_type) <= 80),
  condition text not null check (char_length(condition) <= 80),
  goal text not null check (char_length(goal) <= 80),
  material text not null check (char_length(material) <= 80),
  notes text not null default '' check (char_length(notes) <= 500),
  image_name text not null check (char_length(image_name) <= 120),
  image_path text not null unique check (char_length(image_path) <= 500),
  visibility public.creation_visibility not null default 'private',
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  challenge_id text not null references public.challenges(id) on delete cascade,
  creation_id uuid not null references public.creations(id) on delete cascade,
  voter_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (challenge_id, creation_id, voter_id)
);

create table if not exists public.creation_likes (
  id uuid primary key default gen_random_uuid(),
  creation_id uuid not null references public.creations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (creation_id, user_id)
);

create table if not exists public.creation_comments (
  id uuid primary key default gen_random_uuid(),
  creation_id uuid not null references public.creations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.challenge_registrations (
  id uuid primary key default gen_random_uuid(),
  challenge_id text not null references public.challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);

create table if not exists public.challenge_submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id text not null references public.challenges(id) on delete cascade,
  creation_id uuid not null references public.creations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  statement text not null default '' check (char_length(statement) <= 500),
  created_at timestamptz not null default now(),
  unique (challenge_id, creation_id)
);

alter table public.profiles enable row level security;
alter table public.tutorials enable row level security;
alter table public.challenges enable row level security;
alter table public.creations enable row level security;
alter table public.votes enable row level security;
alter table public.creation_likes enable row level security;
alter table public.creation_comments enable row level security;
alter table public.challenge_registrations enable row level security;
alter table public.challenge_submissions enable row level security;

drop policy if exists "Profiles are readable" on public.profiles;
create policy "Profiles are readable"
on public.profiles for select
using (true);

drop policy if exists "Users can insert their profile" on public.profiles;
create policy "Users can insert their profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Published tutorials are readable" on public.tutorials;
create policy "Published tutorials are readable"
on public.tutorials for select
using (is_published = true);

drop policy if exists "Published challenges are readable" on public.challenges;
create policy "Published challenges are readable"
on public.challenges for select
using (is_published = true);

drop policy if exists "Creations are readable by owner or public" on public.creations;
create policy "Creations are readable by owner or public"
on public.creations for select
using (visibility = 'public' or owner_id = auth.uid());

drop policy if exists "Users can insert their creations" on public.creations;
create policy "Users can insert their creations"
on public.creations for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "Users can update their creations" on public.creations;
create policy "Users can update their creations"
on public.creations for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Users can delete their creations" on public.creations;
create policy "Users can delete their creations"
on public.creations for delete
to authenticated
using (owner_id = auth.uid());

drop policy if exists "Votes are readable" on public.votes;
create policy "Votes are readable"
on public.votes for select
using (true);

drop policy if exists "Users can vote once" on public.votes;
create policy "Users can vote on public creations"
on public.votes for insert
to authenticated
with check (
  voter_id = auth.uid()
  and exists (
    select 1
    from public.creations c
    where c.id = creation_id
    and c.visibility = 'public'
  )
  and exists (
    select 1
    from public.challenges ch
    where ch.id = challenge_id
    and ch.is_published = true
  )
);

drop policy if exists "Users can delete their votes" on public.votes;
create policy "Users can delete their votes"
on public.votes for delete
to authenticated
using (voter_id = auth.uid());

drop policy if exists "Likes are readable for visible creations" on public.creation_likes;
create policy "Likes are readable for visible creations"
on public.creation_likes for select
using (
  exists (
    select 1
    from public.creations c
    where c.id = creation_id
    and (c.visibility = 'public' or c.owner_id = auth.uid())
  )
);

drop policy if exists "Users can like visible creations" on public.creation_likes;
create policy "Users can like visible creations"
on public.creation_likes for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.creations c
    where c.id = creation_id
    and (c.visibility = 'public' or c.owner_id = auth.uid())
  )
);

drop policy if exists "Users can remove their likes" on public.creation_likes;
create policy "Users can remove their likes"
on public.creation_likes for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Comments are readable for visible creations" on public.creation_comments;
create policy "Comments are readable for visible creations"
on public.creation_comments for select
using (
  exists (
    select 1
    from public.creations c
    where c.id = creation_id
    and (c.visibility = 'public' or c.owner_id = auth.uid())
  )
);

drop policy if exists "Users can comment visible creations" on public.creation_comments;
create policy "Users can comment visible creations"
on public.creation_comments for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.creations c
    where c.id = creation_id
    and (c.visibility = 'public' or c.owner_id = auth.uid())
  )
);

drop policy if exists "Users can update their comments" on public.creation_comments;
create policy "Users can update their comments"
on public.creation_comments for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete their comments" on public.creation_comments;
create policy "Users can delete their comments"
on public.creation_comments for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Challenge registrations are readable" on public.challenge_registrations;
create policy "Challenge registrations are readable"
on public.challenge_registrations for select
using (
  exists (
    select 1
    from public.challenges ch
    where ch.id = challenge_id
    and ch.is_published = true
  )
);

drop policy if exists "Users can register to published challenges" on public.challenge_registrations;
create policy "Users can register to published challenges"
on public.challenge_registrations for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.challenges ch
    where ch.id = challenge_id
    and ch.is_published = true
    and ch.status in ('Bientôt', 'En cours')
  )
);

drop policy if exists "Users can leave their registrations" on public.challenge_registrations;
create policy "Users can leave their registrations"
on public.challenge_registrations for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Challenge submissions are readable" on public.challenge_submissions;
create policy "Challenge submissions are readable"
on public.challenge_submissions for select
using (
  exists (
    select 1
    from public.challenges ch
    where ch.id = challenge_id
    and ch.is_published = true
  )
  and exists (
    select 1
    from public.creations c
    where c.id = creation_id
    and c.visibility = 'public'
  )
);

drop policy if exists "Users can submit their public creations" on public.challenge_submissions;
create policy "Users can submit their public creations"
on public.challenge_submissions for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.challenges ch
    where ch.id = challenge_id
    and ch.is_published = true
    and ch.status = 'En cours'
  )
  and exists (
    select 1
    from public.creations c
    where c.id = creation_id
    and c.owner_id = auth.uid()
    and c.visibility = 'public'
  )
);

drop policy if exists "Users can remove their submissions" on public.challenge_submissions;
create policy "Users can remove their submissions"
on public.challenge_submissions for delete
to authenticated
using (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'creation-images',
  'creation-images',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read creation images" on storage.objects;
create policy "Users can read their creation images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'creation-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can upload creation images" on storage.objects;
create policy "Users can upload creation images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'creation-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update their creation images" on storage.objects;
create policy "Users can update their creation images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'creation-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'creation-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete their creation images" on storage.objects;
create policy "Users can delete their creation images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'creation-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

notify pgrst, 'reload schema';
