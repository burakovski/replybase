# Supabase

Project: [cjckdwxkvitdraaxyfhp](https://supabase.com/dashboard/project/cjckdwxkvitdraaxyfhp)

## Apply schema

1. Open [SQL Editor](https://supabase.com/dashboard/project/cjckdwxkvitdraaxyfhp/sql/new)
2. Paste contents of `migrations/20260811120000_init.sql`
3. Run

Or via MCP / CLI once linked.

## API keys → `.env.local`

From [Project Settings → API](https://supabase.com/dashboard/project/cjckdwxkvitdraaxyfhp/settings/api):

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` `secret` → `SUPABASE_SERVICE_ROLE_KEY` (never commit)
