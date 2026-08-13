/**
 * Renders Replybase-like UI crops and saves feature WebPs.
 * Run: node scripts/capture-feature-shots.mjs
 */
import { chromium } from "playwright";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/images");

const css = `
  :root {
    --ink: #071714;
    --moss: #1a6354;
    --moss-deep: #0f4f43;
    --foam: #e8f6f2;
    --paper: #fbfaf6;
    --line: #d5e3df;
    --muted: #5b6f6a;
    --panel: rgba(255,255,255,0.92);
    --chat-surface: #071714;
    --chat-fg: #fbfaf6;
    --chat-user: rgba(251,250,246,0.12);
    --chat-bot: #1a6354;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    background: #dfe9e5;
    color: var(--ink);
  }
  .shot {
    width: 1100px;
    height: 680px;
    padding: 36px;
    background:
      radial-gradient(ellipse 80% 50% at 10% -10%, rgba(15,118,110,0.16), transparent 55%),
      linear-gradient(180deg, #fbfaf6 0%, #f1f5f2 100%);
  }
  .panel {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 24px;
    backdrop-filter: blur(8px);
  }
  .display { letter-spacing: -0.03em; font-weight: 800; }
  .muted { color: var(--muted); }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    background: var(--foam);
    color: var(--moss-deep);
    font-size: 12px;
    font-weight: 600;
    padding: 6px 12px;
  }
`;

