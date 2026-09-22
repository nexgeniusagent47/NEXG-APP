import { chromium } from "playwright";
const t0 = Date.now();
try {
  const b = await chromium.launch({ channel: "chromium" });
  const p = await b.newPage();
  await p.setContent("<h1 id=x>ok</h1>");
  const txt = await p.textContent("#x");
  console.log("LAUNCH OK via channel:chromium in", Date.now()-t0, "ms, text =", txt, "| version", b.version());
  await b.close();
} catch (e) {
  console.log("FAILED:", String(e).split("\n").slice(0,3).join(" | "));
}
