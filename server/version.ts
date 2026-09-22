// server/version.ts
// Runtime version identity for the NEXG Concierge API.
//
// `package.json` is the single source of truth for the version — scripts/release.mjs
// is the only thing that writes it, and nothing here duplicates the number. What
// this module adds is the two facts a running container cannot otherwise report:
// which commit produced the image, and when the image was built.
//
// Those two come from the environment (GIT_SHA, BUILT_AT) because a Docker image
// has no .git directory to read; .dockerignore excludes it. The fallbacks exist so
// a bare `node server/index.ts` on a developer's machine — or an image built
// without build args — reports "unknown" instead of failing or lying.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

export interface VersionInfo {
  /** SemVer from package.json. */
  version: string;
  /** Commit the artefact was built from, or 'unknown' when nothing recorded it. */
  gitSha: string;
  /** ISO build timestamp, or null when nothing recorded it. */
  builtAt: string | null;
  /** Node version actually running the API. */
  node: string;
}

/**
 * Read the version once at import. Both values are immutable for the life of the
 * process — a deploy ships a new image, it does not edit package.json in place —
 * so a per-request read would be file I/O for a constant.
 */
const VERSION = readPackageVersion();

function readPackageVersion(): string {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.resolve(REPO_ROOT, 'package.json'), 'utf-8')
    ) as { version?: string };
    return pkg.version ?? '0.0.0';
  } catch {
    // A missing or malformed manifest is not worth crashing a health surface
    // over; an obviously-wrong version is more useful than a 500.
    return '0.0.0';
  }
}

/**
 * Git SHA recorded at build time when present, otherwise derived from a local
 * checkout. Reading .git/HEAD by hand avoids depending on a `git` binary being
 * installed in the runtime image.
 */
const GIT_SHA = process.env.GIT_SHA?.trim() || readLocalGitSha();

function readLocalGitSha(): string {
  try {
    const dotGit = path.resolve(REPO_ROOT, '.git');
    // Worktrees and submodules store a `gitdir: <path>` pointer in a file named
    // .git rather than a directory.
    const gitDir = fs.statSync(dotGit).isDirectory()
      ? dotGit
      : path.resolve(REPO_ROOT, fs.readFileSync(dotGit, 'utf-8').replace('gitdir:', '').trim());

    const head = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf-8').trim();
    if (!head.startsWith('ref:')) return head.slice(0, 7); // detached HEAD holds the sha directly

    const ref = head.slice(4).trim();
    try {
      return fs.readFileSync(path.join(gitDir, ref), 'utf-8').trim().slice(0, 7);
    } catch {
      // A packed ref (post `git gc`) is not a file. The SHA still exists in
      // packed-refs, which is plain enough to scan.
      const packed = fs.readFileSync(path.join(gitDir, 'packed-refs'), 'utf-8');
      const match = packed.split('\n').find((line) => line.endsWith(` ${ref}`));
      return match ? match.slice(0, 7) : 'unknown';
    }
  } catch {
    return 'unknown';
  }
}

/** Identity of the running build, for `/api/version` and deploy verification. */
export function versionInfo(): VersionInfo {
  return {
    version: VERSION,
    gitSha: GIT_SHA,
    builtAt: process.env.BUILT_AT?.trim() || null,
    node: process.versions.node,
  };
}