const shots = [
  {
    file: "feature-grounded.webp",
    html: `
      <div class="shot" id="root">
        <div class="panel" style="height:100%;padding:22px;display:flex;flex-direction:column;">
          <div style="font-weight:700;font-size:20px;" class="display">In-app chat</div>
          <div style="margin-top:14px;flex:1;border-radius:18px;background:var(--chat-surface);color:var(--chat-fg);padding:18px;display:flex;flex-direction:column;gap:12px;">
            <div style="align-self:flex-end;max-width:78%;background:var(--chat-bot);border-radius:16px;padding:12px 14px;font-size:15px;line-height:1.45;">
              Do you support SSO login?
            </div>
            <div style="align-self:flex-start;max-width:86%;display:flex;flex-direction:column;gap:8px;">
              <div style="background:var(--chat-user);border-radius:16px;padding:12px 14px;font-size:15px;line-height:1.45;">
                На этот ответ я не смогу вам сейчас ответить. Переформулируйте ваш вопрос или свяжитесь с оператором.
              </div>
              <button style="align-self:flex-start;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.1);color:var(--chat-fg);border-radius:999px;padding:8px 14px;font-size:12px;font-weight:700;">
                Связаться с оператором
              </button>
            </div>
            <div style="margin-top:auto;display:flex;gap:8px;">
              <div style="flex:1;border-radius:999px;background:rgba(255,255,255,0.08);padding:12px 16px;font-size:13px;opacity:0.7;">Ask from your docs…</div>
              <div style="border-radius:999px;background:var(--moss);color:#fbfaf6;padding:12px 18px;font-size:13px;font-weight:700;">Send</div>
            </div>
          </div>
          <div style="margin-top:12px;" class="chip">Source required · no guessing</div>
        </div>
      </div>`,
  },
  {
    file: "feature-embed.webp",
    html: `
      <div class="shot" id="root">
        <div class="panel" style="height:100%;padding:22px;display:grid;grid-template-columns:1.1fr 0.9fr;gap:18px;">
          <div style="display:flex;flex-direction:column;min-width:0;">
            <div style="font-weight:700;font-size:20px;" class="display">Embeddable widget</div>
            <p class="muted" style="margin:8px 0 0;font-size:13px;">Paste this before &lt;/body&gt; on any site.</p>
            <pre style="margin-top:14px;flex:1;overflow:hidden;border-radius:16px;background:var(--chat-surface);color:var(--chat-fg);padding:16px;font-size:12px;line-height:1.55;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">&lt;script
  src="https://app.replybase.dev/widget.js"
  data-bot-id="W_yqMwOLYFTAZ2pu1NTSd"
  data-key="-pf8xcZNYUU4oy9r"
  data-origin="https://app.replybase.dev"
  async
&gt;&lt;/script&gt;</pre>
            <div style="margin-top:12px;display:flex;gap:8px;">
              <div style="border-radius:999px;background:var(--moss);color:#fbfaf6;padding:10px 16px;font-size:12px;font-weight:700;">Copy code</div>
              <div style="border-radius:999px;border:1px solid var(--line);padding:10px 16px;font-size:12px;font-weight:600;">Open playground</div>
            </div>
          </div>
          <div style="position:relative;border-radius:20px;background:#f4f7f6;border:1px solid var(--line);overflow:hidden;">
            <div style="padding:18px 16px;font-size:13px;" class="muted">your-site.com</div>
            <div style="padding:0 18px;font-weight:800;font-size:22px;" class="display">Acme Cloud</div>
            <p class="muted" style="padding:10px 18px 0;font-size:13px;line-height:1.45;max-width:26ch;">Need help? Chat with our docs bot.</p>
            <div style="position:absolute;right:16px;bottom:16px;width:210px;height:260px;border-radius:16px;border:1px solid #d7e3e0;background:#fff;box-shadow:0 16px 40px rgba(6,30,26,0.16);overflow:hidden;display:flex;flex-direction:column;">
              <div style="background:var(--moss);color:#fff;padding:12px 14px;font-size:13px;font-weight:700;">Acme Docs Bot</div>
              <div style="flex:1;padding:12px;background:#fafcfb;font-size:12px;line-height:1.4;">
                <div style="background:#f1f5f4;border-radius:12px;padding:10px;max-width:90%;">Hi — ask from your help center.</div>
              </div>
            </div>
            <div style="position:absolute;right:22px;bottom:18px;width:48px;height:48px;border-radius:999px;background:var(--moss);box-shadow:0 10px 24px rgba(15,79,67,0.35);"></div>
          </div>
        </div>
      </div>`,
  },
  {
    file: "feature-history.webp",
    html: `
      <div class="shot" id="root">
        <div class="panel" style="height:100%;padding:22px;display:flex;flex-direction:column;">
          <div style="display:flex;justify-content:space-between;align-items:end;gap:12px;">
            <div>
              <div style="font-weight:700;font-size:20px;" class="display">Conversation history</div>
              <p class="muted" style="margin:6px 0 0;font-size:13px;">Every question logged — spot gaps in your docs.</p>
            </div>
            <div class="chip">Last 7 days</div>
          </div>
          <div style="margin-top:16px;display:grid;gap:10px;">
            ${[
              ["How do I rotate API keys?", "Answered · Security guide §4", true],
              ["Do you support SSO login?", "Unanswered · handoff", false],
              ["Can I embed on marketing site?", "Answered · Getting started §2", true],
              ["What happens if I hit plan limits?", "Answered · Billing FAQ", true],
              ["Export chat transcripts?", "Unanswered · handoff", false],
            ]
              .map(
                ([q, meta, ok]) => `
              <div style="display:flex;justify-content:space-between;gap:16px;align-items:center;border:1px solid var(--line);border-radius:16px;background:#fff;padding:14px 16px;">
                <div>
                  <div style="font-size:14px;font-weight:600;">${q}</div>
                  <div class="muted" style="margin-top:4px;font-size:12px;">${meta}</div>
                </div>
                <div style="font-size:11px;font-weight:700;border-radius:999px;padding:6px 10px;background:${ok ? "var(--foam)" : "#f8e8df"};color:${ok ? "var(--moss-deep)" : "#a34d1f"};">
                  ${ok ? "Grounded" : "Gap"}
                </div>
              </div>`,
              )
              .join("")}
          </div>
        </div>
      </div>`,
  },
  {
    file: "feature-bots.webp",
    html: `
      <div class="shot" id="root">
        <div class="panel" style="height:100%;padding:22px;display:flex;flex-direction:column;">
          <div style="display:flex;justify-content:space-between;align-items:end;">
            <div>
              <div style="font-weight:700;font-size:20px;" class="display">Your chatbots</div>
              <p class="muted" style="margin:6px 0 0;font-size:13px;">One account · bots per product / locale</p>
            </div>
            <div style="border-radius:999px;background:var(--moss);color:#fbfaf6;padding:10px 16px;font-size:12px;font-weight:700;">Create bot</div>
          </div>
          <div style="margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            ${[
              ["Acme Docs EN", "#1a6354", "12 docs · embed on"],
              ["Acme Docs RU", "#0f4f43", "9 docs · embed on"],
              ["Pricing helper", "#2a7a68", "4 docs · in-app"],
              ["Onboarding bot", "#146356", "7 docs · embed on"],
            ]
              .map(
                ([name, color, meta]) => `
              <div style="border:1px solid var(--line);border-radius:20px;background:#fff;padding:18px;">
                <div style="display:flex;align-items:center;gap:10px;">
                  <span style="width:10px;height:10px;border-radius:999px;background:${color};"></span>
                  <div style="font-weight:700;font-size:16px;" class="display">${name}</div>
                </div>
                <div class="muted" style="margin-top:10px;font-size:12px;">${meta}</div>
                <div style="margin-top:14px;font-size:12px;font-weight:600;color:var(--moss-deep);">Open →</div>
              </div>`,
              )
              .join("")}
          </div>
        </div>
      </div>`,
  },
];

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1180, height: 760 },
    deviceScaleFactor: 2,
  });

  for (const shot of shots) {
    await page.setContent(`<!doctype html><html><head><style>${css}</style></head><body>${shot.html}</body></html>`, {
      waitUntil: "networkidle",
    });
    const el = page.locator("#root");
    const buf = await el.screenshot({ type: "png" });
    const webp = await sharp(buf)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const dest = path.join(outDir, shot.file);
    fs.writeFileSync(dest, webp);
    console.log("wrote", dest, webp.length);
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
