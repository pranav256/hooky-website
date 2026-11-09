import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const studio = process.env.STUDIO_URL || "http://127.0.0.1:8000";
const artifacts = new URL("../.design-review/", import.meta.url);
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [],
  missingAssets = [],
  unknownRoutes = [];
let currentPage;
const hook = {
  id: "moment-1",
  title: "Why small teams ship faster",
  hook_quote: "One clear decision saves everyone time.",
  category: "AI-selected",
  retention_score: 84,
  start: 12.5,
  end: 32.5,
  start_fmt: "0:12",
  end_fmt: "0:32",
  duration: "20.0s",
  dialogue: [{ time: "0:12", text: "One clear decision saves everyone time." }],
};
const source = "https://www.youtube.com/watch?v=abcdefghijk";
const file = {
  name: 'clip_"literal"<b>.mp4',
  rel_path: 'session/clip_"literal"<b>.mp4',
  size_mb: 4.2,
  mtime: 1700000000,
};
file.url =
  "/api/outputs/" + file.rel_path.split("/").map(encodeURIComponent).join("/");
const previousRootFile = { ...file, url: file.url + "?job_id=previous-root" };
try {
  for (const width of [390, 768, 1440, 1728]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    currentPage = page;
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (/\/static\/.*\.(js|css)$/.test(response.url()) && !response.ok())
        missingAssets.push(response.url());
    });
    page.on("dialog", (dialog) => dialog.accept());
    let envFails = true,
      envSaveFails = true,
      outputFails = true,
      doctorFfmpegOk = true,
      statusFails = 1;
    let starts = 0,
      saves = 0,
      previewCalls = 0,
      inflight = 0,
      maxInflight = 0,
      statusCalls = 0;
    let jobRecords = [],
      renderPayload;
    let env = {
      raw: "GEMINI_API_KEY=••••••••\nFFMPEG_THREADS=4\nCUSTOM_VALUE=keep\n",
      values: {
        GEMINI_API_KEY: "••••••••",
        FFMPEG_THREADS: "4",
        CUSTOM_VALUE: "keep",
        GEMINI_MODEL: "gemini-flash-latest",
        SUB_STYLE: "gold",
        AUTO_CLIP_DENSITY_MINUTES: "5",
        GEMINI_MODEL_FALLBACKS: "gemini-flash-latest",
      },
    };
    await page.route("**/api/**", async (route) => {
      const request = route.request(),
        path = new URL(request.url()).pathname,
        method = request.method();
      const respond = (json, status = 200) => route.fulfill({ json, status });
      if (path === "/api/doctor" && method === "GET")
        return respond({
          gpu: "Fixture CPU",
          checks: [
            {
              name: "FFmpeg",
              ok: doctorFfmpegOk,
              detail: doctorFfmpegOk ? "Available" : "Not installed",
              required: true,
            },
            {
              name: "GEMINI_API_KEY",
              ok: false,
              detail: "Add a key in Settings",
              required: true,
            },
            {
              name: "Instagram credentials",
              ok: false,
              detail: "Not set (posting disabled)",
              required: false,
            },
            {
              name: "instagrapi",
              ok: false,
              detail: "Not installed (optional)",
              required: false,
            },
          ],
        });
      if (path === "/api/channels" && method === "GET")
        return respond({
          channels: ["@creator | limit=2 | min_views=10000 | scan=20"],
        });
      if (path === "/api/outputs" && method === "GET")
        return respond(
          outputFails
            ? { detail: "Fixture gallery unavailable" }
            : {
                files: [file, previousRootFile],
                folders: [
                  { name: "Interview <literal>", files: [file] },
                  { name: "Previous output folder", files: [previousRootFile] },
                ],
              },
          outputFails ? 503 : 200,
        );
      if (path === "/api/env" && method === "GET")
        return respond(
          envFails
            ? { detail: "Fixture settings unavailable" }
            : (() => {
                const values = { ...env.values };
                if (values.GEMINI_API_KEY) values.GEMINI_API_KEY = "••••••••";
                return {
                  values,
                  raw:
                    Object.entries(values)
                      .map(([key, value]) => key + "=" + value)
                      .join("\n") + "\n",
                };
              })(),
          envFails ? 503 : 200,
        );
      const parseDraft = (body) => {
        if (!Array.isArray(body.draft) || body.draft.length > 100)
          throw new Error("Fixture requires backend draft contract");
        let values = { ...env.values };
        for (const op of body.draft) {
          const previous = values;
          if (op.raw !== undefined)
            values = Object.fromEntries(
              op.raw
                .trim()
                .split("\n")
                .filter(Boolean)
                .map((line) => {
                  const index = line.indexOf("=");
                  return [line.slice(0, index), line.slice(index + 1)];
                }),
            );
          else values = { ...values, ...op.values };
          for (const key of ["GEMINI_API_KEY", "IG_PASSWORD"])
            if (values[key] === "••••••••") values[key] = previous[key] || "";
        }
        return {
          raw:
            Object.entries(values)
              .map(([key, value]) => key + "=" + value)
              .join("\n") + "\n",
          values,
        };
      };
      const masked = (data) => {
        const values = { ...data.values };
        for (const key of ["GEMINI_API_KEY", "IG_PASSWORD"])
          if (values[key]) values[key] = "••••••••";
        return {
          raw:
            Object.entries(values)
              .map(([key, value]) => key + "=" + value)
              .join("\n") + "\n",
          values,
        };
      };
      if (path === "/api/env/preview" && method === "POST") {
        previewCalls++;
        const body = request.postDataJSON();
        if (JSON.stringify(body).includes("INVALID"))
          return respond({ detail: "Malformed dotenv line" }, 400);
        return respond(masked(parseDraft(body)));
      }
      if (path === "/api/env" && method === "POST") {
        saves++;
        await new Promise((resolve) => setTimeout(resolve, 250));
        if (envSaveFails)
          return respond({ detail: "Fixture save failed" }, 500);
        env = parseDraft(request.postDataJSON());
        return respond({
          ...masked(env),
          status: "saved",
          restart_required: [],
        });
      }
      if (path === "/api/jobs" && method === "GET")
        return respond({ jobs: jobRecords });
      if (
        [
          "/api/analyze/start",
          "/api/jobs/render_clip",
          "/api/jobs/make",
        ].includes(path) &&
        method === "POST"
      ) {
        starts++;
        const body = request.postDataJSON(),
          type = path.includes("analyze")
            ? "analyze"
            : path.includes("render_clip")
              ? "render_clip"
              : "make";
        if (type === "render_clip") renderPayload = body;
        const record = {
          id: "job-" + starts,
          type,
          status: "running",
          progress: 0,
          step: "Starting",
          logs: [],
          log_offset: 0,
          ...body,
          request: body,
          url: body.url || body.target,
        };
        jobRecords.unshift(record);
        return respond({ job_id: record.id, status: "started" });
      }
      const cancel = path.match(/^\/api\/jobs\/([^/]+)\/cancel$/);
      if (cancel && method === "POST") {
        const job = jobRecords.find((item) => item.id === cancel[1]);
        job.status = "cancelled";
        job.step = "Cancelled";
        return respond(job);
      }
      const status = path.match(/^\/api\/(?:jobs|analyze\/status)\/([^/]+)$/);
      if (status && method === "GET") {
        inflight++;
        maxInflight = Math.max(maxInflight, inflight);
        statusCalls++;
        try {
          await new Promise((resolve) => setTimeout(resolve, 1350));
          if (statusFails-- > 0)
            return respond({ detail: "Temporary fixture disconnect" }, 503);
          const job = jobRecords.find((item) => item.id === status[1]);
          if (!job) return respond({ detail: "Unknown fixture job" }, 404);
          if (job.type === "analyze" && job.status === "running") {
            job.status = "completed";
            job.progress = 100;
            job.step = "Analysis complete";
            job.logs = ["first log", "second log"];
            job.result = {
              video_title: "Shipping with a small team",
              hooks: [hook],
              recommended_framing: "fit",
              recommended_style: "gold",
            };
          }
          return respond(job);
        } finally {
          inflight--;
        }
      }
      if (path.startsWith("/api/outputs/"))
        return route.fulfill({
          status: 404,
          body: "Fixture: media playback is disabled",
        });
      unknownRoutes.push(method + " " + path);
      return respond({ detail: "Unexpected fixture API route" }, 501);
    });
    await page.route("https://www.youtube-nocookie.com/**", (route) =>
      route.fulfill({ body: "Fixture source player" }),
    );
    await page.goto(studio, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () => !document.getElementById("analyze-btn").disabled,
    );
    await page.waitForFunction(() =>
      document.getElementById("doctor-status").textContent.includes("complete"),
    );
    for (const field of ["Start", "End"])
      assert.equal(
        await page
          .getByRole("spinbutton", { name: field + " (seconds)", exact: true })
          .getAttribute("id"),
        "timing-" + field.toLowerCase(),
      );
    assert(await page.locator("#setup-health").isHidden());
    assert(await page.locator("#setup-key").isVisible());
    assert.match(
      await page.locator("#doctor-checks-container").textContent(),
      /optional\s+Instagram credentials/,
    );
    doctorFfmpegOk = false;
    await page.evaluate(() => loadDoctorReport());
    assert(await page.locator("#setup-health").isVisible());
    assert(await page.locator("#setup-key").isHidden());
    assert.match(
      await page.locator("#doctor-status").textContent(),
      /failed required checks/,
    );
    doctorFfmpegOk = true;
    await page.evaluate(() => loadDoctorReport());
    await page.locator("#source-url").fill(source);
    await page.locator("#source-url").press("Enter");
    await page.waitForFunction(() =>
      document
        .getElementById("stepper-status-text")
        .textContent.includes("Reconnecting"),
    );
    assert(await page.locator("#analyze-btn").isDisabled());
    await page.waitForFunction(
      () =>
        document.getElementById("hook-count").textContent ===
        "1 hooks detected",
      { timeout: 15000 },
    );
    assert.equal(starts, 1);
    assert.equal(maxInflight, 1);
    assert.equal(
      await page
        .locator("#live-engine-console p")
        .filter({ hasText: "first log" })
        .count(),
      1,
    );
    await page.locator("#timing-start").fill("13.25");
    await page.locator("#timing-end").fill("34.75");
    await page
      .getByRole("button", { name: "Apply timing", exact: true })
      .click();
    await page.locator(".hook-select").focus();
    await page.locator(".hook-select").press("Enter");
    assert(
      await page
        .locator(".hook-select")
        .evaluate((element) => element === document.activeElement),
    );
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(
      () =>
        document.getElementById("hook-count").textContent ===
        "1 hooks detected",
    );
    assert.equal(await page.locator("#source-url").inputValue(), source);
    assert.equal(await page.locator("#timing-start").inputValue(), "13.25");
    await page.locator("#preview-tab-canvas").focus();
    await page.locator("#preview-tab-canvas").press("Enter");
    const captionBefore = await page
      .locator("#canvas-subtitle-preview")
      .textContent();
    await page.locator("#preview-play-btn").focus();
    await page.locator("#preview-play-btn").press("Space");
    assert.equal(
      await page.locator("#preview-play-btn").textContent(),
      "Next caption",
    );
    assert.notEqual(
      await page.locator("#canvas-subtitle-preview").textContent(),
      captionBefore,
    );

    await page.locator("#preview-tab-player").click();
    assert(await page.locator("#youtube-embed-frame").isVisible());
    const captionAfter = await page
      .locator("#canvas-subtitle-preview")
      .textContent();
    await page.evaluate(() => {
      const analysis = jobs.find((job) => job.type === "analyze");
      hydrateAnalysis({
        ...analysis,
        url: "https://vimeo.com/123456789",
        result: { ...analysis.result, hooks: CURRENT_HOOKS },
      });
    });
    assert(await page.locator("#youtube-embed-frame").isHidden());
    assert.equal(
      await page.locator("#youtube-embed-frame").getAttribute("src"),
      "",
    );
    assert(await page.locator("#player-placeholder").isVisible());
    assert.match(
      await page.locator("#player-placeholder").textContent(),
      /Source playback is unavailable.*9:16 canvas/,
    );
    await page.locator("#preview-tab-canvas").click();
    assert(await page.locator("#canvas-subtitle-preview").isVisible());
    assert.equal(
      await page.locator("#canvas-subtitle-preview").textContent(),
      captionAfter,
    );
    await page.evaluate((source) => {
      const analysis = jobs.find((job) => job.type === "analyze");
      hydrateAnalysis({
        ...analysis,
        url: source,
        result: { ...analysis.result, hooks: CURRENT_HOOKS },
      });
    }, source);
    await page.locator("#preview-tab-player").click();
    assert(await page.locator("#youtube-embed-frame").isVisible());
    assert.match(
      await page.locator("#youtube-embed-frame").getAttribute("src"),
      /youtube-nocookie\.com\/embed\/abcdefghijk/,
    );
    assert(await page.locator("#player-placeholder").isHidden());

    assert.equal(starts, 1);
    await page
      .locator("#source-url")
      .fill("https://www.youtube.com/watch?v=zyxwvutsrqp");
    assert(await page.locator("#top-render-btn").isDisabled());
    await page.locator("#source-url").fill(source);
    await page.locator("#timing-start").fill("-1");
    await page
      .getByRole("button", { name: "Apply timing", exact: true })
      .click();
    assert.match(
      await page.locator("#timing-error").textContent(),
      /^Start must be finite/,
    );
    for (const exportButton of ["[data-export-hook]", "#top-render-btn"]) {
      for (const [start, end, invalidField] of [
        ["-1", "34.75", "start"],
        ["13.25", "", "end"],
        ["13.25", "1e309", "end"],
        ["13.25", "12", "end"],
      ]) {
        await page.locator("#timing-start").fill(start);
        await page.locator("#timing-end").fill(end);
        await page.locator(exportButton).click();
        assert.equal(starts, 1);
        assert.match(
          await page.locator("#timing-error").textContent(),
          new RegExp(
            "^" +
              (invalidField === "start" ? "Start" : "End") +
              " must be finite",
          ),
        );
        assert(
          await page
            .locator("#timing-" + invalidField)
            .evaluate((el) => el === document.activeElement),
        );
      }
    }
    await page.locator("#timing-start").fill("13.25");
    await page.locator("#timing-end").fill("34.75");
    await page
      .getByRole("button", { name: "Apply timing", exact: true })
      .click();
    await page.locator("#top-render-btn").click();
    await page.waitForFunction(
      () => !document.getElementById("job-cancel-btn").hidden,
    );
    assert.equal(renderPayload.start, 13.25);
    assert.equal(renderPayload.end, 34.75);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(
      () => !document.getElementById("job-cancel-btn").hidden,
    );
    assert(await page.locator("#source-url").isDisabled());
    assert.equal(starts, 2);
    await page.locator("#job-cancel-btn").click();
    await page.waitForFunction(
      () => document.getElementById("job-cancel-btn").hidden,
    );
    assert.match(
      await page.locator("#stepper-status-text").textContent(),
      /cancelled/,
    );
    const callsAfterCancel = statusCalls;
    await page.waitForTimeout(1600);
    assert.equal(statusCalls, callsAfterCancel);
    jobRecords.unshift({
      id: "interrupted-job",
      type: "make",
      status: "interrupted",
      progress: 30,
      step: "Engine restarted",
      url: source,
      logs: [],
      log_offset: 0,
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.locator(".jobs-history summary").click();
    assert(
      (await page
        .getByRole("button", { name: "Retry job", exact: true })
        .count()) >= 1,
    );
    assert.equal(starts, 2);
    await page.locator("#tab-settings").click();
    assert.match(
      await page.locator("#env-status-alert").textContent(),
      /Couldn’t load/,
    );
    assert(await page.locator("#env-save-btn").isDisabled());
    envFails = false;
    await page.locator("#env-retry-btn").click();
    await page.waitForFunction(
      () => !document.getElementById("env-save-btn").disabled,
    );
    await page.locator("#env-ffmpeg-threads").fill("6");
    await page.locator("#env-save-btn").click();
    await page.evaluate(() => saveEnvForm());
    await page.waitForFunction(
      () =>
        document.getElementById("env-status-alert").dataset.state === "error",
    );
    assert.equal(saves, 1);
    assert.equal(await page.locator("#env-ffmpeg-threads").inputValue(), "6");
    await page.locator("#env-tab-raw").click();
    await page.waitForFunction(
      () =>
        !document.getElementById("env-raw-view").classList.contains("hidden"),
    );
    assert.match(
      await page.locator("#env-raw-textarea").inputValue(),
      /FFMPEG_THREADS=6/,
    );
    await page
      .locator("#env-raw-textarea")
      .fill("GEMINI_API_KEY=••••••••\nFFMPEG_THREADS=7\nCUSTOM_VALUE=draft\n");
    await page.locator("#env-tab-form").click();
    await page.waitForFunction(
      () =>
        !document.getElementById("env-form-view").classList.contains("hidden"),
    );
    assert.equal(await page.locator("#env-ffmpeg-threads").inputValue(), "7");
    envSaveFails = false;
    await page.locator("#env-save-btn").click();
    await page.waitForFunction(
      () =>
        document.getElementById("env-status-alert").dataset.state === "saved",
    );
    assert.match(env.raw, /CUSTOM_VALUE=draft/);
    assert.equal(env.values.GEMINI_API_KEY, "••••••••");
    assert(previewCalls >= 2);
    await page.locator("#env-gemini-key").fill("new-form-key");
    await page.locator("#env-tab-raw").click();
    await page.waitForFunction(
      () =>
        !document.getElementById("env-raw-view").classList.contains("hidden"),
    );
    assert(
      !(await page.locator("#env-raw-textarea").inputValue()).includes(
        "new-form-key",
      ),
    );
    await page.locator("#env-save-btn").click();
    await page.waitForFunction(
      () =>
        document.getElementById("env-status-alert").dataset.state === "saved",
    );
    assert.equal(env.values.GEMINI_API_KEY, "new-form-key");
    await page
      .locator("#env-raw-textarea")
      .fill(
        "GEMINI_API_KEY=new-raw-key\nFFMPEG_THREADS=7\nCUSTOM_VALUE=draft\n",
      );
    await page.locator("#env-tab-form").click();
    await page.waitForFunction(
      () =>
        !document.getElementById("env-form-view").classList.contains("hidden"),
    );
    await page.locator("#env-ffmpeg-threads").fill("8");
    await page.locator("#env-tab-raw").click();
    await page.waitForFunction(
      () =>
        !document.getElementById("env-raw-view").classList.contains("hidden"),
    );
    const draftRaw = await page.locator("#env-raw-textarea").inputValue();
    await page
      .locator("#env-raw-textarea")
      .fill(draftRaw + "EXTRA=draft-after-switch\n");
    await page.locator("#env-tab-form").click();
    await page.waitForFunction(
      () =>
        !document.getElementById("env-form-view").classList.contains("hidden"),
    );
    await page.locator("#env-save-btn").click();
    await page.waitForFunction(
      () =>
        document.getElementById("env-status-alert").dataset.state === "saved",
    );
    assert.equal(env.values.GEMINI_API_KEY, "new-raw-key");
    assert.equal(env.values.EXTRA, "draft-after-switch");
    assert.equal(env.values.FFMPEG_THREADS, "8");

    await page.locator("#env-ffmpeg-threads").fill("9");
    await page.locator("#tab-gallery").click();
    await page.locator("#tab-settings").click();
    assert.equal(await page.locator("#env-ffmpeg-threads").inputValue(), "9");
    await page.locator("#env-discard-btn").click();
    await page.waitForFunction(
      () => document.getElementById("env-ffmpeg-threads").value === "8",
    );
    await page.locator("#tab-gallery").click();
    assert.match(
      await page.locator("#outputs-status").textContent(),
      /Couldn’t load/,
    );
    outputFails = false;
    await page.locator("#outputs-retry-btn").click();
    await page.waitForFunction(
      () => document.querySelectorAll(".output-card").length === 2,
    );
    assert.equal(await page.locator("#outputs-grid b").count(), 0);
    assert.match(
      await page.locator(".output-card").first().textContent(),
      /literal/,
    );
    const token = await page.evaluate(() => window.__HOOKY_TOKEN__);
    for (const [index, expectedJobId] of [
      [0, null],
      [1, "previous-root"],
    ]) {
      const card = page.locator(".output-card").nth(index);
      const downloadUrl = new URL(
        await card.getByRole("link").getAttribute("href"),
        studio,
      );
      assert.equal(downloadUrl.pathname, new URL(file.url, studio).pathname);
      assert.equal(downloadUrl.searchParams.get("job_id"), expectedJobId);
      assert.equal(downloadUrl.searchParams.get("token"), token);
      const watch = card.getByRole("button", { name: "Watch", exact: true });
      await watch.focus();
      await watch.press("Enter");
      assert(
        await page
          .locator("#gallery-close-btn")
          .evaluate((element) => element === document.activeElement),
      );
      assert.equal(
        await page.locator("#video-source-elem").getAttribute("src"),
        downloadUrl.pathname + downloadUrl.search,
      );
      await page
        .locator("#gallery-close-btn")
        .press(index === 0 ? "Enter" : "Escape");
      assert(await page.locator("#active-video-player-box").isHidden());
      assert(
        await watch.evaluate((element) => element === document.activeElement),
      );
      await watch.press("Escape");
      assert(
        await watch.evaluate((element) => element === document.activeElement),
      );
    }
    await page.evaluate(() => playOutputVideo("folder\\clip name.mp4"));
    const legacyUrl = new URL(
      await page.locator("#video-source-elem").getAttribute("src"),
      studio,
    );
    assert.equal(legacyUrl.pathname, "/api/outputs/folder/clip%20name.mp4");
    assert.equal(legacyUrl.searchParams.get("token"), token);
    await page.locator("#gallery-close-btn").click();
    for (const invalidUrl of [
      "https://example.com/clip.mp4",
      "/api/env",
      "/api/outputs/../env",
    ]) {
      assert(
        await page.evaluate((url) => {
          try {
            outputVideoUrl("clip.mp4", url);
            return false;
          } catch {
            return true;
          }
        }, invalidUrl),
      );
    }
    outputFails = true;
    await page.locator("#outputs-refresh-btn").click();
    await page.waitForFunction(
      () => document.getElementById("outputs-status").dataset.state === "error",
    );
    assert.equal(await page.locator(".output-card").count(), 2);
    await page.locator("#tab-studio").click();
    const stored = await page.evaluate(() =>
      localStorage.getItem("hooky_studio_v1"),
    );
    assert(!stored.includes("GEMINI_API_KEY") && !stored.includes("dialogue"));
    await page.evaluate(() => {
      for (let index = 0; index < 300; index++)
        appendConsoleLog("fixture line " + index);
    });
    assert.equal(await page.locator("#live-engine-console p").count(), 200);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Horizontal overflow at " + width,
    );
    for (const id of [
      "job-cancel-btn",
      "preview-tab-player",
      "preview-tab-canvas",
      "timing-start",
      "timing-end",
    ]) {
      const target = page.locator("#" + id);
      if (await target.isVisible()) {
        const box = await target.boundingBox();
        assert(
          box.height >= 44 || width > 760,
          "Touch control too short: " + id,
        );
      }
    }

    if (width === 390) {
      await page.evaluate(() =>
        retryJob(
          jobs.find(
            (job) => job.type === "render_clip" && job.status === "cancelled",
          ),
        ),
      );
      await page.waitForFunction(
        () => !document.getElementById("job-cancel-btn").hidden,
      );
      assert.equal(starts, 3);
      assert.equal(renderPayload.start, 13.25);
      jobRecords[0].status = "completed";
      jobRecords[0].progress = 100;
      jobRecords[0].output_file = file.rel_path;
      await page.waitForFunction(
        () => document.getElementById("job-cancel-btn").hidden,
      );
      assert.match(
        await page.locator("#stepper-status-text").textContent(),
        /completed/,
      );
      await page.locator("#execute-make-btn").click();
      await page.waitForFunction(
        () => !document.getElementById("job-cancel-btn").hidden,
      );
      jobRecords[0].status = "failed";
      jobRecords[0].error = "Fixture pipeline failed";
      await page.waitForFunction(
        () => document.getElementById("job-cancel-btn").hidden,
      );
      assert.match(
        await page.locator("#studio-alert").textContent(),
        /Fixture pipeline failed/,
      );
      assert(await page.locator("#analyze-btn").isEnabled());
      env = { raw: "", values: {} };
      await page.locator("#tab-settings").click();
      await page.evaluate(() => loadEnvConfig(true));
      assert.equal(
        await page.locator("#env-gemini-model option:checked").textContent(),
        "Use engine default",
      );
      assert.equal(
        await page.locator("#env-sub-style option:checked").textContent(),
        "Use engine default",
      );
      await page.locator("#env-gemini-key").fill("first-run-key");
      await page.locator("#env-save-btn").click();
      await page.waitForFunction(
        () =>
          document.getElementById("env-status-alert").dataset.state === "saved",
      );
      assert.equal(env.values.GEMINI_API_KEY, "first-run-key");
      assert.equal(env.values.FFMPEG_THREADS, undefined);
    }
    await context.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(missingAssets, []);
  assert.deepEqual(unknownRoutes, []);
  console.log(
    "Passed Studio workflow at 390, 768, 1440 and 1728: sequential delayed polls/reconnect, source/job/timing reload, optional health checks, source preview recovery, Start/End export validation, cancel/interrupted history, dirty settings and editor synchronization, safe current/historical gallery URLs, retry/retained gallery, literal text, keyboard focus, bounded logs and geometry.",
  );
} catch (error) {
  if (currentPage && !currentPage.isClosed())
    await currentPage
      .screenshot({
        path: new URL(
          "studio-workflow-failure.png",
          artifacts,
        ).pathname.replace(/^\/([A-Za-z]:)/, "$1"),
        fullPage: true,
      })
      .catch(() => {});
  await writeFile(
    new URL("studio-workflow-errors.json", artifacts),
    JSON.stringify(
      { error: String(error), errors, missingAssets, unknownRoutes },
      null,
      2,
    ),
  );
  throw error;
} finally {
  await browser.close();
}
