alter table public.documents
  add column if not exists file_ext text not null default '';
