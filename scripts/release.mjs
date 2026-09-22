// scripts/release.mjs
// Cut a NEXG Concierge release: bump the version, open a CHANGELOG entry, and
// print the git commands that publish it.
//
// Usage:
//   node scripts/release.mjs patch            # 2.1.0 -> 2.1.1
//   node scripts/release.mjs minor            # 2.1.0 -> 2.2.0
//   node scripts/release.mjs major            # 2.1.0 -> 3.0.0
//   node scripts/release.mjs 2.5.0            # explicit version
//   node scripts/release.mjs patch --dry-run  # show the plan, write nothing
//   node scripts/release.mjs patch --date 2026-01-31
//
// This script deliberately stops short of `git commit` and `git tag`. A release is
// the one operation in this repository that reaches users, so the last step is a
// human reading the diff, the changelog and the tag name before anything is
// published. Automating the commit would also mean guessing an author, a signing
// configuration and whether the branch is the one intended to be released —
// three guesses on the only irreversible action here. It prints the exact
// commands instead, which keeps a release reviewable and scriptable at once.
//
// The workflow that follows the tag is .github/workflows/release.yml.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE_JSON = path.join(REPO_ROOT, 'package.json');
const PACKAGE_LOCK = path.join(REPO_ROOT, 'package-lock.json');
const CHANGELOG = path.join(REPO_ROOT, 'CHANGELOG.md');

const UNRELEASED_HEADING = '## [Unreleased]';

// ------------------------------------------------------------------- argument

