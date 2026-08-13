alter table public.bots
  add column if not exists no_answer_message text not null default '';
