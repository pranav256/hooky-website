import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
const out = ".design-review";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const states = [];
for (const width of [390, 1440, 1728]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.screenshot({
    path: `${out}/website-${width}.png`,
    fullPage: true,
  });
  await page
    .locator("#cockpit")
    .screenshot({ path: `${out}/website-studio-${width}.png` });
  const evidence = await page.evaluate(() => ({
    viewport: { width: innerWidth, height: innerHeight },
    name: `Website ${innerWidth}`,
    overflow: document.documentElement.scrollWidth > innerWidth,
    elements: [
      ...document.querySelectorAll(
        "h1,h2,.hero-buttons a,.site-header,.hero-copy,.clip-collage,.section-heading,.workflow-step,.demo-shell,.moment-card,.demo-inspector,.install-terminal,.faq-row",
      ),
    ].map((el, i) => {
      const r = el.getBoundingClientRect(),
        s = getComputedStyle(el);
      return {
        id: `element-${i}`,
        label: (el.textContent || "").trim().slice(0, 70),
        selector: el.className,
        tag: el.tagName.toLowerCase(),
        interactive: el.matches("button,a"),
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
        style: {
          display: s.display,
          columnGap: parseFloat(s.columnGap) || 0,
          rowGap: parseFloat(s.rowGap) || 0,
          padding: {
            top: parseFloat(s.paddingTop),
            bottom: parseFloat(s.paddingBottom),
            left: parseFloat(s.paddingLeft),
            right: parseFloat(s.paddingRight),
          },
        },
      };
    }),
  }));
  states.push(evidence);
}
writeFileSync(`${out}/rendered-dom.json`, JSON.stringify(states, null, 2));
writeFileSync(`${out}/browser-errors.json`, JSON.stringify(errors));
console.log(
  JSON.stringify({
    states: states.map((s) => ({
      width: s.viewport.width,
      overflow: s.overflow,
    })),
    errors,
  }),
);
await browser.close();
