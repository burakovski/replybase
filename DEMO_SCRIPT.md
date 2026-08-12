# Replybase — English demo script (human voice)

Target length: **3–4 minutes**. Record screenshare + your voice (not AI TTS). Speak calmly, like a product walkthrough for a founder.

---

## 0. Setup before recording (30 sec, off-camera)

1. `npm run dev` → http://localhost:3012
2. Hard refresh. Use a clean browser profile or Incognito.
3. Optional: put `OPENAI_API_KEY` in `.env.local` for nicer answers.
4. Close Slack/notifications.

---

## 1. Opening (20–25 sec)

Show landing page. Zoom so the brand **Replybase** and headline are clear.

> “Hi, I’m Siarhei. This is Replybase — an MVP of an embeddable chatbot builder.
> The idea is simple: SaaS teams upload help docs, get an in-app assistant, and the same bot as a website widget.
> I’ll walk through landing, the working product, billing, and the embed.”

---

## 2. Landing + pricing (30–40 sec)

Scroll Features → Pricing. Hover Starter.

> “Landing explains the niche and core loop: docs, chat, embed.
> Pricing is gated on purpose. Free is for testing in-app. Starter unlocks the embeddable widget.
> Billing later is a Stripe test mock — no live charges, but the product decision is real.”

---

## 3. Sign up + create bot (40 sec)

Sign up with a demo email → Create bot “Acme Help”.

> “I create an account and one bot for a single product area. Keeping scope focused — one knowledge base, not a kitchen sink.”

---

## 4. Upload docs + in-app chat (60–75 sec)

Upload prefilled sample → ask:

1. “How do I rotate API keys?”
2. “What are the rate limits?”

> “I paste a getting-started article. Replybase chunks it for retrieval.
> Now the chat answers from those docs.
> If the question isn’t covered, the assistant should say it doesn’t know — that’s better than hallucinating.”

(If extractive mode without OpenAI:)

> “Right now this environment runs without a live LLM key, so you see grounded excerpts from the docs. With an OpenAI key, the same flow returns concise LLM answers over the retrieved chunks.”

---

## 5. Billing mock (30 sec)

Open Billing → choose Starter → show success message.

> “Embed is a paid feature. I upgrade with a mock Stripe checkout. Receipt is fake; the plan change is real in the app.”

---

## 6. Embed widget (45–60 sec)

Back to bot → show script tag → open playground → ask the same question via the floating widget.

> “Here’s the one-line embed. On a real marketing site you’d paste this before the closing body tag.
> Same bot, same knowledge. The widget is what customers see — so the product only ships when docs and chat already work.”

---

## 7. Close (15–20 sec)

Return to landing or bot overview.

> “That’s the MVP: focused scope, working docs-to-chat loop, gated embed, mock billing.
> Thanks for watching — happy to iterate based on your feedback.”

---

## Recording tips

- 1080p, system audio off, your mic only
- Cursor highlight / slow clicks
- Don’t read the UI aloud word-for-word
- If something fails, narrate the fix — product makers debug live

## Where to send

Upload unlisted YouTube / Loom / Google Drive and send:

1. Link to the running app (or GitHub/GitLab + `npm run dev` instructions)
2. Video demo URL
3. Optional: 3–5 lines on niche choice and what you’d ship next
