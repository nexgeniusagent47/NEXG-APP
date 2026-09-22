import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1280,height:1000}, locale:"en-KE"})).newPage();
const errs = [];
p.on("pageerror", e => errs.push(e.message.slice(0,200)));
p.on("console", m => { if (m.type()==="error") errs.push("console: "+m.text().slice(0,160)); });
await p.goto("http://127.0.0.1:3000/datetime.html", {waitUntil:"domcontentloaded"});
await p.waitForTimeout(4000);
const info = await p.evaluate(() => ({
  triggers: document.querySelectorAll('button[aria-haspopup="dialog"]').length,
  stored: document.querySelector('[data-testid=stored]')?.innerText.slice(0,200),
  h1: document.querySelector('h1')?.innerText,
  native: document.querySelectorAll('input[type=date],input[type=time]').length,
}));
console.log("triggers:", info.triggers, "| native inputs:", info.native);
console.log("h1:", info.h1);
console.log("errors:", errs.length ? errs.slice(0,3) : "none");
await p.screenshot({path:"logs/critique/datetime-gallery.png", fullPage:false});
console.log("screenshot: logs/critique/datetime-gallery.png");
await b.close();
