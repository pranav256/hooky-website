import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const website = process.env.WEBSITE_URL || "http://127.0.0.1:3000";
const studio = process.env.STUDIO_URL || "http://127.0.0.1:8000";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"], reducedMotion: "reduce" });
const page = await context.newPage();
// Analytics is supplied by Vercel in deployment; fixture hosts stay offline.
await page.route(`${website}/_vercel/insights/**`, (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
const errors = [];
await context.route("**/*", async (route) => {
  const url = new URL(route.request().url());
  if ([new URL(website).origin, new URL(studio).origin].includes(url.origin)) return route.fallback();
  if (url.hostname === "www.youtube-nocookie.com") return route.fulfill({ contentType: "text/html", body: "Fixture source player" });
  errors.push(`Unexpected external fixture request: ${url.origin}`);
  await route.abort();
});
page.on("response", (response) => {
  if (response.status() >= 400 && /\.(?:js|css)(?:\?|$)/.test(response.url())) errors.push(`Missing asset: ${response.status()} ${response.url()}`);
});
page.on("pageerror", (error) => errors.push(error.message));
const noOverflow = async () => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
try {
  for (const width of [390, 768, 1440, 1728]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${website}/docs#config`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelector('a[href="#config"][aria-current="location"]'));
    const search = page.getByRole("searchbox", { name: "Search documentation" });
    await search.fill("  WHISPER_MODEL  ");
    assert(await page.locator('.docs-sidebar-link[href="#config"]').isVisible());
    await search.fill("  SOURCE    DOWNLOAD    PROFILE  ");
    assert(await page.locator('.docs-sidebar-link[href="#config"]').isVisible());
    await noOverflow();
    await search.fill("no-match-for-this-query");
    assert(await page.locator(".docs-search-empty").isVisible());
    await page.getByRole("button", { name: "Clear search" }).click();
    assert(await search.evaluate((el) => el === document.activeElement));
    assert.equal(await page.locator(".docs-sidebar-link").count(), 7);
    await page.locator('.docs-sidebar-link[href="#quickstart"]').click();
    await page.waitForFunction(() => document.querySelector('a[href="#quickstart"][aria-current="location"]'));
    const windows = page.locator(".code-block").filter({ has: page.locator('.code-header span', { hasText: "Windows (PowerShell)" }) }).first();
    await windows.getByRole("button").click();
    assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replaceAll("\r\n", "\n"), await windows.locator("pre code").textContent());
    await page.locator('.docs-sidebar-link[href="#faq"]').click();
    await page.waitForFunction(() => document.querySelector('a[href="#faq"][aria-current="location"]'));
    await page.goBack();
    await page.waitForFunction(() => document.querySelector('a[href="#quickstart"][aria-current="location"]'));
    await page.goForward();
    await page.waitForFunction(() => document.querySelector('a[href="#faq"][aria-current="location"]'));
    // Exercise user scrolling independently of the URL's anchor history.
    await page.locator("#subtitles").evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.waitForFunction(() => document.querySelector('a[href="#subtitles"][aria-current="location"]'));
    await noOverflow();

    if (width <= 768) {
      await page.goto(`${website}/docs`, { waitUntil: "networkidle" });
      await page.evaluate(() => {
        const text = [...document.querySelectorAll("body *")].map((element) => ({ element, size: getComputedStyle(element).fontSize, line: getComputedStyle(element).lineHeight }));
        for (const { element, size, line } of text) {
          element.style.fontSize = `${parseFloat(size) * 2}px`;
          if (line !== "normal") element.style.lineHeight = `${parseFloat(line) * 2}px`;
        }
      });
      await noOverflow();
    }

    let loadFails = true;
    let saveFails = true;
    let posted = null;
    let postCount = 0;
    await page.route(`${studio}/api/**`, async (route) => {
      const request = route.request();
      const path = new URL(request.url()).pathname;
      if (path === "/api/channels") {
        if (request.method() === "POST") {
          postCount++;
          posted = request.postDataJSON();
          await route.fulfill({ status: saveFails ? 500 : 200, json: saveFails ? { detail: "Fixture failure" } : { status: "saved", count: posted.channels.length } });
        } else await route.fulfill({ status: loadFails ? 503 : 200, json: loadFails ? { detail: "Unavailable" } : { channels: ["@creator | limit=2 | min_views=10000 | scan=20"] } });
      } else if (request.method() === "GET" && ["/api/doctor", "/api/env", "/api/outputs", "/api/jobs"].includes(path)) {
        await route.fulfill({ json: path === "/api/doctor" ? { checks: [], gpu: "Test CPU" } : path === "/api/env" ? { raw: "", values: {} } : path === "/api/jobs" ? { jobs: [] } : { files: [] } });
      } else {
        errors.push(`Unintercepted fixture API: ${request.method()} ${path}`);
        await route.fulfill({ status: 500, json: { detail: "Unexpected fixture request" } });
      }
    });
    await page.goto(studio, { waitUntil: "networkidle" });
    await page.locator("#tab-radar").click();
    await page.waitForFunction(() => document.getElementById("channels-status").dataset.state === "error");
    assert.match(await page.locator("#channels-status").textContent(), /Couldn’t load/);
    assert(await page.locator("#channels-save-btn").isDisabled());
    assert(await page.locator("#new-channel-input").isDisabled());
    loadFails = false;
    await page.getByRole("button", { name: "Retry loading" }).click();
    await page.waitForFunction(() => !document.getElementById("new-channel-input").disabled);
    const literal = '@sample<img src=x onerror="window.channelInjected=true"> | focus=<b>story</b>';
    await page.locator("#new-channel-input").fill(literal);
    await page.locator("#new-channel-input").press("Enter");
    assert.equal(await page.locator("#channels-table-body tr").count(), 2);
    assert.equal(await page.locator("#channels-table-body img, #channels-table-body b").count(), 0);
    assert.equal(await page.evaluate(() => window.channelInjected), undefined);
    await page.locator("#channels-save-btn").click();
    await page.waitForFunction(() => document.getElementById("channels-status").dataset.state === "error");
    assert.match(await page.locator("#channels-status").textContent(), /edits are still here/);
    assert.equal(await page.locator("#channels-table-body tr").count(), 2);
    saveFails = false;
    await page.locator("#channels-save-btn").click();
    await page.waitForFunction(() => document.getElementById("channels-status").dataset.state === "saved");
    assert.equal(posted.channels[1], literal);
    assert.equal(postCount, 2);
    assert(await page.locator("#channels-save-btn").isDisabled());
    await noOverflow();
    await page.unroute(`${studio}/api/**`);
  }
  assert.deepEqual(errors, []);
  console.log("Passed: docs body search, reset, deep links, scroll tracking, exact copied commands; channel load failure, retry, literal text, failed save preservation, and successful retry at four widths.");
} catch (error) {
  mkdirSync(".design-review", { recursive: true });
  await page.screenshot({ path: ".design-review/check-improvements-failure.png", fullPage: true });
  writeFileSync(".design-review/check-improvements-errors.json", JSON.stringify({ error: String(error), errors }, null, 2));
  throw error;
} finally {
  await browser.close();
}
