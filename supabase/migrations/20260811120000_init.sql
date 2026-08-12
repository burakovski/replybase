-- Replybase: auth profiles, bots, docs, pgvector chunks
create extension if not exists vector with schema extensions;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  name text not null,
  plan text not null default 'free'
    check (plan in ('free', 'starter', 'growth')),
  created_at timestamptz not null default now()
);

create table if not exists public.bots (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  public_key text not null unique,
  system_prompt text not null,
  welcome_message text not null,
  primary_color text not null default '#0F766E',
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id text primary key,
  bot_id text not null references public.bots (id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.chunks (
  id text primary key,
  bot_id text not null references public.bots (id) on delete cascade,
  document_id text not null references public.documents (id) on delete cascade,
  content text not null,
  embedding extensions.vector (1536)
);

create index if not exists bots_user_id_idx on public.bots (user_id);
create index if not exists documents_bot_id_idx on public.documents (bot_id);
create index if not exists chunks_bot_id_idx on public.chunks (bot_id);
create index if not exists chunks_document_id_idx on public.chunks (document_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.match_chunks(
  query_embedding extensions.vector (1536),
  match_bot_id text,
  match_count int default 4
)
returns table (
  id text,
  bot_id text,
  document_id text,
  content text,
  similarity float
)
language sql
stable
as $$
  select
    c.id,
    c.bot_id,
    c.document_id,
    c.content,
    (1 - (c.embedding <=> query_embedding))::float as similarity
  from public.chunks c
  where c.bot_id = match_bot_id
    and c.embedding is not null
  order by c.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

alter table public.profiles enable row level security;
alter table public.bots enable row level security;
alter table public.documents enable row level security;
alter table public.chunks enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "bots_all_own" on public.bots;
create policy "bots_all_own"
  on public.bots for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "documents_all_own" on public.documents;
create policy "documents_all_own"
  on public.documents for all
  to authenticated
  using (
    exists (
      select 1 from public.bots b
      where b.id = documents.bot_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.bots b
      where b.id = documents.bot_id and b.user_id = auth.uid()
    )
  );

drop policy if exists "chunks_all_own" on public.chunks;
create policy "chunks_all_own"
  on public.chunks for all
  to authenticated
  using (
    exists (
      select 1 from public.bots b
      where b.id = chunks.bot_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.bots b
      where b.id = chunks.bot_id and b.user_id = auth.uid()
    )
  );

grant usage on schema public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant all on public.bots to authenticated;
grant all on public.documents to authenticated;
grant all on public.chunks to authenticated;
grant execute on function public.match_chunks(extensions.vector, text, int) to service_role;
