import assert from "node:assert/strict";
import { chromium } from "playwright";

const website = process.env.WEBSITE_URL || "http://127.0.0.1:3000";
const studio = process.env.STUDIO_URL || "http://127.0.0.1:8000";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const visible = async (selector) =>
  assert(
    await page.locator(selector).isVisible(),
    `${selector} should be visible`,
  );
const click = async (selector) => page.locator(selector).click();
const noOverflow = async (label) =>
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    `${label}: horizontal overflow`,
  );
try {
  for (const width of [390, 768, 1440, 1728]) {
    await page.setViewportSize({ width, height: 950 });
    const response = await page.goto(website, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await noOverflow(`Website ${width}`);
    await click(".moment-card:nth-of-type(2)");
    assert.equal(
      await page
        .locator(".moment-card:nth-of-type(2)")
        .getAttribute("aria-pressed"),
      "true",
    );
    await click('.demo-style:has-text("Clean line")');
    await visible(".caption-clean");
    await click('.demo-segmented button:has-text("Canvas")');
    await visible(".frame-fit");
    await click(".demo-heading button");
    await visible(".demo-notice");
    await click('button[aria-label="Dismiss export message"]');
    assert(!(await page.locator(".demo-notice").count()));
    await click('.demo-sidebar button:has-text("Channel radar")');
    await visible(".demo-alt");
    await click('.demo-alt button:has-text("Back to clip editor")');
    await visible(".demo-workbench");
    await click('.os-tabs button:has-text("Windows")');
    assert(
      (await page.locator(".terminal-code pre").textContent()).includes(
        ".\\main.ps1",
      ),
    );
    await click('.os-tabs button:has-text("macOS")');
    assert(
      (await page.locator(".terminal-code pre").textContent()).includes(
        "./main.sh",
      ),
    );
    await click(".terminal-bottom button");
    assert(
      (
        await context.pages()[0].evaluate(() => navigator.clipboard.readText())
      ).includes("./main.sh"),
    );
    await click("#faq-question-1");
    await visible("#faq-answer-1");
    assert.equal(
      await page.locator("#faq-question-1").getAttribute("aria-expanded"),
      "true",
    );
    if (width === 390) {
      await click(".mobile-menu");
      await visible(".site-navigation");
      await click('.site-navigation a:has-text("How it works")');
      assert.equal(
        await page.locator(".mobile-menu").getAttribute("aria-expanded"),
        "false",
      );
    }
    await page.goto(`${website}/docs`, { waitUntil: "networkidle" });
    await noOverflow(`Docs ${width}`);
    await page.locator(".docs-search-input").fill("unlikely-section-name");
    await visible(".docs-search-empty");
    await page.goto(studio, { waitUntil: "networkidle" });
    await noOverflow(`Studio ${width}`);
    for (const tab of ["settings", "radar", "gallery", "doctor", "studio"]) {
      await click(`#tab-${tab}`);
      await visible(`#view-${tab}`);
      await noOverflow(`Studio ${tab} ${width}`);
      assert.equal(
        await page.locator(`#tab-${tab}`).getAttribute("aria-current"),
        "page",
      );
    }
    assert(await page.locator("#top-render-btn").isDisabled());
    await click("#analyze-btn");
    await visible("#studio-alert");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(website, { waitUntil: "networkidle" });
  await click('button[aria-label="Show next sample caption"]');
  assert.equal(
    await page.locator(".caption-highlight").textContent(),
    "PROUD OF.",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // All requests in this workflow are intercepted. This never downloads, renders,
  // publishes a clip, or writes the user's settings or channel list.
  const fixtures = [
    {
      id: "sample-01",
      title: "Make something worth watching",
      hook_quote: "Start before you feel ready.",
      retention_score: 94,
      category: "Creative insight",
      start: 252,
      end: 286,
      start_fmt: "04:12",
      end_fmt: "04:46",
      duration: "34s",
      words: ["MAKE", "SOMETHING", "WORTH", "WATCHING"],
      dialogue: [{ time: "04:12", text: "Start before you feel ready." }],
    },
    {
      id: "sample-02",
      title: "A new perspective",
      hook_quote: "Look up once in a while.",
      retention_score: 89,
      start: 300,
      end: 340,
      start_fmt: "05:00",
      end_fmt: "05:40",
      duration: "40s",
      words: ["A", "NEW", "PERSPECTIVE"],
      dialogue: [{ time: "05:00", text: "Look up once in a while." }],
    },
  ];
  await page.route(`${studio}/api/**`, async (route) => {
    const path = new URL(route.request().url()).pathname;
    const json =
      path === "/api/analyze/start"
        ? { job_id: "sample-analysis" }
        : path.startsWith("/api/analyze/status/")
          ? {
              status: "completed",
              progress: 100,
              result: {
                hooks: fixtures,
                video_title: "The Creative Mind",
                recommended_framing: "fit",
                recommended_style: "clean",
              },
            }
          : path === "/api/doctor"
            ? { gpu: "Local engine", checks: [] }
            : path === "/api/env"
              ? { raw: "", values: {} }
              : path === "/api/channels"
                ? { channels: [] }
                : path === "/api/outputs"
                  ? { files: [] }
                  : path === "/api/jobs/render_clip"
                    ? { job_id: "sample-render" }
                    : path.startsWith("/api/jobs/")
                      ? { status: "failed", error: "Sample render error" }
                      : {};
    await route.fulfill({ json });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(studio, { waitUntil: "networkidle" });
  await page
    .locator("#source-url")
    .fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  await page.locator("#source-url").press("Enter");
  await page.waitForSelector(".hook-select");
  assert.equal(await page.locator(".hook-select").count(), 2);
  assert(!(await page.locator("#top-render-btn").isDisabled()));
  await click('.hook-select:has-text("A new perspective")');
  assert.equal(
    await page
      .locator('.hook-select:has-text("A new perspective")')
      .getAttribute("aria-pressed"),
    "true",
  );
  await click("#frame-mode-center");
  await click("#sub-mode-hormozi");
  await click("#preview-tab-canvas");
  await visible("#preview-canvas-container");
  await click("button[onclick=\"nudgeTime('start', +0.5)\"]");
  assert(
    (await page.locator("#transcript-time-badge").textContent()).includes(
      "39.5s",
    ),
  );
  await click("#top-render-btn");
  await page.waitForFunction(
    () => !document.getElementById("studio-alert").classList.contains("hidden"),
  );
  assert(
    (await page.locator("#studio-alert").textContent()).includes(
      "Sample render error",
    ),
  );
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log(
    "Passed: responsive website, docs, all five studio views, interactive tour, commands, navigation, analysis fixture, clip selection, timing, framing, captions, and render error feedback.",
  );
} finally {
  await browser.close();
}
