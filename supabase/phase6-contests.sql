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

alter table public.challenge_registrations enable row level security;
alter table public.challenge_submissions enable row level security;

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

notify pgrst, 'reload schema';
