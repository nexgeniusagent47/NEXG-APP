// scripts/device-room/check-source.mjs
//
// Guard against the one mistake this file has now made twice.
//
// `MEASURE_SOURCE` in measure.mjs is a template literal containing a whole JavaScript
// function. A single stray backtick inside it terminates the literal early — including
// one inside a comment, which is where both occurrences were.
//
// The decisive evidence is that the module imports AND the exported source parses as a
// function. Counting backticks was tried first and rejected: the file legitimately names
// the character in its own comments, so a count cannot distinguish prose from syntax.
// Instead the parsed function is checked structurally, which a swallowed file cannot
// satisfy.
//
// Usage: node scripts/device-room/check-source.mjs
// Exit 0 = safe. Exit 1 = the module is broken.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(HERE, 'measure.mjs');

const problems = [];

// The module has to load, which is what a stray backtick breaks first.
try {
  const mod = await import(`./measure.mjs?cachebust=${Date.now()}`);

  if (typeof mod.MEASURE_SOURCE !== 'string' || mod.MEASURE_SOURCE.length < 500) {
    problems.push('MEASURE_SOURCE did not export a plausible function body');
  } else {
    // A stray backtick that swallows the rest of the file leaves the remaining code
    // inside the string, so the export is a fragment rather than a function. Parsing it
    // is the check that a length assertion cannot make.
    try {
      new Function(`return (${mod.MEASURE_SOURCE})`)();
    } catch (err) {
      problems.push(`MEASURE_SOURCE does not parse as a function: ${err.message}`);
    }
  }

  if (typeof mod.MEASURE !== 'function') {
    problems.push('MEASURE did not export a function');
  }
} catch (err) {
  problems.push(`measure.mjs failed to import: ${err.message}`);
}

if (problems.length) {
  console.error('measure.mjs is broken:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log('measure.mjs is intact: imports, and MEASURE_SOURCE parses as a function.');
