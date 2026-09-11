// Dev-only: screenshot key pages for visual review.
//   node scripts/shots.mjs
import { chromium } from "playwright-core";
import path from "node:path";

const OUT = process.argv[2] || ".";
const BASE = "http://localhost:3000";
const pages = [
  ["home", "/"],
  ["sobre", "/sobre"],
  ["contato", "/contato"],
  ["blog", "/blog"],
  ["artigo", "/blog/custo-real-de-arrematar-imovel-em-leilao"],
];

const browser = await chromium.launch({ channel: "msedge" });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
for (const [name, url] of pages) {
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  // Scroll through so IntersectionObserver-driven reveals trigger.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  console.log(name);
  await page.close();
}
await browser.close();
