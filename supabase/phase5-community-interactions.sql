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

alter table public.creation_likes enable row level security;
alter table public.creation_comments enable row level security;

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

notify pgrst, 'reload schema';
