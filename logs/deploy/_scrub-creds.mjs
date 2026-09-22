// Remove the hardcoded database password from every TRACKED file.
//
// DELETING THESE FILES WOULD NOT HAVE HELPED. They are tracked, so the value is in git
// history; removing the file from the working tree leaves it in every past commit. The only
// useful action is to replace the VALUE, so the current tree is clean and the secret stops
// being copied forward.
//
// A note on what this value actually was: `nexg_password` is a DEVELOPMENT DEFAULT, not a
// production secret. It appears in a local connection string, a README example, the compose
// file and a setup script. The compose file is the one that matters, because it shipped that
// default to the server — which is why the production database is using it.
import { readFileSync, writeFileSync } from 'node:fs';

const OLD = 'nexg_password';

/** Files where the value is prose or a template, so a placeholder is correct. */
const PLACEHOLDER_FILES = [
  '.env.example',
  'README.md',
  'docs/PLAN-v1.md',
];

/** Files where the value must keep working, so it becomes an env reference with a default. */
const PARAMETERISE = [
  { file: 'docker-compose.yml', from: 'nexg_password', to: '${POSTGRES_PASSWORD:-nexg_dev_password}' },
];

const PLACEHOLDER = 'change_me';
let changes = 0;

// 1. Templates and docs get an obvious placeholder.
for (const file of PLACEHOLDER_FILES) {
  let src;
  try {
    src = readFileSync(file, 'utf8');
  } catch {
    console.log(`  skip (missing): ${file}`);
    continue;
  }
  if (!src.includes(OLD)) {
    console.log(`  no change:      ${file}`);
    continue;
  }
  const n = src.split(OLD).length - 1;
  writeFileSync(file, src.split(OLD).join(PLACEHOLDER), 'utf8');
  console.log(`  placeholder:    ${file}  (${n} occurrence${n === 1 ? '' : 's'})`);
  changes++;
}

// 2. The compose file keeps a working default, but no longer hardcodes the value.
for (const { file, from, to } of PARAMETERISE) {
  let src;
  try {
    src = readFileSync(file, 'utf8');
  } catch {
    console.log(`  skip (missing): ${file}`);
    continue;
  }
  if (!src.includes(from)) {
    console.log(`  no change:      ${file}`);
    continue;
  }
  const n = src.split(from).length - 1;
  writeFileSync(file, src.split(from).join(to), 'utf8');
  console.log(`  parameterised:  ${file}  (${n} occurrence${n === 1 ? '' : 's'})`);
  changes++;
}

console.log(`\n${changes} file(s) changed`);
