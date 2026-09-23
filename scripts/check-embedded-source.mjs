// scripts/check-embedded-source.mjs
//
// Guard for the mistake this repository has now made six times: a backtick typed INSIDE a
// template literal that holds browser JavaScript. One stray backtick terminates the literal
// early, and because the terminator is often inside a comment the file still looks correct
// while everything after it becomes string content.
//
//   scripts/device-room/measure.mjs        4 occurrences while it was written
//   scripts/contrast-probe.mjs             2 occurrences, both in comments naming a
//                                          variable or an event handler
//
// Counting backticks in a file cannot work — several of these files legitimately name the
// character in prose. Instead each target declares its opening marker and the regex that
// matches its closing line, and the check is exact: the FIRST backtick after the opening
// delimiter must be the delimiter that closes it. Anything earlier is the bug, and the
// line is named.
//
// The line scan is backed by a functional check that a swallowed literal cannot satisfy:
// the module is imported and its exported source is compiled with `new Function`. A literal
// closed early by a stray backtick leaves the rest of the file inside the string, so the
// export does not parse — which is exactly how the four measure.mjs occurrences presented.
//
// Usage: node scripts/check-embedded-source.mjs
// Exit 0 = every embedded source is intact. Exit 1 = one is broken, and which line.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const TARGETS = [
  {
    file: 'scripts/contrast-probe.mjs',
    open: 'CONTRAST_PROBE = String.raw`',
    close: /^\}\)\(\)`;\s*$/,
    exportName: 'CONTRAST_PROBE',
    describe: 'the contrast probe',
  },
  {
    file: 'scripts/device-room/measure.mjs',
    open: 'MEASURE_SOURCE = `',
    close: /^\}`;\s*$/,
    exportName: 'MEASURE_SOURCE',
    describe: 'the device-room measurement function',
  },
  {
    // One line holds both delimiters, so there is no interior to scan and only the
    // functional check applies.
    file: 'scripts/device-room/measure-page.mjs',
    open: 'EVALUATE_EXPRESSION = `',
    close: null,
    exportName: 'EVALUATE_EXPRESSION',
    describe: 'the device-room evaluate expression',
  },
];

const problems = [];

for (const t of TARGETS) {
  const abs = path.join(ROOT, t.file);
  if (!fs.existsSync(abs)) {
    problems.push(`${t.file}: missing`);
    continue;
  }
  const lines = fs.readFileSync(abs, 'utf8').split(/\r?\n/);
  const openAt = lines.findIndex((l) => l.includes(t.open));

  if (openAt === -1) {
    problems.push(`${t.file}: could not find the opening delimiter "${t.open}"`);
    continue;
  }

  const openLine = lines[openAt];
  const afterOpen = openLine.slice(openLine.indexOf(t.open) + t.open.length);
  const selfClosing = afterOpen.includes('`');

  if (!selfClosing && t.close) {
    const closeAt = lines.findIndex((l, i) => i > openAt && t.close.test(l));
    if (closeAt === -1) {
      problems.push(`${t.file}: could not find the closing delimiter ${t.close}`);
      continue;
    }
    const firstTick = lines.findIndex((l, i) => i > openAt && l.includes('`'));
    if (firstTick !== -1 && firstTick < closeAt) {
      problems.push(
        `${t.file}: line ${firstTick + 1} has a backtick inside the literal, which closes it ` +
          `${closeAt - firstTick} line(s) early — ${t.describe} is truncated there: ` +
          `"${lines[firstTick].trim().slice(0, 90)}"`
      );
    }
  }

  // The functional check. A literal closed early leaves the rest of the file inside the
  // string, so the export is a fragment rather than an expression.
  try {
    const mod = await import(`file://${abs.replace(/\\/g, '/')}?guard=${Date.now()}`);
    const src = mod[t.exportName];
    if (typeof src !== 'string' || src.length < 80) {
      problems.push(`${t.file}: ${t.exportName} did not export a plausible source string`);
    } else {
      try {
        new Function(`return (${src})`);
      } catch (err) {
        problems.push(`${t.file}: ${t.exportName} does not parse as an expression: ${err.message}`);
      }
    }
  } catch (err) {
    problems.push(`${t.file}: failed to import — ${err.message.split('\n')[0]}`);
  }
}

if (problems.length) {
  console.error('An embedded JavaScript source is broken:');
  for (const p of problems) console.error(`  - ${p}`);
  console.error('\nAlmost always a backtick inside the template literal, usually in a comment.');
  process.exit(1);
}

console.log(
  `embedded sources intact: ${TARGETS.map((t) => path.basename(t.file)).join(', ')} — ` +
    `each opens and closes where it should, and each export parses as an expression.`
);
