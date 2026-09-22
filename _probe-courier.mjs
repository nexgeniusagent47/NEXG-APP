import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
p.on("pageerror", e => console.log("[pageerror]", e.message.slice(0,150)));
await p.goto("http://127.0.0.1:3000/?page=courier_onboarding", {waitUntil:"domcontentloaded"});
await p.waitForTimeout(4500);
const info = await p.evaluate(() => ({
  bodyText: (document.body.innerText || "").trim().slice(0, 700),
  buttons: [...document.querySelectorAll("button")].slice(0, 14).map(b => (b.innerText||"").trim().slice(0,40)).filter(Boolean),
  inputs: [...document.querySelectorAll("input,select")].slice(0, 10).map(i => `${i.tagName}[${i.type||""}]${i.id?("#"+i.id):""}`),
  dialogs: document.querySelectorAll("[role=dialog]").length,
}));
console.log("BODY:", JSON.stringify(info.bodyText.slice(0,600)));
console.log("BUTTONS:", JSON.stringify(info.buttons));
console.log("INPUTS:", JSON.stringify(info.inputs));
await b.close();
