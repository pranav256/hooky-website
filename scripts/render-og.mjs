import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const font = readFileSync("public/fonts/space-grotesk.woff2").toString(
  "base64",
);
const portrait = readFileSync("public/images/portrait.jpg").toString("base64");
const mountain = readFileSync("public/images/mountains.jpg").toString("base64");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(
  `<style>@font-face{font-family:Space;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;background:#101110;color:#f3f5ec;font-family:Space,Arial}main{height:630px;padding:60px 65px;position:relative;overflow:hidden}.brand{font-weight:600;font-size:30px;letter-spacing:-1.5px;color:#d2fa69}.badge{display:inline-block;font:11px monospace;letter-spacing:2px;color:#b0b5a8;margin-left:26px}h1{font-size:103px;line-height:.98;font-weight:500;letter-spacing:-8px;margin:74px 0 24px}h1 span{color:#d2fa69}p{font-size:19px;color:#b0b5a8;line-height:1.5;max-width:580px}.bottom{position:absolute;bottom:52px;left:65px;font:12px monospace;letter-spacing:1px;color:#b0b5a8}.card{position:absolute;border:1px solid #ffffff40;border-radius:14px;width:224px;height:399px;top:122px;right:107px;transform:rotate(7deg);overflow:hidden;background:#252721;box-shadow:0 25px 60px #0008}.card.back{right:250px;top:151px;transform:rotate(-12deg);width:206px;height:367px}.card img{width:100%;height:100%;object-fit:cover;filter:saturate(.6)}.card:after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 40%,#000b)}.caption{position:absolute;bottom:45px;left:16px;right:16px;font-size:25px;font-weight:700;line-height:1.1;z-index:2;text-align:center;color:white}.caption strong{display:block;color:#101110;background:#d2fa69;padding:3px;margin-top:4px}.card.back .caption{font-size:24px;font-style:italic;font-family:Georgia;color:#b8a0fc}.meta{position:absolute;top:18px;left:16px;color:white;font:8px monospace;z-index:2}</style><main><div class="brand">hooky. <span class="badge">FREE & OPEN SOURCE</span></div><h1>Long story.<br><span>Short form.</span></h1><p>Turn your long videos into shorts<br>worth watching. On your machine.</p><div class="bottom">YOUR FOOTAGE. YOUR MACHINE. YOUR RULES.</div><div class="card back"><img src="data:image/jpeg;base64,${mountain}"><span class="meta">THE NEXT GOOD MOMENT</span><div class="caption">A different<br>perspective.</div></div><div class="card"><img src="data:image/jpeg;base64,${portrait}"><span class="meta">THE CREATIVE MIND</span><div class="caption">MAKE SOMETHING<strong>WORTH WATCHING.</strong></div></div></main>`,
);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og-image.png" });
await browser.close();
console.log("Social sharing image rendered.");
