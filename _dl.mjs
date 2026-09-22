import { spawnSync } from "node:child_process";
import fs from "node:fs";
const url = "https://codeload.github.com/jakubkrehel/skills/tar.gz/refs/heads/main";
const out = "logs/skills-staging/jakubkrehel-skills.tar.gz";
fs.mkdirSync("logs/skills-staging", { recursive: true });
const res = await fetch(url);
if (!res.ok) { console.log("DOWNLOAD FAILED", res.status); process.exit(1); }
const buf = Buffer.from(await res.arrayBuffer());
fs.writeFileSync(out, buf);
console.log("downloaded bytes:", buf.length, "magic:", buf.subarray(0,2).toString("hex"));
