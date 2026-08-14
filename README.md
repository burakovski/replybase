# Replybase

Embeddable chatbot builder MVP for the Paralect Product Academy assignment ([Embeddable Chatbot Builder](https://www.paralect.com/academy/product-manager/projects/chatbot-builder)).

**Niche:** SaaS help docs → customer support chatbot (in-app + website widget).

**Stack:** Next.js 16 · Supabase (Auth + Postgres + pgvector) · OpenAI embeddings/chat · mock Stripe billing.

## Run locally

Bookmark: **Replybase local** → http://localhost:3012

```bash
cd workspace/replybase
npm install
cp .env.example .env.local
# fill Supabase + OpenAI keys
npm run dev
```

### Smoke (after build)

```bash
npm run build && npm run start
# other terminal:
npm run test:smoke
```

### Required env

| Variable | Where |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same |
| `SUPABASE_SERVICE_ROLE_KEY` | same (server only) |
| `OPENROUTER_API_KEY` | [OpenRouter](https://openrouter.ai/) (preferred) |
| `OPENAI_MODEL` | e.g. `openai/gpt-4o-mini` |
| `OPENAI_EMBEDDING_MODEL` | e.g. `openai/text-embedding-3-small` |
| `OPENAI_API_KEY` | optional fallback if OpenRouter unset |

Apply schema once (SQL Editor or CLI):

`supabase/migrations/20260811120000_init.sql`

### Auth: email confirmation code

Signup sends a confirmation code; the user enters it on `/signup` before getting a session.

In Supabase Dashboard → **Authentication**:

1. **Providers → Email** — enable **Confirm email**
2. **Email Templates → Confirm signup** — include the OTP in the body, e.g.:

```html
<h2>Confirm your signup</h2>
<p>Your Replybase code is: <strong>{{ .Token }}</strong></p>
<p>Or open this link: <a href="{{ .ConfirmationURL }}">Confirm email</a></p>
```

Without `{{ .Token }}` the UI code step will not work (link-only emails).

## What to demo

1. Landing → features + pricing  
2. Sign up → create a bot  
3. Upload sample doc → ask “How do I rotate API keys?”  
4. Billing → mock Stripe upgrade to Starter  
5. Copy embed snippet → open widget playground  

## Deliverables

| Item | Status |
|------|--------|
| Landing + pricing | `/` |
| Web app (docs, chat, billing) | `/app` |
| Embeddable widget | `/widget.js` + `/embed/[botId]` |
| Video demo (EN, human voice) | see `DEMO_SCRIPT.md` |

Repo: https://github.com/burakovski/replybase  
Supabase: https://supabase.com/dashboard/project/cjckdwxkvitdraaxyfhp
