import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

// The CI runner supplies an isolated Studio. Project reads/writes use its real API.
const studio = process.env.STUDIO_URL;
if (!studio) throw new Error("Run check:browser-ci, or set STUDIO_URL to an isolated Studio. This check writes test projects.");
const artifacts = new URL("../.design-review/", import.meta.url);
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [], spacing = [];
const source = "https://www.youtube.com/watch?v=abcdefghijk&feature=share";
const cue = { start: 10, end: 15, text: "Talk to customers before building." };
const hooks = [1, 2].map(index => ({ id: `hook_${index}`, title: `Founder lesson ${index}`,
  start: 10, end: 30, start_fmt: "0:10", end_fmt: "0:30", duration: "20.0s", cues: [cue], hook_quote: cue.text }));
let starts = 0, failSave = false, failRead = false, failList = false, exportPayload;
async function newPage(width) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  await context.route("**/*", route => {
    const url = new URL(route.request().url());
    if (url.origin === new URL(studio).origin) return route.fallback();
    if (url.hostname === "www.youtube-nocookie.com") return route.fulfill({ contentType: "text/html", body: "Video fixture" });
    return route.abort();
  });
  let jobs = [];
  await page.route("**/api/**", route => {
    const request = route.request(), path = new URL(request.url()).pathname, method = request.method();
    if (path.startsWith("/api/projects")) {
      if ((failSave && method !== "GET") || (failRead && method === "GET" && path !== "/api/projects") || (failList && path === "/api/projects" && method === "GET"))
        return route.fulfill({ status: 503, json: { detail: "Fixture disk unavailable." } });
      return route.fallback();
    }
    const fixtures = { "/api/doctor": { checks: [], gpu: "Fixture CPU" }, "/api/env": { values: {}, raw: "" },
      "/api/channels": { channels: [] }, "/api/outputs": { files: [] }, "/api/jobs": { jobs } };
    if (fixtures[path]) return route.fulfill({ json: fixtures[path] });
    if (["/api/analyze/start", "/api/jobs/render_clip"].includes(path)) {
      const payload = request.postDataJSON(), type = path.includes("analyze") ? "analyze" : "render_clip";
      const job = { id: `${type}_${++starts}`, type, url: payload.url, request: payload, status: "running", progress: 0,
        result: type === "analyze" ? { video_title: "Founder interview", topic: "founder lessons", hooks,
          recommended_framing: "fit", recommended_style: "clean" } : null };
      jobs.unshift(job);
      if (type === "render_clip") exportPayload = payload;
      return route.fulfill({ json: { job_id: job.id } });
    }
    const status = path.match(/^\/api\/(?:jobs|analyze\/status)\/([^/]+)(\/cancel)?$/);
    if (status) {
      const job = jobs.find(job => job.id === status[1]);
      if (status[2]) job.status = "cancelled";
      else if (job.type === "analyze") { job.status = "completed"; job.progress = 100; }
      return route.fulfill({ json: job });
    }
    errors.push(`Unexpected fixture route: ${method} ${path}`);
    return route.fulfill({ status: 404, json: { detail: "Unexpected route" } });
  });
  await page.goto(studio, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !projectLoading && !jobsLoading);
  return { page, context, clearJobs: () => { jobs = []; } };
}
async function save(page, selector = "#project-save") {
  await page.locator(selector).click();
  await page.waitForFunction(() => !projectLoading);
}
async function open(page, id) {
  await page.locator("#project-list").selectOption(id);
  await page.locator("#project-open").click();
  await page.waitForFunction(() => !projectLoading);
}
try {
  for (const width of [390, 768, 1440, 1728]) {
    const { page, context, clearJobs } = await newPage(width), before = starts;
    await page.locator("#source-url").fill(source);
    await page.locator("#analyze-btn").click();
    await page.waitForFunction(() => !activeJobId && CURRENT_HOOKS.length === 2);
    await page.locator('[data-hook-id="hook_2"].hook-select').click();
    await page.locator("#caption-0").fill("Corrected founder name.");
    await page.locator("#timing-start").fill("11.5");
    await page.locator("#timing-end").fill("28.5");
    await page.locator("#frame-mode-center").click();
    await page.locator("#sub-mode-clean").click();
    await page.locator("#project-name").fill("");
    await save(page);
    assert.match(await page.locator("#project-status").textContent(), /Enter a project name/);
    await page.locator("#project-name").fill(`Founder <script> ${width}`);
    await save(page);
    const firstId = await page.evaluate(() => currentProject.id);
    assert(await page.evaluate(() => !projectDirty()));
    assert.equal(await page.locator(".project-panel script").count(), 0);
    assert.equal(await page.locator("#project-list").inputValue(), firstId);

    const peer = await newPage(width);
    await open(peer.page, firstId);
    assert.equal(starts, before + 1);
    assert.equal(await peer.page.evaluate(() => selectedHookId), "hook_2");
    assert.equal(await peer.page.locator("#caption-0").inputValue(), "Corrected founder name.");
    assert.equal(await peer.page.locator("#timing-start").inputValue(), "11.5");
    assert.equal(await peer.page.evaluate(() => activeFramingMode), "center");
    assert.equal(await peer.page.evaluate(() => activeSubtitleMode), "clean");

    await page.locator("#caption-0").fill("Newer saved correction.");
    await save(page);
    await peer.page.locator("#caption-0").fill("Other tab's correction.");
    await save(peer.page);
    assert.match(await peer.page.locator("#project-status").textContent(), /changed in another tab/);
    assert.equal(await peer.page.locator("#caption-0").inputValue(), "Other tab's correction.");
    await save(peer.page, "#project-copy");
    const copyId = await peer.page.evaluate(() => currentProject.id);
    assert.notEqual(copyId, firstId);
    assert(await peer.page.evaluate(() => !projectDirty()));
    await peer.context.close();

    await page.locator("#project-name").fill(`Renamed interview ${width}`);
    await save(page);
    assert.equal(await page.evaluate(() => currentProject.id), firstId);
    await page.locator("#caption-0").fill("Unsaved local correction.");
    await page.evaluate(() => loadJobs());
    assert.equal(await page.locator("#caption-0").inputValue(), "Unsaved local correction.");
    clearJobs();
    failRead = true;
    page.once("dialog", dialog => dialog.accept());
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(() => !projectLoading && !jobsLoading);
    assert.match(await page.locator("#project-status").textContent(), /Could not load projects/);
    failRead = false;
    await page.locator("#project-refresh").click();
    await page.waitForFunction(() => !projectLoading && !jobsLoading && CURRENT_HOOKS.length === 2);
    assert.equal(await page.locator("#source-url").inputValue(), source);
    assert.equal(await page.locator("#caption-0").inputValue(), "Unsaved local correction.");
    assert(await page.evaluate(() => projectDirty()));
    await page.locator("#project-list").selectOption(copyId);
    page.once("dialog", dialog => dialog.dismiss());
    await open(page, copyId);
    assert.equal(await page.evaluate(() => currentProject.id), firstId);
    page.once("dialog", dialog => dialog.accept());
    await open(page, copyId);
    assert.equal(await page.locator("#caption-0").inputValue(), "Other tab's correction.");
    assert(await page.evaluate(() => !projectDirty()));

    failRead = true;
    await open(page, firstId);
    assert.equal(await page.evaluate(() => currentProject.id), copyId);
    assert.match(await page.locator("#project-status").textContent(), /current edits were kept/);
    failRead = false;
    await open(page, firstId);
    assert.equal(await page.locator("#caption-0").inputValue(), "Newer saved correction.");
    failList = true;
    await page.evaluate(() => loadProjects());
    await page.waitForFunction(() => !projectLoading);
    assert.match(await page.locator("#project-status").textContent(), /Refresh list to retry/);
    failList = false;
    await page.locator("#project-refresh").click();
    await page.waitForFunction(() => !projectLoading);

    failSave = true;
    await page.locator("#caption-0").fill("Final founder caption.");
    await save(page);
    assert.match(await page.locator("#project-status").textContent(), /edits are still here/);
    failSave = false;
    await save(page);
    assert(await page.evaluate(() => !projectDirty()));
    await page.locator("#caption-0").fill("");
    await save(page);
    assert.match(await page.locator("#project-status").textContent(), /Could not save project/);
    await page.locator("#caption-0").fill("Final founder caption.");
    await save(page);
    await page.locator("#project-name").focus();
    await page.locator("#project-name").press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.id), "project-save");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator(".project-panel").scrollIntoViewIfNeeded();
    spacing.push(await page.evaluate(() => {
      const elements = [...document.querySelectorAll(".project-panel, .project-panel h2, .project-panel p, .project-row, .project-field, .project-field label, .project-field input, .project-field select, .project-row button")].filter(element => element.getClientRects().length).map((element, index) => {
        const r = element.getBoundingClientRect(), s = getComputedStyle(element), number = value => parseFloat(value) || 0;
        return { id: element.id || `project-element-${index}`, tag: element.tagName.toLowerCase(), label: element.textContent.slice(0, 80),
          interactive: element.matches("input,select,button"), rect: { x: r.x, y: r.y, width: r.width, height: r.height },
          clientWidth: element.clientWidth, clientHeight: element.clientHeight, scrollWidth: element.scrollWidth, scrollHeight: element.scrollHeight,
          style: { display: s.display, position: s.position, flexDirection: s.flexDirection, flexWrap: s.flexWrap,
            overflowX: s.overflowX, overflowY: s.overflowY, rowGap: number(s.rowGap), columnGap: number(s.columnGap),
            padding: { top: number(s.paddingTop), right: number(s.paddingRight), bottom: number(s.paddingBottom), left: number(s.paddingLeft) },
            margin: { top: number(s.marginTop), right: number(s.marginRight), bottom: number(s.marginBottom), left: number(s.marginLeft) } } };
      });
      return { name: `projects-${innerWidth}`, viewport: { width: innerWidth, height: innerHeight }, elements };
    }));
    await page.screenshot({ path: new URL(`studio-projects-${width}.png`, artifacts).pathname.replace(/^\/([A-Za-z]:)/, "$1"), fullPage: true });
    await page.locator("#top-render-btn").click();
    await page.waitForFunction(() => Boolean(activeJobId));
    assert.equal(exportPayload.caption_edits[0].text, "Final founder caption.");
    assert.equal(exportPayload.start, 11.5);
    assert(await page.locator("#project-open").isDisabled());
    await page.locator("#job-cancel-btn").click();
    await page.waitForFunction(() => !activeJobId);
    await context.close();
    console.log(`Passed real project save/open, concurrent tabs and recovery at ${width}px`);
  }
  assert.deepEqual(errors, []);
  await writeFile(new URL("studio-projects-spacing.json", artifacts), JSON.stringify(spacing, null, 2));
} finally {
  await browser.close();
}
