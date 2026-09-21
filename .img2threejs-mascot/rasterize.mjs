// Rasterize the mascot SVG for the img2threejs intake pipeline.
// Writes two PNGs: the full illustration, and a background-stripped variant
// whose alpha channel the silhouette / interior-difference gates can measure.
import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ws = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const svgPath = path.join(ws, "mascot.svg");
const svg = await readFile(svgPath, "utf8");

// The skill's gates measure silhouette against a transparent alpha channel.
// The artwork ships its own grey backdrop group, so drop it for the cutout.
const stripped = svg.replace(/<g id="background">[\s\S]*?<\/g>\s*/, "");

const targets = [
  { file: "mascot-full.png", markup: svg },
  { file: "mascot-cutout.png", markup: stripped },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 709, height: 1024 }, deviceScaleFactor: 2 });

for (const t of targets) {
  const b64 = Buffer.from(t.markup, "utf8").toString("base64");
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:transparent">` +
      `<img id="a" src="data:image/svg+xml;base64,${b64}" width="709" height="1024">` +
      `</body></html>`,
    { waitUntil: "load" }
  );
  await page.waitForFunction(() => {
    const el = document.getElementById("a");
    return el && el.complete && el.naturalWidth > 0;
  });
  const buf = await page.locator("#a").screenshot({ omitBackground: true });
  const out = path.join(ws, t.file);
  await writeFile(out, buf);
  console.log(`wrote ${t.file} (${buf.length} bytes)`);
}

await browser.close();
