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

> “Hi, I’m Siarhei. This is Replybase — an embeddable chatbot builder.
> I’ll show it the way my studio Eskviz would use it: upload the site FAQ, test in-app, then drop the widget on eskviz.com.”

---

## 2. Landing + pricing (30–40 sec)

Scroll Features → Pricing. Hover Starter.

> “Landing explains the niche and core loop: docs, chat, embed.
> Pricing is gated on purpose. Free is for testing in-app. Starter unlocks the embeddable widget.
> Billing later is a Stripe test mock — no live charges, but the product decision is real.”

---

## 3. Sign up + create bot (40 sec)

Sign up with a demo email → Create bot **Eskviz Help**.

> “Customer story: my studio Eskviz wants a support bot on eskviz.com — visitors ask about price, timeline, BelGIE, without waiting for a human.
> One bot, one knowledge base. Not a kitchen sink.”

---

## 4. Upload docs + in-app chat (60–75 sec)

Paste from `docs/demo/FAQ-и-тарифы-Eskviz.md` (source: https://eskviz.com/).

**Title field** (`placeholder: напр. API-ключи и ротация`):

```
FAQ и тарифы Eskviz
```

**Textarea** — copy the file body (or drop the `.md`: title becomes `FAQ и тарифы Eskviz`).

Click **Загрузить и проиндексировать** / **Upload & index**. Wait until the doc appears in the list.

Ask:

1. `Сколько стоит лендинг?`
2. `Нужна ли регистрация в БелГИЭ?`
3. `Какая гарантия возврата денег?` ← not in the corpus — must refuse

> “I paste the Eskviz help article — real pricing, timeline, BelGIE.
> Replybase chunks it for retrieval. Same questions a visitor would type on eskviz.com.
> Refund policy isn’t in the docs, so it says it doesn’t know. Grounded answers beat hallucinations.”

(If extractive mode without OpenAI:)

> “This environment is running extractive mode — you still see grounded excerpts. With an API key, the same retrieval returns a short LLM answer.”

---

## 5. Billing mock (30 sec)

Open Billing → choose Starter → show success message.

> “Embed is a paid feature. I upgrade with a mock Stripe checkout. Receipt is fake; the plan change is real in the app.”

---

## 6. Embed widget (45–60 sec)

Back to bot → show script tag → open playground → ask `Сколько стоит лендинг?` in the floating widget.

> “Here’s the one-line embed. On eskviz.com this goes before the closing body tag.
> Same bot, same FAQ. A visitor on the marketing site gets the 890 BYN answer — not a generic chatbot.”

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
