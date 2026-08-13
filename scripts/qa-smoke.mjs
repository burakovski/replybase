#!/usr/bin/env node
/**
 * Smoke: marketing/auth routes × light + dark.
 * Run: npm run start (or next start) → npm run test:smoke
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3012";

const ROUTES = [
  { path: "/", needsH1: true, needsFooter: true },
  { path: "/login", needsH1: true, needsFooter: false },
  { path: "/signup", needsH1: true, needsFooter: false },
];

const IGNORE_CONSOLE = [
  /Download the React DevTools/i,
  /Failed to load resource:.*favicon/i,
];

function shouldIgnoreError(text) {
  return IGNORE_CONSOLE.some((re) => re.test(text));
}

function filterErrors(errors) {
  return [...new Set(errors)].filter((e) => !shouldIgnoreError(e));
}

async function testRoute(page, route, theme) {
  const errors = [];
  const onPageError = (e) => errors.push(e.message);
  const onConsole = (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  };
  page.on("pageerror", onPageError);
  page.on("console", onConsole);

  try {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(`${BASE}${route.path}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForLoadState("load", { timeout: 30000 }).catch(() => {});

    const h1 = await page.locator("h1").count();
    const status = {
      path: route.path,
      theme,
      title: await page.title(),
      h1,
      headingOk: route.needsH1 ? h1 === 1 : h1 >= 0,
    main: await page.locator("main").count(),
    header: await page.locator("header").count(),
    footer: await page.locator("footer").count(),
    dataTheme: await page.locator("html").getAttribute("data-theme"),
    errors: filterErrors(errors),
  };

  if (route.path === "/") {
      await page.locator('a[href="#product"]').first().click({ timeout: 5000 });
      await page.waitForTimeout(200);
      status.productAnchor = await page.locator("#product").count();
      status.faqAnchor = await page.locator("#faq").count();
      // Landing keeps h1 in first-fold (outside <main>); still require exactly one.
    }

    if (route.needsFooter && status.footer < 1) {
      status.errors.push("missing footer");
    }
    if (status.main < 1) status.errors.push("missing main");
    if (status.header < 1) status.errors.push("missing header");
    if (!status.headingOk) status.errors.push(`expected single h1, got ${h1}`);

    return status;
  } finally {
    page.off("pageerror", onPageError);
    page.off("console", onConsole);
  }
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];

for (const route of ROUTES) {
  for (const theme of ["light", "dark"]) {
    try {
      results.push(await testRoute(page, route, theme));
    } catch (e) {
      results.push({ path: route.path, theme, fatal: String(e), errors: [String(e)] });
    }
  }
}

await browser.close();

const passed = results.filter(
  (r) => !r.fatal && (r.errors?.length ?? 0) === 0 && r.headingOk && r.main > 0,
).length;

const summary = {
  base: BASE,
  total: results.length,
  passed,
  failed: results.length - passed,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(summary.failed > 0 ? 1 : 0);
