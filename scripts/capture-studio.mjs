import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
const out = ".design-review";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const states = [];
for (const width of [390, 1440, 1728]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("http://127.0.0.1:8000", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  for (const view of ["studio", "settings", "radar", "gallery", "doctor"]) {
    await page.locator(`#tab-${view}`).click();
    await page.screenshot({
      path: `${out}/studio-${view}-${width}.png`,
      fullPage: true,
    });
    const state = await page.evaluate(
      (view) => ({
        name: `Studio ${view} ${innerWidth}`,
        viewport: { width: innerWidth, height: innerHeight },
        overflow: document.documentElement.scrollWidth > innerWidth,
        elements: [
          ...document.querySelectorAll(
            `#view-${view} h1,#view-${view} h2,#view-${view} button,.studio-header,.studio-sidebar,.studio-command,.studio-workbench,.studio-empty`,
          ),
        ]
          .filter((el) => el.getBoundingClientRect().height > 0)
          .map((el, i) => {
            const r = el.getBoundingClientRect(),
              s = getComputedStyle(el);
            return {
              id: `${view}-${i}`,
              label: el.textContent.trim().slice(0, 70),
              rect: { x: r.x, y: r.y, width: r.width, height: r.height },
              interactive: el.matches("button"),
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
      }),
      view,
    );
    states.push(state);
  }
}
writeFileSync(
  `${out}/studio-rendered-dom.json`,
  JSON.stringify(states, null, 2),
);
console.log(
  JSON.stringify({
    overflow: states.filter((s) => s.overflow).map((s) => s.name),
    errors,
  }),
);
await browser.close();
