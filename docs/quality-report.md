# Quality Report — Replybase

**Номер проверки:** 2  
**Дата и время проверки:** 12.08.2026, 10:53 (UTC+03)

**Область:** MVP Replybase (лендинг + auth + app + embed)  
**Прод URL:** https://replybase-sigma.vercel.app  
**Локально:** http://localhost:3012  
**GitHub:** https://github.com/burakovski/replybase

## Итог

| Этап | Статус |
|---|---|
| Landing L1–L6 | ✅ PASS |
| Images I1–I10 | ✅ PASS (исключения favicon/apple-touch PNG) |
| Technical T1–T12 | ✅ PASS (локально; прод ждёт push/redeploy) |
| Ops O1–O12 | ✅ NA |
| Published PS1–PS6 | ⚠️ PARTIAL — код готов; **прод ещё на старом билде** до push |
| WCAG 2.2 AA | ✅ PASS локально (light+dark); прод dark — после redeploy |

**Вердикт цикла (код):** ✅ PASS  
**Вердикт прод:** ❌ до push + redeploy (см. список действий владельца)

---

## Сделано в коде (проверка №2)

- Dark-контраст чата/pricing/snippet → токены `--chat-*`
- RU display → Exo 2
- Контраст `--accent` / `--line` / focus / primary fg
- `sitemap.ts` + `robots.ts` (3 URL в sitemap)
- `npm run test:smoke` (Playwright, `/` `/login` `/signup` × light+dark) — **6/6 PASS**
- Брендовый `favicon.ico` (16/32/48), `icon.png`, `apple-icon.png`, `og.webp`
- `metadataBase` + OpenGraph/Twitter
- `<main>` на login/signup
- Удалены неиспользуемые шаблонные SVG из `public/`

---

## Критические пробелы

1. **Прод не обновлён** — фиксы только локально, пока нет push/deploy.

## Minor / вне кода

1. OpenAI quota для полного LLM (сейчас extractive fallback).
2. Демо-видео + HR letter (Paralect).
3. Опционально: UX Writer compliance (не блокирует MVP).

## Delta для владельца

См. список «Что сделать тебе» в чате / ниже.

---

## WCAG 2.2 AA

| Criterion | Status | Evidence | Delta |
|---|---|---|---|
| 1.4.3 light | ✅ PASS | ink 17.61; muted 5.12; accent 5.53; badges ≥8.48 | — |
| 1.4.3 dark | ✅ PASS (код) | ink 16.47; muted 8.18; accent 9.10; chat 17.61; bot bubble 5.24 | Redeploy |
| 1.4.11 UI line | ✅ PASS | L 3.81 / D 3.65 | — |
| 2.4.7 Focus | ✅ PASS | outline + focus-ring | — |
| Dark chips/badges | ✅ PASS | moss-deep/foam L 8.48 / D 10.50 | — |
| Dark tables | ✅ NA | нет data-table | — |

---

## L1–L6 / I1–I10

| # | Status | Evidence |
|---|---|---|
| L1–L6 | ✅ PASS | без регрессий (лендинг иерархия/ритм) |
| I1 | ✅ PASS | tracked png/jpg в UI-path: favicon.ico + apple icons (исключения); OG = `og.webp` |
| I2–I9 | ✅ PASS / NA | нет marketing raster hero |
| I10 | ✅ PASS | `/og.webp` 1200×630 в metadata |

**I1 exceptions:** `src/app/favicon.ico`; `src/app/apple-icon.png`; `public/apple-touch-icon.png`; `public/logo/apple-touch-icon.png` (Safari/Apple).

---

## T1–T12

| # | Status | Evidence |
|---|---|---|
| T1 | ✅ PASS | `npm run lint` exit 0 |
| T2 | ✅ PASS | `npm run build` OK; routes включают `/sitemap.xml`, `/robots.txt` |
| T3 | ✅ PASS | covered by next build |
| T4 | ✅ PASS | local `/` `/login` `/signup` 200; `/sitemap.xml` 200 |
| T5 | ✅ PASS | `npm run test:smoke` → 6/6 light+dark, 0 errors |
| T6 | ✅ PASS | sitemap = **3** URL (`/`, `/login`, `/signup`); `/app` исключён (auth) |
| T7–T8 | ✅ NA | UX Writer не в скоупе |
| T9 | ✅ PASS | smoke без pageerror; fetch cancel; locale cleanup |
| T10 | ✅ PASS | lint clean |
| T11 | ✅ NA | нет remote media |
| T12 | ⚠️ | Smoke на **local `next start`**. Прод ещё старый до deploy |

---

## PS1–PS6

| # | Status | Evidence | Delta |
|---|---|---|---|
| PS1 | ✅ PASS (прошлая проверка) | LH 13.4.1 mobile на проде | Повторить после deploy |
| PS2 | ✅ PASS | metadataBase → vercel.app; OG `/og.webp` | — |
| PS3–PS5 | ✅ PASS (lab #1) | LCP 2.3s; без тяжёлых images | — |
| PS6 | ❌ до deploy | Dark color-contrast fail на **старом** проде | Push → re-LH dark |

---

## O / Figma

| | Status |
|---|---|
| O1–O12 | ✅ NA |
| C1–C10 | ✅ NA |