function parseArgs(argv) {
  const flags = { dryRun: false, date: null };
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run' || arg === '-n') {
      flags.dryRun = true;
    } else if (arg === '--date') {
      flags.date = argv[++i] ?? null;
      if (!flags.date) fail('--date needs a value, e.g. --date 2026-01-31');
    } else if (arg.startsWith('--date=')) {
      flags.date = arg.slice('--date='.length);
    } else if (arg.startsWith('-')) {
      fail(`unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  return { ...flags, bump: positional[0] ?? null, extra: positional.slice(1) };
}

function fail(message) {
  console.error(`\n  error: ${message}\n`);
  console.error('  usage: node scripts/release.mjs <major|minor|patch|X.Y.Z> [--dry-run] [--date YYYY-MM-DD]\n');
  process.exit(1);
}

// -------------------------------------------------------------------- version

function readVersion() {
  return JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8')).version;
}

/** Missing minor/patch fields count as zero, so `1.2` behaves like `1.2.0`. */
function parseSemver(value) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(String(value).trim());
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? null,
  };
}

function resolveNextVersion(bump, current) {
  const parsedCurrent = parseSemver(current);
  if (!parsedCurrent) fail(`package.json version is not SemVer: ${current}`);

  if (bump === 'major' || bump === 'minor' || bump === 'patch') {
    // Releasing a pre-release promotes it: 2.0.0-rc.1 + patch is 2.0.0, because
    // bumping the patch of a pre-release would skip the release it was preparing.
    if (parsedCurrent.prerelease) return `${parsedCurrent.major}.${parsedCurrent.minor}.${parsedCurrent.patch}`;

    if (bump === 'major') return `${parsedCurrent.major + 1}.0.0`;
    if (bump === 'minor') return `${parsedCurrent.major}.${parsedCurrent.minor + 1}.0`;
    return `${parsedCurrent.major}.${parsedCurrent.minor}.${parsedCurrent.patch + 1}`;
  }

  const parsedExplicit = parseSemver(bump);
  if (!parsedExplicit) {
    fail(`"${bump}" is neither major|minor|patch nor an explicit SemVer version`);
  }
  return `${parsedExplicit.major}.${parsedExplicit.minor}.${parsedExplicit.patch}${
    parsedExplicit.prerelease ? `-${parsedExplicit.prerelease}` : ''
  }`;
}

// ------------------------------------------------------------------ changelog

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Insert a release heading at the top of the changelog.
 *
 * The existing `## [Unreleased]` section is relabelled rather than emptied: its
 * entries describe what is shipping, so they belong to the version being cut. A
 * fresh empty section is inserted above it for work that has not shipped yet.
 *
 * Two details are inherited from the file rather than invented here. Headings in
 * this changelog are `## [2.1.0] — 2026-09-21` with an em dash, not the hyphen
 * keepachangelog shows, and the Unreleased heading carries a one-line description
 * of the theme. Both are preserved, including the description, because it belongs
 * to the entries underneath it and dropping it would leave them unexplained.
 */
function nextChangelog(source, version, date) {
  const freshUnreleased = `${UNRELEASED_HEADING}\n\n### Added\n\n- _nothing yet_\n\n---\n`;
  const stub = `- _release ${version}._`;

  if (!source.includes(UNRELEASED_HEADING)) {
    // No section to rename. Prepend one, then the release heading, so the next
    // unreleased work still has an obvious place to go.
    return `${freshUnreleased}\n## [${version}] — ${date}\n\n### Added\n\n${stub}\n\n---\n\n${source}`;
  }

  // Only the first occurrence: the heading doubles as a phrase in the file's own
  // prose describing the convention.
  const headingLine = source
    .split('\n')
    .find((line) => line.startsWith(UNRELEASED_HEADING));
  const bracket = headingLine.indexOf(']');
  // Em and en dash only, and never the ASCII hyphen that opens a character class —
  // allowing `-` here lets the match run on into an em-dash-delimited description
  // and duplicate it into the heading.
  const separator = headingLine.slice(bracket + 1).match(/^\s*[—–]\s*/)?.[0] ?? ' — ';
  const description = headingLine.slice(bracket + 1 + separator.length).trim();

  const releasedHeading =
    `## [${version}]${separator}${date}` + (description ? `${separator}${description}` : '');

  // The stub is inserted before the heading is relabelled, and both steps work from
  // the original text. Relabelling first would leave two `### Added` headings — the
  // fresh Unreleased one and the section's own — and the stub would land under the
  // wrong version. The section keeps its entries; only its label changes.
  //
  // Both calls use a replacer function rather than a replacement string. The heading
  // carries `$&` from the em-dash match, and `$&` in a replacement string means "the
  // matched substring" — it re-inserted the whole description, so the released
  // heading printed its theme twice.
  const withStub = source.replace(/^(###\s+Added[^\n]*\n)/m, (_match, heading) => `${heading}\n${stub}\n`);
  return withStub.replace(UNRELEASED_HEADING, () => `${freshUnreleased}\n${releasedHeading}`);
}

// ----------------------------------------------------------------------- git

function git(args) {
  try {
    const result = spawnSync('git', args, { cwd: REPO_ROOT, encoding: 'utf-8' });
    return { ok: result.status === 0, out: (result.stdout ?? '').trim() };
  } catch {
    // No git binary is not an error here; the printed commands are still correct.
    return { ok: false, out: '' };
  }
}

function planGitCommands(version, files) {
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']).out || '<branch>';
  const addArgs = files.map((f) => path.relative(REPO_ROOT, f).replace(/\\/g, '/')).join(' ');
  const subject = `chore(release): v${version}`;
  const body = `Release v${version}.`;
  // `-F -` keeps the multi-line message out of shell-quoting trouble; `-S` signs
  // the tag, because a release tag is what release.yml trusts.
  return [
    `git add ${addArgs}`,
    `git commit -m ${JSON.stringify(subject)} -m ${JSON.stringify(body)}`,
    `git tag -a v${version} -m ${JSON.stringify(`NEXG Concierge v${version}`)}`,
    `git push origin ${branch}`,
    `git push origin v${version}`,
  ];
}

// ---------------------------------------------------------------------- main

const { bump, extra, dryRun, date } = parseArgs(process.argv.slice(2));

if (!bump) fail('a version bump is required');
if (extra.length) fail(`unexpected extra argument: ${extra[0]}`);
if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`--date must be YYYY-MM-DD, got: ${date}`);

const currentVersion = readVersion();
const nextVersion = resolveNextVersion(bump, currentVersion);
const releaseDate = date ?? todayIso();
const isPrerelease = nextVersion.includes('-');

const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8'));
pkg.version = nextVersion;

// Keep the lockfile's root version in step — `npm ci` fails when the two
// manifests disagree, which would break CI and every Docker build.
let touchedLock = false;
let lock = null;
if (fs.existsSync(PACKAGE_LOCK)) {
  lock = JSON.parse(fs.readFileSync(PACKAGE_LOCK, 'utf-8'));
  if (lock.version !== nextVersion) {
    lock.version = nextVersion;
    if (lock.packages?.['']) lock.packages[''].version = nextVersion;
    touchedLock = true;
  }
}

const changelogBefore = fs.existsSync(CHANGELOG) ? fs.readFileSync(CHANGELOG, 'utf-8') : '# Changelog\n';
const changelogAfter = nextChangelog(changelogBefore, nextVersion, releaseDate);

const target = parseSemver(nextVersion);
const source = parseSemver(currentVersion);
const isDowngrade =
  target.major < source.major ||
  (target.major === source.major && target.minor < source.minor) ||
  (target.major === source.major && target.minor === source.minor && target.patch < source.patch);

console.log(`\n  NEXG Concierge release${dryRun ? ' (dry run — nothing written)' : ''}`);
console.log(`  version  ${currentVersion} -> ${nextVersion}${isPrerelease ? '  (pre-release)' : ''}`);
console.log(`  date     ${releaseDate}`);
console.log(`  packages package.json${touchedLock ? ' + package-lock.json' : ' (lockfile already in step)'}`);
console.log(`  changelog ${fs.existsSync(CHANGELOG) ? 'CHANGELOG.md (new entry prepended)' : 'CHANGELOG.md (created)'}`);

if (isDowngrade) {
  console.warn(`\n  warning: ${nextVersion} is lower than ${currentVersion}; continuing because an explicit version was given.`);
}

if (dryRun) {
  console.log('\n  nothing written. Re-run without --dry-run to apply.\n');
  process.exit(0);
}

fs.writeFileSync(PACKAGE_JSON, `${JSON.stringify(pkg, null, 2)}\n`);
if (touchedLock) fs.writeFileSync(PACKAGE_LOCK, `${JSON.stringify(lock, null, 2)}\n`);
fs.writeFileSync(CHANGELOG, changelogAfter);

const files = [PACKAGE_JSON, CHANGELOG, ...(touchedLock ? [PACKAGE_LOCK] : [])];
const dirty = git(['status', '--porcelain']).out
  .split('\n')
  .filter((line) => line.trim() && !files.some((f) => line.includes(path.relative(REPO_ROOT, f))));

console.log('\n  Next — run these yourself; this script intentionally does not:\n');
for (const command of planGitCommands(nextVersion, files)) console.log(`    ${command}`);

if (dirty.length) {
  console.log('\n  note: the worktree has other uncommitted changes, so the commit above would');
  console.log('        include only the release files. Review before staging:');
  for (const line of dirty.slice(0, 10)) console.log(`          ${line}`);
}

console.log('');
console.log('  Review the CHANGELOG entry before tagging: the stub records the mechanical');
console.log('  release; the human-readable notes are yours to write.\n');
