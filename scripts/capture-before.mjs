import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const out = ".design-review";
mkdirSync(out, { recursive: true });
const studio = execFileSync(
  "git",
  ["show", "HEAD:hooky/web/static/index.html"],
  { cwd: resolve(process.env.HOOKY_DIR || "../Hooky"), encoding: "utf8" },
);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.route("**/api/**", (route) =>
  route.fulfill({
    json: { checks: [], channels: [], files: [], values: {}, raw: "" },
  }),
);
for (const width of [390, 1440, 1728]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.setContent(studio, { waitUntil: "networkidle" });
  await page.screenshot({
    path: `${out}/studio-before-${width}.png`,
    fullPage: true,
  });
}
writeFileSync(`${out}/studio-before.html`, studio);
await browser.close();
console.log("Captured studio before redesign.");
