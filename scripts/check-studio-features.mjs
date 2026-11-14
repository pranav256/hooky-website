import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const studio = process.env.STUDIO_URL || "http://127.0.0.1:8000";
const artifacts = new URL("../.design-review/", import.meta.url);
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [], spacing = [];
const source = "https://www.youtube.com/watch?v=abcdefghijk";
const cues = [
  { start: 12.5, end: 17, text: "Maya explains what went wrong with our startup." },
  { start: 17, end: 24, text: "We built too many features before talking to customers." },
  { start: 24, end: 33, text: "One clear decision saves everyone time." },
];
const hook = { id: "topic_1", title: "Talk to customers first", category: "AI topic match",
  start: 12.5, end: 33, start_fmt: "0:13", end_fmt: "0:33", duration: "20.5s",
  hook_quote: cues[0].text, reason: "The speaker explains a startup mistake and its lesson.",
  cues, dialogue: cues.map(cue => ({ time: String(cue.start), text: cue.text })), words: ["Maya", "explains"] };
try {
  for (const width of [390, 768, 1440, 1728]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    let jobs = [], starts = 0, exportPayload;
    await context.route("**/*", route => {
      const url = new URL(route.request().url());
      if (url.origin === new URL(studio).origin) return route.fallback();
      if (url.hostname === "www.youtube-nocookie.com") return route.fulfill({ contentType: "text/html", body: "Source video fixture" });
      return route.abort();
    });
    await page.route("**/api/**", route => {
      const request = route.request(), path = new URL(request.url()).pathname;
      if (path === "/api/doctor") return route.fulfill({ json: { checks: [{ name: "FFmpeg", ok: true, required: true }], gpu: "Fixture CPU" } });
      if (path === "/api/env") return route.fulfill({ json: { values: {}, raw: "" } });
      if (path === "/api/outputs") return route.fulfill({ json: { files: [], folders: [], count: 0 } });
      if (path === "/api/channels") return route.fulfill({ json: { channels: [] } });
      if (path === "/api/jobs") return route.fulfill({ json: { jobs } });
      if (path === "/api/projects") return route.fulfill({ json: { projects: [] } });
      if (["/api/analyze/start", "/api/jobs/render_clip"].includes(path)) {
        const payload = request.postDataJSON();
        const type = path.includes("analyze") ? "analyze" : "render_clip";
        const job = { id: `${type}_${++starts}`, type, status: "running", progress: 0,
          created_at: Date.now()/1000, updated_at: Date.now()/1000, logs: [], request: payload,
          url: payload.url, title: payload.title || "", result: null };
        if (type === "analyze") job.result = { status: "success", video_title: "Lessons from a small team",
          topic: payload.topic, selection_mode: "ai", hooks: payload.topic === "quantum physics" ? [] : [hook],
          recommended_framing: "fit", recommended_style: "clean" };
        else exportPayload = payload;
        jobs.unshift(job);
        return route.fulfill({ json: { job_id: job.id, status: "started" } });
      }
      const status = path.match(/^\/api\/(?:jobs|analyze\/status)\/([^/]+)(\/cancel)?$/);
      if (status) {
        const job = jobs.find(job => job.id === status[1]);
        if (status[2]) job.status = "cancelled";
        else if (job.type === "analyze") { job.status = "completed"; job.progress = 100; }
        return route.fulfill({ json: job });
      }
      return route.fulfill({ status: 404, json: { detail: "Unexpected fixture route" } });
    });
    await page.goto(studio, { waitUntil: "networkidle" });
    await page.locator("#source-url").fill(source);
    await page.getByLabel("Clip topic", { exact: false }).fill("startup mistakes");
    await page.locator("#clip-topic").press("Enter");
    await page.waitForFunction(() => !activeJobId && CURRENT_HOOKS.length === 1);
    assert.equal(jobs[0].request.topic, "startup mistakes");
    assert.match(await page.locator("#topic-results-summary").textContent(), /startup mistakes.*1 matches/);
    assert.equal(await page.locator(".caption-phrase textarea").count(), 3);
    assert(!String(await page.locator("#hooks-container").textContent()).includes("undefined%"));
    await page.getByLabel("Find a caption", { exact: true }).fill("customers");
    assert.equal(await page.locator(".caption-phrase textarea").count(), 1);
    await page.locator("#caption-search").fill("");
    const first = page.locator("#caption-0");
    await first.fill("Corrected Maya explains the startup mistake.");
    assert.match(await page.locator("#caption-edit-status").textContent(), /saved in this browser/);
    await page.evaluate(() => loadJobs());
    assert.equal(await page.locator("#caption-0").inputValue(), "Corrected Maya explains the startup mistake.");
    await page.locator("#preview-tab-canvas").click();
    assert.match(await page.locator("#canvas-subtitle-preview").textContent(), /Corrected/);
    await first.focus();
    await first.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.id), "caption-1");
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(() => CURRENT_HOOKS.length === 1 && !jobsLoading);
    assert.equal(await page.locator("#clip-topic").inputValue(), "startup mistakes");
    assert.equal(await page.locator("#caption-0").inputValue(), "Corrected Maya explains the startup mistake.");
    await page.locator("#caption-0").fill("");
    await page.locator("#top-render-btn").click();
    assert.equal(starts, 1);
    assert.match(await page.locator("#studio-alert").textContent(), /Correct empty/);
    await page.locator("#caption-reset").click();
    assert.equal(await page.locator("#caption-0").inputValue(), cues[0].text);
    assert(await page.locator("#studio-alert").isHidden());
    await page.locator("#caption-0").fill("Corrected <script> caption & quote.");
    assert.equal(await page.locator("#caption-editor script").count(), 0);
    await page.locator("#caption-0").fill("Maya explains why our startup failed.");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

    await page.locator("#caption-editor").scrollIntoViewIfNeeded();
    spacing.push(await page.evaluate(() => {
      const selectors = [".topic-field", ".topic-field label", "#clip-topic", "#topic-help", "#caption-editor",
        ".caption-editor-heading", ".caption-search-row", "#caption-search", "#caption-reset", "#caption-editor-help",
        "#caption-edit-status", ".caption-phrases", ".caption-phrase", ".caption-phrase label", ".caption-phrase textarea"];
      const number = value => parseFloat(value) || 0;
      const elements = selectors.flatMap(selector => [...document.querySelectorAll(selector)].map((element, index) => {
        const rect = element.getBoundingClientRect(), style = getComputedStyle(element);
        return { id: selector + "-" + index, selector, tag: element.tagName.toLowerCase(),
          label: element.getAttribute("aria-label") || element.textContent.slice(0, 80), interactive: element.matches("input,textarea,button"),
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          clientWidth: element.clientWidth, clientHeight: element.clientHeight, scrollWidth: element.scrollWidth, scrollHeight: element.scrollHeight,
          style: { display: style.display, position: style.position, flexDirection: style.flexDirection, flexWrap: style.flexWrap,
            overflowX: style.overflowX, overflowY: style.overflowY, rowGap: number(style.rowGap), columnGap: number(style.columnGap),
            padding: { top: number(style.paddingTop), right: number(style.paddingRight), bottom: number(style.paddingBottom), left: number(style.paddingLeft) },
            margin: { top: number(style.marginTop), right: number(style.marginRight), bottom: number(style.marginBottom), left: number(style.marginLeft) } } };
      }));
      return { name: `caption-editor-${innerWidth}`, viewport: { width: innerWidth, height: innerHeight }, elements };
    }));
    await page.screenshot({ path: new URL(`studio-features-${width}.png`, artifacts).pathname.replace(/^\/([A-Za-z]:)/, "$1"), fullPage: true });
    await page.locator("#top-render-btn").click();
    await page.waitForFunction(() => Boolean(activeJobId));
    assert.equal(exportPayload.caption_edits[0].text, "Maya explains why our startup failed.");
    assert.equal(exportPayload.caption_edits[0].start, 12.5);
    assert(await page.locator("#caption-0").isDisabled());
    await page.locator("#job-cancel-btn").click();
    await page.waitForFunction(() => !activeJobId);
    await page.locator("#clip-topic").fill("quantum physics");
    await page.locator("#analyze-btn").click();
    await page.waitForFunction(() => !activeJobId && currentAnalysisTopic === "quantum physics");
    assert.equal(await page.locator(".hook-select").count(), 0);
    assert.match(await page.locator("#hooks-container").textContent(), /No matching spoken moments/);
    assert(await page.locator("#top-render-btn").isDisabled());
    await context.close();
    console.log(`Passed topic/caption workflow at ${width}px`);
  }
  assert.deepEqual(errors, []);
  await writeFile(new URL("studio-features-spacing.json", artifacts), JSON.stringify(spacing, null, 2));
} finally {
  await browser.close();
}
