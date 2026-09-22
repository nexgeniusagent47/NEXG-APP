import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext()).newPage();
await p.setContent(`<iframe id=f src="http://localhost:3000/?page=spa" width="390" height="844"></iframe>`);
await p.waitForTimeout(6000);
const r = await p.evaluate(() => {
  const f = document.getElementById("f");
  return { cd: f.contentDocument === null ? "NULL" : "readable", win: !!f.contentWindow };
});
console.log("parent view:", JSON.stringify(r));
const fh = await p.$("#f");
const fr = await fh.contentFrame();
console.log("contentFrame():", fr ? "available" : "null");
if (fr) {
  const inner = await fr.evaluate(() => ({
    search: location.search,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyChars: (document.body.innerText || "").trim().length,
  }));
  console.log("inner measurement:", JSON.stringify(inner));
}
await b.close();
