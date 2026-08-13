-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cjckdwxkvitdraaxyfhp/sql/new

alter table public.bots
  add column if not exists no_answer_message text not null default '';

alter table public.documents
  add column if not exists file_ext text not null default '';

-- refresh PostgREST schema cache
notify pgrst, 'reload schema';
